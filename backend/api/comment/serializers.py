from rest_framework import serializers

from comment.models import Comment


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['name', 'website', 'body', 'published_on']


class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['name', 'website', 'body', 'post', 'email']


class CommentDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['name', 'website', 'body', 'post', 'email']