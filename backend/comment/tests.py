from django.test import TestCase
from rest_framework.test import APIRequestFactory
from rest_framework.test import force_authenticate
from rest_framework.test import APITestCase
# Create your tests here.
from account.models import Account
from django.test.client import encode_multipart, RequestFactory
from .views import *
from post.models import Post


class CommentTests(APITestCase):

    def test_api_detail_comment_view(self):
        factory = APIRequestFactory()
        account = Account.objects.create(username='lll')
        post = Post.objects.create(author=account)
        comment = Comment.objects.create(post=post, author=account)
        request = factory.get('/comment')
        force_authenticate(request, user=account)
        response = api_detail_comment_view(request, 4)
        self.assertEquals(response.status_code, 404)
        response = api_detail_comment_view(request, 1)
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.data,  {'pk': 1, 'content': '', 'username': 'lll', 'post': 1})
        return

    def test_api_is_author_of_comment(self):
        factory = APIRequestFactory()
        account = Account.objects.create(username='lll')
        post = Post.objects.create(author=account)
        comment = Comment.objects.create(post=post, author=account)
        request = factory.get('/comment')
        force_authenticate(request, user=account)
        response = api_is_author_of_comment(request, 4)
        self.assertEquals(response.status_code, 404)
        response = api_is_author_of_comment(request, 1)
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.data,  {'response': 'You have permission to edit that.'})

        account = Account.objects.create(username='222')
        comment2 = Comment.objects.create(post=post, author=account)
        response = api_is_author_of_comment(request, 2)
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.data,  {'response': 'You don\'t have permission to edit that.'})
        return

    def test_api_delete_comment_view(self):
        factory = APIRequestFactory()
        account = Account.objects.create(username='lll')
        post = Post.objects.create(author=account)
        comment = Comment.objects.create(post=post, author=account)
        comment2 = Comment.objects.create(post=post, author=account)
        comment3 = Comment.objects.create(post=post, author=account)
        request = factory.delete('/comment')
        force_authenticate(request, user=account)
        response = api_delete_comment_view(request, 10)
        self.assertEquals(response.status_code, 404)
        response = api_delete_comment_view(request, 1)
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.data, {'response': 'deleted'})
        comments = Comment.objects.all()
        self.assertEquals(len(comments), 2)
        comment1 = Comment.objects.filter(pk=1)
        self.assertEquals(len(comment1), 0)
        return

    def test_api_create_comment_view(self):
        factory = APIRequestFactory()
        account = Account.objects.create(username='lll')
        post = Post.objects.create(author=account)
        request = factory.post('/comment', {'content': 'new idea', 'post':1}, format='json')
        force_authenticate(request, user=account)
        response = api_create_comment_view(request)
        self.assertEquals(response.status_code, 201)
        self.assertEquals(response.data, {'pk': 1, 'content': 'new idea', 'post': 1})

        request = factory.post('/comment', {'content': 'new idea'}, format='json')
        force_authenticate(request, user=account)
        response = api_create_comment_view(request)
        self.assertEquals(response.status_code, 400)
        return

    def test_comment_list(self):
        factory = APIRequestFactory()
        account = Account.objects.create(username='lll')
        post = Post.objects.create(author=account)
        comment = Comment.objects.create(post=post, author=account)
        comment2 = Comment.objects.create(post=post, author=account)
        comment3 = Comment.objects.create(post=post, author=account)
        request = factory.get('/comment')
        force_authenticate(request, user=account)
        view = CommentListView.as_view()
        response = view(request)
        self.assertEquals(response.status_code, 200)
        self.assertEquals(len(response.data), 3)
        return





