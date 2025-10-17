@echo off
echo ========================================
echo CBI App - Android Build Script
echo ========================================
echo.

echo Checking if EAS CLI is installed...
where eas >nul 2>nul
if %errorlevel% neq 0 (
    echo EAS CLI not found. Installing...
    call npm install -g eas-cli
    echo.
)

echo Checking login status...
call eas whoami >nul 2>nul
if %errorlevel% neq 0 (
    echo You need to login to Expo first.
    echo.
    call eas login
    echo.
)

echo.
echo Starting Android APK build...
echo This will take about 5-10 minutes.
echo You'll get a download link when it's done.
echo.

call eas build --platform android --profile preview

echo.
echo ========================================
echo Build Complete!
echo Download your APK from the link above.
echo Install it on your Android phone to get the app icon.
echo ========================================
pause
