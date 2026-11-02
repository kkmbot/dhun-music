package app.dhun.music;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(DhunUpdaterPlugin.class);
        registerPlugin(DhunWidgetPlugin.class);
        registerPlugin(DhunSpeechPlugin.class);
        registerPlugin(DhunSharePlugin.class);
        super.onCreate(savedInstanceState);
    }
}
