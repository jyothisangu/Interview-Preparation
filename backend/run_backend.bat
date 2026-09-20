# run_backend.bat - Run this to start the backend server
# Double-click or run in PowerShell from the backend folder

cd /d "%~dp0"
call ..\..\venv\Scripts\activate.bat 2>nul || python -m venv ..\..\venv && call ..\..\venv\Scripts\activate.bat
pip install -r requirements.txt -q
python -m spacy download en_core_web_sm -q
python main.py
