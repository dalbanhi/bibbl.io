from django.contrib import admin
from .models import User

# Register your models here.
# Register your models here.
class UserAdmin(admin.ModelAdmin):
    # list_display = ("id", "name", "email")
    fieldsets = (
        (
            "Basic Information", 
            {"fields": ("username", "email", "password")}
        ),
    )


admin.site.register(User, UserAdmin)