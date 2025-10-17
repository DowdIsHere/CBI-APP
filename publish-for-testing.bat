@echo off
echo ========================================
echo CBI App - Publish for Testing
echo ========================================
echo.
echo This creates a PERMANENT testing link.
echo Share it with testers - it works forever!
echo Updates when you publish again.
echo.
echo ========================================
echo.

cd /d "%~dp0"

echo Publishing app to Expo...
echo.

call npx expo publish

echo.
echo ========================================
echo DONE!
echo.
echo Your app is now published.
echo Share the link above with testers.
echo.
echo Testers need:
echo 1. Expo Go app installed
echo 2. Your shareable link
echo 3. That's it!
echo.
echo To update: Just run this script again!
echo ========================================
echo.

pause
