package kr.storix.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.kakao.sdk.common.KakaoSdk;
import com.nerdfrenz.kakao.KakaoLoginPlugin;
import com.lepisode.capacitor.naverlogin.CapacitorNaverLoginPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Kakao SDK 초기화 — strings.xml 의 kakao_native_app_key 사용
        KakaoSdk.init(this, getString(R.string.kakao_native_app_key));

        registerPlugin(KakaoLoginPlugin.class);
        registerPlugin(CapacitorNaverLoginPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
