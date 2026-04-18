#!/usr/bin/env bash
# ----------------------------------------------------------------------------
# Storix Android (Capacitor) 최초 세팅 스크립트
#
# 수행 순서:
#   1) @capacitor/android 가 없으면 설치
#   2) ./android 가 없으면 `cap add android`
#   3) AndroidManifest.xml / strings.xml / MainActivity.kt 에 Kakao·Naver 설정 패치
#   4) variables.gradle 에 Capacitor 플러그인용 minSdk 오버라이드 주입
#
# 이미 패치된 블록은 건너뛰므로 여러 번 실행해도 안전합니다.
# ----------------------------------------------------------------------------
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

ENV_FILE="${ROOT_DIR}/.env.local"
if [[ ! -f "$ENV_FILE" ]]; then
  ENV_FILE="${ROOT_DIR}/.env"
fi

if [[ -f "$ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  set -a && source "$ENV_FILE" && set +a
fi

KAKAO_APP_KEY="${NEXT_PUBLIC_KAKAO_NATIVE_APP_KEY:-}"
NAVER_URL_SCHEME="${NEXT_PUBLIC_NAVER_URL_SCHEME:-storixnaverlogin}"

if [[ -z "$KAKAO_APP_KEY" ]]; then
  echo "⚠️  NEXT_PUBLIC_KAKAO_NATIVE_APP_KEY 가 .env.local 에 없습니다."
  echo "    iOS 와 동일한 Kakao 네이티브 앱 키를 .env.local 에 추가하세요."
  echo "    (패치는 일단 플레이스홀더로 진행합니다)"
  KAKAO_APP_KEY="REPLACE_ME_KAKAO_NATIVE_APP_KEY"
fi

# --- 1) @capacitor/android 설치 확인 ----------------------------------------
#   husky 의 prepare 훅이 monorepo 구조(.git 이 상위 디렉터리)에서 실패하므로
#   이 한 번의 npm install 에서는 HUSKY=0 으로 prepare 를 스킵.
if [[ ! -d "node_modules/@capacitor/android" ]]; then
  echo "📦 @capacitor/android 설치"
  HUSKY=0 npm install
fi

# --- 2) android/ 디렉터리 생성 ----------------------------------------------
if [[ ! -d "android" ]]; then
  echo "📱 cap add android"
  npx cap add android
else
  echo "✅ android/ 이미 존재. add 스킵."
fi

ANDROID_APP_SRC="android/app/src/main"
MANIFEST="${ANDROID_APP_SRC}/AndroidManifest.xml"
STRINGS="${ANDROID_APP_SRC}/res/values/strings.xml"
# MainActivity 경로는 appId 에 따라 달라짐 — 찾아서 씀.
MAIN_ACTIVITY="$(find "${ANDROID_APP_SRC}/java" -name 'MainActivity.java' -o -name 'MainActivity.kt' | head -n 1)"
VARIABLES_GRADLE="android/variables.gradle"

if [[ -z "$MAIN_ACTIVITY" ]]; then
  echo "❌ MainActivity 를 찾을 수 없습니다. cap add android 가 정상 동작했는지 확인하세요."
  exit 1
fi

# --- 3) strings.xml 에 kakao_native_app_key 추가 ----------------------------
if ! grep -q 'kakao_native_app_key' "$STRINGS"; then
  echo "📝 strings.xml 에 kakao_native_app_key 추가"
  # </resources> 바로 앞에 key 두 개를 삽입
  python3 - <<PY "$STRINGS" "$KAKAO_APP_KEY"
import sys, re, pathlib
p = pathlib.Path(sys.argv[1])
key = sys.argv[2]
text = p.read_text()
inject = f'    <string name="kakao_native_app_key">{key}</string>\n' \
         f'    <string name="kakao_scheme">kakao{key}</string>\n'
text = text.replace('</resources>', inject + '</resources>')
p.write_text(text)
PY
else
  echo "✅ strings.xml 에 kakao_native_app_key 이미 존재"
fi

# --- 4) AndroidManifest.xml 패치 --------------------------------------------
if ! grep -q 'com.kakao.sdk.AppKey' "$MANIFEST"; then
  echo "📝 AndroidManifest.xml 에 Kakao meta-data + 인텐트 필터 추가"
  python3 - <<'PY' "$MANIFEST"
import sys, re, pathlib
p = pathlib.Path(sys.argv[1])
xml = p.read_text()

# (a) application 태그 안에 Kakao meta-data + Auth activity 주입
app_inject = '''
        <!-- Kakao SDK -->
        <meta-data
            android:name="com.kakao.sdk.AppKey"
            android:value="@string/kakao_native_app_key" />

        <activity
            android:name="com.kakao.sdk.auth.AuthCodeHandlerActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data
                    android:host="oauth"
                    android:scheme="@string/kakao_scheme" />
            </intent-filter>
        </activity>
'''
xml = re.sub(r'(</application>)', app_inject + r'    \1', xml, count=1)

# (b) 루트에 인터넷 권한 + queries (Kakao/Naver 앱 스위칭 지원)
queries_block = '''
    <uses-permission android:name="android.permission.INTERNET" />

    <queries>
        <!-- Kakao -->
        <package android:name="com.kakao.talk" />
        <!-- Naver -->
        <package android:name="com.nhn.android.search" />
        <intent>
            <action android:name="android.intent.action.VIEW" />
            <data android:scheme="https" />
        </intent>
    </queries>
'''
if 'com.kakao.talk' not in xml:
    xml = re.sub(r'(<application\b)', queries_block + r'\n    \1', xml, count=1)

p.write_text(xml)
PY
else
  echo "✅ AndroidManifest.xml 에 Kakao 설정 이미 존재"
fi

# --- 5) MainActivity 에 플러그인 등록 ---------------------------------------
if ! grep -q 'KakaoLoginPlugin' "$MAIN_ACTIVITY"; then
  echo "📝 MainActivity 에 Kakao/Naver 플러그인 등록"
  if [[ "$MAIN_ACTIVITY" == *.kt ]]; then
    python3 - <<'PY' "$MAIN_ACTIVITY"
import sys, pathlib, re
p = pathlib.Path(sys.argv[1])
t = p.read_text()
t = t.replace(
    'import com.getcapacitor.BridgeActivity',
    'import com.getcapacitor.BridgeActivity\n'
    'import android.os.Bundle\n'
    'import com.nerdfrenz.kakao.KakaoLoginPlugin\n'
    'import com.lepisode.capacitor.naverlogin.CapacitorNaverLoginPlugin'
)
# 빈 class body → onCreate 삽입
new_body = '''class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        registerPlugin(KakaoLoginPlugin::class.java)
        registerPlugin(CapacitorNaverLoginPlugin::class.java)
        super.onCreate(savedInstanceState)
    }
}'''
t = re.sub(r'class MainActivity\s*:\s*BridgeActivity\(\)\s*\{\s*\}', new_body, t)
p.write_text(t)
PY
  else
    echo "⚠️  MainActivity 가 Java 파일입니다. 수동으로 Kakao/Naver 플러그인 등록이 필요합니다."
  fi
else
  echo "✅ MainActivity 에 플러그인 이미 등록됨"
fi

# --- 6) variables.gradle — minSdk 23 (Kakao SDK 요구) -----------------------
if [[ -f "$VARIABLES_GRADLE" ]]; then
  if grep -q 'minSdkVersion = 22' "$VARIABLES_GRADLE"; then
    echo "📝 variables.gradle minSdkVersion 22 → 23 (Kakao SDK 최소 요구)"
    sed -i.bak 's/minSdkVersion = 22/minSdkVersion = 23/' "$VARIABLES_GRADLE"
    rm -f "${VARIABLES_GRADLE}.bak"
  fi
fi

echo ""
echo "🎉 Android 세팅 완료!"
echo "   다음 단계:"
echo "   1) npm run android          # 정적 빌드 후 Android Studio 열기"
echo "   2) npm run android:dev      # dev 서버 (HMR) 기반으로 Android Studio 열기"
