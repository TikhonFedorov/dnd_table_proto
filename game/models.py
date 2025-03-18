from django.db import models

class RuleSet(models.Model):
    name = models.CharField(max_length=50, unique=True)
    config = models.JSONField(default=dict)

    def __str__(self):
        return self.name

class Character(models.Model):
    name = models.CharField(max_length=50)
    rule_set = models.ForeignKey(RuleSet, on_delete=models.CASCADE)
    # Основные характеристики
    strength = models.IntegerField(default=10)
    dexterity = models.IntegerField(default=10)
    constitution = models.IntegerField(default=10)
    intelligence = models.IntegerField(default=10)
    wisdom = models.IntegerField(default=10)
    charisma = models.IntegerField(default=10)
    # Производные характеристики
    level = models.IntegerField(default=1)
    hit_points_max = models.IntegerField(default=10)
    hit_points_current = models.IntegerField(default=10)
    armor_class = models.IntegerField(default=10)
    proficiency_bonus = models.IntegerField(default=2)
    # Дополнительно
    character_class = models.CharField(max_length=50, blank=True)  # Например, "Fighter"
    race = models.CharField(max_length=50, blank=True)  # Например, "Human"
    initiative_bonus = models.IntegerField(default=0)  # Бонус к инициативе (обычно DEX mod)

    def __str__(self):
        return self.name

    @property
    def modifiers(self):
        return {
            'strength': (self.strength - 10) // 2,
            'dexterity': (self.dexterity - 10) // 2,
            'constitution': (self.constitution - 10) // 2,
            'intelligence': (self.intelligence - 10) // 2,
            'wisdom': (self.wisdom - 10) // 2,
            'charisma': (self.charisma - 10) // 2
        }

class Token(models.Model):
    character = models.ForeignKey(Character, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=50)
    x = models.IntegerField(default=0)
    y = models.IntegerField(default=0)
    color = models.CharField(max_length=7, default="#ef4444")

    def __str__(self):
        return self.name