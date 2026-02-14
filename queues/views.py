from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from .models import Doctor, Token
from django.utils import timezone


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def join_queue(request):
    doctor_id = request.data.get('doctor_id')

    if not doctor_id:
        return Response({"error": "doctor_id is required"}, status=400)

    today = timezone.now().date()

    try:
        doctor = Doctor.objects.get(id=doctor_id)
    except Doctor.DoesNotExist:
        return Response({"error": "Doctor not found"}, status=404)

    
    existing_token = Token.objects.filter(
        doctor=doctor,
        patient=request.user,
        status='WAITING',
        date=today
    ).first()

    if existing_token:
        return Response({
            "message": "You are already in queue",
            "token_number": existing_token.token_number
        })

    
    last_token = Token.objects.filter(
        doctor=doctor,
        date=today
    ).order_by('-token_number').first()

    if last_token:
        new_token_number = last_token.token_number + 1
    else:
        new_token_number = 1

    token = Token.objects.create(
        doctor=doctor,
        patient=request.user,
        token_number=new_token_number,
        date=today
    )

    return Response({
        "message": "Joined queue successfully",
        "doctor": doctor.name,
        "token_number": new_token_number,
        "date": today
    })




@api_view(['POST'])
@permission_classes([IsAdminUser])
def call_next(request):
    doctor_id = request.data.get('doctor_id')

    try:
        doctor = Doctor.objects.get(id=doctor_id)
    except Doctor.DoesNotExist:
        return Response({"error": "Doctor not found"}, status=404)

    
    current_token = Token.objects.filter(
        doctor=doctor,
        status='SERVING'
    ).first()

    if current_token:
        current_token.status = 'COMPLETED'
        current_token.save()

    
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def queue_status(request):
    doctor_id = request.query_params.get('doctor_id')

    try:
        doctor = Doctor.objects.get(id=doctor_id)
    except Doctor.DoesNotExist:
        return Response({"error": "Doctor not found"}, status=404)

    
    current_token = Token.objects.filter(
        doctor=doctor,
        status='SERVING'
    ).order_by('-token_number').first()

    current_number = current_token.token_number if current_token else 0

    
    patient_token = Token.objects.filter(
        doctor=doctor,
        patient=request.user,
        status='WAITING'
    ).first()

    if not patient_token:
        return Response({"message": "You are not in queue"})

    people_ahead = Token.objects.filter(
        doctor=doctor,
        status='WAITING',
        token_number__lt=patient_token.token_number
    ).count()

    average_time_per_patient = 10  

    estimated_wait = people_ahead * average_time_per_patient

    return Response({
        "currently_serving": current_number,
        "your_token": patient_token.token_number,
        "people_ahead": people_ahead,
        "estimated_wait_minutes": estimated_wait
    })


@api_view(['GET'])
@permission_classes([IsAdminUser])
def full_queue(request):
    doctor_id = request.query_params.get('doctor_id')

    try:
        doctor = Doctor.objects.get(id=doctor_id)
    except Doctor.DoesNotExist:
        return Response({"error": "Doctor not found"}, status=404)

    tokens = Token.objects.filter(
        doctor=doctor,
        status='WAITING'
    ).order_by('token_number')

    data = [
        {
            "token_number": token.token_number,
            "patient": token.patient.username
        }
        for token in tokens
    ]

    return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_token(request):
    doctor_id = request.data.get('doctor_id')

    try:
        token = Token.objects.get(
            doctor_id=doctor_id,
            patient=request.user,
            status='WAITING'
        )
    except Token.DoesNotExist:
        return Response({"error": "No active token found"}, status=404)

    token.status = 'COMPLETED'
    token.save()

    return Response({"message": "Token cancelled successfully"})

@api_view(['POST'])
@permission_classes([IsAdminUser])
def skip_token(request):
    doctor_id = request.data.get('doctor_id')

    try:
        doctor = Doctor.objects.get(id=doctor_id)
    except Doctor.DoesNotExist:
        return Response({"error": "Doctor not found"}, status=404)

    current_token = Token.objects.filter(
        doctor=doctor,
        status='SERVING'
    ).first()

    if not current_token:
        return Response({"error": "No patient currently serving"}, status=404)

    current_token.status = 'SKIPPED'
    current_token.save()

    return Response({"message": "Patient skipped"})
