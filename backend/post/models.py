from django.conf import settings
from django.db import models
from django.utils.text import slugify
from django.db.models.signals import post_delete, pre_save

from account.models import Account

TYPES = [
    ('food', 'Food'),
    ('fashion', 'Fashion'),
    ('sport', 'Sport'),
    ('beauty', 'Beauty'),
    ('travel', 'Travel'),
    ('other', 'Other')
]

class Post(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    content = models.TextField(max_length=200)
    category = models.CharField(choices=TYPES, default='other', max_length=100)

    def __str__(self):
        return str(self.title)
