from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
# https://stackoverflow.com/questions/11721818/django-get-the-static-files-url-in-view/59355195#59355195
from django.templatetags.static import static

from django.db import IntegrityError
import json

from .models import User, Book, Shelf


# saw this as inspiration of how to get django urls to js
def obj_of_menu_urls(user):
    menu_urls = {
        "index": {
            "url": reverse("index"), 
            "name": "Home", 
            "auth": "all"
        },
        "logo": {
            "url": static("assets/books.png"), 
            "name": "logo", 
            "auth": "all"
        },
        "login": {
            "url": reverse("login"),
            "name": "Login",
            "auth": "not_authenticated"
        },
        "logout": {
            "url": reverse("logout"),
            "name": "Logout",
            "auth": "authenticated"
        },
        "register": {
            "url": reverse("register"),
            "name": "Register",
            "auth": "not_authenticated"
        },
        "my_profile":{
            "url": reverse("my_profile"),
            "name": "My Profile",
            "auth": "authenticated"
        }
    }
    return menu_urls

# Create your views here.
def index(request):

    user = None
    if request.user.is_authenticated:
        print("here")
        user = User.objects.get(username=request.user.username)
        user= user.serialize()
        print(user)
    else:
        user = ""

    return render(request, "bibblio/index.html", {
        "is_register_view": True,
        "is_authenticated": request.user.is_authenticated,
        "user": user,
        "app_container": "app_container",
        "menu_urls": obj_of_menu_urls(user),
    })

def login_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        print(data)

        # try to sign user in
        username = data.get("username")
        password = data.get("password")
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return JsonResponse({"message": "Login successful.", "user_id": user.id}, status=200)
        else:
            return JsonResponse({"error": "Invalid username and/or password."}, status=400)
    else:
        user = None
        if request.user.is_authenticated:
            user = User.objects.get(username=request.user.username)
            user= user.serialize()
            print(user)
        else:
            user = ""
        return render(request, "bibblio/index.html", {
        "is_register_view": False,
        "is_authenticated": request.user.is_authenticated,
        "user": user,
        "app_container": "app_container",
        "menu_urls": obj_of_menu_urls(user),
    })

@login_required
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        data = json.loads(request.body)
        print(data)
        if data.get("username") == '':
            return JsonResponse({"error": "Username required."}, status=400)
        if data.get("email") == '':
            return JsonResponse({"error": "Email address required."}, status=400)
        if data.get("password") == '':
            return JsonResponse({"error": "Password required."}, status=400)
        if data.get("confirmation") == '':
            return JsonResponse({"error": "Password confirmation required."}, status=400)
        password = data.get("password")
        confirmation = data.get("confirmation")
        if password != confirmation and password != '' and confirmation != "":
            return JsonResponse({"error": "Passwords must match."}, status=400)
        
        # try to make a new user
        try:
            user = User.objects.create_user(data.get("username"), data.get("email"), password)
            user.save()
        except IntegrityError:
            return JsonResponse({"error": "Username already taken."}, status=400)
        
        login(request, user)
        return JsonResponse({"message": "Registration and Login succesful", "user_id": user.id}, status=200)
    
    return HttpResponseRedirect(reverse("index"))

@login_required
def my_profile(request):
    return render(request, "bibblio/index.html")


# backends
def users(request, user_id):
    if request.method == "GET":
        user = User.objects.get(id=user_id)
        return JsonResponse(user.serialize())
    elif request.method == "PUT":
        pass
    elif request.method == "DELETE":
        pass
    else:
        return JsonResponse({"error": "GET, PUT, or DELETE request required."}, status=400)