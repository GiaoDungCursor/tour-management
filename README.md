# Smart Tour Management System

Hệ thống quản lý tour du lịch thông minh với React frontend và Spring Boot backend, tích hợp Tailwind CSS cho giao diện hiện đại.

## 🚀 Công nghệ sử dụng

### Backend
- **Spring Boot 3.2.0** - Framework Java
- **Spring Data JPA** - ORM và database management
- **Spring Security** - Authentication và authorization
- **JWT** - JSON Web Token cho authentication
- **H2 Database** - In-memory database cho development
- **PostgreSQL** - Production database
- **Maven** - Dependency management

### Frontend
- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Query** - Data fetching và caching
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **Heroicons** - Icon library
- **React Hot Toast** - Notification system

## 📁 Cấu trúc dự án

```
tour-management/
├── smart-tour-backend/          # Spring Boot API
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/smarttour/smarttourbackend/
│   │   │   │   ├── model/          # Entity classes
│   │   │   │   ├── repository/     # Data access layer
│   │   │   │   ├── service/        # Business logic
│   │   │   │   ├── controller/      # REST controllers
│   │   │   │   ├── config/         # Configuration classes
│   │   │   │   └── security/       # Security configuration
│   │   │   └── resources/
│   │   │       └── application.yml
│   │   └── test/
│   └── pom.xml
├── smart-tour-web/              # React web application
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── pages/               # Page components
│   │   ├── services/            # API services
│   │   ├── types/               # TypeScript type definitions
│   │   ├── hooks/               # Custom React hooks
│   │   ├── utils/               # Utility functions
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
└── README.md
```

## 🛠️ Hướng dẫn cài đặt và chạy

### Yêu cầu hệ thống
- Java 17+
- Node.js 16+
- Maven 3.6+
- Git

### Backend Setup

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd tour-management
   ```

2. **Chạy Spring Boot backend**
   ```bash
   cd smart-tour-backend
   ./mvnw spring-boot:run
   ```
   
   Hoặc trên Windows:
   ```bash
   cd smart-tour-backend
   mvnw.cmd spring-boot:run
   ```

3. **API sẽ chạy tại:** http://localhost:8080
4. **H2 Console:** http://localhost:8080/h2-console
   - JDBC URL: `jdbc:h2:mem:testdb`
   - Username: `sa`
   - Password: `password`

### Frontend Setup

1. **Cài đặt dependencies**
   ```bash
   cd smart-tour-web
   npm install
   ```

2. **Chạy development server**
   ```bash
   npm start
   ```

3. **Web app sẽ chạy tại:** http://localhost:3000

## 🎯 Tính năng chính

### Backend Features
- ✅ **User Management** - Đăng ký, đăng nhập, quản lý profile
- ✅ **Tour Management** - CRUD operations cho tours
- ✅ **Booking System** - Đặt tour, quản lý booking
- ✅ **Review System** - Đánh giá và review tours
- ✅ **JWT Authentication** - Secure API access
- ✅ **Search & Filter** - Tìm kiếm tours theo nhiều tiêu chí
- ✅ **RESTful API** - Clean API design

### Frontend Features
- ✅ **Responsive Design** - Mobile-first với Tailwind CSS
- ✅ **Modern UI/UX** - Clean và intuitive interface
- ✅ **Tour Discovery** - Browse và search tours
- ✅ **User Authentication** - Login/Register forms
- ✅ **Tour Details** - Chi tiết tour với images và itinerary
- ✅ **Booking Flow** - Quy trình đặt tour
- ✅ **Dashboard** - User dashboard cho quản lý bookings

### Smart Features (Planned)
- 🔄 **AI Recommendations** - Gợi ý tours dựa trên preferences
- 🔄 **Real-time Tracking** - Theo dõi tour progress
- 🔄 **Smart Notifications** - Thông báo thông minh
- 🔄 **Weather Integration** - Tích hợp thông tin thời tiết
- 🔄 **Social Features** - Chia sẻ và tương tác

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký

### Tour Endpoints
- `GET /api/tours` - Lấy danh sách tours
- `GET /api/tours/{id}` - Lấy chi tiết tour
- `GET /api/tours/search` - Tìm kiếm tours
- `GET /api/tours/upcoming` - Tours sắp diễn ra
- `POST /api/tours` - Tạo tour mới (Admin)

### Booking Endpoints
- `GET /api/bookings` - Lấy bookings của user
- `POST /api/bookings` - Tạo booking mới
- `PUT /api/bookings/{id}/confirm` - Xác nhận booking
- `PUT /api/bookings/{id}/cancel` - Hủy booking

## 🎨 UI Components

### Design System
- **Colors**: Primary (Blue), Secondary (Green), Gray scale
- **Typography**: Inter font family
- **Components**: Cards, Buttons, Forms, Navigation
- **Icons**: Heroicons library
- **Responsive**: Mobile-first approach

### Key Pages
- **Homepage** - Hero section, featured tours, features
- **Tours Page** - Search, filter, grid layout
- **Tour Detail** - Detailed tour information
- **Login/Register** - Authentication forms
- **Dashboard** - User management area
- **Booking** - Tour booking flow

## 🔧 Development

### Backend Development
```bash
# Run tests
./mvnw test

# Build JAR
./mvnw clean package

# Run with profile
./mvnw spring-boot:run -Dspring.profiles.active=dev
```

### Frontend Development
```bash
# Run tests
npm test

# Build for production
npm run build

# Type checking
npx tsc --noEmit
```

## 🚀 Deployment

### Backend Deployment
1. Build JAR file: `./mvnw clean package`
2. Deploy JAR to server: `java -jar target/smart-tour-backend-0.0.1-SNAPSHOT.jar`
3. Configure production database (PostgreSQL)
4. Set environment variables

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Deploy `build/` folder to web server
3. Configure API endpoint

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Email**: support@smarttour.com
- **Documentation**: [Wiki](wiki-url)
- **Issues**: [GitHub Issues](issues-url)

---

**Smart Tour Management System** - Your adventure awaits! 🌟