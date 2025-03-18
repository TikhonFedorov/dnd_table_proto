from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'rulesets', views.RuleSetViewSet)
router.register(r'characters', views.CharacterViewSet)
router.register(r'tokens', views.TokenViewSet)

urlpatterns = [
    path('api/', include(router.urls)),  # Маршруты API начинаются с /api/
]