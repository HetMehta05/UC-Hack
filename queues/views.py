from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from .models import Doctor, Token


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def join_queue(request):
    doctor_id = request.data.get('doctor_id')

    try:
        doctor = Doctor.objects.get(id=doctor_id)
    except Doctor.DoesNotExist:
        return Response({"error": "Doctor not found"}, status=404)

    
    last_token = Token.objects.filter(doctor=doctor).order_by('-token_number').first()

    if last_token:
        new_token_number = last_token.token_number + 1
    else:
        new_token_number = 1

    token = Token.objects.create(
        doctor=doctor,
        patient=request.user,
        token_number=new_token_number
    )

    return Response({
        "message": "Joined queue",
        "token_number": new_token_number
    })

@api_view(['POST'])
@permission_classes([IsAdminUser])
def call_next(request):
    doctor_id = request.data.get('doctor_id')

    try:
        doctor = Doctor.objects.get(id=doctor_id)
    except Doctor.DoesNotExist:
        return Response({"error": "Doctor not found"}, status=404)

    next_token = Token.objects.filter(
        doctor=doctor,
        status='WAITING'
    ).order_by('token_number').first()

    if not next_token:
        return Response({"message": "No patients waiting"})

    next_token.status = 'SERVING'
    next_token.save()

    return Response({
        "message": "Next patient called",
        "token_number": next_token.token_number
    })
