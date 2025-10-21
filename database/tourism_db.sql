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

-- Insert sample admin user (password: 123)
-- Note: You should change this password in production
INSERT INTO users (username, email, password, full_name, role, active) VALUES
('admin', 'admin@tourism.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'Administrator', 'ADMIN', TRUE),
('staff1', 'staff@tourism.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'Staff Member', 'STAFF', TRUE),
('customer1', 'customer@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'John Doe', 'CUSTOMER', TRUE);

-- Insert sample tours
INSERT INTO tours (name, description, destination, duration, price, max_participants, available_seats, start_date, end_date, image_url, status, itinerary, included, excluded, category_id) VALUES
('Tour Phú Quốc 3N2Đ', 'Khám phá đảo ngọc Phú Quốc với bãi biển tuyệt đẹp và những trải nghiệm độc đáo', 'Phú Quốc, Kiên Giang', 3, 4500000, 20, 18, '2025-01-15', '2025-01-17', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800', 'AVAILABLE', 
'Ngày 1: Đón khách tại sân bay, check-in resort, tham quan chợ đêm Phú Quốc\nNgày 2: Tham quan Vinpearl Safari, tắm biển Bãi Trường\nNgày 3: Tham quan nhà tù Phú Quốc, mua sắm, về lại TP.HCM', 
'Vé máy bay khứ hồi\nKhách sạn 3 sao\nĂn sáng\nHướng dẫn viên\nXe đưa đón\nBảo hiểm du lịch', 
'Ăn trưa, tối\nChi phí cá nhân\nĐồ uống\nPhí tham quan tự chọn', 1),

('Tour Đà Lạt 4N3Đ', 'Thành phố ngàn hoa với khí hậu mát mẻ quanh năm và cảnh quan thiên nhiên tuyệt đẹp', 'Đà Lạt, Lâm Đồng', 4, 3200000, 25, 22, '2025-01-20', '2025-01-23', 'https://images.unsplash.com/photo-1583417267826-aebc4d1542e1?w=800', 'AVAILABLE',
'Ngày 1: Đón khách tại sân bay, check-in khách sạn, tham quan chợ Đà Lạt\nNgày 2: Tham quan Hồ Xuân Hương, Dinh Bảo Đại, Thiền viện Trúc Lâm\nNgày 3: Tham quan Thung lũng Tình yêu, Ga Đà Lạt, Vườn hoa\nNgày 4: Mua sắm đặc sản, về lại TP.HCM',
'Vé máy bay khứ hồi\nKhách sạn 3 sao\nĂn sáng\nHướng dẫn viên\nXe đưa đón\nBảo hiểm du lịch',
'Ăn trưa, tối\nChi phí cá nhân\nĐồ uống\nPhí tham quan tự chọn', 2),

('Tour Hạ Long 2N1Đ', 'Di sản thiên nhiên thế giới Vịnh Hạ Long với hàng nghìn đảo đá vôi tuyệt đẹp', 'Hạ Long, Quảng Ninh', 2, 2800000, 30, 25, '2025-01-10', '2025-01-11', 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800', 'AVAILABLE',
'Ngày 1: Đón khách tại Hà Nội, di chuyển đến Hạ Long, lên tàu cruise, tham quan hang Sửng Sốt\nNgày 2: Tham quan hang Luồn, đảo Titop, về lại Hà Nội',
'Vé tàu cruise\nPhòng nghỉ trên tàu\nĂn uống trên tàu\nHướng dẫn viên\nXe đưa đón\nBảo hiểm du lịch',
'Chi phí cá nhân\nĐồ uống có cồn\nPhí tham quan tự chọn', 4),

('Tour Sapa 3N2Đ', 'Khám phá vùng núi Tây Bắc và ruộng bậc thang tuyệt đẹp cùng văn hóa dân tộc', 'Sapa, Lào Cai', 3, 3500000, 20, 15, '2025-01-25', '2025-01-27', 'https://images.unsplash.com/photo-1583417267826-aebc4d1542e1?w=800', 'AVAILABLE',
'Ngày 1: Đón khách tại Hà Nội, di chuyển đến Sapa, check-in homestay\nNgày 2: Trekking ruộng bậc thang, tham quan làng Cát Cát\nNgày 3: Tham quan chợ Sapa, về lại Hà Nội',
'Homestay\nĂn uống\nHướng dẫn viên\nXe đưa đón\nBảo hiểm du lịch',
'Chi phí cá nhân\nĐồ uống\nPhí tham quan tự chọn', 2),

('Tour Nha Trang 3N2Đ', 'Thành phố biển Nha Trang xinh đẹp với những bãi biển trong xanh', 'Nha Trang, Khánh Hòa', 3, 3800000, 25, 20, '2025-02-01', '2025-02-03', 'https://images.unsplash.com/photo-1583417267826-aebc4d1542e1?w=800', 'AVAILABLE',
'Ngày 1: Đón khách tại sân bay, check-in resort, tham quan chợ Đầm\nNgày 2: Tham quan đảo Hòn Mun, Vinpearl Land\nNgày 3: Tắm biển, mua sắm, về lại TP.HCM',
'Vé máy bay khứ hồi\nResort 4 sao\nĂn sáng\nHướng dẫn viên\nXe đưa đón\nBảo hiểm du lịch',
'Ăn trưa, tối\nChi phí cá nhân\nĐồ uống\nPhí tham quan tự chọn', 1),

('Tour Hội An 2N1Đ', 'Phố cổ Hội An với kiến trúc cổ kính và ẩm thực đặc sắc', 'Hội An, Quảng Nam', 2, 2500000, 30, 28, '2025-02-10', '2025-02-11', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 'AVAILABLE',
'Ngày 1: Đón khách tại Đà Nẵng, di chuyển đến Hội An, tham quan phố cổ\nNgày 2: Tham quan làng gốm Thanh Hà, về lại Đà Nẵng',
'Khách sạn 3 sao\nĂn sáng\nHướng dẫn viên\nXe đưa đón\nBảo hiểm du lịch',
'Ăn trưa, tối\nChi phí cá nhân\nĐồ uống\nPhí tham quan tự chọn', 4),

('Tour Cần Thơ 2N1Đ', 'Miền Tây sông nước với chợ nổi và văn hóa đặc trưng', 'Cần Thơ', 2, 2200000, 25, 23, '2025-02-15', '2025-02-16', 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800', 'AVAILABLE',
'Ngày 1: Đón khách tại TP.HCM, di chuyển đến Cần Thơ, tham quan chợ nổi Cái Răng\nNgày 2: Tham quan vườn trái cây, về lại TP.HCM',
'Khách sạn 3 sao\nĂn sáng\nHướng dẫn viên\nXe đưa đón\nBảo hiểm du lịch',
'Ăn trưa, tối\nChi phí cá nhân\nĐồ uống\nPhí tham quan tự chọn', 5),

('Tour Huế 3N2Đ', 'Cố đô Huế với di sản văn hóa và ẩm thực cung đình', 'Huế, Thừa Thiên Huế', 3, 3000000, 20, 18, '2025-02-20', '2025-02-22', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', 'AVAILABLE',
'Ngày 1: Đón khách tại Huế, check-in khách sạn, tham quan Đại Nội\nNgày 2: Tham quan lăng Khải Định, chùa Thiên Mụ\nNgày 3: Tham quan chợ Đông Ba, về lại TP.HCM',
'Khách sạn 3 sao\nĂn sáng\nHướng dẫn viên\nXe đưa đón\nBảo hiểm du lịch',
'Ăn trưa, tối\nChi phí cá nhân\nĐồ uống\nPhí tham quan tự chọn', 4);

-- Insert sample bookings
INSERT INTO bookings (customer_id, tour_id, number_of_people, total_amount, status, payment_status, special_requests, created_at) VALUES
(3, 1, 2, 9000000, 'CONFIRMED', 'PAID', 'Cần phòng đôi, không ăn cay', '2024-12-15 10:30:00'),
(3, 2, 1, 3200000, 'PENDING', 'PENDING', 'Cần hướng dẫn viên nói tiếng Anh', '2024-12-16 14:20:00'),
(3, 3, 3, 8400000, 'CONFIRMED', 'PAID', 'Có trẻ em 5 tuổi', '2024-12-17 09:15:00'),
(3, 4, 2, 7000000, 'CANCELLED', 'REFUNDED', 'Hủy do lý do cá nhân', '2024-12-18 16:45:00'),
(3, 5, 1, 3800000, 'CONFIRMED', 'PAID', '', '2024-12-19 11:30:00');

-- Insert sample payments
INSERT INTO payments (booking_id, amount, payment_method, payment_status, transaction_id, created_at) VALUES
(1, 9000000, 'BANK_TRANSFER', 'COMPLETED', 'TXN001234567', '2024-12-15 10:35:00'),
(2, 3200000, 'CREDIT_CARD', 'PENDING', 'TXN001234568', '2024-12-16 14:25:00'),
(3, 8400000, 'BANK_TRANSFER', 'COMPLETED', 'TXN001234569', '2024-12-17 09:20:00'),
(4, 7000000, 'CREDIT_CARD', 'REFUNDED', 'TXN001234570', '2024-12-18 16:50:00'),
(5, 3800000, 'BANK_TRANSFER', 'COMPLETED', 'TXN001234571', '2024-12-19 11:35:00');
