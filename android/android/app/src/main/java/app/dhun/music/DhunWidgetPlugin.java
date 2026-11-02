package app.dhun.music;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.util.Base64;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * JS ⇄ home-screen widget.
 *  update({title, artist, playing, art?})  art = data:image/...;base64,… or an https URL
 *  getPendingAction() → {action: "prev"|"toggle"|"next"|null}  (a widget tap that launched the app)
 *  event "widgetAction" {action}           (a widget tap while the app is running)
 */
@CapacitorPlugin(name = "DhunWidget")
public class DhunWidgetPlugin extends Plugin {
    private static final int ART_PX = 256;
    private static final int MAX_ART_BYTES = 3 * 1024 * 1024;
    private final ExecutorService io = Executors.newSingleThreadExecutor();
    private final AtomicInteger seq = new AtomicInteger();
    private volatile String pendingAction;

    @Override
    public void load() {
        DhunWidget.plugin = this;
        takeLaunchAction(getActivity() != null ? getActivity().getIntent() : null, false);
        final Context c = getContext().getApplicationContext();
        try { io.execute(() -> DhunWidget.renderAll(c)); } catch (Exception e) { DhunWidget.renderAll(c); } // buttons → live broadcasts
    }

    @Override
    protected void handleOnNewIntent(Intent intent) {
        takeLaunchAction(intent, true);
    }

    @Override
    protected void handleOnDestroy() {
        if (DhunWidget.plugin == this) DhunWidget.plugin = null;
        Context c = getContext();
        if (c != null) {
            DhunWidget.prefs(c).edit().putBoolean(DhunWidget.K_PLAYING, false).apply();
            DhunWidget.renderAll(c); // buttons → "open the app"
        }
        io.shutdown();
    }

    boolean isBridgeAlive() {
        try {
            Activity a = getActivity();
            return getBridge() != null && getBridge().getWebView() != null && a != null && !a.isDestroyed();
        } catch (Exception e) {
            return false;
        }
    }

    private void takeLaunchAction(Intent intent, boolean appRunning) {
        if (intent == null) return;
        String a = intent.getStringExtra(DhunWidget.EXTRA_ACTION);
        if (a == null) return;
        intent.removeExtra(DhunWidget.EXTRA_ACTION); // never replay on recreate
        if (!"prev".equals(a) && !"toggle".equals(a) && !"next".equals(a)) return;
        if (appRunning) fireAction(a);
        else pendingAction = a;
    }

    void fireAction(String action) {
        JSObject d = new JSObject();
        d.put("action", action);
        notifyListeners("widgetAction", d);
    }

    @PluginMethod
    public void getPendingAction(PluginCall call) {
        JSObject r = new JSObject();
        String a = pendingAction;
        pendingAction = null;
        r.put("action", a); // null → JSON null
        call.resolve(r);
    }

    @PluginMethod
    public void update(PluginCall call) {
        final Context c = getContext().getApplicationContext();
        final String title = call.getString("title", "");
        final String artist = call.getString("artist", "");
        final boolean playing = Boolean.TRUE.equals(call.getBoolean("playing", false));
        final String art = call.getString("art", null);
        // art omitted → keep the current artwork (play/pause-only updates); "" → clear it.
        String oldSrc = DhunWidget.prefs(c).getString(DhunWidget.K_ART_SRC, null);
        boolean artChanged = art != null && !art.equals(oldSrc);
        final int my = artChanged ? seq.incrementAndGet() : seq.get();
        android.content.SharedPreferences.Editor e = DhunWidget.prefs(c).edit()
            .putString(DhunWidget.K_TITLE, title == null ? "" : title)
            .putString(DhunWidget.K_ARTIST, artist == null ? "" : artist)
            .putBoolean(DhunWidget.K_PLAYING, playing);
        if (artChanged) e.putBoolean(DhunWidget.K_HAS_ART, false).putString(DhunWidget.K_ART_SRC, null);
        e.apply();
        DhunWidget.renderAll(c); // text + play state now; artwork follows when ready
        call.resolve();

        if (!artChanged || art.isEmpty()) return;
        try {
            io.execute(() -> {
                try {
                    byte[] bytes = art.startsWith("data:") ? decodeDataUrl(art) : (art.startsWith("https://") ? download(art) : null);
                    if (bytes == null || my != seq.get()) return;
                    Bitmap b = DhunWidget.squareRounded(bytes, ART_PX);
                    if (b == null || my != seq.get()) return;
                    File tmp = new File(c.getFilesDir(), DhunWidget.ART_FILE + ".tmp");
                    try (FileOutputStream fo = new FileOutputStream(tmp)) {
                        b.compress(Bitmap.CompressFormat.PNG, 100, fo);
                    }
                    if (my != seq.get()) return;
                    File dst = DhunWidget.artFile(c);
                    if (!tmp.renameTo(dst)) return;
                    DhunWidget.prefs(c).edit().putBoolean(DhunWidget.K_HAS_ART, true).putString(DhunWidget.K_ART_SRC, art).apply();
                    DhunWidget.renderAll(c);
                } catch (Throwable ignored) {}
            });
        } catch (Exception ignored) {} // executor shut down
    }

    private static byte[] decodeDataUrl(String s) {
        int comma = s.indexOf(',');
        if (comma < 0 || !s.substring(0, comma).contains(";base64")) return null;
        return Base64.decode(s.substring(comma + 1), Base64.DEFAULT);
    }

    private static byte[] download(String url) throws Exception {
        HttpURLConnection h = (HttpURLConnection) new URL(url).openConnection();
        h.setConnectTimeout(6000);
        h.setReadTimeout(8000);
        h.setInstanceFollowRedirects(true);
        try {
            if (h.getResponseCode() / 100 != 2) return null;
            try (InputStream in = h.getInputStream(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                byte[] buf = new byte[16384];
                int n, total = 0;
                while ((n = in.read(buf)) > 0) {
                    total += n;
                    if (total > MAX_ART_BYTES) return null;
                    out.write(buf, 0, n);
                }
                return out.toByteArray();
            }
        } finally {
            h.disconnect();
        }
    }
}
