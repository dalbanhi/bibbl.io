from django.urls import path
from django.views.generic.base import TemplateView
from . import views

urlpatterns = [
    path(r"", views.IndexView.as_view(), name="index"),
    # path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("my_profile", views.my_profile, name="my_profile"),
    # backends
    path("users/<int:user_id>", views.users, name="users"),
    # path("login_register", views.login_register, name="login_register")
    path("book", views.book, name="book"),
    path("shelf", views.shelf, name="shelf"),
]
