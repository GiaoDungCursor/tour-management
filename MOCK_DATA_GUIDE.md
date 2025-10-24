# 🎯 MOCK DATA SYSTEM - HƯỚNG DẪN SỬ DỤNG

## 📋 **TỔNG QUAN**

Hệ thống đã được tích hợp với **Mock Data System** để test frontend mà không cần backend. Dữ liệu được lưu trong file JSON với metadata đầy đủ.

---

## 🔧 **CẤU HÌNH**

### **File chính:**
- `mock-data.json` - Dữ liệu JSON với metadata
- `frontend/src/services/mockDataService.ts` - Service xử lý mock data
- `frontend/src/services/api.ts` - API service với flag `USE_MOCK_DATA`

### **Flag điều khiển:**
```typescript
const USE_MOCK_DATA = true; // Set to false when backend is ready
```

---

## 📊 **DỮ LIỆU CÓ SẴN**

### **👥 Users (3 users):**
- **admin** / password: `123` (ADMIN role)
- **staff1** / password: `123` (STAFF role)  
- **customer1** / password: `123` (CUSTOMER role)

### **🏷️ Categories (5 categories):**
- Du lịch biển
- Du lịch núi
- Du lịch thành phố
- Du lịch văn hóa
- Du lịch sinh thái

### **🗺️ Tours (8 tours):**
- Tour Phú Quốc 3N2Đ (4.5M VND)
- Tour Đà Lạt 4N3Đ (3.2M VND)
- Tour Hạ Long 2N1Đ (2.8M VND)
- Tour Sapa 3N2Đ (3.5M VND)
- Tour Nha Trang 3N2Đ (3.8M VND)
- Tour Hội An 2N1Đ (2.5M VND)
- Tour Cần Thơ 2N1Đ (2.2M VND)
- Tour Huế 3N2Đ (3M VND)

### **📅 Bookings (5 bookings):**
- 3 bookings CONFIRMED
- 1 booking PENDING
- 1 booking CANCELLED

### **💰 Payments (5 payments):**
- 4 payments COMPLETED
- 1 payment PENDING
- 1 payment REFUNDED

---

## 🚀 **TÍNH NĂNG HOẠT ĐỘNG**

### **✅ Đã hoạt động:**
- **Authentication** - Login/Register với mock data
- **Tours Listing** - Hiển thị danh sách tours với filter
- **Tour Detail** - Chi tiết tour với booking form
- **Search & Filter** - Tìm kiếm theo destination, category, price
- **My Bookings** - Xem bookings của customer
- **Customer Dashboard** - Dashboard với statistics
- **Profile Management** - Quản lý profile user

### **🔄 Simulated API delays:**
- Login: 500ms
- Tours: 400ms
- Bookings: 300ms
- Categories: 200ms

---

## 🎮 **CÁCH TEST**

### **1. Login với tài khoản có sẵn:**
```
Username: admin
Password: 123
Role: ADMIN
```

```
Username: customer1  
Password: 123
Role: CUSTOMER
```

### **2. Test các tính năng:**

#### **🔍 Search & Filter:**
- Tìm kiếm: "Phú Quốc", "Đà Lạt", "Hạ Long"
- Filter theo category: Du lịch biển, Du lịch núi
- Filter theo giá: 2M - 5M VND
- Sort: Tên A-Z, Giá thấp-cao

#### **📅 Booking Flow:**
1. Browse tours → Click "View Details"
2. Fill booking form → Submit
3. Check "My Bookings" để xem booking mới

#### **👤 Customer Features:**
- Dashboard với statistics
- My Bookings management
- Profile editing

---

## 🔧 **CUSTOMIZATION**

### **Thêm dữ liệu mới:**

#### **1. Thêm Tour mới:**
```json
{
  "id": 9,
  "name": "Tour Mới",
  "description": "Mô tả tour",
  "destination": "Địa điểm",
  "duration": 3,
  "price": 3000000,
  "maxParticipants": 20,
  "availableSeats": 18,
  "startDate": "2025-03-01",
  "endDate": "2025-03-03",
  "imageUrl": "https://images.unsplash.com/photo-xxx",
  "status": "AVAILABLE",
  "categoryId": 1,
  "category": { "id": 1, "name": "Du lịch biển" },
  "rating": 4.5,
  "reviewCount": 0
}
```

#### **2. Thêm Category mới:**
```json
{
  "id": 6,
  "name": "Du lịch mạo hiểm",
  "description": "Tours mạo hiểm và thể thao",
  "imageUrl": "https://images.unsplash.com/photo-xxx",
  "active": true
}
```

#### **3. Cập nhật metadata:**
```json
{
  "metadata": {
    "version": "1.1",
    "lastUpdated": "2024-12-20T15:00:00Z",
    "totalRecords": {
      "users": 3,
      "categories": 6,
      "tours": 9,
      "bookings": 5
    }
  }
}
```

---

## 🔄 **SWITCH TO REAL API**

### **Khi backend sẵn sàng:**

1. **Cập nhật flag:**
```typescript
const USE_MOCK_DATA = false; // Switch to real API
```

2. **Cập nhật API_BASE_URL:**
```typescript
const API_BASE_URL = 'https://your-backend-url.com/api';
```

3. **Test với real data:**
- Đảm bảo backend chạy
- Test authentication
- Test CRUD operations
- Verify data consistency

---

## 📈 **ANALYTICS DATA**

### **Dashboard Statistics:**
```json
{
  "analytics": {
    "dashboard": {
      "totalTours": 8,
      "activeTours": 8,
      "totalBookings": 5,
      "pendingBookings": 1,
      "confirmedBookings": 3,
      "totalRevenue": 26400000,
      "averageRating": 4.7
    }
  }
}
```

### **Monthly Stats:**
- Revenue trends
- Booking patterns
- Category performance

---

## 🎯 **BENEFITS**

### **✅ Ưu điểm:**
- **Fast Development** - Không cần chờ backend
- **Consistent Data** - Dữ liệu ổn định để test
- **Easy Testing** - Test đầy đủ tính năng frontend
- **Realistic Simulation** - API delays giống thật
- **Easy Switch** - Chuyển sang real API dễ dàng

### **🔄 Workflow:**
1. **Development** → Mock data
2. **Testing** → Mock data  
3. **Integration** → Real API
4. **Production** → Real API

---

## 🚀 **READY TO USE!**

Frontend hiện tại đã sẵn sàng với:
- ✅ **8 tours** với đầy đủ thông tin
- ✅ **5 categories** đa dạng
- ✅ **3 user accounts** với roles khác nhau
- ✅ **5 bookings** để test customer flow
- ✅ **Complete search & filter** system
- ✅ **Responsive design** trên mọi thiết bị

**Bạn có thể test ngay bây giờ! 🎉**
