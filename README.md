# 🌏 Hệ Thống Quản Lý Du Lịch

Ứng dụng quản lý tour du lịch được xây dựng với **Spring Boot** (Backend) và **React.js** (Frontend).

## 📋 Mục lục

- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cài đặt](#-cài-đặt)
- [Cấu hình](#-cấu-hình)
- [Chạy ứng dụng](#-chạy-ứng-dụng)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)

## ✨ Tính năng

### Khách hàng
- 🔐 Đăng ký / Đăng nhập
- 🔍 Tìm kiếm và xem danh sách tours
- 📝 Đặt tour du lịch
- 👤 Quản lý booking cá nhân
- 💳 Thanh toán online

### Quản trị viên
- 📊 Dashboard thống kê
- 🌏 Quản lý tours (CRUD)
- 📋 Quản lý bookings
- 📂 Quản lý danh mục tours
- 👥 Quản lý khách hàng
- 💰 Quản lý thanh toán

## 🛠 Công nghệ sử dụng

### Backend
- **Spring Boot 3.5.6**
- **Spring Security** - Authentication & Authorization
- **JWT** - Token-based authentication
- **Spring Data JPA** - Database ORM
- **MySQL** - Database
- **Maven** - Dependency management

### Frontend
- **React.js 18**
- **React Router** - Routing
- **Ant Design** - UI Components
- **Axios** - HTTP client
- **Vite** - Build tool

## 💻 Cài đặt

### Yêu cầu hệ thống
- Java JDK 17+
- Node.js 16+
- MySQL 8.0+
- Maven 3.6+

### Clone repository
```bash
git clone <repository-url>
cd DoAnCuaGiao
```

### Cài đặt Backend
```bash
cd backend
mvn clean install
```

### Cài đặt Frontend
```bash
cd frontend
npm install
```

## ⚙ Cấu hình

### 1. Cấu hình Database

Tạo database MySQL:
```sql
CREATE DATABASE tourism_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Import dữ liệu mẫu:
```bash
mysql -u root -p tourism_db < database/tourism_db.sql
```

### 2. Cấu hình Backend

Chỉnh sửa file `backend/src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/tourism_db
spring.datasource.username=root
spring.datasource.password=your_password

# JWT Configuration
jwt.secret=your_secret_key_here
jwt.expiration=86400000
```

### 3. Cấu hình Frontend

File `frontend/src/services/api.js` đã được cấu hình sẵn để kết nối với backend tại `http://localhost:8080`

## 🚀 Chạy ứng dụng

### Chạy Backend
```bash
cd backend
mvn spring-boot:run
```
Backend sẽ chạy tại: `http://localhost:8080`

### Chạy Frontend
```bash
cd frontend
npm run dev
```
Frontend sẽ chạy tại: `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký

### Tours
- `GET /api/tours` - Lấy danh sách tours
- `GET /api/tours/{id}` - Lấy chi tiết tour
- `POST /api/tours` - Tạo tour mới (Admin)
- `PUT /api/tours/{id}` - Cập nhật tour (Admin)
- `DELETE /api/tours/{id}` - Xóa tour (Admin)
- `GET /api/tours/search?destination={destination}` - Tìm kiếm tour

### Bookings
- `POST /api/bookings` - Tạo booking
- `GET /api/bookings/my-bookings` - Lấy bookings của user
- `GET /api/bookings` - Lấy tất cả bookings (Admin)
- `PUT /api/bookings/{id}/status` - Cập nhật trạng thái booking (Admin)

### Categories
- `GET /api/categories` - Lấy danh sách danh mục
- `POST /api/categories` - Tạo danh mục (Admin)
- `PUT /api/categories/{id}` - Cập nhật danh mục (Admin)
- `DELETE /api/categories/{id}` - Xóa danh mục (Admin)

## 🔑 Tài khoản mặc định

### Admin
- **Username:** admin
- **Password:** admin123

## 📁 Cấu trúc dự án

```
DoAnCuaGiao/
├── backend/
│   ├── src/main/java/com/example/tourismmanagement/
│   │   ├── config/          # Security & CORS config
│   │   ├── controller/      # REST Controllers
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── model/           # Entity models
│   │   ├── repository/      # JPA Repositories
│   │   ├── security/        # Security & JWT
│   │   └── service/         # Business logic
│   └── src/main/resources/
│       └── application.properties
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── App.jsx
│   └── package.json
├── database/
│   └── tourism_db.sql       # Database schema
└── README.md
```

## 🌟 Tính năng nổi bật

- ✅ Authentication với JWT
- ✅ Role-based Authorization (Admin, Staff, Customer)
- ✅ CRUD operations cho Tours, Bookings, Categories
- ✅ Search và Filter tours
- ✅ Responsive UI với Ant Design
- ✅ Quản lý trạng thái booking
- ✅ Thống kê doanh thu và báo cáo

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng tạo Pull Request hoặc Issue.

## 📝 License

MIT License

## 📧 Liên hệ

- Email: your-email@example.com
- GitHub: your-github-profile

---

Được phát triển với ❤️ bởi [Your Name]
