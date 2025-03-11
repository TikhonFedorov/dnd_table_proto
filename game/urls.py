from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TokenViewSet, MessageViewSet

router = DefaultRouter()
router.register(r'tokens', TokenViewSet)
router.register(r'messages', MessageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]