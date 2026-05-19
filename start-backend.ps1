$python = "C:\Program Files\PostgreSQL\18\pgAdmin 4\python\python.exe"
$backendRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

if (-not (Test-Path $python)) {
  Write-Error "Python runtime not found at $python"
  exit 1
}

$env:PYTHONPATH = $backendRoot
& $python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --app-dir $backendRoot
