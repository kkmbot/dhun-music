package app.dhun.music;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import androidx.core.content.FileProvider;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.File;
import java.util.Arrays;

/** In-app updates: installed version, "install unknown apps" permission, and handing a downloaded APK to the system installer. */
@CapacitorPlugin(name = "DhunUpdater")
public class DhunUpdaterPlugin extends Plugin {

    static long codeOf(PackageInfo pi) {
        return Build.VERSION.SDK_INT >= 28 ? pi.getLongVersionCode() : pi.versionCode;
    }

    @PluginMethod
    public void getVersion(PluginCall call) {
        try {
            Context c = getContext();
            PackageInfo pi = c.getPackageManager().getPackageInfo(c.getPackageName(), 0);
            JSObject r = new JSObject();
            r.put("versionCode", codeOf(pi));
            r.put("versionName", pi.versionName);
            call.resolve(r);
        } catch (Exception e) {
            call.reject("version: " + e.getMessage());
        }
    }

    @PluginMethod
    public void canInstall(PluginCall call) {
        JSObject r = new JSObject();
        r.put("allowed", Build.VERSION.SDK_INT < 26 || getContext().getPackageManager().canRequestPackageInstalls());
        call.resolve(r);
    }

    @PluginMethod
    public void openInstallSettings(PluginCall call) {
        try {
            Intent i;
            if (Build.VERSION.SDK_INT >= 26) {
                i = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, Uri.parse("package:" + getContext().getPackageName()));
            } else {
                i = new Intent(Settings.ACTION_SECURITY_SETTINGS);
            }
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(i);
            call.resolve();
        } catch (Exception e) {
            call.reject("settings: " + e.getMessage());
        }
    }

    @SuppressWarnings("deprecation")
    private static Signature[] sigs(PackageInfo pi) {
        if (pi == null) return null;
        if (Build.VERSION.SDK_INT >= 28 && pi.signingInfo != null) {
            return pi.signingInfo.hasMultipleSigners() ? pi.signingInfo.getApkContentsSigners() : pi.signingInfo.getSigningCertificateHistory();
        }
        return pi.signatures;
    }

    /** path: absolute path or file:// URI of an APK inside the app's cache folder. */
    @PluginMethod
    @SuppressWarnings("deprecation")
    public void install(PluginCall call) {
        String path = call.getString("path", "");
        if (path.startsWith("file://")) path = Uri.parse(path).getPath();
        try {
            Context c = getContext();
            File f = new File(path);
            if (!f.isFile() || f.length() < 100000) { call.reject("APK file missing or incomplete", "BAD_FILE"); return; }
            PackageManager pm = c.getPackageManager();
            int flags = Build.VERSION.SDK_INT >= 28 ? PackageManager.GET_SIGNING_CERTIFICATES : PackageManager.GET_SIGNATURES;
            PackageInfo apk = pm.getPackageArchiveInfo(f.getAbsolutePath(), flags);
            if (apk == null) { call.reject("Downloaded file is not a valid APK", "BAD_FILE"); return; }
            if (!c.getPackageName().equals(apk.packageName)) { call.reject("APK is for a different app", "BAD_FILE"); return; }
            PackageInfo me = pm.getPackageInfo(c.getPackageName(), flags);
            if (codeOf(apk) <= codeOf(me)) { call.reject("This version is already installed", "NOT_NEWER"); return; }
            Signature[] a = sigs(apk), b = sigs(me);
            if (a != null && b != null && a.length > 0 && b.length > 0 && !Arrays.asList(a).contains(b[0]) && !Arrays.asList(b).contains(a[0])) {
                call.reject("APK is signed with a different key, it can't update this app", "BAD_SIGNATURE"); return;
            }
            if (Build.VERSION.SDK_INT >= 26 && !pm.canRequestPackageInstalls()) { call.reject("Install unknown apps is off for Dhun", "NOT_ALLOWED"); return; }
            Uri uri = FileProvider.getUriForFile(c, c.getPackageName() + ".fileprovider", f);
            Intent i = new Intent(Intent.ACTION_VIEW);
            i.setDataAndType(uri, "application/vnd.android.package-archive");
            i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
            c.startActivity(i);
            JSObject r = new JSObject();
            r.put("started", true);
            r.put("versionCode", codeOf(apk));
            call.resolve(r);
        } catch (Exception e) {
            call.reject("install: " + e.getMessage(), "ERROR");
        }
    }
}
