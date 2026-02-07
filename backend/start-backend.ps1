# Activate virtual environment and start backend
Set-Location D:\Projects\LearnWeave\backend
& .\venv\Scripts\Activate.ps1
python -m uvicorn src.main:app --reload --host 127.0.0.1 --port 8127
