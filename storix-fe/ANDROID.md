# Storix Android (Capacitor) 세팅 & 테스트 가이드

## 0. 한 번만 — Android Studio + JDK 설치

1. Android Studio 최신 버전 설치: <https://developer.android.com/studio>
2. Android Studio → **Settings / Preferences** → **Languages & Frameworks → Android SDK**
   - **SDK Platforms**: Android 14 (API 34) 또는 35 체크
   - **SDK Tools**: "Android SDK Build-Tools", "Android SDK Platform-Tools", "Android Emulator" 체크
3. 환경변수(zsh 기준 `~/.zshrc`):
   ```bash
   export ANDROID_HOME="$HOME/Library/Android/sdk"
   export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator"
   ```
   저장 후 `source ~/.zshrc`.
4. JDK 17 이 필요합니다. Android Studio 내장 JBR 을 쓰거나:
   ```bash
   brew install openjdk@17
   export JAVA_HOME="$(/usr/libexec/java_home -v17)"
   ```

## 1. 프로젝트에 android/ 플랫폼 추가 (최초 1회)

`.env.local` 에 `NEXT_PUBLIC_KAKAO_NATIVE_APP_KEY` 가 있는지 먼저 확인한 뒤:

```bash
cd storix-fe
npm install                 # @capacitor/android 설치
npm run android:setup       # cap add android + Kakao/Naver 자동 패치
```

`scripts/setup-android.sh` 가 하는 일:

- `npx cap add android` 로 `android/` 디렉터리 생성
- `android/app/src/main/res/values/strings.xml` 에 `kakao_native_app_key`, `kakao_scheme` 주입
- `AndroidManifest.xml` 에 Kakao meta-data, AuthCodeHandlerActivity 인텐트 필터, `<queries>` (카톡/네이버 앱 스위칭), 인터넷 퍼미션 주입
- `MainActivity.kt` 에 `registerPlugin(KakaoLoginPlugin::class.java)` / `registerPlugin(CapacitorNaverLoginPlugin::class.java)` 등록
- `variables.gradle` 의 `minSdkVersion` 을 23 으로 (Kakao SDK 최소 요구)

이 스크립트는 **멱등** 입니다 — 여러 번 돌려도 같은 블록을 중복 삽입하지 않음.

## 2. 빌드 스크립트 대응표 (iOS ↔ Android)

| 용도                         | iOS                  | Android                  |
| ---------------------------- | -------------------- | ------------------------ |
| 정적 번들 빌드               | `npm run build:capacitor` | `npm run build:capacitor` |
| 번들 싱크 (정적)             | `npm run cap:sync`   | `npm run cap:sync:android` |
| IDE 열기 (정적, 권장)        | `npm run ios`        | `npm run android`         |
| dev 서버 기반 (HMR O)        | `npm run ios:dev`    | `npm run android:dev`     |
| IDE 없이 연결 기기로 바로 실행 | —                    | `npm run android:run`     |

`CAPACITOR_BUILD=true` 가 켜지면 `capacitor.config.ts` 에서 `webDir` 을 `out/` 으로, `server.url` 을 비우도록 되어 있어 정적 번들이 앱 안에 패키징됩니다. 끄면 `server.url` 로 dev 서버(http://localhost:3000 또는 `CAPACITOR_DEV_URL`)를 바라봅니다.

### Android dev 서버 접속 팁

Android 에뮬레이터에서 localhost 는 **호스트 Mac 이 아니라 에뮬레이터 자신** 을 가리킵니다. dev 서버로 접속하려면:

- 에뮬레이터에선 `10.0.2.2` 가 호스트 Mac 입니다.
  ```bash
  CAPACITOR_DEV_URL=http://10.0.2.2:3000 npm run android:dev
  ```
- 실기기(USB / Wi-Fi)에선 Mac 의 LAN IP (예: `192.168.0.12`) 를 사용:
  ```bash
  CAPACITOR_DEV_URL=http://192.168.0.12:3000 npm run android:dev
  ```
  그리고 `npm run dev` 가 `-H 0.0.0.0` 로 떠 있는지 확인.

## 3. 실제 핸드폰(Android Studio) 로 테스트하는 법

### 3-1. 폰에서 개발자 옵션 + USB 디버깅 켜기

1. 폰 **설정 → 휴대전화 정보 → 소프트웨어 정보** → 빌드 번호 **7번 탭** → 개발자 모드 ON
2. 설정 → **개발자 옵션** → **USB 디버깅** ON
3. Mac 에 USB 로 연결 → 폰에서 "이 컴퓨터에서 USB 디버깅 허용" 팝업 → 항상 허용

### 3-2. 디바이스 인식 확인

```bash
adb devices
# List of devices attached
# R3CXXXXXXXX    device
```

`unauthorized` 로 뜨면 폰 화면의 허용 팝업을 놓친 것 — 케이블 뽑았다 다시 꽂으면 다시 뜸.
`no devices` 면 케이블이 충전 전용일 가능성이 높음(데이터 케이블 사용).

### 3-3. Android Studio 에서 실행

```bash
npm run android          # 정적 빌드 + Android Studio 열림
```

Android Studio 상단 툴바:

- **Device 드롭다운**: 연결된 폰(또는 에뮬레이터) 선택
- ▶️ **Run 'app'** (Shift+F10) → 빌드 후 폰에 자동 설치 + 실행
- 🐞 **Debug 'app'** (Shift+F9) → 브레이크포인트 붙음

첫 실행 때 Gradle 싱크가 오래 걸릴 수 있음 (5~15분). Android Studio 하단 상태바에서 진행 확인.

### 3-4. Wi-Fi 디버깅 (케이블 없이)

Android 11+ 에서는 무선 디버깅 가능:

1. 폰 개발자 옵션 → **무선 디버깅** ON → "페어링 코드로 기기 페어링"
2. Mac 터미널:
   ```bash
   adb pair <폰에 표시된 IP:포트>      # 페어링 코드 입력
   adb connect <폰 디버깅 IP:포트>     # 이후 연결
   ```
3. `adb devices` 에 무선으로 잡히면 Android Studio 에서도 동일하게 선택 가능.

### 3-5. Chrome DevTools 로 WebView 디버깅

Capacitor 앱 = 네이티브 쉘 안의 Chrome WebView 입니다. WebView 쪽(JS/React) 디버깅은:

1. 폰을 USB 로 연결
2. Mac Chrome → `chrome://inspect/#devices`
3. "Remote Target" 에 폰의 Storix 가 뜸 → **Inspect** 클릭
4. DOM / Console / Network / Source 모두 동일하게 사용 가능

## 4. Kakao / Naver 로그인 확인

앱 실행 후 로그인 화면에서:

- **Kakao**: 카톡이 깔려있으면 카톡 토큰 로그인으로 스위칭, 없으면 카카오 계정 웹뷰. 리디렉트 스킴 `kakao{APP_KEY}://oauth` 로 앱이 복귀해야 성공.
- **Naver**: 네이버 앱이 깔려있으면 앱 OAuth, 없으면 인앱 웹뷰. `storixnaverlogin://` 스킴으로 복귀.

로그인이 실패할 때는 Android Studio 의 **Logcat** 에서 필터를 걸어 확인:

```
tag:KakaoSDK | tag:NaverIdLoginSDK | tag:Capacitor
```

## 5. 자주 나는 에러 & 해결

| 증상 | 원인 / 해결 |
|------|-------------|
| `cap add android` 후 Gradle sync 실패 | JDK 가 17 이 아님. Android Studio → Settings → Build, Execution, Deployment → Build Tools → Gradle → **Gradle JDK** 를 17 로. |
| `Kakao SDK not initialized` | `strings.xml` 의 `kakao_native_app_key` 가 비었거나 Manifest meta-data 가 없음. `npm run android:setup` 재실행. |
| Kakao 로그인 후 앱으로 안 돌아옴 | `AuthCodeHandlerActivity` 의 `android:scheme` 이 `kakao{APPKEY}` 포맷이어야 함 — setup 스크립트가 `@string/kakao_scheme` 으로 주입해 줌. |
| Naver 로그인 `NID_ERROR: client not registered` | 네이버 개발자센터에서 Android 패키지명(`kr.storix.app`) + 해시키 등록 필요. 해시키는 `./gradlew :app:signingReport` 또는 `keytool -exportcert ... | openssl sha1 -binary | openssl base64` 로 뽑음. |
| 에뮬레이터에서 dev 서버 안 열림 | `localhost` 대신 `10.0.2.2` 사용. `CAPACITOR_DEV_URL=http://10.0.2.2:3000 npm run android:dev`. |
| `INSTALL_FAILED_UPDATE_INCOMPATIBLE` | 서명 달라서 재설치 실패. 폰에서 기존 Storix 앱 삭제 후 재설치. |

## 6. git 관리

PR 로 올릴 때:

- `android/app/src/main/java/**/MainActivity.kt`
- `android/app/src/main/AndroidManifest.xml`
- `android/app/src/main/res/values/strings.xml`
- `android/variables.gradle`
- `android/app/build.gradle`
- `android/build.gradle`, `android/settings.gradle`, `android/gradle/wrapper/*`

이 정도가 팀에서 공유해야 하는 설정. 자동 생성된 `android/.gradle/`, `android/app/build/`, `android/local.properties` 는 `.gitignore` 로 제외 (cap add android 가 만들어 주는 `.gitignore` 가 이미 이걸 처리함).
