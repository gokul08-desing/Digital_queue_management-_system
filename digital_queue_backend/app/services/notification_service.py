import uuid
from ..extensions import db
from ..models.notification import Notification

def notify(user_id, message, notification_type="QUEUE"):
    item = Notification(
        id="notif_" + uuid.uuid4().hex[:20],
        user_id=user_id,
        message=message,
        type=notification_type
    )
    db.session.add(item)
    return item
