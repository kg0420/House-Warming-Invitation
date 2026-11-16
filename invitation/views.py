from django.contrib import messages
from django.shortcuts import redirect, render
from .forms import RSVPForm

def home(request):
    return render(request, "invitation/home.html")

def rsvp(request):
    if request.method != "POST":
        return redirect("home")
    form = RSVPForm(request.POST)
    if form.is_valid():
        form.save()
        messages.success(request, "Thank you! Your response has been received. We look forward to celebrating with you.")
    else:
        messages.error(request, "Please check the details and submit the form again.")
    return redirect("/#rsvp")
