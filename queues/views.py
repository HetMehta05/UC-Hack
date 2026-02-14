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


# 🔹 Patient joins queue (NO multiple active tokens allowed)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def join_queue(request):
    doctor_id = request.data.get('doctor_id')

    if not doctor_id:
        return Response({"error": "doctor_id is required"}, status=400)

    try:
        doctor = Doctor.objects.get(id=doctor_id)
    except Doctor.DoesNotExist:
        return Response({"error": "Doctor not found"}, status=404)

    today = timezone.now().date()

    # 🚫 Block if user already has active token
    active_token = Token.objects.filter(
        doctor=doctor,
        patient=request.user,
        status__in=['WAITING', 'SERVING']
    ).first()

    if active_token:
        return Response({
            "error": "You already have an active appointment with this doctor",
            "token_number": active_token.token_number,
            "status": active_token.status
        }, status=400)

    # 🔢 Generate next token number
    last_token = Token.objects.filter(
        doctor=doctor,
        date=today
    ).order_by('-token_number').first()

    new_token_number = last_token.token_number + 1 if last_token else 1

    Token.objects.create(
        doctor=doctor,
        patient=request.user,
        token_number=new_token_number,
        date=today,
        status='WAITING'
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

    # Current serving
    current_token = Token.objects.filter(
        doctor=doctor,
        status='SERVING',
        date=today
    ).first()

    current_number = current_token.token_number if current_token else 0

    # Patient token
    patient_token = Token.objects.filter(
        doctor=doctor,
        patient=request.user,
        status__in=['WAITING', 'SERVING'],
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

    # 🔥 Calculate dynamic average time
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

    # 🔥 Remaining time of current serving
    remaining_time = 0

    if current_token and current_token.start_time:
        time_spent = (timezone.now() - current_token.start_time).total_seconds() / 60
        remaining_time = max(avg_time - time_spent, 0)

    # 🔥 Final estimated wait
    if people_ahead > 0:
        estimated_wait = remaining_time + (people_ahead - 1) * avg_time
    else:
        estimated_wait = remaining_time

    total_in_queue = Token.objects.filter(
        doctor=doctor,
        status='WAITING',
        date=today
    ).count()

    return Response({
        "currently_serving": current_number,
        "your_token": patient_token.token_number,
        "people_ahead": people_ahead,
        "estimated_wait_minutes": round(estimated_wait, 1),
        "average_consultation_time": round(avg_time, 1),
        "total_in_queue": total_in_queue
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

    # Complete current serving
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

    # Move next
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
            status__in=['WAITING', 'SERVING'],
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
    current_token.end_time = timezone.now()

    if current_token.start_time:
        duration = (
            current_token.end_time - current_token.start_time
        ).total_seconds() / 60
        current_token.actual_duration = duration

    current_token.save()

    return Response({"message": "Patient skipped"})

# 🔹 Admin views full queue (monitor dashboard)
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
        date=today
    ).order_by('token_number')

    queue_data = []

    for token in tokens:
        queue_data.append({
            "id": token.id,
            "token_number": token.token_number,
            "patient_username": token.patient.username,
            "patient_id": token.patient.id,
            "status": token.status,
            "start_time": token.start_time,
            "end_time": token.end_time,
            "actual_duration": token.actual_duration
        })

    return Response({
        "doctor": doctor.name,
        "total_tokens": tokens.count(),
        "queue": queue_data
    })

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_token(request, token_id):
    try:
        token = Token.objects.get(id=token_id)
    except Token.DoesNotExist:
        return Response({"error": "Token not found"}, status=404)

    token.delete()

    return Response({"message": "Token deleted successfully"})

@api_view(['POST'])
@permission_classes([IsAdminUser])
def force_complete(request):
    token_id = request.data.get('token_id')

    try:
        token = Token.objects.get(id=token_id)
    except Token.DoesNotExist:
        return Response({"error": "Token not found"}, status=404)

    token.status = 'COMPLETED'
    token.end_time = timezone.now()
    token.save()

    return Response({"message": "Token marked as completed"})
