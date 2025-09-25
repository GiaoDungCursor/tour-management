package com.smarttour.smarttourbackend.repository;

import com.smarttour.smarttourbackend.model.Booking;
import com.smarttour.smarttourbackend.model.User;
import com.smarttour.smarttourbackend.model.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
    List<Booking> findByTour(Tour tour);
    List<Booking> findByStatus(Booking.BookingStatus status);
    
    @Query("SELECT b FROM Booking b WHERE b.user = :user ORDER BY b.bookingDate DESC")
    List<Booking> findByUserOrderByBookingDateDesc(@Param("user") User user);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.tour = :tour AND b.status = :status")
    Long countByTourAndStatus(@Param("tour") Tour tour, @Param("status") Booking.BookingStatus status);
    
    @Query("SELECT b FROM Booking b WHERE b.bookingDate BETWEEN :startDate AND :endDate")
    List<Booking> findByBookingDateBetween(@Param("startDate") LocalDateTime startDate, 
                                          @Param("endDate") LocalDateTime endDate);
}
