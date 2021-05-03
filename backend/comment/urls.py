from django.urls import path
from .views import(
    api_create_comment_view,
    api_delete_comment_view,
    api_detail_comment_view,
    api_is_author_of_comment,
    CommentListView
)

app_name = 'comment'

urlpatterns = [
    path('<pk>/', api_detail_comment_view, name="detail"),
    path('<pk>/delete', api_delete_comment_view, name="delete"),
    path('create', api_create_comment_view, name="create"),
    path('list', CommentListView.as_view(), name="list"),
    path('<pk>/is_author', api_is_author_of_comment, name="is_author"),
]