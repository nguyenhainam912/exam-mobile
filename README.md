npx expo run:android

scrcpy

npx expo install expo-file-system expo-sharing

emulator -list-avds
emulator -avd pixel6
emulator -avd nexus5

avdmanager create avd -n nexus5 -k "system-images;android-30;google_apis;x86_64" -d "Nexus 5"
sdkmanager "system-images;android-30;google_apis;x86_64"
