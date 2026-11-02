package app.dhun.music;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.speech.RecognizerIntent;
import androidx.activity.result.ActivityResult;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.ArrayList;

/**
 * Voice search through the system speech dialog (Google), so the app itself needs no mic permission.
 *  available() → {ok}
 *  listen({lang: "hi-IN"|"en-IN", prompt?}) → {text, alternatives[]}; rejects with code "cancelled" / "no_match" / "unavailable".
 */
@CapacitorPlugin(name = "DhunSpeech")
public class DhunSpeechPlugin extends Plugin {

    private Intent recognizerIntent(String lang, String prompt) {
        Intent i = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        i.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        i.putExtra(RecognizerIntent.EXTRA_LANGUAGE, lang);
        i.putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, lang);
        i.putExtra(RecognizerIntent.EXTRA_ONLY_RETURN_LANGUAGE_PREFERENCE, false);
        // Hinglish: let the recognizer also consider the other Indian language (Android 13+ recognizers read this).
        String other = lang.startsWith("hi") ? "en-IN" : "hi-IN";
        i.putExtra("android.speech.extra.EXTRA_ADDITIONAL_LANGUAGES", new String[] { other });
        i.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 5);
        i.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, false);
        if (prompt != null && !prompt.isEmpty()) i.putExtra(RecognizerIntent.EXTRA_PROMPT, prompt);
        return i;
    }

    @PluginMethod
    public void available(PluginCall call) {
        boolean ok = false;
        try {
            ok = !getContext().getPackageManager()
                .queryIntentActivities(new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH), 0).isEmpty();
        } catch (Exception ignored) {}
        JSObject r = new JSObject();
        r.put("ok", ok);
        call.resolve(r);
    }

    @PluginMethod
    public void listen(PluginCall call) {
        String lang = call.getString("lang", "hi-IN");
        if (lang == null || lang.isEmpty()) lang = "hi-IN";
        String prompt = call.getString("prompt", null);
        try {
            startActivityForResult(call, recognizerIntent(lang, prompt), "speechResult");
        } catch (ActivityNotFoundException e) {
            call.reject("Voice search is not available on this phone", "unavailable");
        } catch (Exception e) {
            call.reject("Voice search failed: " + e.getMessage(), "error");
        }
    }

    @ActivityCallback
    private void speechResult(PluginCall call, ActivityResult result) {
        if (call == null) return;
        if (result.getResultCode() != Activity.RESULT_OK) {
            call.reject("cancelled", "cancelled");
            return;
        }
        Intent data = result.getData();
        ArrayList<String> list = data != null ? data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS) : null;
        if (list == null || list.isEmpty() || list.get(0) == null || list.get(0).trim().isEmpty()) {
            call.reject("no_match", "no_match");
            return;
        }
        JSObject r = new JSObject();
        r.put("text", list.get(0).trim());
        JSArray alts = new JSArray();
        for (String s : list) alts.put(s);
        r.put("alternatives", alts);
        call.resolve(r);
    }
}
