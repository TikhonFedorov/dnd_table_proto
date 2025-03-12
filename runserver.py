import os
import sys
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import subprocess
import time

class RestartHandler(FileSystemEventHandler):
    def __init__(self):
        self.process = None
        self.start_server()

    def start_server(self):
        if self.process:
            self.process.terminate()
        self.process = subprocess.Popen(["daphne", "-b", "0.0.0.0", "-p", "8000", "dnd_table.asgi:application"])

    def on_any_event(self, event):
        if event.src_path.endswith(".py"):
            print("Detected change, restarting server...")
            self.start_server()

if __name__ == "__main__":
    os.system("python manage.py migrate")
    event_handler = RestartHandler()
    observer = Observer()
    observer.schedule(event_handler, path=".", recursive=True)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()