from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Doctor, Token

admin.site.register(Doctor)
admin.site.register(Token)
