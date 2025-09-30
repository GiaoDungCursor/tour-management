# 📚 Hướng Dẫn Cài Đặt Chi Tiết

## 🔧 Cài Đặt Môi Trường

### 1. Cài đặt Java JDK 17

**Windows:**
1. Tải Java JDK 17 từ: https://www.oracle.com/java/technologies/downloads/#java17
2. Cài đặt và thêm JAVA_HOME vào Environment Variables
3. Kiểm tra: `java -version`

**Linux/Mac:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install openjdk-17-jdk

# Mac (với Homebrew)
brew install openjdk@17
```

### 2. Cài đặt MySQL

**Windows:**
1. Tải XAMPP từ: https://www.apachefriends.org/
2. Cài đặt và khởi động MySQL từ XAMPP Control Panel

**Linux:**
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

**Mac:**
```bash
brew install mysql
brew services start mysql
```

### 3. Cài đặt Node.js

Tải và cài đặt từ: https://nodejs.org/ (phiên bản LTS)

Kiểm tra:
```bash
node -version
npm -version
```

### 4. Cài đặt Maven

**Windows:**
1. Tải Maven từ: https://maven.apache.org/download.cgi
2. Giải nén và thêm vào PATH

**Linux/Mac:**
```bash
# Ubuntu/Debian
sudo apt install maven

# Mac
brew install maven
```

Kiểm tra: `mvn -version`

## 💾 Thiết Lập Database

### Bước 1: Tạo Database
```bash
# Đăng nhập MySQL
mysql -u root -p

# Tạo database
CREATE DATABASE tourism_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

### Bước 2: Import Dữ Liệu Mẫu
```bash
mysql -u root -p tourism_db < database/tourism_db.sql
```

### Bước 3: Kiểm Tra
```bash
mysql -u root -p
USE tourism_db;
SHOW TABLES;
SELECT * FROM users;
```

## 🚀 Chạy Backend

### Bước 1: Cấu hình
Chỉnh sửa `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

### Bước 2: Build và Chạy
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend sẽ chạy tại: http://localhost:8080

### Test API:
```bash
curl http://localhost:8080/api/tours
```

## 🎨 Chạy Frontend

### Bước 1: Cài đặt Dependencies
```bash
cd frontend
npm install
```

### Bước 2: Chạy Development Server
```bash
npm run dev
```

Frontend sẽ chạy tại: http://localhost:3000

## 🧪 Kiểm Tra Ứng Dụng

### 1. Đăng nhập Admin
- URL: http://localhost:3000/login
- Username: `admin`
- Password: `admin123`

### 2. Kiểm tra các tính năng:
- ✅ Xem danh sách tours
- ✅ Tìm kiếm tours
- ✅ Đăng ký tài khoản mới
- ✅ Đặt tour (với tài khoản customer)
- ✅ Quản lý tours (với tài khoản admin)

## 🐛 Troubleshooting

### Lỗi kết nối Database
```
Error: Communications link failure
```
**Giải pháp:**
1. Kiểm tra MySQL đã chạy chưa
2. Kiểm tra username/password trong application.properties
3. Kiểm tra port 3306 có bị chặn không

### Lỗi Port đã được sử dụng
```
Port 8080 already in use
```
**Giải pháp:**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8080
kill -9 <PID>
```

### Lỗi CORS
Đảm bảo `cors.allowed.origins` trong application.properties đã được cấu hình đúng:
```properties
cors.allowed.origins=http://localhost:3000,http://localhost:5173
```

### Lỗi JWT
Nếu gặp lỗi về JWT token, đảm bảo:
1. `jwt.secret` có độ dài đủ (tối thiểu 256 bits)
2. Token được gửi đúng trong header: `Authorization: Bearer <token>`

## 📦 Build cho Production

### Backend
```bash
cd backend
mvn clean package
java -jar target/tourismmanagement-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd frontend
npm run build
# Files sẽ được tạo trong thư mục dist/
```

## 🔐 Bảo Mật

**Trước khi deploy production:**

1. Đổi JWT secret trong application.properties
2. Đổi password cho tài khoản admin
3. Cấu hình HTTPS
4. Giới hạn CORS origins
5. Enable SQL injection protection
6. Cấu hình rate limiting

## 📞 Hỗ Trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra logs trong console
2. Xem file README.md
3. Tạo Issue trên GitHub

---

Chúc bạn triển khai thành công! 🎉
