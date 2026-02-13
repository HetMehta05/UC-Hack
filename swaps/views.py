from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from queues.models import Token
from .models import SwapRequest

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_swap(request):
    doctor_id = request.data.get('doctor_id')
    target_token_number = request.data.get('target_token')

    try:
        my_token = Token.objects.get(
            doctor_id=doctor_id,
            patient=request.user,
            status='WAITING'
        )

        target_token = Token.objects.get(
            doctor_id=doctor_id,
            token_number=target_token_number,
            status='WAITING'
        )

    except Token.DoesNotExist:
        return Response({"error": "Invalid token"}, status=404)

    swap = SwapRequest.objects.create(
        from_token=my_token,
        to_token=target_token
    )

    return Response({"message": "Swap request sent", "swap_id": swap.id})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_swap(request):
    swap_id = request.data.get('swap_id')

    try:
        swap = SwapRequest.objects.get(id=swap_id, status='PENDING')
    except SwapRequest.DoesNotExist:
        return Response({"error": "Invalid swap request"}, status=404)

    if swap.to_token.patient != request.user:
        return Response({"error": "Not authorized"}, status=403)

    # Swap token numbers
    temp = swap.from_token.token_number
    swap.from_token.token_number = swap.to_token.token_number
    swap.to_token.token_number = temp

    swap.from_token.save()
    swap.to_token.save()

    swap.status = 'ACCEPTED'
    swap.save()

    return Response({"message": "Swap successful"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_swap(request):
    swap_id = request.data.get('swap_id')

    try:
        swap = SwapRequest.objects.get(id=swap_id, status='PENDING')
    except SwapRequest.DoesNotExist:
        return Response({"error": "Invalid swap request"}, status=404)

    # Only receiver can reject
    if swap.to_token.patient != request.user:
        return Response({"error": "Not authorized"}, status=403)

    swap.status = 'REJECTED'
    swap.save()

    return Response({"message": "Swap rejected"})
