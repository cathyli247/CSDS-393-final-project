from django.test import TestCase
from rest_framework.test import APIRequestFactory, CoreAPIClient, APIClient
from rest_framework.test import force_authenticate
from rest_framework.test import APITestCase
# Create your tests here.
from account.models import Account
from comment.models import Comment
from django.test.client import encode_multipart, RequestFactory
from .views import *
from .models import Post
from requests.auth import HTTPBasicAuth

class PostTests(APITestCase):
    maxDiff = None

    def test_api_detail_blog_view(self):
        factory = APIRequestFactory()
        account = Account.objects.create(username='author1')
        post = Post.objects.create(author=account)
        request = factory.get('/post')
        force_authenticate(request, user=account)
        response = api_detail_blog_view(request, 1)
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.data, {'pk': 1, 'title': '', 'content': '', 'category': 'other', 'username': 'author1'})
        return

    def test_api_update_blog_view(self):
        factory = APIRequestFactory()
        account = Account.objects.create(username='author1')
        post = Post.objects.create(author=account, title='title_1', content='content2')
        request = factory.put('/post', {'content': 'content2', 'category':'beauty'}, format='json')
        force_authenticate(request, user=account)
        response = api_update_blog_view(request, 1)
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.data, {'response': 'updated', 'pk': 1, 'title': 'title_1', 'content': 'content2', 'category': 'beauty', 'account': 'author1'})
        return

    def test_api_is_author_of_blogpost(self):
        factory = APIRequestFactory()
        account = Account.objects.create(username='lll')
        post = Post.objects.create(author=account)
        request = factory.get('/post')
        force_authenticate(request, user=account)
        response = api_is_author_of_blogpost(request, 1)
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.data,  {'response': 'You have permission to edit that.'})

        account = Account.objects.create(username='222')
        post = Post.objects.create(author=account)
        response = api_is_author_of_blogpost(request, 2)
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.data,  {'response': 'You don\'t have permission to edit that.'})
        return

    def test_test_api_delete_comment_view(self):
        factory = APIRequestFactory()
        account = Account.objects.create(username='lll')
        post = Post.objects.create(author=account)
        post2 = Post.objects.create(author=account)
        post3 = Post.objects.create(author=account)
        request = factory.delete('/post')
        force_authenticate(request, user=account)
        response = api_delete_blog_view(request, 1)
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.data, {'response': 'deleted'})
        posts = Post.objects.all()
        self.assertEquals(len(posts), 2)
        post1 = Comment.objects.filter(pk=1)
        self.assertEquals(len(post1), 0)
        return

    def test_api_create_comment_view(self):
        factory = APIRequestFactory()
        account = Account.objects.create(username='author1')
        request = factory.post('/post', {'title': 'title_1', 'content': 'content2', 'category': 'beauty', 'account': 'author1'}, format='json')
        force_authenticate(request, user=account)
        response = api_create_blog_view(request)
        self.assertEquals(response.status_code, 201)
        self.assertEquals(response.data, {'pk': 1, 'title': 'title_1', 'content': 'content2', 'category': 'beauty'})
        return

    def test_post_list(self):
        factory = APIRequestFactory()
        account = Account.objects.create(username='lll')
        post = Post.objects.create(author=account)
        post2 = Post.objects.create(author=account)
        post3 = Post.objects.create(author=account)
        request = factory.get('/post')
        force_authenticate(request, user=account)
        view = ApiBlogListView.as_view()
        response = view(request)
        self.assertEquals(response.status_code, 200)
        self.assertEquals(len(response.data), 3)
        return

    def test_post_author_list(self):
        client = APIClient()
        response = self.client.get('/post/list/lll/')
        self.assertEqual(response.status_code, 401)
        return


