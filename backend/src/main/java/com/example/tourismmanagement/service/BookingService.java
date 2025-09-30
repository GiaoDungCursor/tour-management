package com.example.tourismmanagement.service;

import com.example.tourismmanagement.dto.BookingDTO;
import com.example.tourismmanagement.model.Booking;
import com.example.tourismmanagement.model.Tour;
import com.example.tourismmanagement.model.User;
import com.example.tourismmanagement.repository.BookingRepository;
import com.example.tourismmanagement.repository.TourRepository;
import com.example.tourismmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private TourRepository tourRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Transactional
    public BookingDTO createBooking(BookingDTO bookingDTO, String username) {
        User customer = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Tour tour = tourRepository.findById(bookingDTO.getTourId())
                .orElseThrow(() -> new RuntimeException("Tour not found"));
        
        if (tour.getAvailableSeats() < bookingDTO.getNumberOfPeople()) {
            throw new RuntimeException("Not enough available seats");
        }
        
        Booking booking = new Booking();
        booking.setTour(tour);
        booking.setCustomer(customer);
        booking.setNumberOfPeople(bookingDTO.getNumberOfPeople());
        booking.setTotalAmount(tour.getPrice().multiply(BigDecimal.valueOf(bookingDTO.getNumberOfPeople())));
        booking.setStatus(Booking.BookingStatus.PENDING);
        booking.setPaymentStatus(Booking.PaymentStatus.UNPAID);
        booking.setSpecialRequests(bookingDTO.getSpecialRequests());
        
        // Update available seats
        tour.setAvailableSeats(tour.getAvailableSeats() - bookingDTO.getNumberOfPeople());
        tourRepository.save(tour);
        
        Booking savedBooking = bookingRepository.save(booking);
        return convertToDTO(savedBooking);
    }
    
    public List<BookingDTO> getCustomerBookings(String username) {
        User customer = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return bookingRepository.findByCustomerId(customer.getId()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public BookingDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return convertToDTO(booking);
    }
    
    @Transactional
    public BookingDTO updateBookingStatus(Long id, String status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setStatus(Booking.BookingStatus.valueOf(status));
        Booking updatedBooking = bookingRepository.save(booking);
        return convertToDTO(updatedBooking);
    }
    
    private BookingDTO convertToDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setId(booking.getId());
        dto.setTourId(booking.getTour().getId());
        dto.setTourName(booking.getTour().getName());
        dto.setCustomerId(booking.getCustomer().getId());
        dto.setCustomerName(booking.getCustomer().getFullName());
        dto.setNumberOfPeople(booking.getNumberOfPeople());
        dto.setTotalAmount(booking.getTotalAmount());
        dto.setStatus(booking.getStatus().name());
        dto.setPaymentStatus(booking.getPaymentStatus().name());
        dto.setSpecialRequests(booking.getSpecialRequests());
        return dto;
    }
}
