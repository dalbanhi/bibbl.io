from typing import Any, Dict
from django.shortcuts import render
from django.urls import reverse, path
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse


from django.views.generic.base import TemplateView, View

# https://stackoverflow.com/questions/11721818/django-get-the-static-files-url-in-view/59355195#59355195
from django.templatetags.static import static

from django.db import IntegrityError
import json

from .models import User, Book, Shelf



def obj_of_menu_urls() -> dict:
    """Returns an object of urls for the menu.
    @return: dict
    """
    menu_urls = {
        "index": {"url": reverse("index"), "name": "Home", "auth": "all"},
        "logo": {"url": static("images/books.png"), "name": "logo", "auth": "all"},
        # "login": {
        #     "url": reverse("login"),
        #     "name": "Login",
        #     "auth": "not_authenticated",
        # },
        "logout": {
            "url": reverse("logout"), 
            "name": "Logout",
            "auth": "authenticated"
        },
        # "register": {
        #     "url": reverse("index") + "?register=true",
        #     "name": "Register",
        #     "auth": "not_authenticated",
        # },
        "signIn": {
            "url": reverse("signIn"),
            "name": "Sign In",
            "auth": "not_authenticated",
        },
        "my_profile": {
            "url": reverse("my_profile"),
            "name": "My Profile",
            "auth": "authenticated",
        },
    }
    return menu_urls

def obj_of_api_urls() -> dict:
    """Returns an object of urls for the api.
    @param: None
    @return: dict
    """
    api_urls = {
        "book": reverse("book"),
        "shelf": reverse("shelf"),
    }

    return api_urls


# Views
def welcome_view(request):
    return HttpResponseRedirect(reverse("index"))

class IndexView(TemplateView):
    """Renders the index page. All other views are rendered through the index page and are handled by the front end.
    Inherits from TemplateView
    """
    register_view_full_path = "/my_app/login?register=true"
    template_name ="bibblio/index.html"

    def check_full_path(self) -> bool:
        """Checks if the full path is the register view.
        @return: bool
        """
        full_path = self.request.get_full_path_info()
        return True if full_path == self.register_view_full_path else False

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        """Returns the context data for the index page."""

        user = None
        if self.request.user.is_authenticated:
            user = User.objects.get(username=self.request.user.username)
            user = user.serialize()
        else:
            user = ""

        return {
            "is_register_view": self.check_full_path(),
            "is_authenticated": self.request.user.is_authenticated,
            "user": user,
            "app_container": "app_container",
            "menu_urls": obj_of_menu_urls(),
            "api_urls": obj_of_api_urls(),
        }

@login_required
def logout_view(request):
    """ View for logging out. Logs user out and redirects to index page."""
    logout(request)
    return HttpResponseRedirect(reverse("index"))

class LoginOrRegisterView(View):
    """View for logging in or registering. Inherits from View."""

    def register(self, request, data):
        data = json.loads(request.body)
        if data.get("username") == "":
            return JsonResponse({"error": "Username required."}, status=400)
        if data.get("email") == "":
            return JsonResponse({"error": "Email address required."}, status=400)
        if data.get("password") == "":
            return JsonResponse({"error": "Password required."}, status=400)
        if data.get("confirmation") == "":
            return JsonResponse(
                {"error": "Password confirmation required."}, status=400
            )
        password = data.get("password")
        confirmation = data.get("confirmation")
        if password != confirmation and password != "" and confirmation != "":
            return JsonResponse({"error": "Passwords must match."}, status=400)

        # try to make a new user
        try:
            user = User.objects.create_user(
                data.get("username"), data.get("email"), password
            )
            user.save()
        except IntegrityError:
            return JsonResponse({"error": "Username already taken."}, status=400)

        login(request, user)
        return JsonResponse(
            {"message": "Registration and Login succesful", "user_id": user.id},
            status=200,
        )
    
    def login(self, request, data):
        data = json.loads(request.body)

        # try to sign user in
        username = data.get("username")
        password = data.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse(
                {"message": "Login successful.", "user_id": user.id}, status=200
            )
        else:
            return JsonResponse(
                {"error": "Invalid username and/or password."}, status=400
            )

    def get(self, request, *args, **kwargs):
        return HttpResponseRedirect(reverse("index"))
    
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        print(data)

        if data.get("register") == "true":
            return self.register(request, data)
        else:
            return self.login(request, data)
        # try to sign user in
        # if data.get("username") == "":
        #     return JsonResponse({"error": "Username required."}, status=400)
        # if data.get("email") == "":
        #     return JsonResponse({"error": "Email address required."}, status=400)
        # if data.get("password") == "":
        #     return JsonResponse({"error": "Password required."}, status=400)
        # if data.get("password") != data.get("password_confirm"):
        #     return JsonResponse({"error": "Passwords must match."}, status=400)
        # try:
        #     user = User.objects.create_user(
        #         data.get("username"), data.get("email"), data.get("password")
        #     )
        #     user.save()
        # except IntegrityError:
        #     return JsonResponse({"error": "Username already taken."}, status=400)
        # login(request, user)
        # return JsonResponse({"message": "Login successful.", "user_id": user.id}, status=200)



class LoginView(View):

    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)

        # try to sign user in
        username = data.get("username")
        password = data.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse(
                {"message": "Login successful.", "user_id": user.id}, status=200
            )
        else:
            return JsonResponse(
                {"error": "Invalid username and/or password."}, status=400
            )

    def get(self, request, *args, **kwargs):
        return HttpResponseRedirect(reverse("index"))

class RegisterView(View):
    """ View for registering a new user. If the request is a POST request, the user is registered and logged in. Otherwise, the user is redirected to the index page, with the view of the register page."""

    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        if data.get("username") == "":
            return JsonResponse({"error": "Username required."}, status=400)
        if data.get("email") == "":
            return JsonResponse({"error": "Email address required."}, status=400)
        if data.get("password") == "":
            return JsonResponse({"error": "Password required."}, status=400)
        if data.get("confirmation") == "":
            return JsonResponse(
                {"error": "Password confirmation required."}, status=400
            )
        password = data.get("password")
        confirmation = data.get("confirmation")
        if password != confirmation and password != "" and confirmation != "":
            return JsonResponse({"error": "Passwords must match."}, status=400)

        # try to make a new user
        try:
            user = User.objects.create_user(
                data.get("username"), data.get("email"), password
            )
            user.save()
        except IntegrityError:
            return JsonResponse({"error": "Username already taken."}, status=400)

        login(request, user)
        return JsonResponse(
            {"message": "Registration and Login succesful", "user_id": user.id},
            status=200,
        )

    def get(self, request, *args, **kwargs):
        url = reverse("index") + "?register=true"
        return HttpResponseRedirect(url)


@login_required
def my_profile(request):
    """View for the user's profile. Right now, only returns to the index page. Further functionality for the user's profile will be added later."""
    return HttpResponseRedirect(reverse("index"))


# backends
def users(request, user_id):
    """Backend for users. Handles GET, PUT, and DELETE requests."""
    if request.method == "GET":
        user = User.objects.get(id=user_id)
        return JsonResponse(user.serialize())
    elif request.method == "PUT":
        return JsonResponse({"error": "PUT request not implemented."}, status=400)
    elif request.method == "DELETE":
        return JsonResponse({"error": "DELETE request not implemented."}, status=400)
    else:
        return JsonResponse(
            {"error": "GET, PUT, or DELETE request required."}, status=400
        )
    

########################### Book Endpoints ###########################


@login_required
def book(request):
    """Backend for books. Handles GET, POST, and PUT requests.
    @param: request
    """
    if request.method == "GET":
        # try to get information about a certain book?
        return JsonResponse({"error": "Cannot GET yet."}, status=400)
    elif request.method == "POST":
        data = json.loads(request.body)
        # get the user
        user = User.objects.get(username=request.user.username)

        if data.get("title") == "":
            return JsonResponse({"error": "Title required."}, status=400)

        book = get_or_create_book(data)
        # if a JSONResponse object is returned, then there was an error
        if type(book) == JsonResponse:
            return book
        # have ensured that a book exists, now relate the book to user. including shelves
        return relate_book_to_user(data, book, user)

    elif request.method == "PUT":
        # try to edit information about a certain book?
        data = json.loads(request.body)
        # get the user
        user = User.objects.get(username=request.user.username)
        # get the book
        try:
            book = Book.objects.get(id=data.get("book_id"))
        except Book.DoesNotExist:
            return JsonResponse({"error": "Book does not exist."}, status=400)

        if data.get("removing_book"):
            return remove_book(data, book, user, request)
        else:
            return update_book_fields(data, book, user, request)

    else:
        return JsonResponse(
            {"error": "GET, POST, or PUT request required."}, status=400
        )


def get_or_create_book(data):
    """Helper function for a book. Based on data, either gets a book from the database or creates a new one.
    @param: data
    """
    book = None
    make_new_book = False
    # check if at least one book by that title already exist in the database
    if Book.objects.filter(title=data.get("title")).exists():
        # if there is one book by that title, get it
        if Book.objects.filter(title=data.get("title")).count() < 2:
            # is that book already in the db the same one the user is trying to add?
            db_book = Book.objects.get(title=data.get("title"))
            if data.get("authors") != "":
                if db_book.authors != data.get("authors"):
                    # if not, make a new book
                    make_new_book = True
                else:
                    book = db_book
            elif data.get("publication_year") != "":
                if db_book.publication_year != data.get("publication_year"):
                    # if not, make a new book
                    make_new_book = True
                else:
                    book = db_book
            else:
                return JsonResponse(
                    {
                        "error": "There's a book by that title already in the database, but since no author or publication year was given, it's unclear if you're trying to add a new book of the same title. Please enter an author and/or publication year to further specify a book."
                    },
                    status=400,
                )

        # if there are multiple books by that title, get the one that matches the authors or publication year
        else:
            if data.get("authors") != "":
                if (
                    Book.objects.filter(title=data.get("title"))
                    .filter(authors=data.get("authors"))
                    .exists()
                ):
                    book = Book.objects.get(title=data.get("title")).filter(
                        authors=data.get("authors")
                    )
            elif data.get("publication_year") != "":
                if (
                    Book.objects.filter(title=data.get("title"))
                    .filter(publication_year=data.get("publication_year"))
                    .exists()
                ):
                    book = Book.objects.get(title=data.get("title")).filter(
                        publication_year=data.get("publication_year")
                    )
            else:
                return JsonResponse(
                    {
                        "error": "There are multiple books by that title. Please enter an author and/or publication year to further specify a book."
                    },
                    status=400,
                )
    else:
        make_new_book = True
    if make_new_book == True:
        # try to make a new book
        cover_image_url_given = False if data.get("cover_image_url") == "" else True
  
        if cover_image_url_given:
            book = Book.objects.create(
                title=data.get("title"),
                authors=data.get("authors"),
                publication_year=data.get("publication_year"),
                cover_image_url= data.get("cover_image_url")
            )
        else:
            # use cover image url default value
            book = Book.objects.create(
                title=data.get("title"),
                authors=data.get("authors"),
                publication_year=data.get("publication_year"),
            )
        # check if valid before saving
        if book.is_valid():
            book.save()
        else:
            return JsonResponse(
                {
                    "error": "Book is not valid. If you have multiple authors, check that your list authors is separated by only a comma. Check that your publication year, if known, is at least 10 and no greater than the current year. "
                },
                status=400,
            )

    # if book is valid, return it
    return book

def relate_book_to_user(data, book, user):
    """Helper function for a book. Once it has been gotten, it relates a book to a user based on the read_category given in data.
    @params: data - from the request
    @param: book - the book model object
    @param: user - the user model object
    """
    # if a book is already in any category, don't add it again
    if (
        user.books_read.filter(id=book.id).exists()
        or user.books_reading.filter(id=book.id).exists()
        or user.books_to_read.filter(id=book.id).exists()
    ):
        return JsonResponse(
            {
                "error": "You already have this book in your Library. If you want to switch it's reading category, view it in your Library and edit it there. "
            },
            status=400,
        )

    # add book to users read_category
    if data.get("read_category") == "read":
        user.books_read.add(book)
    elif data.get("read_category") == "reading":
        user.books_reading.add(book)
    elif data.get("read_category") == "to_read":
        user.books_to_read.add(book)
    else:
        return JsonResponse({"error": "Read category required."}, status=400)

    # add the book to any shelves that were passed in
    if data.get("shelves"):
        book = book_to_shelves(book, data.get("shelves"), should_add=True)
        if type(book) == JsonResponse:
            return book

    return JsonResponse(
        {
            "message": "Book added to your library successfully.",
            "user": user.serialize(),
        },
        status=200,
    )


def book_to_shelves(book, shelves_list, should_add):
    """Helper function to relate a book to a given list of shelf ids. Can add or remove them.
    @param: book - the book model object
    @param: shelves_list - a list of shelf ids
    @param: should_add - boolean, whether to add or remove the book from the shelves
    """
    for shelf in shelves_list:
        try:
            shelf = Shelf.objects.get(id=shelf)
            if should_add:
                shelf.books.add(book)
            else:
                shelf.books.remove(book)
        except Shelf.DoesNotExist:
            return JsonResponse({"error": "Shelf does not exist."}, status=400)
    return book

def remove_book_from_read_category(book, user, category):
    """Helper function to remove a book from a user's read category.
    @param: book - the book model object
    @param: user - the user model object
    @param: category - the category to remove the book from ("read, "reading", "to_read")
    """
    if category == "read":
        user.books_read.remove(book)
    elif category == "reading":
        user.books_reading.remove(book)
    elif category == "to_read":
        user.books_to_read.remove(book)
    else:
        return JsonResponse({"error": "Current category not valid."}, status=400)
    return user


def change_book_read_category(data, book, user):
    """Helper function to change a book's read category. First removes the current category, then adds a new one
    @param: data - from the request
    @param: book - the book model object
    @param: user - the user model object
    """
    # try to update read category
    # get current book category
    current_category = data.get("current_category")

    # remove from current category
    user = remove_book_from_read_category(book, user, current_category)
    if type(user) == JsonResponse:
        return user

    # add to new category
    if data.get("read_category") != "":
        if data.get("read_category") == "read":
            user.books_read.add(book)
        elif data.get("read_category") == "reading":
            user.books_reading.add(book)
        elif data.get("read_category") == "to_read":
            user.books_to_read.add(book)
        else:
            return JsonResponse({"error": "New category not valid."}, status=400)
    user.save()
    return user


def update_book_fields(data, book, user, request):
    """Helper function to update a book's fields. Called by the book view (PUT request).
    @param: data - from the request
    @param: book - the book model object
    @param: user - the user model object
    @param: request - the request object
    """
    if data.get("title") != "":
        # try to update title
        book.title = data.get("title")
    if data.get("authors") != "":
        # try to update authors
        book.authors = data.get("authors")
    if data.get("publication_year") != "":
        # try to update publication year
        book.publication_year = int(data.get("publication_year"))
    if data.get("cover_image_url") != "":
        print("cover image url: ", data.get("cover_image_url"))
        # try to update cover image url
        book.cover_image_url = data.get("cover_image_url")
    if data.get("read_category") != "":
        user = change_book_read_category(data, book, user)
        # if the user was not able to be updated, return the error
        if type(user) == JsonResponse:
            return user
    if data.get("shelves_to_remove"):
        # try to remove book from shelves
        book = book_to_shelves(book, data.get("shelves_to_remove"), should_add=False)
    if data.get("shelves_to_add"):
        # try to add book to shelves
        book = book_to_shelves(book, data.get("shelves_to_add"), should_add=True)

    if type(book) == JsonResponse:
        # there was a problem adding shelves
        return book

    # save if valid and return user, return error if not
    if book.is_valid():
        book.save()
        # get latest user info to send back
        user = User.objects.get(username=request.user.username)
        return JsonResponse(
            {"message": "Book updated successfully.", "user": user.serialize()},
            status=201,
        )
    else:
        return JsonResponse(
            {
                "error": "Book is not valid. If you have multiple authors, check that your list authors is separated by only a comma. Check that your publication year, if known, is at least 10 and no greater than the current year. "
            },
            status=400,
        )


def remove_book(data, book, user, request):
    """Helper function to remove a book from a user's library. Called by the book view (PUT request). Does NOT delete the book from the database, but removes it from association with the user.
    @param: data - from the request
    @param: book - the book model object
    @param: user - the user model object
    @param: request - the request object
    """
    # remove book from user read_category list
    category = data.get("current_category")
    user = remove_book_from_read_category(book, user, category)
    if type(user) == JsonResponse:
        return user

    # remove book from user shelves
    book = book_to_shelves(book, data.get("book_in_shelves_of_user"), should_add=False)
    if type(book) == JsonResponse:
        return book

    # save user
    user.save()
    # get latest user info to send back
    user = User.objects.get(username=request.user.username)
    return JsonResponse(
        {
            "message": "Book removed from your library successfully.",
            "user": user.serialize(),
        },
        status=201,
    )


#################### Shelf Endpoints ####################

def get_books_from_data(data, should_add):
    """Helper function to get books from data. Called by the shelf form endpoints(PUT request). Data is different if books should be added or not
    @param: data - from the request
    @param: should_add - boolean indicating whether books should be added or removed
    """
    # get and combine books from all categories
    books = []
    if should_add:
        books_to_add = books
        if data.get("books_read"):
            books_to_add += data.get("books_read")
        if data.get("books_reading"):
            books_to_add += data.get("books_reading")
        if data.get("books_to_read"):
            books_to_add += data.get("books_to_read")

        # get books from ids
        books = [Book.objects.get(id=int(book_id)) for book_id in books_to_add]

    else:
        books_to_remove = books
        if data.get("books_to_remove"):
            books += data.get("books_to_remove")

        # get books from ids
        books = [Book.objects.get(id=int(book_id)) for book_id in books_to_remove]

    return books


def handle_shelf_post(request):
    """Helper function to handle the POST request for the shelf form. Called by the shelf view (POST request).
    @param: request - the request object
    """
    # load data from request
    data = json.loads(request.body)
    # get the user
    user = User.objects.get(username=request.user.username)
    # get the name
    if data.get("name") == "":
        return JsonResponse({"error": "Name required for shelf."}, status=400)

    # if shelf already exists
    if Shelf.objects.filter(name=data.get("name")).exists():
        return JsonResponse(
            {
                "error": "You already have a shelf with that name. Please choose another name."
            },
            status=400,
        )

    # create the shelf
    shelf = Shelf.objects.create(
        name=data.get("name"),
        owner=user,
    )
    # add books of shelf because cannot forward set MTM field
    shelf.books.add(*get_books_from_data(data, should_add=True))

    shelf.save()

    return JsonResponse(
        {"message": "Shelf created successfully!", "user": user.serialize()}, status=200
    )


def add_books_to_shelves(data, user, request):
    """Helper function to add books to shelves. Called by the shelf view (PUT request) if trying to add books to a shelf.
    @param: data - from the request
    @param: user - the user model object
    @param: request - the request object
    """
    # check if at least one book is being added
    if (
        data.get("books_read") == []
        and data.get("books_reading") == []
        and data.get("books_to_read") == []
    ):
        return JsonResponse(
            {"error": "At least one book must be selected."}, status=400
        )
    elif data.get("shelves") == []:
        return JsonResponse(
            {"error": "At least one shelf must be selected."}, status=400
        )
    else:
        # get the shelves
        shelves = [
            Shelf.objects.get(id=int(shelf_id)) for shelf_id in data.get("shelves")
        ]

        # add books to shelves
        for shelf in shelves:
            shelf.books.add(*get_books_from_data(data, should_add=True))
            shelf.save()
        return JsonResponse(
            {
                "message": "Books added to shelves successfully!",
                "user": user.serialize(),
            },
            status=200,
        )


def handle_shelf_put(request):
    """Helper function to handle PUT request to shelf view. Called by the shelf view (PUT request)."""
    # load data from request
    data = json.loads(request.body)
    # get the user
    user = User.objects.get(username=request.user.username)

    # get add_or_remove
    if not data.get("add_or_remove"):
        return JsonResponse({"error": "Add or remove must be specified."}, status=400)
    else:
        if data.get("add_or_remove") == "add":
            return add_books_to_shelves(data, user, request)
        elif data.get("add_or_remove") == "remove":
            # get the shelf
            try:
                shelf = Shelf.objects.get(id=data.get("shelf_id"))
            except Shelf.DoesNotExist:
                return JsonResponse({"error": "Shelf does not exist."}, status=400)

            if data.get("shelf_name") != "":
                # change the name of the shelf
                shelf.name = data.get("shelf_name")

            # remove books from shelf
            if data.get("books_to_remove"):
                shelf.books.remove(*get_books_from_data(data, should_add=False))

            shelf.save()
            return JsonResponse(
                {"message": "Shelf updated successfully!", "user": user.serialize()},
                status=200,
            )

        else:
            return JsonResponse(
                {"error": "Add or remove must be specified."}, status=400
            )


def handle_shelf_delete(request):
    """Helper function to handle DELETE request to shelf view. Called by the shelf view (DELETE request)."""
    data = json.loads(request.body)
    # get the shelf

    try:
        shelf = Shelf.objects.get(id=data.get("shelf_id"))
    except Shelf.DoesNotExist:
        return JsonResponse({"error": "Shelf does not exist."}, status=400)

    # remove all books from shelf
    shelf.books.clear()
    # delete the shelf
    shelf.delete()

    # get latest user
    user = User.objects.get(username=request.user.username)
    return JsonResponse(
        {
            "message": "Shelf deleted successfully! Will reload the page soon.",
            "user": user.serialize(),
        },
        status=201,
    )


@login_required
def shelf(request):
    """View for the shelf page. Handles GET, POST, PUT, and DELETE requests."""
    if request.method == "GET":
        return JsonResponse({"error": "Cannot GET yet."}, status=400)
    elif request.method == "POST":
        return handle_shelf_post(request)
    elif request.method == "PUT":
        return handle_shelf_put(request)
    elif request.method == "DELETE":
        return handle_shelf_delete(request)
    else:
        return JsonResponse(
            {"error": "GET, POST, or PUT request required."}, status=400
        )
