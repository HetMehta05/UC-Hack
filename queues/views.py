from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.utils import timezone
from .models import Doctor, Token


# 🔹 List Doctors (with optional department filter)
@api_view(['GET'])
def list_doctors(request):
    department = request.query_params.get('department')

    if department:
        doctors = Doctor.objects.filter(department__iexact=department)
    else:
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

    # Prevent duplicate join
    existing_token = Token.objects.filter(
        doctor=doctor,
        patient=request.user,
        status='WAITING',
        date=today
    ).first()

    if existing_token:
        return Response({
            "message": "Already in queue",
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
        "token_number": new_token_number
    })


# 🔹 Queue Status (Dynamic Intelligent Estimation)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def queue_status(request):
    doctor_id = request.query_params.get('doctor_id')

    if not doctor_id:
        return Response({"error": "doctor_id required"}, status=400)

    today = timezone.now().date()

    try:
        doctor = Doctor.objects.get(id=doctor_id)
    except Doctor.DoesNotExist:
        return Response({"error": "Doctor not found"}, status=404)

    # Get current serving token
    current_token = Token.objects.filter(
        doctor=doctor,
        status='SERVING',
        date=today
    ).first()

    current_number = current_token.token_number if current_token else 0

    # Get patient token
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

    # 🔥 Calculate dynamic average consultation time
    completed_tokens = Token.objects.filter(
        doctor=doctor,
        date=today,
        status='COMPLETED',
        actual_duration__isnull=False
    )

    if completed_tokens.exists():
        avg_time = sum(t.actual_duration for t in completed_tokens) / completed_tokens.count()
    else:
        avg_time = doctor.consultation_time

    # 🔥 Calculate remaining time of current patient
    remaining_time = 0

    if current_token and current_token.start_time:
        time_spent = (timezone.now() - current_token.start_time).total_seconds() / 60
        remaining_time = max(avg_time - time_spent, 0)

    # 🔥 Final estimation
    if people_ahead > 0:
        estimated_wait = remaining_time + (people_ahead - 1) * avg_time
    else:
        estimated_wait = remaining_time

    return Response({
        "currently_serving": current_number,
        "your_token": patient_token.token_number,
        "people_ahead": people_ahead,
        "estimated_wait_minutes": round(estimated_wait, 1),
        "average_consultation_time": round(avg_time, 1)
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

    # Complete current serving patient
    current_token = Token.objects.filter(
        doctor=doctor,
        status='SERVING',
        date=today
    ).first()

    if current_token:
        current_token.status = 'COMPLETED'
        current_token.end_time = timezone.now()

        if current_token.start_time:
            duration = (
                current_token.end_time - current_token.start_time
            ).total_seconds() / 60

            current_token.actual_duration = duration

        current_token.save()

    # Move next waiting patient to serving
    next_token = Token.objects.filter(
        doctor=doctor,
        status='WAITING',
        date=today
    ).order_by('token_number').first()

    if not next_token:
        return Response({"message": "No patients waiting"})

    next_token.status = 'SERVING'
    next_token.start_time = timezone.now()
    next_token.save()

    return Response({
        "message": "Next patient called",
        "token_number": next_token.token_number
    })


# 🔹 Cancel token
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_token(request):
    doctor_id = request.data.get('doctor_id')

    if not doctor_id:
        return Response({"error": "doctor_id required"}, status=400)

    today = timezone.now().date()

    try:
        token = Token.objects.get(
            doctor_id=doctor_id,
            patient=request.user,
            status='WAITING',
            date=today
        )
    except Token.DoesNotExist:
        return Response({"error": "No active token found"}, status=404)

    token.status = 'COMPLETED'
    token.save()

    return Response({"message": "Token cancelled successfully"})


# 🔹 Skip current patient
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



