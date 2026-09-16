"""
Database Seeder for Digital Queue Management System.
Generates comprehensive demo data across 10 hospitals in Tamil Nadu,
with 22 services, 35 counters, 12 queues, 20 users, and realistic tokens.
"""

from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env")

from datetime import datetime, timezone, timedelta
from werkzeug.security import generate_password_hash

from app import create_app
from app.extensions import db
from app.models.location import Location
from app.models.service import Service
from app.models.counter import Counter
from app.models.queue import Queue
from app.models.token import Token
from app.models.user import User
from app.models.swap import Swap
from app.models.notification import Notification
from app.models.service_log import ServiceLog


def seed():
    app = create_app()
    with app.app_context():
        # Clean existing tables
        db.drop_all()
        db.create_all()

        pw = generate_password_hash("Demo@123")

        # ── 1. Locations (10 Tamil Nadu Facilities) ──────────────────────────
        locations_data = [
            ("hospital_001", "ABC Multispeciality Hospital", "HOSPITAL", "124 Anna Salai, Anna Nagar, Chennai", "600040"),
            ("hospital_002", "CityCare Diagnostic Center",   "CLINIC",   "45 GST Road, Guindy, Chennai",           "600032"),
            ("hospital_003", "GreenLife Health Center",      "HOSPITAL", "88 Poonamallee High Rd, Kilpauk, Chennai","600010"),
            ("hospital_004", "Apollo First Med Hospital",    "HOSPITAL", "154 P.H. Road, Kilpauk, Chennai",         "600010"),
            ("hospital_005", "Fortis Malar Hospital",        "HOSPITAL", "52 1st Main Rd, Gandhi Nagar, Adyar",     "600020"),
            ("hospital_006", "MIOT International",           "HOSPITAL", "4/112 Mount Poonamallee Rd, Manapakkam",  "600089"),
            ("hospital_007", "Kauvery Hospital",             "HOSPITAL", "199 Luz Church Road, Mylapore, Chennai",  "600004"),
            ("hospital_008", "Billroth Hospitals",           "HOSPITAL", "43 Lakshmi Talkies Rd, Shenoy Nagar",     "600030"),
            ("hospital_009", "SIMS Hospital",                "HOSPITAL", "1 Jawaharlal Nehru Salai, Vadapalani",    "600026"),
            ("hospital_010", "Medway Hospitals",             "HOSPITAL", "23 Dr Ambedkar Rd, Kodambakkam, Chennai", "600024"),
        ]
        for lid, name, ltype, addr, pin in locations_data:
            db.session.add(Location(id=lid, name=name, type=ltype, address=addr, pincode=pin))

        # ── 2. Services (22 Services across Locations) ──────────────────────
        services_data = [
            # ABC Multispeciality (3 services)
            ("svc_opd_001",   "hospital_001", "General OPD",         "Outpatient consultation and routine checkups", True),
            ("svc_pedia_001", "hospital_001", "Pediatrics OPD",      "Child healthcare, vaccination, growth monitoring", True),
            ("svc_ortho_001", "hospital_001", "Orthopedics OPD",     "Bone, joint, and musculoskeletal consultations", True),
            # CityCare Diagnostic (2 services)
            ("svc_diag_002",  "hospital_002", "Pathology Lab",       "Blood collection and sample drop-off", True),
            ("svc_xray_002",  "hospital_002", "Radiology / X-Ray",   "Digital X-ray and ultrasound scanning", True),
            # GreenLife Health (2 services)
            ("svc_opd_003",   "hospital_003", "General Medicine",    "Primary care and internal medicine", True),
            ("svc_pharma_003","hospital_003", "Pharmacy Counter",    "Prescription fulfillment and billing", True),
            # Apollo First Med (2 services)
            ("svc_cardio_004","hospital_004", "Cardiology OPD",      "Heart health evaluations and ECG", True),
            ("svc_neuro_004", "hospital_004", "Neurology OPD",       "Brain and nervous system consultations", True),
            # Fortis Malar (2 services)
            ("svc_ent_005",   "hospital_005", "ENT Consultation",    "Ear, nose, and throat diagnostics", True),
            ("svc_derma_005", "hospital_005", "Dermatology",         "Skin and allergy care", True),
            # MIOT (3 services)
            ("svc_ortho_006", "hospital_006", "Joint & Spine Center", "Specialized orthopedic joint consultations", True),
            ("svc_gastro_006","hospital_006", "Gastroenterology",    "Digestive health and endoscopy", True),
            ("svc_rehab_006", "hospital_006", "Physiotherapy",       "Post-operative physical rehabilitation", True),
            # Kauvery (2 services)
            ("svc_geria_007", "hospital_007", "Geriatric Care",      "Elderly health management", True),
            ("svc_pulmo_007", "hospital_007", "Pulmonology OPD",     "Respiratory and asthma care", True),
            # Billroth (2 services)
            ("svc_onco_008",  "hospital_008", "Medical Oncology",    "Cancer consultation and follow-ups", True),
            ("svc_nephro_008","hospital_008", "Nephrology & Dialysis","Kidney health and dialysis registration", True),
            # SIMS (2 services)
            ("svc_plastic_009","hospital_009","Plastic Surgery",     "Cosmetic and reconstructive surgery", True),
            ("svc_vasc_009",  "hospital_009", "Vascular Surgery",    "Vein and artery treatments", True),
            # Medway (2 services)
            ("svc_diab_010",  "hospital_010", "Diabetology & Endo",  "Diabetes management and endocrine care", True),
            ("svc_gen_010",   "hospital_010", "General Consultation","General medical practitioner clinic", True),
        ]
        for sid, lid, name, desc, active in services_data:
            db.session.add(Service(id=sid, location_id=lid, name=name, description=desc, active=active))

        # ── 3. Queues (12 Active Queues) ────────────────────────────────────
        queues_data = [
            ("queue_opd_001",   "svc_opd_001",   "ABC General OPD Queue",          True, 43),
            ("queue_pedia_001", "svc_pedia_001", "ABC Pediatrics Queue",           True, 16),
            ("queue_ortho_001", "svc_ortho_001", "ABC Ortho Queue",                True, 12),
            ("queue_opd_002",   "svc_diag_002",  "CityCare Pathology Queue",       True, 24),
            ("queue_opd_003",   "svc_opd_003",   "GreenLife Medicine Queue",       True, 15),
            ("queue_opd_004",   "svc_cardio_004","Apollo Cardiology Queue",        True, 25),
            ("queue_opd_005",   "svc_ent_005",   "Fortis ENT Queue",               True, 10),
            ("queue_opd_006",   "svc_ortho_006", "MIOT Joint & Spine Queue",       True, 12),
            ("queue_opd_007",   "svc_geria_007", "Kauvery Geriatric Queue",        True, 19),
            ("queue_opd_008",   "svc_onco_008",  "Billroth Oncology Queue",        True, 26),
            ("queue_opd_009",   "svc_plastic_009","SIMS Plastic Surgery Queue",    True, 21),
            ("queue_opd_010",   "svc_diab_010",  "Medway Diabetology Queue",       True, 15),
        ]
        for qid, sid, name, active, next_num in queues_data:
            db.session.add(Queue(id=qid, service_id=sid, name=name, active=active, next_token_number=next_num))

        # ── 4. Counters (35 Counters across Services) ────────────────────────
        counters_data = [
            # ABC Multispeciality — OPD (queue_opd_001)
            ("counter_1", "svc_opd_001", "Counter 1 (Dr. Ramesh)",  25, 4.5, True),
            ("counter_2", "svc_opd_001", "Counter 2 (Dr. Priya)",   36, 3.5, True),
            ("counter_3", "svc_opd_001", "Counter 3 (Dr. Anand)",   31, 5.0, True),
            # ABC Pediatrics
            ("ctr_pedia_1", "svc_pedia_001", "Pediatrics Desk 1",    12, 5.0, True),
            ("ctr_pedia_2", "svc_pedia_001", "Pediatrics Desk 2",    14, 4.0, True),
            # ABC Ortho
            ("ctr_ortho_1", "svc_ortho_001", "Ortho Desk 1",         8,  6.0, True),
            # CityCare Pathology
            ("ctr_002_1", "svc_diag_002", "Sample Collection A",     18, 2.5, True),
            ("ctr_002_2", "svc_diag_002", "Sample Collection B",     19, 3.0, True),
            # CityCare X-Ray
            ("ctr_xray_1", "svc_xray_002", "X-Ray Room 1",           7,  8.0, True),
            # GreenLife Medicine
            ("ctr_003_1", "svc_opd_003", "Consultation Room 1",      11, 4.0, True),
            ("ctr_003_2", "svc_opd_003", "Consultation Room 2",      12, 4.5, True),
            # GreenLife Pharmacy
            ("ctr_pharma_1","svc_pharma_003","Billing Counter A",    25, 2.0, True),
            ("ctr_pharma_2","svc_pharma_003","Dispensing Counter B", 22, 2.5, True),
            # Apollo Cardiology
            ("ctr_004_1", "svc_cardio_004", "Cardio OPD 1",          20, 5.5, True),
            ("ctr_004_2", "svc_cardio_004", "Cardio OPD 2",          18, 5.0, True),
            # Apollo Neurology
            ("ctr_neuro_1","svc_neuro_004", "Neuro OPD Desk",        9,  7.0, True),
            # Fortis ENT
            ("ctr_005_1", "svc_ent_005", "ENT Clinic 1",             8,  4.0, True),
            ("ctr_005_2", "svc_ent_005", "ENT Clinic 2",             7,  4.5, True),
            # Fortis Dermatology
            ("ctr_derma_1","svc_derma_005", "Skin Clinic",           11, 5.0, True),
            # MIOT Joint & Spine
            ("ctr_006_1", "svc_ortho_006", "Spine Desk 1",           9,  6.0, True),
            ("ctr_006_2", "svc_ortho_006", "Joint Desk 2",           8,  5.5, True),
            # MIOT Gastro
            ("ctr_gastro_1","svc_gastro_006","Gastro Clinic",        6,  6.5, True),
            # Kauvery Geriatric
            ("ctr_007_1", "svc_geria_007", "Geriatric Desk 1",       15, 6.0, True),
            ("ctr_007_2", "svc_geria_007", "Geriatric Desk 2",       14, 5.5, True),
            # Kauvery Pulmonology
            ("ctr_pulmo_1","svc_pulmo_007", "Asthma & Chest Clinic", 10, 5.0, True),
            # Billroth Oncology
            ("ctr_008_1", "svc_onco_008", "Oncology Consultation 1", 22, 7.0, True),
            ("ctr_008_2", "svc_onco_008", "Oncology Consultation 2", 20, 6.5, True),
            # Billroth Nephrology
            ("ctr_nephro_1","svc_nephro_008","Dialysis Desk",        5,  10.0,True),
            # SIMS Plastic Surgery
            ("ctr_009_1", "svc_plastic_009","Plastic Clinic 1",      18, 5.0, True),
            ("ctr_009_2", "svc_plastic_009","Plastic Clinic 2",      16, 5.5, True),
            # SIMS Vascular
            ("ctr_vasc_1", "svc_vasc_009",  "Vein Clinic",           8,  6.0, True),
            # Medway Diabetology
            ("ctr_010_1", "svc_diab_010", "Endocrine Desk 1",        12, 4.0, True),
            ("ctr_010_2", "svc_diab_010", "Endocrine Desk 2",        11, 4.5, True),
            # Medway General
            ("ctr_gen_1",  "svc_gen_010",  "General Clinic A",       19, 3.5, True),
            ("ctr_gen_2",  "svc_gen_010",  "General Clinic B",       17, 3.5, True),
        ]
        for cid, sid, name, cur_token, avg_min, active in counters_data:
            db.session.add(Counter(
                id=cid, service_id=sid, name=name,
                current_token_number=cur_token,
                average_service_minutes=avg_min,
                active=active
            ))

        # ── 5. Users (20 Demo Users) ─────────────────────────────────────────
        users_data = [
            ("user_001", "Ananya Sharma",  "9876543210"),
            ("user_002", "Rahul Mehta",    "9876543211"),
            ("user_003", "Priya Balan",    "9876543212"),
            ("user_004", "Karthik Raja",   "9876543213"),
            ("user_005", "Meera Iyer",     "9876543214"),
            ("user_006", "Vikram Seth",    "9876543215"),
            ("user_007", "Divya Nair",     "9876543216"),
            ("user_008", "Siddharth Rao",  "9876543217"),
            ("user_009", "Sneha Kulkarni", "9876543218"),
            ("user_010", "Arun Prakash",   "9876543219"),
            ("user_011", "Roshni Patel",   "9876543220"),
            ("user_012", "Gautam Menon",   "9876543221"),
            ("user_013", "Anita Deshmukh", "9876543222"),
            ("user_014", "Rajesh Khanna",  "9876543223"),
            ("user_015", "Deepa Sundaram", "9876543224"),
            ("user_016", "Manoj Tiwari",   "9876543225"),
            ("user_017", "Kavita Reddy",   "9876543226"),
            ("user_018", "Sanjay Pillai",  "9876543227"),
            ("user_019", "Hema Varma",     "9876543228"),
            ("user_020", "Dinesh Nambiar", "9876543229"),
        ]
        for uid, name, phone in users_data:
            db.session.add(User(id=uid, name=name, phone=phone, password_hash=pw))

        db.session.flush()

        now = datetime.now(timezone.utc)

        # ── 6. Tokens for ABC OPD queue (Unique numbers per queue) ───────────
        # Counter 1 waiting: 26..30
        # Counter 3 waiting: 32..35
        # Counter 2 waiting: 37..41 (Rahul is 41), Ananya is 42
        abc_opd_tokens = [
            # counter_1 tokens
            ("tok_c1_26", 26, "counter_1", "WAITING",    None),
            ("tok_c1_27", 27, "counter_1", "WAITING",    "user_003"),
            ("tok_c1_28", 28, "counter_1", "WAITING",    "user_004"),
            ("tok_c1_29", 29, "counter_1", "WAITING",    "user_005"),
            ("tok_c1_30", 30, "counter_1", "APPROACHING","user_006"),
            # counter_3 tokens
            ("tok_c3_32", 32, "counter_3", "WAITING",    None),
            ("tok_c3_33", 33, "counter_3", "WAITING",    "user_011"),
            ("tok_c3_34", 34, "counter_3", "WAITING",    "user_012"),
            ("tok_c3_35", 35, "counter_3", "APPROACHING","user_013"),
            # counter_2 tokens (5 waiting ahead of Ananya)
            ("tok_c2_37", 37, "counter_2", "WAITING",    "user_007"),
            ("tok_c2_38", 38, "counter_2", "WAITING",    "user_008"),
            ("tok_c2_39", 39, "counter_2", "WAITING",    "user_009"),
            ("tok_c2_40", 40, "counter_2", "WAITING",    "user_010"),
            # Rahul's token #41 — released for swap
            ("tok_c2_41", 41, "counter_2", "EXCHANGE_AVAILABLE", "user_002"),
        ]
        for tid, number, cid, status, uid in abc_opd_tokens:
            db.session.add(Token(
                id=tid, queue_id="queue_opd_001",
                user_id=uid, counter_id=cid,
                token_number=number, status=status,
                issued_at=now - timedelta(minutes=max(1, 50 - number))
            ))

        # Ananya's primary demo token #42
        db.session.add(Token(
            id="token_demo_42", queue_id="queue_opd_001", user_id="user_001",
            counter_id="counter_2", token_number=42, status="WAITING",
            issued_at=now
        ))

        # Historical completed tokens for service log references (all distinct numbers)
        hist_tokens = [
            ("tok_hist_15", 15, "counter_2", "COMPLETED", None, now - timedelta(minutes=50)),
            ("tok_hist_16", 16, "counter_2", "COMPLETED", None, now - timedelta(minutes=44)),
            ("tok_hist_17", 17, "counter_2", "COMPLETED", None, now - timedelta(minutes=38)),
            ("tok_hist_18", 18, "counter_2", "COMPLETED", None, now - timedelta(minutes=32)),
            ("tok_hist_19", 19, "counter_2", "COMPLETED", None, now - timedelta(minutes=26)),
            ("tok_hist_20", 20, "counter_2", "COMPLETED", None, now - timedelta(minutes=20)),
            ("tok_h1_10",   10, "counter_1", "COMPLETED", None, now - timedelta(minutes=60)),
            ("tok_h1_11",   11, "counter_1", "COMPLETED", None, now - timedelta(minutes=54)),
            ("tok_h1_12",   12, "counter_1", "COMPLETED", None, now - timedelta(minutes=48)),
            ("tok_h1_13",   13, "counter_1", "COMPLETED", None, now - timedelta(minutes=42)),
            ("tok_h1_14",   14, "counter_1", "COMPLETED", None, now - timedelta(minutes=36)),
            ("tok_h3_21",   21, "counter_3", "COMPLETED", None, now - timedelta(minutes=40)),
            ("tok_h3_22",   22, "counter_3", "COMPLETED", None, now - timedelta(minutes=36)),
            ("tok_h3_23",   23, "counter_3", "COMPLETED", None, now - timedelta(minutes=32)),
            ("tok_h3_24",   24, "counter_3", "COMPLETED", None, now - timedelta(minutes=28)),
        ]
        for tid, number, cid, status, uid, issued in hist_tokens:
            db.session.add(Token(
                id=tid, queue_id="queue_opd_001", user_id=uid,
                counter_id=cid, token_number=number, status=status,
                issued_at=issued
            ))

        # Tokens for secondary queues
        secondary_tokens = [
            ("tok_002_21", "queue_opd_002", "ctr_002_1", 21, "WAITING",  "user_016"),
            ("tok_002_22", "queue_opd_002", "ctr_002_1", 22, "WAITING",  "user_017"),
            ("tok_002_23", "queue_opd_002", "ctr_002_2", 20, "WAITING",  None),
            ("tok_003_14", "queue_opd_003", "ctr_003_1", 14, "WAITING",  "user_018"),
            ("tok_003_15", "queue_opd_003", "ctr_003_2", 13, "WAITING",  "user_019"),
            ("tok_004_23", "queue_opd_004", "ctr_004_1", 23, "WAITING",  "user_020"),
            ("tok_004_24", "queue_opd_004", "ctr_004_2", 22, "WAITING",  None),
            ("tok_005_9",  "queue_opd_005", "ctr_005_1", 9,  "WAITING",  None),
            ("tok_006_11", "queue_opd_006", "ctr_006_1", 11, "WAITING",  None),
            ("tok_007_18", "queue_opd_007", "ctr_007_1", 18, "WAITING",  None),
            ("tok_008_25", "queue_opd_008", "ctr_008_1", 25, "WAITING",  None),
            ("tok_009_20", "queue_opd_009", "ctr_009_1", 20, "WAITING",  None),
            ("tok_010_14", "queue_opd_010", "ctr_010_1", 14, "WAITING",  None),
        ]
        for tid, qid, cid, num, status, uid in secondary_tokens:
            db.session.add(Token(
                id=tid, queue_id=qid, user_id=uid,
                counter_id=cid, token_number=num, status=status,
                issued_at=now - timedelta(minutes=15)
            ))

        db.session.flush()

        # ── 7. Service Logs (Used for dynamic rolling ETA calculation) ────────
        c2_dur = [4.0, 5.0, 3.0, 6.0, 5.0, 4.5, 6.5, 5.5, 3.5, 4.0]
        for i, dur in enumerate(c2_dur):
            st = now - timedelta(minutes=60 - i * 6)
            db.session.add(ServiceLog(
                id=f"slog_c2_{i+1}",
                queue_id="queue_opd_001",
                counter_id="counter_2",
                token_number=15 + (i % 6),
                started_at=st,
                completed_at=st + timedelta(minutes=dur),
                duration_minutes=dur
            ))

        # Counter 1 logs
        c1_dur = [4.5, 5.0, 4.0, 5.5, 4.5]
        for i, dur in enumerate(c1_dur):
            st = now - timedelta(minutes=60 - i * 8)
            db.session.add(ServiceLog(
                id=f"slog_c1_{i+1}",
                queue_id="queue_opd_001",
                counter_id="counter_1",
                token_number=10 + (i % 5),
                started_at=st,
                completed_at=st + timedelta(minutes=dur),
                duration_minutes=dur
            ))

        # Counter 3 logs
        c3_dur = [6.0, 7.0, 5.5, 6.5, 5.0]
        for i, dur in enumerate(c3_dur):
            st = now - timedelta(minutes=60 - i * 8)
            db.session.add(ServiceLog(
                id=f"slog_c3_{i+1}",
                queue_id="queue_opd_001",
                counter_id="counter_3",
                token_number=21 + (i % 4),
                started_at=st,
                completed_at=st + timedelta(minutes=dur),
                duration_minutes=dur
            ))

        # Secondary queue logs
        for i, (qid, cid, num, dur) in enumerate([
            ("queue_opd_002", "ctr_002_1", 17, 2.5),
            ("queue_opd_002", "ctr_002_2", 18, 3.0),
            ("queue_opd_003", "ctr_003_1", 10, 4.0),
            ("queue_opd_003", "ctr_003_2", 11, 4.5),
        ]):
            st = now - timedelta(minutes=30 - i * 5)
            db.session.add(ServiceLog(
                id=f"slog_sec_{i+1}",
                queue_id=qid,
                counter_id=cid,
                token_number=num,
                started_at=st,
                completed_at=st + timedelta(minutes=dur),
                duration_minutes=dur
            ))

        # ── 8. Swap Opportunity ──────────────────────────────────────────────
        db.session.add(Swap(
            id="swap_demo_001",
            offered_token_id="tok_c2_41",
            status="AVAILABLE",
            created_at=now - timedelta(minutes=5),
            expires_at=now + timedelta(hours=24)
        ))

        # ── 9. In-App Notifications ──────────────────────────────────────────
        notifs_data = [
            ("notif_001", "user_001", "You have joined the General OPD queue. Your token is #42 at Counter 2 (Dr. Priya).", "INFO", False, now - timedelta(minutes=18)),
            ("notif_002", "user_001", "Recommended arrival window: 10:15 AM - 10:30 AM. Please plan your transit.", "ARRIVAL_WINDOW", False, now - timedelta(minutes=15)),
            ("notif_003", "user_001", "ETA updated: 4 people ahead (~14 mins). Counter 2 throughput is optimal.", "ETA_UPDATE", False, now - timedelta(minutes=10)),
            ("notif_004", "user_001", "Peer slot exchange available: Token #41 is listed for swap by Rahul Mehta.", "SWAP_AVAILABLE", False, now - timedelta(minutes=5)),
            ("notif_005", "user_002", "Your token #41 has been listed for slot exchange in General OPD.", "SWAP", True, now - timedelta(minutes=8)),
            ("notif_006", "user_003", "Token #27 at Counter 1: Approaching front of queue (2 ahead).", "APPROACHING", False, now - timedelta(minutes=4)),
            ("notif_007", "user_006", "Token #30 at Counter 1: Please proceed towards Counter 1 waiting lounge.", "APPROACHING", True, now - timedelta(minutes=2)),
            ("notif_008", "user_007", "Token #37 at Counter 2: Currently 1 person ahead. Prepare your documents.", "ETA_UPDATE", False, now - timedelta(minutes=3)),
            ("notif_009", "user_013", "Token #35 at Counter 3: Estimated consultation in 6 minutes.", "ETA_UPDATE", False, now - timedelta(minutes=7)),
            ("notif_010", "user_014", "Appointment reminder: OPD consultation scheduled today at ABC Hospital.", "REMINDER", True, now - timedelta(minutes=60)),
        ]
        for nid, uid, msg, ntype, read, created in notifs_data:
            db.session.add(Notification(
                id=nid, user_id=uid, message=msg,
                type=ntype, read=read, created_at=created
            ))

        db.session.commit()
        print("=" * 60)
        print("DATABASE SEED COMPLETED SUCCESSFULLY")
        print("=" * 60)
        print("  - Locations:      10 (Tamil Nadu facilities)")
        print("  - Services:       22")
        print("  - Queues:         12")
        print("  - Counters:       35")
        print("  - Users:          20 (all password: Demo@123)")
        print("  - Primary Token:  #42 (user_001 / Ananya Sharma / Counter 2)")
        print("  - Swap Token:     #41 (user_002 / Rahul Mehta / Available)")
        print("  - Notifications:  10")
        print("  - Service Logs:   24 (enables dynamic rolling ETA)")
        print("=" * 60)


if __name__ == "__main__":
    seed()
