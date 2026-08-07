@echo off
cd /d "%~dp0"
echo Starting Diarsa dev server...
echo Once it says "ready", open http://localhost:5173/ in your browser.
echo Close this window to stop the server.
npm run dev
