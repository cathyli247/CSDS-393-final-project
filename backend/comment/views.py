from tokenize import Comment

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import ListAPIView
from rest_framework.filters import SearchFilter, OrderingFilter

from account.models import Account
from .models import Post
from .models import Comment
from .serializers import CommentSerializer, CommentCreateSerializer, CommentUpdateSerializer
import json

SUCCESS = 'success'
ERROR = 'error'
DELETE_SUCCESS = 'deleted'
UPDATE_SUCCESS = 'updated'
CREATE_SUCCESS = 'created'


@api_view(['GET', ])
@permission_classes((IsAuthenticated, ))
def api_detail_comment_view(request, pk):

    try:
        comment = Comment.objects.get(pk=pk)
    except Post.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CommentSerializer(comment)
        return Response(serializer.data)


@api_view(['GET',])
@permission_classes((IsAuthenticated,))
def api_is_author_of_comment(request, pk):
    try:
        comment = Comment.objects.get(pk=pk)
    except comment.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    data = {}
    user = request.user
    if comment.author != user:
        data['response'] = "You don't have permission to edit that."
        return Response(data=data)
    data['response'] = "You have permission to edit that."
    return Response(data=data)


@api_view(['DELETE',])
@permission_classes((IsAuthenticated, ))
def api_delete_comment_view(request, pk):
    try:
        comment = Comment.objects.get(pk=pk)
    except Comment.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    user = request.user
    if comment.post.author != user:
        return Response({'response':"You don't have permission to delete that."})

    if request.method == 'DELETE':
        operation = comment.delete()
        data = {}
        if operation:
            data['response'] = DELETE_SUCCESS
        return Response(data=data)


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def api_create_comment_view(request):

    comment = Comment(author=request.user)

    if request.method == 'POST':
        serializer = CommentCreateSerializer(comment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentListView(ListAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    pagination_class = PageNumberPagination
    filter_backends = (SearchFilter, OrderingFilter)
    search_fields = ('author__username', 'post__title', 'post__id')