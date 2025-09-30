package com.example.tourismmanagement.repository;

import com.example.tourismmanagement.model.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {
    List<Tour> findByDestinationContaining(String destination);
    List<Tour> findByStatus(Tour.TourStatus status);
    List<Tour> findByCategoryId(Long categoryId);
    List<Tour> findByStartDateBetween(LocalDate startDate, LocalDate endDate);
    List<Tour> findByPriceLessThanEqual(java.math.BigDecimal price);
}
