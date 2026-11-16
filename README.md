# The Gupta Family — Satyanarayan Mahapooja Invitation

A mobile-first Django invitation website redesigned around the user-provided 30-second Instagram reel reference.

## Visual sequence
1. Ornate, carved double wooden doors with a marigold toran.
2. Tap-to-open 3D-style doors.
3. Animated auspicious footprints leading into the home.
4. Brief glowing blessing/handprint transition and floating petals.
5. A warm inner mandir reveal and Satyanarayan Mahapooja title.
6. Cream invitation letter, event details, countdown, schedule, RSVP and sharing.

The visuals are built with HTML/CSS/JavaScript (no external image assets required). This is an original implementation inspired by the supplied reference's sequence and mood; it is not a frame-for-frame copy. A supplied family photograph or custom deity artwork can be added later if desired.

## Event details already configured
- Family: The Gupta Family
- Date: Sunday, 20 December 2026
- Pooja: 09:00 AM–05:00 PM
- Venue: Bypaas Ayodhya Building, 14th Floor, Bhiwandi
- WhatsApp: +91 7219570360
- Language: English

Edit `pooja_invite/settings.py` in the `INVITATION` dictionary to change any details.

## Setup

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python manage.py makemigrations invitation
python manage.py migrate
python manage.py runserver
```

Open http://127.0.0.1:8000

Create an admin account to view RSVP submissions:

```bash
python manage.py createsuperuser
```

Then open http://127.0.0.1:8000/admin/

## Deploy to Render
Build command:
```bash
pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
```
Start command:
```bash
gunicorn pooja_invite.wsgi:application
```
Set `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=False`, and `ALLOWED_HOSTS` as environment variables. Use PostgreSQL or a persistent disk for RSVP data in production; the default SQLite database is suitable for local development only.

## Notes
- The Google Maps link is a location search for the supplied building and locality; verify the exact pin before distributing the invitation.
- The opening sequence begins after the visitor taps “Touch to open the door”, avoiding unexpected sound or motion on page load.
- No music file is bundled. Add only audio you have permission to use if you want background music.
