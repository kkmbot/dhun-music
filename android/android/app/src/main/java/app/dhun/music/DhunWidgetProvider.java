package app.dhun.music;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.os.Bundle;

/** The "Dhun" home-screen widget. All drawing is in DhunWidget; state comes from SharedPreferences. */
public class DhunWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] ids) {
        DhunWidget.renderAll(context);
    }

    @Override
    public void onAppWidgetOptionsChanged(Context context, AppWidgetManager manager, int id, Bundle newOptions) {
        DhunWidget.renderAll(context);
    }
}
