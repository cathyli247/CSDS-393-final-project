from rest_framework import serializers
from .models import Post

MIN_TITLE_LENGTH = 1
MIN_BODY_LENGTH = 10

class BlogPostSerializer(serializers.ModelSerializer):

    username = serializers.SerializerMethodField('get_username_from_author')

    class Meta:
        model = Post
        fields = ['pk', 'title', 'content', 'category','username']


    def get_username_from_author(self, blog_post):
        username = blog_post.author.username
        return username


class BlogPostUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Post
        fields = ['title', 'content', 'category']

    def validate(self, blog_post):
        try:
            title = blog_post['title']
            if len(title) < MIN_TITLE_LENGTH:
                raise serializers.ValidationError({"response": "Enter a title longer than " + str(MIN_TITLE_LENGTH) + " characters."})

            content = blog_post['content']
            if len(content) < MIN_BODY_LENGTH:
                raise serializers.ValidationError({"response": "Enter a body longer than " + str(MIN_BODY_LENGTH) + " characters."})
        except KeyError:
            pass
        return blog_post


class BlogPostCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Post
        fields = ['pk', 'title', 'content', 'category']

    # def save(self):
    #     try:
    #         print('================')
    #         print(self.validated_data.__dict__)
    #         blog_post = Post(
    #             author=self.validated_data['author'],
    #             title=self.validated_data['title'],
    #             content=self.validated_data['content'],
    #             category=self.validated_data['category'],
    #         )
    #         blog_post.save()
    #         print('================2')
    #         return blog_post
    #     except KeyError:
    #         raise serializers.ValidationError({"response": "You must have a title, some content, and an image."})









