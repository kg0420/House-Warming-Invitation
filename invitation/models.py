from django.db import models

class RSVP(models.Model):
    ATTENDANCE = [("yes", "Joyfully attending"), ("no", "Unable to attend"), ("maybe", "Will confirm")]
    name = models.CharField(max_length=120)
    phone = models.CharField(max_length=20, blank=True)
    guests = models.PositiveSmallIntegerField(default=1)
    attendance = models.CharField(max_length=10, choices=ATTENDANCE, default="yes")
    message = models.CharField(max_length=300, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} — {self.get_attendance_display()}"
