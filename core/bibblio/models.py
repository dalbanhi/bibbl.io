from django.contrib.auth.models import AbstractUser
from django.db import models
import re
from datetime import datetime


class User(AbstractUser):
    """A model class representing a user on the site."""

    books_read = models.ManyToManyField("Book", blank=True, related_name="in_read")
    books_reading = models.ManyToManyField(
        "Book", blank=True, related_name="in_reading"
    )
    books_to_read = models.ManyToManyField(
        "Book", blank=True, related_name="in_to_read"
    )

    # followers = models.ManyToManyField('User', blank=True, related_name="following", null=True)

    def get_books_read(self):
        return ",\t".join([str(book) for book in self.books_read.all()])

    def get_books_reading(self):
        return ",\t".join([str(book) for book in self.books_reading.all()])

    def get_books_to_read(self):
        return ",\t".join([str(book) for book in self.books_to_read.all()])

    # changed email example from last project
    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "books_read": [book.serialize() for book in self.books_read.all()],
            "books_reading": [book.serialize() for book in self.books_reading.all()],
            "books_to_read": [book.serialize() for book in self.books_to_read.all()],
            "shelves": [shelf.serialize() for shelf in self.shelves.all()],
        }

    def __str__(self) -> str:
        return f"{self.username}"




class Book(models.Model):
    # data

    title = models.TextField(max_length=140)

    authors = models.TextField(max_length=1000, blank=True)

    publication_year = models.IntegerField(blank=True)

    # credit for cover to MiniMouse user on MobileRead forums:
    # https://www.mobileread.com/forums/showpost.php?p=2627355&postcount=3
    

    def get_default_cover_image_url():
        return "https://www.mobileread.com/forums/attachment.php?attachmentid=111282&d=1378756884"
    
    # setting a default value in a django field: https://stackoverflow.com/questions/755857/how-can-i-set-a-default-value-for-a-field-in-a-django-model
    cover_image_url = models.URLField(default=get_default_cover_image_url)

    def is_valid(self):
        # tested regexes here: https://regex101.com/
        if self.title:
            # check if year is valid (if it exists)
            if self.publication_year:
                pattern = r"^\d{2,4}$"
                if (
                    not re.match(pattern, str(self.publication_year))
                    or int(self.publication_year) > datetime.today().year
                    or int(self.publication_year) < 0
                ):
                    return False

            # check if authors are valid (if they exist)
            if self.authors:
                pattern = r"^[a-zA-Z]+[a-zA-Z\.?\s]*$"
                authors_list = self.authors.split(",")
                for author in authors_list:
                    if not re.match(pattern, author):
                        return False

            return True
        else:
            return False

    def serialize(self):
        authors_list = self.authors.split(",") if self.authors else []
        main_author = ""
        if len(authors_list) == 1:
            main_author = authors_list[0]
        elif len(authors_list) > 1:
            main_author = authors_list[0] + " et al."

        pub_year = self.publication_year if self.publication_year else ""
        cover_image_url = self.cover_image_url if self.cover_image_url else ""
        return {
            "id": self.id,
            "title": self.title,
            "authors": authors_list,
            "main_author": main_author,
            "publication_year": pub_year,
            "cover_image_url": cover_image_url,
            "in_shelves": [shelf.id for shelf in self.in_shelf.all()],
            "in_read": [user.id for user in self.in_read.all()],
            "in_reading": [user.id for user in self.in_reading.all()],
            "in_to_read": [user.id for user in self.in_to_read.all()],
        }

    def __str__(self):
        return f"{self.title} by {self.authors}"


class Shelf(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="shelves")

    name = models.CharField(max_length=140)

    books = models.ManyToManyField(Book, blank=True, related_name="in_shelf")

    def __str__(self):
        return (
            f"{self.name} by {self.owner} containing {self.books.all().count()} books."
        )

    def serialize(self):
        books = self.books.all()
        return {
            "id": self.id,
            "owner": self.owner.username,
            "name": self.name,
            "books": [book.serialize() for book in books],
            "book_count": books.count(),
        }
