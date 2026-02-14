from django.urls import path
from .views import join_queue, call_next,queue_status,full_queue,cancel_token,skip_token,delete_token,force_complete  


urlpatterns = [
    path('join/', join_queue),
    path('call-next/', call_next),
    path('status/', queue_status),
    path('full-queue/', full_queue),
    path('cancel/', cancel_token),
    path('skip/', skip_token),
    path('full-queue/', full_queue),
    path('delete-token/<int:token_id>/', delete_token),
    path('force-complete/', force_complete),


]

