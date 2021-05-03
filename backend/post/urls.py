from django.urls import path
from .views import(
    api_detail_blog_view,
    api_update_blog_view,
    api_delete_blog_view,
    api_create_blog_view,
    api_is_author_of_blogpost,
    ApiBlogListView
)

app_name = 'blog'

urlpatterns = [
    path('<pk>/', api_detail_blog_view, name="detail"),
    path('<pk>/update', api_update_blog_view, name="update"),
    path('<pk>/delete', api_delete_blog_view, name="delete"),
    path('create', api_create_blog_view, name="create"),
    path('list', ApiBlogListView.as_view(), name="list"),
    path('<pk>/is_author', api_is_author_of_blogpost, name="is_author"),
]