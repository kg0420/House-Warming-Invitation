from django.conf import settings

def invitation_details(request):
    return {"invite": settings.INVITATION}
