@echo off
call venv\Scripts\activate
set DJANGO_SETTINGS_MODULE=dnd_table.settings
python manage.py migrate
nodemon --exec "daphne -b 0.0.0.0 -p 8000 dnd_table.asgi:application" --watch .