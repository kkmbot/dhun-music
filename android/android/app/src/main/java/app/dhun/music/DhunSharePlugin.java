package app.dhun.music;

import android.app.Activity;
import android.content.ClipData;
import android.content.Intent;
import android.net.Uri;
import android.util.Base64;
import androidx.core.content.FileProvider;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.File;
import java.io.FileOutputStream;

/**
 * shareImage({base64, mime?, filename?, text?}) → {ok:true} once Android's share sheet is shown.
 * The WebView has no navigator.share for files, so the Share-card story image goes out this way
 * (Instagram story, WhatsApp status, …). The file is written to cache/share/ and shared through
 * the app's existing FileProvider (${applicationId}.fileprovider, <cache-path path=".">).
 */
@CapacitorPlugin(name = "DhunShare")
public class DhunSharePlugin extends Plugin {

    @PluginMethod
    public void shareImage(PluginCall call) {
        String b64 = call.getString("base64", null);
        if (b64 == null || b64.isEmpty()) {
            call.reject("base64 is required", "bad_input");
            return;
        }
        int comma = b64.indexOf(',');
        if (b64.startsWith("data:") && comma > 0) b64 = b64.substring(comma + 1); // tolerate a data: prefix
        String mime = call.getString("mime", "image/png");
        if (mime == null || !mime.startsWith("image/")) mime = "image/png";
        String name = call.getString("filename", mime.endsWith("jpeg") || mime.endsWith("jpg") ? "dhun-story.jpg" : "dhun-story.png");
        name = name == null ? "dhun-story.png" : name.replaceAll("[^A-Za-z0-9._-]", "_");
        if (name.isEmpty() || name.startsWith(".")) name = "dhun-story.png";
        String text = call.getString("text", null);

        try {
            byte[] bytes = Base64.decode(b64, Base64.DEFAULT);
            File dir = new File(getContext().getCacheDir(), "share");
            if (!dir.exists() && !dir.mkdirs()) throw new Exception("cannot create cache dir");
            File[] old = dir.listFiles();
            if (old != null) for (File f : old) f.delete(); // keep only the latest card
            File f = new File(dir, name);
            try (FileOutputStream out = new FileOutputStream(f)) {
                out.write(bytes);
            }
            Uri uri = FileProvider.getUriForFile(getContext(), getContext().getPackageName() + ".fileprovider", f);

            Intent send = new Intent(Intent.ACTION_SEND);
            send.setType(mime);
            send.putExtra(Intent.EXTRA_STREAM, uri);
            if (text != null && !text.isEmpty()) send.putExtra(Intent.EXTRA_TEXT, text);
            send.setClipData(ClipData.newRawUri(name, uri));
            send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            Intent chooser = Intent.createChooser(send, "Share");
            chooser.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

            Activity a = getActivity();
            if (a == null) throw new Exception("no activity");
            a.runOnUiThread(() -> {
                try {
                    a.startActivity(chooser);
                    JSObject r = new JSObject();
                    r.put("ok", true);
                    call.resolve(r);
                } catch (Exception e) {
                    call.reject("share failed: " + e.getMessage(), "error");
                }
            });
        } catch (IllegalArgumentException e) {
            call.reject("bad base64: " + e.getMessage(), "bad_input");
        } catch (Exception e) {
            call.reject("share failed: " + e.getMessage(), "error");
        }
    }
}
