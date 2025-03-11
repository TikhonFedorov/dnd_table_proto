from django.db import models

class Token(models.Model):
    x = models.IntegerField(default=0)
    y = models.IntegerField(default=0)
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Message(models.Model):
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.content[:50]