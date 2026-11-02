package app.dhun.music;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** Receives prev / toggle / next taps from the widget (not exported: only our own PendingIntents reach it). */
public class DhunWidgetActionReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent == null || !DhunWidget.ACTION_BUTTON.equals(intent.getAction())) return;
        String action = intent.getStringExtra(DhunWidget.EXTRA_ACTION);
        if (!"prev".equals(action) && !"toggle".equals(action) && !"next".equals(action)) return;

        if ("toggle".equals(action)) {
            // Optimistic flip so the icon changes instantly; JS confirms with DhunWidget.update().
            boolean playing = DhunWidget.prefs(context).getBoolean(DhunWidget.K_PLAYING, false);
            DhunWidget.prefs(context).edit().putBoolean(DhunWidget.K_PLAYING, !playing).apply();
        }

        DhunWidgetPlugin p = DhunWidget.plugin;
        if (p != null && p.isBridgeAlive()) {
            p.fireAction(action);
            if ("toggle".equals(action)) DhunWidget.renderAll(context);
            return;
        }

        // The app's process was killed with the buttons still in "live" mode: open the app with the
        // action (best effort; Android may block a background activity start) and switch the widget
        // to "open the app" buttons so the next tap always works.
        if ("toggle".equals(action)) {
            DhunWidget.prefs(context).edit().putBoolean(DhunWidget.K_PLAYING, false).apply();
        }
        DhunWidget.renderAll(context);
        try {
            Intent i = new Intent(context, MainActivity.class);
            i.setAction(Intent.ACTION_MAIN);
            i.addCategory(Intent.CATEGORY_LAUNCHER);
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            i.putExtra(DhunWidget.EXTRA_ACTION, action);
            context.startActivity(i);
        } catch (Exception ignored) {}
    }
}
