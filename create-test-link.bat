@echo off
echo ========================================
echo CBI App - Create Testing Link
echo ========================================
echo.
echo This will create a shareable link for testing.
echo Testers can use it on iPhone or Android.
echo NO iOS developer account needed!
echo.
echo ========================================
echo.

echo Starting development server with tunnel...
echo.
echo When the QR code appears:
echo 1. Take a screenshot
echo 2. Share it with testers
echo 3. They install Expo Go app
echo 4. They scan the QR code
echo 5. App loads on their phone!
echo.
echo ========================================
echo.
echo Press Ctrl+C to stop the server when done.
echo.

cd /d "%~dp0"
call npx expo start --tunnel

pause
