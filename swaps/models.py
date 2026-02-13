from django.db import models
from queues.models import Token


class SwapRequest(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
    )

    from_token = models.ForeignKey(Token, on_delete=models.CASCADE, related_name="swap_from")
    to_token = models.ForeignKey(Token, on_delete=models.CASCADE, related_name="swap_to")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Swap {self.from_token.token_number} ↔ {self.to_token.token_number}"

