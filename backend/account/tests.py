from django.test import TestCase
from .models import Account
from requests.auth import HTTPBasicAuth
from rest_framework.test import APIRequestFactory, CoreAPIClient, APIClient
from rest_framework.test import force_authenticate
from rest_framework.test import APITestCase
from rest_framework.test import force_authenticate
from django.test.client import encode_multipart, RequestFactory
from .views import *
from rest_framework.exceptions import ErrorDetail
from requests.auth import HTTPBasicAuth


# Create your tests here.
class AccountTest(APITestCase):

    maxDiff = None

    def test_registration_view(self):
        factory = APIRequestFactory()
        request = factory.post('account/register', {'username': 'unit_test_1', 'password': '010coco1234'}, format='json')
        response = registration_view(request)
        self.assertEquals(response.status_code, 200)

        request = factory.post('account/register', {'username': 'unit_test_1', 'password': '010coco1234'}, format='json')
        response = registration_view(request)
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.data, {'error_message': "That username is already in use.", 'response': 'Error'})

        request = factory.post('account/register', {'username': '', 'password': '010coco1234'}, format='json')
        response = registration_view(request)
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.data, {'username': [ErrorDetail(string='This field may not be blank.', code='blank')]})

        request = factory.post('account/register', {'username': 'unit_test_1', 'password': ''}, format='json')
        response = registration_view(request)
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.data, {'error_message': 'That username is already in use.', 'response': 'Error'})

        return

    def test_login_view(self):
        factory = APIRequestFactory()
        create = factory.post('account/register', {'username': 'unit_test_1', 'password': '010coco1234'},
                               format='json')
        registration_view(create)
        request = factory.post('account/login', {'username': 'unit_test_1', 'password': '010coco1234'},
                               format='json')
        view = ObtainAuthTokenView.as_view()
        response = view(request)
        self.assertEquals(response.status_code, 200)
        request = factory.post('account/login', {'username': 'unit_test_1', 'password': '010coco123'},
                               format='json')
        response = view(request)
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.data, {'response': 'Error', 'error_message': 'Invalid credentials'})

        request = factory.post('account/login', {'username': 'unit_test_0', 'password': '010coco123'},
                               format='json')
        response = view(request)
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.data, {'response': 'Error', 'error_message': 'Invalid credentials'})

        return

    def test_account_properties(self):
        factory = APIRequestFactory()
        account1 = Account.objects.create(username='unit_test_1')
        request = factory.get('/account/properties', user=account1)
        force_authenticate(request, user=account1)
        response = account_properties_view(request)
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.data, {'pk': 1, 'username': 'unit_test_1', 'fav_list': '[]'})

        update_request = factory.put('account/properties/update', {'pk': 1, 'username': 'unit_test_1', 'fav_list': '[1,2]'},
                              format='json')
        force_authenticate(update_request, user=account1)
        update_response = update_account_view(update_request)
        request = factory.get('/account/properties', user=account1)
        force_authenticate(request, user=account1)
        response = account_properties_view(request)
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.data, {'pk': 1, 'username': 'unit_test_1', 'fav_list': '[1,2]'})


        account0 = Account.objects.create(username='unit_test_0')
        request = factory.get('/account/properties', user=account0)
        response = account_properties_view(request)
        self.assertEquals(response.status_code, 401)
        self.assertEquals(response.data,{'detail': ErrorDetail(string='Authentication credentials were not provided.', code='not_authenticated')})

        return

    def test_account_update(self):
        factory = APIRequestFactory()
        account1 = Account.objects.create(username='unit_test_1')
        request = factory.put('account/properties/update', {'pk': 1, 'username': 'unit_test_1', 'fav_list': '[1,2,3]'}, format='json')
        force_authenticate(request, user=account1)
        response = update_account_view(request)
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.data,{'response': 'Account update success', 'data': {'pk': 1, 'username': 'unit_test_1', 'fav_list': '[1,2,3]'}})

        request = factory.put('account/properties/update', {'fav_list': '[1,2]'},
                              format='json')
        force_authenticate(request, user=account1)
        response = update_account_view(request)
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.data, {'response': 'Account update success',
                                          'data': {'pk': 1, 'username': 'unit_test_1', 'fav_list': '[1,2]'}})

        request = factory.put('account/properties/update', {2}, format='json')
        force_authenticate(request, user=account1)
        response = update_account_view(request)
        self.assertEquals(response.status_code, 400)
        self.assertEquals(response.data, {'non_field_errors': [ErrorDetail(string='Invalid data. Expected a dictionary, but got list.', code='invalid')]})

        request = factory.put('account/properties/update', {'pk': 1, 'username': 'unit_test_1', 'fav_list': '[1,2]'},
                              format='json')
        response = update_account_view(request)
        self.assertEquals(response.status_code, 401)
        self.assertEquals(response.data, {
            'detail': ErrorDetail(string='Authentication credentials were not provided.', code='not_authenticated')})

        return

    def test_does_account_exist(self):
        factory = APIRequestFactory()
        Account.objects.create(username='unit_test_1')
        request = factory.get('account/check_if_account_exists/', {'username': 'unit_test_1'})
        response = does_account_exist_view(request)
        self.assertEquals(response.status_code, 200)

        request = factory.get('account/check_if_account_exists/', {'username': 'unit_test_2'})
        response = does_account_exist_view(request)
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.data, {'response': 'Account does not exist'})

        return

















