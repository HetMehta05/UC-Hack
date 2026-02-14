from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.utils import timezone
from .models import Doctor, Token


# 🔹 List all doctors
@api_view(['GET'])
def list_doctors(request):
    doctors = Doctor.objects.all()

    data = [
        {
            "id": doctor.id,
            "name": doctor.name,
            "department": doctor.department
        }
        for doctor in doctors
    ]

    return Response(data)


# 🔹 Patient joins queue
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

    new_token_number = last_token.token_number + 1 if last_token else 1

    Token.objects.create(
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


# 🔹 Doctor calls next patient
@api_view(['POST'])
@permission_classes([IsAdminUser])
def call_next(request):
    try:
        doctor = Doctor.objects.get(user=request.user)
    except Doctor.DoesNotExist:
        return Response({"error": "Doctor profile not found"}, status=404)

    today = timezone.now().date()

    current_token = Token.objects.filter(
        doctor=doctor,
        status='SERVING',
        date=today
    ).first()

    if current_token:
        current_token.status = 'COMPLETED'
        current_token.save()

    next_token = Token.objects.filter(
        doctor=doctor,
        status='WAITING',
        date=today
    ).order_by('token_number').first()

    if not next_token:
        return Response({"message": "No patients waiting"})

    next_token.status = 'SERVING'
    next_token.save()

    return Response({
        "message": "Next patient called",
        "token_number": next_token.token_number
    })


# 🔹 Patient checks queue status
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def queue_status(request):
    doctor_id = request.query_params.get('doctor_id')

    if not doctor_id:
        return Response({"error": "doctor_id required"}, status=400)

    try:
        doctor = Doctor.objects.get(id=doctor_id)
    except Doctor.DoesNotExist:
        return Response({"error": "Doctor not found"}, status=404)

    today = timezone.now().date()

    current_token = Token.objects.filter(
        doctor=doctor,
        status='SERVING',
        date=today
    ).first()

    current_number = current_token.token_number if current_token else 0

    patient_token = Token.objects.filter(
        doctor=doctor,
        patient=request.user,
        status='WAITING',
        date=today
    ).first()

    if not patient_token:
        return Response({"message": "You are not in queue"})

    people_ahead = Token.objects.filter(
        doctor=doctor,
        status='WAITING',
        date=today,
        token_number__lt=patient_token.token_number
    ).count()

    estimated_wait = people_ahead * 10

    return Response({
        "currently_serving": current_number,
        "your_token": patient_token.token_number,
        "people_ahead": people_ahead,
        "estimated_wait_minutes": estimated_wait
    })


# 🔹 Admin sees full queue
@api_view(['GET'])
@permission_classes([IsAdminUser])
def full_queue(request):
    try:
        doctor = Doctor.objects.get(user=request.user)
    except Doctor.DoesNotExist:
        return Response({"error": "Doctor profile not found"}, status=404)

    today = timezone.now().date()

    tokens = Token.objects.filter(
        doctor=doctor,
        status='WAITING',
        date=today
    ).order_by('token_number')

    data = [
        {
            "token_number": token.token_number,
            "patient": token.patient.username,
            "status": token.status
        }
        for token in tokens
    ]

    return Response(data)


# 🔹 Doctor skips current patient
@api_view(['POST'])
@permission_classes([IsAdminUser])
def skip_token(request):
    try:
        doctor = Doctor.objects.get(user=request.user)
    except Doctor.DoesNotExist:
        return Response({"error": "Doctor profile not found"}, status=404)

    today = timezone.now().date()

    current_token = Token.objects.filter(
        doctor=doctor,
        status='SERVING',
        date=today
    ).first()

    if not current_token:
        return Response({"error": "No patient currently serving"}, status=404)

    current_token.status = 'SKIPPED'
    current_token.save()

    return Response({"message": "Patient skipped"})

