from django.conf import settings
from django.db import models
from post.models import Post

# Create your models here.

class Comment(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField(max_length=200)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)