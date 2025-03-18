from django.shortcuts import render
from rest_framework import viewsets
from .models import Character, Token, RuleSet
from .serializers import CharacterSerializer, TokenSerializer, RuleSetSerializer

class RuleSetViewSet(viewsets.ModelViewSet):
    queryset = RuleSet.objects.all()
    serializer_class = RuleSetSerializer

class CharacterViewSet(viewsets.ModelViewSet):
    queryset = Character.objects.all()
    serializer_class = CharacterSerializer

class TokenViewSet(viewsets.ModelViewSet):
    queryset = Token.objects.all()
    serializer_class = TokenSerializer