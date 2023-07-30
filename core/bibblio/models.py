from django.contrib.auth.models import AbstractUser
from django.db import models
import re
from datetime import datetime


class User(AbstractUser):
    """A model class representing a user on the site.
    """
    books_read = models.ManyToManyField('Book', blank=True, related_name="in_read")
    books_reading = models.ManyToManyField('Book', blank=True, related_name="in_reading")
    books_to_read = models.ManyToManyField('Book', blank=True, related_name="in_to_read")

    # followers = models.ManyToManyField('User', blank=True, related_name="following", null=True)

    def get_books_read(self):
        return ",\t".join([str(book) for book in self.books_read.all()])
    
    def get_books_reading(self):
        return ",\t".join([str(book) for book in self.books_reading.all()])
    
    def get_books_to_read(self):
        return ",\t".join([str(book) for book in self.books_to_read.all()])

    #changed email example from last project
    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "books_read": [str(book) for book in self.books_read.all()],
            "books_reading": [str(book) for book in self.books_reading.all()],
            "books_to_read": [str(book) for book in self.books_to_read.all()],
        }

    def __str__(self) -> str:
        return f"{self.username}"
    

class Book(models.Model):
     # data

    title = models.TextField(max_length=140)

    authors = models.TextField(max_length=1000, blank=True)
    
    publication_year = models.IntegerField(blank=True)

    cover_image_url = models.URLField(blank=True)

    def is_valid(self):
        # tested regexes here: https://regex101.com/
        if self.title:
            
            # check if year is valid (if it exists)
            if self.publication_year:
                pattern = r'^\d{2,4}$'
                if not re.match(pattern, str(self.publication_year)) or \
                    int(self.publication_year) > datetime.today().year or \
                    int(self.publication_year) < 0:
                    return False
                
            # check if authors are valid (if they exist)
            if self.authors:
                pattern = r'^[a-zA-Z]+[a-zA-Z\.?\s]*$'
                authors_list = self.authors.split(",")
                for author in authors_list:
                    if not re.match(pattern, author):
                        return False

            return True
        else:
            return False


    def serialize(self):
        authors_list = self.authors.split(",")
        return {
            "id": self.id,
            "title": self.title,
            "authors": authors_list,
            "publication_year": self.publication_year,
            "image_url": self.image_url,
        }
    
    def __str__(self):
        return f"{self.title} by {self.authors}"
    

class Shelf(models.Model):

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="shelves")

    name = models.CharField(max_length=140)

    books = models.ManyToManyField(Book, blank=True, related_name="in_shelf")
    
