from django import forms
from .models import RSVP

class RSVPForm(forms.ModelForm):
    class Meta:
        model = RSVP
        fields = ["name", "phone", "guests", "attendance", "message"]
        widgets = {
            "name": forms.TextInput(attrs={"placeholder": "Your full name", "autocomplete": "name"}),
            "phone": forms.TextInput(attrs={"placeholder": "Phone number (optional)", "autocomplete": "tel"}),
            "guests": forms.NumberInput(attrs={"min": "1", "max": "30"}),
            "attendance": forms.Select(),
            "message": forms.TextInput(attrs={"placeholder": "A blessing or message for the family (optional)"}),
        }
