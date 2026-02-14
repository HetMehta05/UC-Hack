from django.urls import path
from .views import request_swap, accept_swap, reject_swap

urlpatterns = [
    path('request/', request_swap),
    path('accept/', accept_swap),
    path('reject/', reject_swap),
]
