"""
ASGI config for dnd_table project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
import django
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dnd_table.settings')
django.setup()  # <-- Добавьте эту строку перед импортом модулей Django!

from channels.routing import ProtocolTypeRouter, URLRouter
from game.routing import websocket_urlpatterns  # Импорт WebSocket маршрутов

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter(websocket_urlpatterns),
})
