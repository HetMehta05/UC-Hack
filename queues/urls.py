from django.urls import path
from .views import join_queue, call_next

urlpatterns = [
    path('join/', join_queue),
    path('call-next/', call_next),
]
