from rest_framework import serializers
from .models import Character, Token, RuleSet

class RuleSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = RuleSet
        fields = '__all__'

class CharacterSerializer(serializers.ModelSerializer):
    modifiers = serializers.ReadOnlyField()  # Добавляем модификаторы как вычисляемое поле

    class Meta:
        model = Character
        fields = '__all__'

class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = '__all__'