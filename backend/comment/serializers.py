from rest_framework import serializers
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):

    username = serializers.SerializerMethodField('get_username_from_author')

    class Meta:
        model = Comment
        fields = ['pk', 'content', 'username', 'post']

    def get_username_from_author(self, comment):
        username = comment.author.username
        return username

class CommentUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = CommentSerializer
        fields = ['content']

class CommentCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = ['pk', 'content', 'post']
