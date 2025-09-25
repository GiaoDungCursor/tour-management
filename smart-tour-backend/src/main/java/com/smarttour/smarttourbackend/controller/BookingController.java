package com.smarttour.smarttourbackend.controller;

import com.smarttour.smarttourbackend.model.Booking;
import com.smarttour.smarttourbackend.model.User;
import com.smarttour.smarttourbackend.service.BookingService;
import com.smarttour.smarttourbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {
    
    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody BookingRequest request, Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = (User) userService.loadUserByUsername(username);
            
            Booking booking = bookingService.createBooking(
                user,
                request.getTourId(),
                request.getNumberOfParticipants(),
                request.getSpecialRequests(),
                request.getEmergencyContact(),
                request.getEmergencyPhone()
            );
            
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Booking>> getUserBookings(Authentication authentication) {
        String username = authentication.getName();
        User user = (User) userService.loadUserByUsername(username);
        List<Booking> bookings = bookingService.findByUser(user);
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        Optional<Booking> booking = bookingService.findById(id);
        return booking.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}/confirm")
    public ResponseEntity<Booking> confirmBooking(@PathVariable Long id) {
        Booking booking = bookingService.confirmBooking(id);
        if (booking != null) {
            return ResponseEntity.ok(booking);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(@PathVariable Long id) {
        Booking booking = bookingService.cancelBooking(id);
        if (booking != null) {
            return ResponseEntity.ok(booking);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/complete")
    public ResponseEntity<Booking> completeBooking(@PathVariable Long id) {
        Booking booking = bookingService.completeBooking(id);
        if (booking != null) {
            return ResponseEntity.ok(booking);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
    
    // Inner class for booking request
    public static class BookingRequest {
        private Long tourId;
        private Integer numberOfParticipants;
        private String specialRequests;
        private String emergencyContact;
        private String emergencyPhone;
        
        // Getters and Setters
        public Long getTourId() {
            return tourId;
        }
        
        public void setTourId(Long tourId) {
            this.tourId = tourId;
        }
        
        public Integer getNumberOfParticipants() {
            return numberOfParticipants;
        }
        
        public void setNumberOfParticipants(Integer numberOfParticipants) {
            this.numberOfParticipants = numberOfParticipants;
        }
        
        public String getSpecialRequests() {
            return specialRequests;
        }
        
        public void setSpecialRequests(String specialRequests) {
            this.specialRequests = specialRequests;
        }
        
        public String getEmergencyContact() {
            return emergencyContact;
        }
        
        public void setEmergencyContact(String emergencyContact) {
            this.emergencyContact = emergencyContact;
        }
        
        public String getEmergencyPhone() {
            return emergencyPhone;
        }
        
        public void setEmergencyPhone(String emergencyPhone) {
            this.emergencyPhone = emergencyPhone;
        }
    }
}
