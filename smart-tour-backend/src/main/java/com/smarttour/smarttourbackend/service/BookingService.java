package com.smarttour.smarttourbackend.service;

import com.smarttour.smarttourbackend.model.Booking;
import com.smarttour.smarttourbackend.model.Tour;
import com.smarttour.smarttourbackend.model.User;
import com.smarttour.smarttourbackend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private TourService tourService;
    
    public Booking createBooking(User user, Long tourId, Integer numberOfParticipants, 
                               String specialRequests, String emergencyContact, String emergencyPhone) {
        Optional<Tour> tourOpt = tourService.findById(tourId);
        if (tourOpt.isEmpty()) {
            throw new RuntimeException("Tour not found");
        }
        
        Tour tour = tourOpt.get();
        
        // Check if tour is still available
        if (!tour.getIsActive()) {
            throw new RuntimeException("Tour is not available");
        }
        
        // Check if registration deadline has passed
        if (tour.getRegistrationDeadline() != null && 
            tour.getRegistrationDeadline().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Registration deadline has passed");
        }
        
        // Check if there are enough spots available
        Long currentBookings = bookingRepository.countByTourAndStatus(tour, Booking.BookingStatus.CONFIRMED);
        if (currentBookings + numberOfParticipants > tour.getMaxParticipants()) {
            throw new RuntimeException("Not enough spots available");
        }
        
        // Calculate total price
        BigDecimal totalPrice = tour.getPrice().multiply(BigDecimal.valueOf(numberOfParticipants));
        
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setTour(tour);
        booking.setNumberOfParticipants(numberOfParticipants);
        booking.setTotalPrice(totalPrice);
        booking.setSpecialRequests(specialRequests);
        booking.setEmergencyContact(emergencyContact);
        booking.setEmergencyPhone(emergencyPhone);
        booking.setStatus(Booking.BookingStatus.PENDING);
        
        return bookingRepository.save(booking);
    }
    
    public Optional<Booking> findById(Long id) {
        return bookingRepository.findById(id);
    }
    
    public List<Booking> findByUser(User user) {
        return bookingRepository.findByUserOrderByBookingDateDesc(user);
    }
    
    public List<Booking> findByTour(Tour tour) {
        return bookingRepository.findByTour(tour);
    }
    
    public List<Booking> findByStatus(Booking.BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }
    
    public Booking updateBookingStatus(Long bookingId, Booking.BookingStatus status) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            booking.setStatus(status);
            return bookingRepository.save(booking);
        }
        return null;
    }
    
    public Booking confirmBooking(Long bookingId) {
        return updateBookingStatus(bookingId, Booking.BookingStatus.CONFIRMED);
    }
    
    public Booking cancelBooking(Long bookingId) {
        return updateBookingStatus(bookingId, Booking.BookingStatus.CANCELLED);
    }
    
    public Booking completeBooking(Long bookingId) {
        return updateBookingStatus(bookingId, Booking.BookingStatus.COMPLETED);
    }
    
    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }
    
    public List<Booking> getBookingsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return bookingRepository.findByBookingDateBetween(startDate, endDate);
    }
}
