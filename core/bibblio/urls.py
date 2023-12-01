from django.urls import path
from django.views.generic.base import TemplateView
from . import views

urlpatterns = [

    path('', views.welcome_view, name='welcome'),
    path('my_app', views.IndexView.as_view(), name="index"),
    path('my_app/<path:path>', views.IndexView.as_view(), name="index_with_path"),


    path("login", views.LoginView.as_view(), name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.RegisterView.as_view(), name="register"),
    path("my_profile", views.my_profile, name="my_profile"),
    # backends
    path("users/<int:user_id>", views.users, name="users"),
    path("book", views.book, name="book"),
    path("shelf", views.shelf, name="shelf"),
]
