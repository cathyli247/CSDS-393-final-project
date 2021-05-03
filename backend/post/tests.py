from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

class POSTTests(APITestCase):
    def test_create_post(self):
        """
        Ensure we can create a new account object.
        """
        url = reverse('create')
        data = {'title':'title1', 'content':'content1', 'category':'other'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data, data)
