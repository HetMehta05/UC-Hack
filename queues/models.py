from django.db import models
from django.db import models
from django.contrib.auth.models import User


class Doctor(models.Model):
    name = models.CharField(max_length=100)
    department = models.CharField(max_length=100)

    def __str__(self):
        return f"Dr. {self.name} - {self.department}"

class Token(models.Model):
    STATUS_CHOICES = (
        ('WAITING', 'Waiting'),
        ('SERVING', 'Serving'),
        ('COMPLETED', 'Completed'),
    )

    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="tokens")
    patient = models.ForeignKey(User, on_delete=models.CASCADE)
    token_number = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='WAITING')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.doctor.name} - Token {self.token_number}"

