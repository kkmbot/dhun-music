package app.dhun.music;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.BitmapShader;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.RectF;
import android.graphics.Shader;
import android.net.Uri;
import android.os.Bundle;
import android.widget.RemoteViews;
import java.io.File;

/**
 * Shared state + rendering for the "Dhun" home-screen widget.
 * State lives in SharedPreferences ("dhun_widget") and the artwork in files/dhun_widget_art.png,
 * so the widget shows the last song after a reboot or a launcher restart.
 */
final class DhunWidget {
    static final String PREFS = "dhun_widget";
    static final String K_TITLE = "title", K_ARTIST = "artist", K_PLAYING = "playing", K_ART_SRC = "artSrc", K_HAS_ART = "hasArt";
    static final String ACTION_BUTTON = "app.dhun.music.WIDGET_BUTTON";
    static final String EXTRA_ACTION = "dhun_widget_action";
    static final String ART_FILE = "dhun_widget_art.png";

    /** Live plugin (null when the app's bridge is not running). */
    static volatile DhunWidgetPlugin plugin;

    private DhunWidget() {}

    static SharedPreferences prefs(Context c) {
        return c.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    static File artFile(Context c) {
        return new File(c.getFilesDir(), ART_FILE);
    }

    static boolean appAlive() {
        DhunWidgetPlugin p = plugin;
        return p != null && p.isBridgeAlive();
    }

    /** Re-render every placed widget instance from the saved state. */
    static void renderAll(Context ctx) {
        Context c = ctx.getApplicationContext();
        try {
            AppWidgetManager m = AppWidgetManager.getInstance(c);
            if (m == null) return;
            int[] ids = m.getAppWidgetIds(new ComponentName(c, DhunWidgetProvider.class));
            if (ids == null || ids.length == 0) return;
            Bitmap art = loadArt(c);
            boolean alive = appAlive();
            for (int id : ids) render(c, m, id, art, alive);
        } catch (Exception ignored) {}
    }

    static void render(Context c, AppWidgetManager m, int id, Bitmap art, boolean alive) {
        Bundle opts = null;
        try { opts = m.getAppWidgetOptions(id); } catch (Exception ignored) {}
        int minH = opts != null ? opts.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT, 0) : 0;
        int minW = opts != null ? opts.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 0) : 0;
        boolean tall = minH >= 100;
        boolean narrow = !tall && minW > 0 && minW < 240; // ~3 cells: drop the artwork so the title still fits
        RemoteViews v = new RemoteViews(c.getPackageName(), tall ? R.layout.dhun_widget_tall : R.layout.dhun_widget);
        SharedPreferences p = prefs(c);
        String title = p.getString(K_TITLE, "");
        String artist = p.getString(K_ARTIST, "");
        boolean playing = p.getBoolean(K_PLAYING, false);
        boolean empty = title == null || title.trim().isEmpty();
        v.setTextViewText(R.id.dw_title, empty ? c.getString(R.string.dhun_widget_empty_title) : title);
        v.setTextViewText(R.id.dw_artist, empty ? c.getString(R.string.dhun_widget_empty_sub) : (artist == null ? "" : artist));
        if (art != null && !empty) v.setImageViewBitmap(R.id.dw_art, art);
        else v.setImageViewResource(R.id.dw_art, R.drawable.dhun_widget_art_placeholder);
        v.setViewVisibility(R.id.dw_art, narrow ? android.view.View.GONE : android.view.View.VISIBLE);
        v.setImageViewResource(R.id.dw_toggle, playing ? R.drawable.dhun_widget_ic_pause : R.drawable.dhun_widget_ic_play);

        PendingIntent open = activityIntent(c, null, 10);
        v.setOnClickPendingIntent(R.id.dw_art, open);
        v.setOnClickPendingIntent(R.id.dw_text, open);
        v.setOnClickPendingIntent(R.id.dw_root, open);
        // App running → buttons are silent broadcasts handled by the live player.
        // App not running → buttons open the app with the action as an extra (a background
        // broadcast receiver is not reliably allowed to start an activity on Android 10+).
        v.setOnClickPendingIntent(R.id.dw_prev, alive ? buttonIntent(c, "prev", 1) : activityIntent(c, "prev", 11));
        v.setOnClickPendingIntent(R.id.dw_toggle, alive ? buttonIntent(c, "toggle", 2) : activityIntent(c, "toggle", 12));
        v.setOnClickPendingIntent(R.id.dw_next, alive ? buttonIntent(c, "next", 3) : activityIntent(c, "next", 13));
        m.updateAppWidget(id, v);
    }

    static PendingIntent buttonIntent(Context c, String action, int req) {
        Intent i = new Intent(c, DhunWidgetActionReceiver.class);
        i.setAction(ACTION_BUTTON);
        i.setData(Uri.parse("dhunwidget://button/" + action));
        i.putExtra(EXTRA_ACTION, action);
        return PendingIntent.getBroadcast(c, req, i, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
    }

    static PendingIntent activityIntent(Context c, String action, int req) {
        Intent i = new Intent(c, MainActivity.class);
        i.setAction(Intent.ACTION_MAIN);
        i.addCategory(Intent.CATEGORY_LAUNCHER);
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        if (action != null) {
            i.setData(Uri.parse("dhunwidget://open/" + action));
            i.putExtra(EXTRA_ACTION, action);
        }
        return PendingIntent.getActivity(c, req, i, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
    }

    static Bitmap loadArt(Context c) {
        try {
            if (!prefs(c).getBoolean(K_HAS_ART, false)) return null;
            File f = artFile(c);
            if (!f.exists()) return null;
            return BitmapFactory.decodeFile(f.getAbsolutePath());
        } catch (Throwable t) {
            return null;
        }
    }

    /** Decode bytes to a square, rounded bitmap of at most `size` px (keeps the widget's bitmap small). */
    static Bitmap squareRounded(byte[] data, int size) {
        BitmapFactory.Options o = new BitmapFactory.Options();
        o.inJustDecodeBounds = true;
        BitmapFactory.decodeByteArray(data, 0, data.length, o);
        if (o.outWidth <= 0 || o.outHeight <= 0) return null;
        int sample = 1;
        while (Math.min(o.outWidth, o.outHeight) / (sample * 2) >= size) sample *= 2;
        BitmapFactory.Options o2 = new BitmapFactory.Options();
        o2.inSampleSize = sample;
        Bitmap src = BitmapFactory.decodeByteArray(data, 0, data.length, o2);
        if (src == null) return null;
        int side = Math.min(src.getWidth(), src.getHeight());
        int out = Math.min(size, side);
        Bitmap dst = Bitmap.createBitmap(out, out, Bitmap.Config.ARGB_8888);
        Canvas cv = new Canvas(dst);
        Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG | Paint.FILTER_BITMAP_FLAG);
        BitmapShader sh = new BitmapShader(src, Shader.TileMode.CLAMP, Shader.TileMode.CLAMP);
        android.graphics.Matrix mx = new android.graphics.Matrix();
        float scale = (float) out / side;
        mx.setScale(scale, scale);
        mx.postTranslate(-(src.getWidth() - side) / 2f * scale, -(src.getHeight() - side) / 2f * scale);
        sh.setLocalMatrix(mx);
        paint.setShader(sh);
        float r = out * 0.14f;
        cv.drawRoundRect(new RectF(0, 0, out, out), r, r, paint);
        if (src != dst) src.recycle();
        return dst;
    }
}
