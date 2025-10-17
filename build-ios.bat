@echo off
echo ========================================
echo CBI App - iOS Build Script
echo ========================================
echo.

echo NOTE: iOS builds require:
echo - macOS computer OR
echo - Expo cloud build (works on Windows too!)
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
echo Starting iOS build...
echo This will take about 10-15 minutes.
echo You'll get a TestFlight link when it's done.
echo.

call eas build --platform ios --profile preview

echo.
echo ========================================
echo Build Complete!
echo Install TestFlight on your iPhone.
echo Use the link above to install CBI app.
echo ========================================
pause
