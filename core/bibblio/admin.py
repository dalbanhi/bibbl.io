from django.contrib import admin
from .models import User, Book, Shelf

# Register your models here.
# Register your models here.
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "get_books_read", "get_books_reading", "get_books_to_read")

class BookAdmin(admin.ModelAdmin):
    fieldsets = (
        (
            "Basic Information", 
            {"fields": ("title", "authors", "publication_year", "cover_image_url")}
        ),
    )

class ShelfAdmin(admin.ModelAdmin):
    fieldsets = (
        (
            "Basic Information", 
            {"fields": ("owner", "books")}
        ),
    )

admin.site.register(Shelf, ShelfAdmin)

admin.site.register(User, UserAdmin)
admin.site.register(Book, BookAdmin)