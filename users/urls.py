from django.urls import path
from .views import signup,get_user_details
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('signup/', signup),
    path('login/', TokenObtainPairView.as_view()),
    path('me/', get_user_details), 
]
