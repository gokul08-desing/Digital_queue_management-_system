# Digital Queue Management System — Flask Backend

Hackathon MVP backend for the user-only Digital Queue Management System.

## Stack
- Python 3.11+
- Flask
- Flask-SQLAlchemy
- PostgreSQL
- Flask-JWT-Extended
- Flask-CORS
- python-dotenv
- Werkzeug password hashing

## 1. Create environment
```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and set your PostgreSQL `DATABASE_URL`.

Example:
`postgresql+psycopg://postgres:YOUR_PASSWORD@localhost:5432/digital_queue`

## 2. Create PostgreSQL database
Create an empty database named `digital_queue`.

## 3. Seed demo data
```powershell
python seed.py
```

Demo accounts:
- 9876543210 / Demo@123
- 9876543211 / Demo@123

## 4. Run
```powershell
python run.py
```

API:
`http://localhost:5000`

Health:
`GET /api/health`

## Main endpoints

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`

### Locations
- GET `/api/locations?q=ABC`
- GET `/api/locations?pincode=600040`
- GET `/api/locations/<location_id>`
- GET `/api/locations/<location_id>/services`

### Queue
- GET `/api/services/<service_id>/counters`
- GET `/api/services/<service_id>/recommendation`
- POST `/api/services/<service_id>/join`
- GET `/api/queues/<queue_id>/status`

### Token
- POST `/api/tokens/<token_id>/confirm`

### Slot exchange
- POST `/api/tokens/<token_id>/release`
- GET `/api/swaps/available`
- POST `/api/swaps/<swap_id>/request`
- POST `/api/swaps/<swap_id>/accept`

### Notifications
- GET `/api/notifications`

## Example login
```powershell
$body = '{"phone":"9876543210","password":"Demo@123"}'
curl.exe -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d $body
```

Use the returned JWT as:
`Authorization: Bearer YOUR_TOKEN`

## Architecture
React + Vite + Tailwind
        ↓
Flask REST API
        ↓
SQLAlchemy
        ↓
PostgreSQL

The queue engine is authoritative. Recommendation/ETA logic cannot directly change token order.
