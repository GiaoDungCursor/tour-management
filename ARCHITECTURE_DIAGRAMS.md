# 🏗️ KIẾN TRÚC HỆ THỐNG BOOKING DU LỊCH - SƠ ĐỒ

## 📊 **SƠ ĐỒ KIẾN TRÚC TỔNG QUAN**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│  🌐 Web Browser          📱 Mobile App          💻 Desktop App                │
│  (React Frontend)       (React Native)         (Electron)                     │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            PRESENTATION LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│  🎨 UI Components        🧭 Navigation         📝 Forms                         │
│  🎯 State Management    🔍 Search & Filter    📊 Charts & Reports              │
│  📱 Responsive Design   🔔 Notifications      🖼️ Media Gallery                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│  🔐 Authentication      🛡️ Authorization      📊 Rate Limiting                │
│  🔄 Request Routing     📝 Logging            🚨 Error Handling                │
│  📈 Monitoring          🔧 Load Balancing     🌐 CORS Management                │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            BUSINESS LOGIC LAYER                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│  👤 User Service        🗺️ Tour Service        📋 Booking Service              │
│  💳 Payment Service     📧 Notification Svc    📊 Analytics Service             │
│  📁 File Service        🔍 Search Service      📝 Review Service                │
│  📈 Report Service      🎯 Recommendation     🔔 Communication Service         │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATA ACCESS LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│  🗄️ Repository Pattern   🔄 Unit of Work       📊 Query Optimization            │
│  🔍 Caching Layer        📝 Data Validation    🔒 Data Encryption               │
│  📈 Performance Monitor  🔄 Transaction Mgmt  📊 Connection Pooling             │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              PERSISTENCE LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│  🗄️ MySQL Database       📊 Redis Cache        📁 File Storage                 │
│  📈 Analytics DB         🔍 Search Engine      📝 Log Storage                  │
│  💾 Backup System        🔄 Replication        📊 Monitoring DB                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            EXTERNAL SERVICES                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│  💳 Payment Gateway      📧 Email Service       📱 SMS Service                   │
│  🗺️ Maps API            🌤️ Weather API        📊 Analytics API                 │
│  🔐 OAuth Providers     📁 Cloud Storage       🔔 Push Notifications            │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 **SƠ ĐỒ LUỒNG BOOKING**

```
👤 Customer                    🎨 Frontend                    🔧 Backend                    🗄️ Database
    │                              │                              │                              │
    │ 1. Browse Tours              │                              │                              │
    ├─────────────────────────────►│                              │                              │
    │                              │ 2. GET /api/tours           │                              │
    │                              ├─────────────────────────────►│                              │
    │                              │                              │ 3. Query tours table         │
    │                              │                              ├─────────────────────────────►│
    │                              │                              │ 4. Return tours data         │
    │                              │◄─────────────────────────────┤                              │
    │                              │ 5. Display tours             │                              │
    │◄─────────────────────────────┤                              │                              │
    │                              │                              │                              │
    │ 6. Select Tour               │                              │                              │
    ├─────────────────────────────►│                              │                              │
    │                              │ 7. GET /api/tours/:id        │                              │
    │                              ├─────────────────────────────►│                              │
    │                              │                              │ 8. Query tour details        │
    │                              │                              ├─────────────────────────────►│
    │                              │                              │ 9. Return tour details       │
    │                              │◄─────────────────────────────┤                              │
    │                              │ 10. Display tour details     │                              │
    │◄─────────────────────────────┤                              │                              │
    │                              │                              │                              │
    │ 11. Fill Booking Form         │                              │                              │
    ├─────────────────────────────►│                              │                              │
    │                              │ 12. POST /api/bookings       │                              │
    │                              ├─────────────────────────────►│                              │
    │                              │                              │ 13. Validate booking data    │
    │                              │                              │ 14. Create booking record    │
    │                              │                              ├─────────────────────────────►│
    │                              │                              │ 15. Return booking ID        │
    │                              │◄─────────────────────────────┤                              │
    │                              │ 16. Redirect to payment       │                              │
    │◄─────────────────────────────┤                              │                              │
    │                              │                              │                              │
    │ 17. Process Payment          │                              │                              │
    ├─────────────────────────────►│                              │                              │
    │                              │ 18. POST /api/payments       │                              │
    │                              ├─────────────────────────────►│                              │
    │                              │                              │ 19. Call Payment Gateway     │
    │                              │                              ├─────────────────────────────►│
    │                              │                              │ 20. Update payment status    │
    │                              │                              ├─────────────────────────────►│
    │                              │                              │ 21. Return payment result    │
    │                              │◄─────────────────────────────┤                              │
    │                              │ 22. Show booking confirmation │                              │
    │◄─────────────────────────────┤                              │                              │
```

---

## 🔄 **SƠ ĐỒ LUỒNG AUTHENTICATION**

```
👤 User                        🎨 Frontend                    🔧 Backend                    🗄️ Database
    │                              │                              │                              │
    │ 1. Login Request             │                              │                              │
    ├─────────────────────────────►│                              │                              │
    │                              │ 2. POST /api/auth/login      │                              │
    │                              ├─────────────────────────────►│                              │
    │                              │                              │ 3. Validate credentials     │
    │                              │                              ├─────────────────────────────►│
    │                              │                              │ 4. Check user exists         │
    │                              │◄─────────────────────────────┤                              │
    │                              │                              │ 5. Generate JWT token        │
    │                              │◄─────────────────────────────┤                              │
    │                              │ 6. Store token in localStorage│                              │
    │◄─────────────────────────────┤                              │                              │
    │                              │                              │                              │
    │ 7. Access Protected Route    │                              │                              │
    ├─────────────────────────────►│                              │                              │
    │                              │ 8. Include token in header   │                              │
    │                              ├─────────────────────────────►│                              │
    │                              │                              │ 9. Verify JWT token         │
    │                              │                              │ 10. Check user permissions   │
    │                              │                              ├─────────────────────────────►│
    │                              │                              │ 11. Return user data         │
    │                              │◄─────────────────────────────┤                              │
    │                              │ 12. Render protected content  │                              │
    │◄─────────────────────────────┤                              │                              │
```

---

## 📊 **SƠ ĐỒ DATABASE RELATIONSHIPS**

```
                    ┌─────────────────┐
                    │     USERS       │
                    │─────────────────│
                    │ id (PK)         │
                    │ username        │
                    │ email           │
                    │ password        │
                    │ full_name       │
                    │ role            │
                    │ active          │
                    └─────────────────┘
                            │
                            │ 1:N
                            ▼
                    ┌─────────────────┐
                    │   BOOKINGS      │
                    │─────────────────│
                    │ id (PK)         │
                    │ customer_id (FK)│
                    │ tour_id (FK)    │
                    │ number_of_people│
                    │ total_amount    │
                    │ status          │
                    │ payment_status  │
                    └─────────────────┘
                            │
                            │ 1:1
                            ▼
                    ┌─────────────────┐
                    │    PAYMENTS     │
                    │─────────────────│
                    │ id (PK)         │
                    │ booking_id (FK) │
                    │ amount          │
                    │ payment_method  │
                    │ payment_status  │
                    │ transaction_id  │
                    └─────────────────┘

┌─────────────────┐         ┌─────────────────┐
│   CATEGORIES    │         │      TOURS      │
│─────────────────│         │─────────────────│
│ id (PK)         │◄────────┤ id (PK)         │
│ name            │   1:N   │ category_id (FK)│
│ description     │         │ name            │
│ image_url       │         │ description     │
│ active          │         │ destination     │
└─────────────────┘         │ duration        │
                            │ price           │
                            │ max_participants│
                            │ available_seats │
                            │ start_date      │
                            │ end_date        │
                            │ image_url       │
                            │ status          │
                            │ itinerary       │
                            │ included        │
                            │ excluded        │
                            └─────────────────┘
                                    │
                                    │ 1:N
                                    ▼
                            ┌─────────────────┐
                            │    REVIEWS      │
                            │─────────────────│
                            │ id (PK)         │
                            │ booking_id (FK) │
                            │ customer_id (FK)│
                            │ tour_id (FK)    │
                            │ rating          │
                            │ comment         │
                            │ created_at      │
                            └─────────────────┘
```

---

## 🎨 **SƠ ĐỒ COMPONENT ARCHITECTURE**

```
                    ┌─────────────────────────────────────┐
                    │            APP COMPONENT             │
                    │  (Router, AuthProvider, Theme)       │
                    └─────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
        ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
        │   PUBLIC PAGES   │ │ CUSTOMER PAGES   │ │  ADMIN PAGES    │
        │─────────────────│ │─────────────────│ │─────────────────│
        │ • HomePage       │ │ • Dashboard     │ │ • AdminDashboard│
        │ • ToursPage      │ │ • MyBookings    │ │ • TourManagement│
        │ • TourDetail     │ │ • Profile       │ │ • BookingMgmt   │
        │ • Login/Register │ │ • Reviews       │ │ • UserManagement│
        └─────────────────┘ └─────────────────┘ └─────────────────┘
                    │               │               │
                    └───────────────┼───────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
        ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
        │  SHARED COMPONENTS│ │  SHARED COMPONENTS│ │  SHARED COMPONENTS│
        │─────────────────│ │─────────────────│ │─────────────────│
        │ • Navbar         │ │ • TourCard       │ │ • DataTable     │
        │ • Footer         │ │ • BookingCard    │ │ • Chart         │
        │ • LoadingSpinner  │ │ • ReviewCard     │ │ • Modal         │
        │ • ErrorMessage   │ │ • SearchFilter   │ │ • Form          │
        │ • ConfirmDialog  │ │ • Pagination     │ │ • StatusBadge   │
        └─────────────────┘ └─────────────────┘ └─────────────────┘
```

---

## 🔧 **SƠ ĐỒ DEPLOYMENT**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              PRODUCTION ENVIRONMENT                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  🌐 CDN (CloudFlare)                                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Static Assets (JS, CSS, Images)                                        │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                           │
│                                    ▼                                           │
│  🖥️ Load Balancer (Nginx)                                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ • SSL Termination                                                       │   │
│  │ • Request Routing                                                       │   │
│  │ • Rate Limiting                                                         │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                           │
│                                    ▼                                           │
│  🚀 Application Servers (Docker Containers)                                   │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Frontend (React)     Backend (Spring Boot)    Background Jobs           │   │
│  │ • Port 3000          • Port 8080              • Email Processing        │   │
│  │ • Static Files       • REST API               • Payment Processing      │   │
│  │ • PWA Support        • WebSocket              • Report Generation       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                           │
│                                    ▼                                           │
│  🗄️ Database Cluster (MySQL)                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ Primary DB          Read Replicas        Redis Cache                   │   │
│  │ • Write Operations  • Read Operations    • Session Storage             │   │
│  │ • Data Integrity    • Analytics Queries  • API Response Cache          │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 **KẾT LUẬN**

Kiến trúc này cung cấp:

✅ **Scalability:** Có thể mở rộng theo nhu cầu  
✅ **Maintainability:** Dễ bảo trì và phát triển  
✅ **Security:** Bảo mật cao với nhiều lớp  
✅ **Performance:** Tối ưu hiệu suất  
✅ **Reliability:** Độ tin cậy cao  
✅ **Flexibility:** Linh hoạt trong việc thay đổi  

**Đây là kiến trúc hoàn chỉnh cho một hệ thống booking du lịch chuyên nghiệp! 🚀**
