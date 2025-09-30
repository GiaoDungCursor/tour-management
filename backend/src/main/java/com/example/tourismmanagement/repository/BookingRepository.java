package com.example.tourismmanagement.repository;

import com.example.tourismmanagement.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerId(Long customerId);
    List<Booking> findByTourId(Long tourId);
    List<Booking> findByStatus(Booking.BookingStatus status);
    List<Booking> findByCustomerIdAndStatus(Long customerId, Booking.BookingStatus status);
}
