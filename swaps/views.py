from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from datetime import timedelta

from queues.models import Token
from .models import SwapRequest


# 🔥 Expire old swaps automatically
def expire_old_swaps():
    SwapRequest.objects.filter(
        status='PENDING',
        expires_at__lt=timezone.now()
    ).update(status='EXPIRED')


# 🔹 Request Swap
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_swap(request):

    expire_old_swaps()

    doctor_id = request.data.get('doctor_id')
    target_token_number = request.data.get('target_token')

    if not doctor_id or not target_token_number:
        return Response({"error": "doctor_id and target_token required"}, status=400)

    try:
        my_token = Token.objects.get(
            doctor_id=doctor_id,
            patient=request.user,
            status='WAITING'
        )
    except Token.DoesNotExist:
        return Response({"error": "You are not in queue"}, status=404)

    # 🚫 Block if already has pending swap
    if SwapRequest.objects.filter(
        from_token__patient=request.user,
        status='PENDING'
    ).exists():
        return Response(
            {"error": "You already have a pending swap request"},
            status=400
        )

    try:
        target_token = Token.objects.get(
            doctor_id=doctor_id,
            token_number=target_token_number,
            status='WAITING'
        )
    except Token.DoesNotExist:
        return Response({"error": "Invalid target token"}, status=404)

    if my_token.token_number == target_token.token_number:
        return Response({"error": "Cannot swap with yourself"}, status=400)

    # 🚫 Prevent duplicate swap request
    if SwapRequest.objects.filter(
        from_token=my_token,
        to_token=target_token,
        status='PENDING'
    ).exists():
        return Response({"error": "Swap already requested"}, status=400)

    swap = SwapRequest.objects.create(
        from_token=my_token,
        to_token=target_token,
        expires_at=timezone.now() + timedelta(minutes=2)
    )

    return Response({
        "message": "Swap request sent",
        "swap_id": swap.id,
        "expires_at": swap.expires_at
    })


# 🔹 Accept Swap
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_swap(request):

    expire_old_swaps()

    swap_id = request.data.get('swap_id')

    try:
        swap = SwapRequest.objects.get(id=swap_id)
    except SwapRequest.DoesNotExist:
        return Response({"error": "Invalid swap request"}, status=404)

    if swap.status != 'PENDING':
        return Response({"error": "Swap already processed"}, status=400)

    if swap.expires_at < timezone.now():
        swap.status = 'EXPIRED'
        swap.save()
        return Response({"error": "Swap expired"}, status=400)

    if swap.to_token.patient != request.user:
        return Response({"error": "Not authorized"}, status=403)

    # 🚫 Safety checks
    if swap.from_token.status != 'WAITING' or swap.to_token.status != 'WAITING':
        return Response(
            {"error": "One of the tokens is no longer eligible"},
            status=400
        )

    if swap.from_token.doctor != swap.to_token.doctor:
        return Response({"error": "Doctor mismatch"}, status=400)

    # 🔁 Perform swap
    temp = swap.from_token.token_number
    swap.from_token.token_number = swap.to_token.token_number
    swap.to_token.token_number = temp

    swap.from_token.save()
    swap.to_token.save()

    swap.status = 'ACCEPTED'
    swap.save()

    return Response({"message": "Swap successful"})


# 🔹 Reject Swap
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_swap(request):

    expire_old_swaps()

    swap_id = request.data.get('swap_id')

    try:
        swap = SwapRequest.objects.get(id=swap_id, status='PENDING')
    except SwapRequest.DoesNotExist:
        return Response({"error": "Invalid swap request"}, status=404)

    if swap.to_token.patient != request.user:
        return Response({"error": "Not authorized"}, status=403)

    swap.status = 'REJECTED'
    swap.save()

    return Response({"message": "Swap rejected"})


# 🔹 View My Swaps
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_swaps(request):

    expire_old_swaps()

    swaps = SwapRequest.objects.filter(
        Q(from_token__patient=request.user) |
        Q(to_token__patient=request.user)
    ).order_by('-created_at')

    data = []

    for swap in swaps:
        data.append({
            "swap_id": swap.id,
            "from_token": swap.from_token.token_number,
            "to_token": swap.to_token.token_number,
            "status": swap.status,
            "expires_at": swap.expires_at,
            "created_at": swap.created_at
        })

    return Response(data)


# 🔹 Nearby Tokens (For UI)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def nearby_tokens(request):

    doctor_id = request.query_params.get('doctor_id')

    if not doctor_id:
        return Response({"error": "doctor_id required"}, status=400)

    try:
        my_token = Token.objects.get(
            doctor_id=doctor_id,
            patient=request.user,
            status='WAITING'
        )
    except Token.DoesNotExist:
        return Response({"error": "You are not in queue"}, status=404)

    tokens = Token.objects.filter(
        doctor_id=doctor_id,
        status='WAITING'
    ).exclude(patient=request.user)

    data = [
        {
            "token_number": t.token_number,
            "username": t.patient.username
        }
        for t in tokens
    ]

    return Response(data)
