import re

PHONE_RE = re.compile(r"^[0-9]{10,15}$")

def require_fields(data, fields):
    missing = [f for f in fields if data.get(f) in (None, "")]
    if missing:
        return False, f"Missing required fields: {', '.join(missing)}"
    return True, None

def valid_phone(phone):
    return bool(PHONE_RE.fullmatch(str(phone or "")))
