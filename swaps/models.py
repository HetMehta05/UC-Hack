from django.db import models
from django.utils import timezone
from datetime import timedelta
from queues.models import Token


class SwapRequest(models.Model):

    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
        ('EXPIRED', 'Expired'),
    ]

    from_token = models.ForeignKey(
        Token,
        on_delete=models.CASCADE,
        related_name='swap_sent'
    )

    to_token = models.ForeignKey(
        Token,
        on_delete=models.CASCADE,
        related_name='swap_received'
    )

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='PENDING'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    expires_at = models.DateTimeField(
        default=timezone.now() + timedelta(minutes=2)
    )

    def __str__(self):
        return f"{self.from_token.token_number} → {self.to_token.token_number} ({self.status})"
