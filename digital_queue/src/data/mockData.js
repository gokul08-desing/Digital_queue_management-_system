// Centralized mock data representing realistic service locations, counters, and queues
export const HOSPITALS = [
  {
    id: "hospital_001",
    name: "ABC Multispeciality Hospital",
    type: "Multispeciality Hospital",
    address: "24 Anna Nagar Main Road, Chennai, Tamil Nadu - 600040",
    pincode: "600040",
    city: "Chennai",
    operatingHours: "08:00 AM - 08:00 PM",
    phone: "+91 44 2621 0000",
    badge: "Government & Private Approved",
    rating: 4.8,
    activeQueuesCount: 3,
    totalWaiting: 13,
    services: [
      {
        id: "service_opd_001",
        name: "OPD Registration",
        category: "Outpatient",
        description: "New patient registrations, appointment validation, and consultation slip generation.",
        totalWaiting: 13,
        avgWaitMinutes: 14,
        counters: [
          {
            id: "counter_1",
            counterNumber: 1,
            name: "Registration Desk A",
            staffName: "Staff Operator - Desk A",
            currentToken: 38,
            peopleWaiting: 4,
            avgServiceTime: 4.5,
            estimatedWaitMinutes: 18,
            status: "ACTIVE",
            speedTag: "Moderate"
          },
          {
            id: "counter_2",
            counterNumber: 2,
            name: "Registration Desk B",
            staffName: "Staff Operator - Desk B",
            currentToken: 35,
            peopleWaiting: 2,
            avgServiceTime: 7.0,
            estimatedWaitMinutes: 14,
            status: "ACTIVE",
            speedTag: "Recommended (Lowest Total Wait)",
            isRecommended: true
          },
          {
            id: "counter_3",
            counterNumber: 3,
            name: "Registration Desk C",
            staffName: "Staff Operator - Desk C",
            currentToken: 31,
            peopleWaiting: 7,
            avgServiceTime: 3.0,
            estimatedWaitMinutes: 21,
            status: "ACTIVE",
            speedTag: "High Volume"
          }
        ],
        recommendation: {
          recommendedCounterId: "counter_2",
          counterNumber: 2,
          counterName: "Registration Desk B",
          estimatedWaitMinutes: 14,
          reason: "Counter 2 currently has the shortest projected wait time (14 mins) despite fewer people, accounting for Desk B's historical throughput and service pacing.",
          comparisonNote: "Note: Counter 3 has faster service per person (3 min) but a 7-person backlog (21 min). Counter 2 offers the optimal balance."
        }
      },
      {
        id: "service_gc_002",
        name: "General Consultation",
        category: "Physician Consult",
        description: "General medical practitioner assessment and vital checks.",
        totalWaiting: 8,
        avgWaitMinutes: 25,
        counters: [
          {
            id: "counter_gc_1",
            counterNumber: 1,
            name: "Doctor Chamber 101",
            staffName: "Dr. K. Ramanathan, MD",
            currentToken: 14,
            peopleWaiting: 5,
            avgServiceTime: 6.0,
            estimatedWaitMinutes: 30,
            status: "ACTIVE"
          },
          {
            id: "counter_gc_2",
            counterNumber: 2,
            name: "Doctor Chamber 102",
            staffName: "Dr. S. Meenakshi, MBBS",
            currentToken: 19,
            peopleWaiting: 3,
            avgServiceTime: 6.5,
            estimatedWaitMinutes: 19.5,
            status: "ACTIVE",
            isRecommended: true
          }
        ]
      },
      {
        id: "service_pharm_003",
        name: "Hospital Pharmacy",
        category: "Dispensary",
        description: "Prescription dispensing and medication counseling.",
        totalWaiting: 6,
        avgWaitMinutes: 9,
        counters: [
          {
            id: "counter_ph_1",
            counterNumber: 1,
            name: "Dispensary Counter 1",
            staffName: "Senior Pharmacist",
            currentToken: 82,
            peopleWaiting: 4,
            avgServiceTime: 2.0,
            estimatedWaitMinutes: 8,
            status: "ACTIVE",
            isRecommended: true
          },
          {
            id: "counter_ph_2",
            counterNumber: 2,
            name: "Dispensary Counter 2",
            staffName: "Pharmacist",
            currentToken: 79,
            peopleWaiting: 2,
            avgServiceTime: 5.0,
            estimatedWaitMinutes: 10,
            status: "ACTIVE"
          }
        ]
      }
    ]
  },
  {
    id: "hospital_002",
    name: "City Care Clinic",
    type: "Outpatient Clinic",
    address: "12 Poonamallee High Road, Kilpauk, Chennai - 600010",
    pincode: "600010",
    city: "Chennai",
    operatingHours: "09:00 AM - 09:00 PM",
    phone: "+91 44 2641 1234",
    badge: "Primary Health Center",
    rating: 4.6,
    activeQueuesCount: 2,
    totalWaiting: 7,
    services: [
      {
        id: "service_ccc_opd",
        name: "General Token Desk",
        category: "Registration",
        description: "Clinic registration and token dispatch.",
        totalWaiting: 7,
        avgWaitMinutes: 12,
        counters: [
          {
            id: "counter_ccc_1",
            counterNumber: 1,
            name: "Reception Desk",
            staffName: "Duty Nurse",
            currentToken: 22,
            peopleWaiting: 7,
            avgServiceTime: 1.8,
            estimatedWaitMinutes: 12.6,
            status: "ACTIVE",
            isRecommended: true
          }
        ]
      }
    ]
  },
  {
    id: "hospital_003",
    name: "Apex Community Pharmacy Demo",
    type: "Retail Pharmacy & Diagnostics",
    address: "88 2nd Avenue, Anna Nagar West, Chennai - 600040",
    pincode: "600040",
    city: "Chennai",
    operatingHours: "24 Hours",
    phone: "+91 44 2626 5678",
    badge: "Pharmacy Partner",
    rating: 4.7,
    activeQueuesCount: 1,
    totalWaiting: 4,
    services: [
      {
        id: "service_apex_pharm",
        name: "Medication Counter",
        category: "Pharmacy",
        description: "Express prescription fulfillment.",
        totalWaiting: 4,
        avgWaitMinutes: 6,
        counters: [
          {
            id: "counter_apex_1",
            counterNumber: 1,
            name: "Express Pickup",
            staffName: "Staff Pharmacist",
            currentToken: 51,
            peopleWaiting: 4,
            avgServiceTime: 1.5,
            estimatedWaitMinutes: 6,
            status: "ACTIVE",
            isRecommended: true
          }
        ]
      }
    ]
  }
];

export const DEMO_USER = {
  id: "user_001",
  name: "Ananya Sharma",
  phone: "9876543210",
  email: "ananya.sharma@example.com",
  preferredLanguage: "English",
  smsAlerts: true,
  createdAt: "2026-01-15"
};

// Initial state for the primary active queue token
export const INITIAL_ACTIVE_TOKEN = {
  id: "queue_opd_001",
  hospitalId: "hospital_001",
  hospitalName: "ABC Multispeciality Hospital",
  hospitalAddress: "24 Anna Nagar Main Road, Chennai, Tamil Nadu - 600040",
  serviceId: "service_opd_001",
  serviceName: "OPD Registration",
  counterId: "counter_2",
  counterNumber: 2,
  counterName: "Registration Desk B",
  tokenNumber: 42,
  currentToken: 36,
  peopleAhead: 5,
  estimatedWaitMinutes: 18,
  recommendedArrivalStart: "10:38 AM",
  recommendedArrivalEnd: "10:43 AM",
  status: "WAITING", // WAITING, APPROACHING, COME_NOW, CALLED, CONFIRMED, IN_SERVICE, COMPLETED, NO_SHOW, CANCELLED
  isSlotReleased: false,
  timestamp: new Date().toISOString(),
  history: [
    {
      id: "hist_001",
      hospitalName: "ABC Multispeciality Hospital",
      serviceName: "Hospital Pharmacy",
      tokenNumber: 29,
      counter: "Dispensary Counter 1",
      date: "Yesterday, 04:15 PM",
      status: "COMPLETED"
    },
    {
      id: "hist_002",
      hospitalName: "City Care Clinic",
      serviceName: "General Token Desk",
      tokenNumber: 14,
      counter: "Reception Desk",
      date: "Feb 28, 2026",
      status: "COMPLETED"
    }
  ]
};

// Available slot swaps in the same service queue
export const MOCK_SWAP_OPPORTUNITIES = [
  {
    id: "swap_001",
    queueId: "queue_opd_001",
    serviceId: "service_opd_001",
    serviceName: "OPD Registration",
    counterName: "Registration Desk B",
    currentToken: 36,
    offeredBy: {
      userId: "user_p02",
      name: "Priya Nair",
      maskedPhone: "+91 98•••• 1204"
    },
    offeredToken: 40,
    offeredArrivalTime: "10:24 AM",
    offeredEtaMinutes: 8,
    timeAdvantageMinutes: 10,
    eligibilityReason: "Same service queue (OPD Registration Desk B). Token #40 is waiting and earlier than your Token #42.",
    status: "AVAILABLE"
  },
  {
    id: "swap_002",
    queueId: "queue_opd_001",
    serviceId: "service_opd_001",
    serviceName: "OPD Registration",
    counterName: "Registration Desk B",
    currentToken: 36,
    offeredBy: {
      userId: "user_r03",
      name: "Rahul Verma",
      maskedPhone: "+91 97•••• 4489"
    },
    offeredToken: 46,
    offeredArrivalTime: "10:55 AM",
    offeredEtaMinutes: 28,
    timeAdvantageMinutes: -10,
    isLaterSlot: true,
    eligibilityReason: "Same service queue. User requested a later slot due to delayed transit.",
    status: "AVAILABLE"
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif_001",
    title: "Queue Joined Successfully",
    message: "You have joined OPD Registration at ABC Multispeciality Hospital. Your token is #42.",
    type: "SUCCESS",
    timestamp: "Just now",
    isRead: false
  },
  {
    id: "notif_002",
    title: "Dynamic ETA Calculated",
    message: "Initial estimated wait is 18 minutes (5 people ahead). Recommended arrival: 10:38 - 10:43 AM.",
    type: "INFO",
    timestamp: "1 min ago",
    isRead: false
  },
  {
    id: "notif_003",
    title: "Eligible Slot Exchange Alert",
    message: "An earlier slot (#40, ETA ~8 min) is currently available for exchange in your queue.",
    type: "SWAP",
    timestamp: "2 mins ago",
    isRead: true
  }
];
