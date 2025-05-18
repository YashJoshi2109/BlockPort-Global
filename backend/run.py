import sys
from pathlib import Path
import uvicorn

# Add the app directory to the Python path
app_dir = Path(__file__).resolve().parent / "app"
sys.path.append(str(app_dir))

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
