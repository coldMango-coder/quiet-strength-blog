@echo off
echo.
echo ================================
echo   QUIET STRENGTH BLOG WEBSITE
echo ================================
echo.
echo Starting your website...
echo.
echo Building the website first...
call npm run build
echo.
echo Build complete! Now serving your website...
echo.
echo Your website will be available at: http://localhost:3000
echo.
echo ================================
echo   WEBSITE IS NOW RUNNING!
echo ================================
echo.
echo Press Ctrl+C to stop the server
echo.
call serve -s build -p 3000