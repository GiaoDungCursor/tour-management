-- Tourism Management System Database Schema

CREATE DATABASE IF NOT EXISTS tourism_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tourism_db;

-- Table: categories
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    address TEXT,
    role ENUM('ADMIN', 'STAFF', 'CUSTOMER') NOT NULL DEFAULT 'CUSTOMER',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: tours
CREATE TABLE IF NOT EXISTS tours (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    destination VARCHAR(200) NOT NULL,
    duration INT NOT NULL COMMENT 'số ngày',
    price DECIMAL(10,2) NOT NULL,
    max_participants INT NOT NULL,
    available_seats INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    image_url VARCHAR(500),
    status ENUM('AVAILABLE', 'FULL', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'AVAILABLE',
    itinerary TEXT COMMENT 'lịch trình chi tiết',
    included TEXT COMMENT 'bao gồm',
    excluded TEXT COMMENT 'không bao gồm',
    category_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: bookings
CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tour_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    number_of_people INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    payment_status ENUM('UNPAID', 'PARTIAL', 'PAID', 'REFUNDED') DEFAULT 'UNPAID',
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: payments
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'E_WALLET') NOT NULL,
    status ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    transaction_id VARCHAR(100),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Du lịch biển', 'Các tour du lịch tới các bãi biển đẹp'),
('Du lịch núi', 'Khám phá các vùng núi non hùng vĩ'),
('Du lịch thành phố', 'Tham quan các thành phố lớn'),
('Du lịch văn hóa', 'Khám phá di sản văn hóa'),
('Du lịch sinh thái', 'Tour du lịch sinh thái và thiên nhiên');

-- Insert sample admin user (password: admin123)
-- Note: You should change this password in production
INSERT INTO users (username, email, password, full_name, role, active) VALUES
('admin', 'admin@tourism.com', '$2a$10$qrCflF.XTME3gTwq5kL9xOr.v4gNYwqMdVKnA7Y2w7lU5vz5U8fze', 'Administrator', 'ADMIN', TRUE);

-- Insert sample tours
INSERT INTO tours (name, description, destination, duration, price, max_participants, available_seats, start_date, end_date, image_url, status, category_id) VALUES
('Tour Phú Quốc 3N2Đ', 'Khám phá đảo ngọc Phú Quốc với bãi biển tuyệt đẹp', 'Phú Quốc', 3, 4500000, 20, 20, '2025-10-15', '2025-10-17', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19', 'AVAILABLE', 1),
('Tour Đà Lạt 4N3Đ', 'Thành phố ngàn hoa với khí hậu mát mẻ quanh năm', 'Đà Lạt', 4, 3200000, 25, 25, '2025-10-20', '2025-10-23', 'https://images.unsplash.com/photo-1583417267826-aebc4d1542e1', 'AVAILABLE', 2),
('Tour Hạ Long 2N1Đ', 'Di sản thiên nhiên thế giới Vịnh Hạ Long', 'Quảng Ninh', 2, 2800000, 30, 30, '2025-10-10', '2025-10-11', 'https://images.unsplash.com/photo-1528127269322-539801943592', 'AVAILABLE', 4),
('Tour Sapa 3N2Đ', 'Khám phá vùng núi Tây Bắc và ruộng bậc thang', 'Sapa, Lào Cai', 3, 3500000, 20, 20, '2025-10-25', '2025-10-27', 'https://images.unsplash.com/photo-1583417267826-aebc4d1542e1', 'AVAILABLE', 2),
('Tour Nha Trang 3N2Đ', 'Thành phố biển Nha Trang xinh đẹp', 'Nha Trang', 3, 3800000, 25, 25, '2025-11-01', '2025-11-03', 'https://images.unsplash.com/photo-1583417267826-aebc4d1542e1', 'AVAILABLE', 1);
