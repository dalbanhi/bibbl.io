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
def obj_of_menu_urls():
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

def obj_of_api_urls():
    api_urls ={
        "book": reverse("book"),
        "shelf": reverse("shelf"),   
    }

    return api_urls


# Create your views here.
def index(request):
    print("index")
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
        "menu_urls": obj_of_menu_urls(),
        "api_urls": obj_of_api_urls(),
    })

def login_view(request):
    if request.method == "POST":
        data = json.loads(request.body)

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
        "menu_urls": obj_of_menu_urls(),
        "api_urls": obj_of_api_urls(),
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

def add_book_to_category(data, book, user):
    # if a book is already in any category, don't add it again
        if user.books_read.filter(id=book.id).exists() or user.books_reading.filter(id=book.id).exists() or user.books_to_read.filter(id=book.id).exists():
            return JsonResponse({"error": "You already have this book in your Library. If you want to switch it's reading category, view it in your Library and edit it there. "}, status=400)

        # add book to users read_category
        if data.get("read_category") == "read":
            user.books_read.add(book)
        elif data.get("read_category") == "reading":
            user.books_reading.add(book)
        elif data.get("read_category") == "to_read":
            user.books_to_read.add(book)
        else:
            return JsonResponse({"error": "Read category required."}, status=400)
        
        return JsonResponse({"message": "Book added to your library successfully."}, status=200)


def get_or_create_book(data):
    book = None
    make_new_book = False
    #check if at least one book by that title already exist in the database
    if Book.objects.filter(title=data.get("title")).exists():
        print(Book.objects.filter(title=data.get("title")).count())
        # if there is one book by that title, get it
        if Book.objects.filter(title=data.get("title")).count() < 2:
            print("here")

            # is that book already in the db the same one the user is trying to add?
            db_book = Book.objects.get(title=data.get("title"))
            if data.get("authors") != '':
                if db_book.authors != data.get("authors"):
                    # if not, make a new book
                    make_new_book = True
                else:
                    book = db_book
            elif data.get("publication_year") != '':
                if db_book.publication_year != data.get("publication_year"):
                    # if not, make a new book
                    make_new_book = True
                else:
                    book = db_book
        
        # if there are multiple books by that title, get the one that matches the authors or publication year        
        else:
            if data.get("authors") != '':
                if Book.objects.filter(title=data.get("title")).filter(authors=data.get("authors")).exists():
                    book = Book.objects.get(title=data.get("title")).filter(authors=data.get("authors"))
            elif data.get("publication_year") != '':
                if Book.objects.filter(title=data.get("title")).filter(publication_year=data.get("publication_year")).exists():
                    book = Book.objects.get(title=data.get("title")).filter(publication_year=data.get("publication_year"))
            else:
                return JsonResponse({"error": "There are multiple books by that title. Please enter an author or publication year to narrow your search."}, status=400)
    else:
        make_new_book = True
    if make_new_book == True:
        # try to make a new book
        book = Book.objects.create(
            title=data.get("title"),
            authors=data.get("authors"),
            publication_year=data.get("publication_year"),
            cover_image_url=data.get("cover_image_url"),
            )
        #check if valid before saving
        if book.is_valid():
            book.save()
        else:
            return JsonResponse({"error": "Book is not valid. Check that your list of author or authors is separated by only a comma, and that your publication year, if known, is at least 10 and no greater than the current year. "}, status=400)
    
    # if book is valid, return it
    return book

@login_required
def book(request):
    if request.method == "GET":
        pass
    elif request.method == "POST":
        data = json.loads(request.body)
        print(data)
        # get the user
        user = User.objects.get(username=request.user.username)

        if data.get("title") == '':
            return JsonResponse({"error": "Title required."}, status=400)
        
        book = get_or_create_book(data)
        if type(book) != Book:
            return book
        # have ensured that a book exists, now add it to the user's read_category 
        return add_book_to_category(data, book, user)
        
    elif request.method == "PUT":
        print("PUT")
    else:
        return JsonResponse({"error": "GET, POST, or PUT request required."}, status=400)
    

@login_required
def shelf(request):
    if request.method == "GET":
        pass
    elif request.method == "POST":
        pass
    elif request.method == "PUT":
        pass
    else:
        return JsonResponse({"error": "GET, POST, or PUT request required."}, status=400)