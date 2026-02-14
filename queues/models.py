from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100)
    department = models.CharField(max_length=100)

    def __str__(self):
        return f"Dr. {self.name} - {self.department}"


class Token(models.Model):
    STATUS_CHOICES = (
        ('WAITING', 'Waiting'),
        ('SERVING', 'Serving'),
        ('COMPLETED', 'Completed'),
        ('SKIPPED', 'Skipped'),
    )

    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="tokens")
    patient = models.ForeignKey(User, on_delete=models.CASCADE)
    token_number = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='WAITING')
    date = models.DateField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.doctor.name} - Token {self.token_number}"



