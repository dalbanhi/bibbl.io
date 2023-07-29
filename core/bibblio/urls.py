from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("my_profile", views.my_profile, name="my_profile"),
    # backends
    path("users/<int:user_id>", views.users, name="users"),
    # path("login_register", views.login_register, name="login_register")
]