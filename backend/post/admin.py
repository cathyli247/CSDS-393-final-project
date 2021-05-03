from django.contrib import admin
from .models import Post

list_display = ('pk','username', 'title','content', 'category')
admin.site.register(Post)