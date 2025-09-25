package com.smarttour.smarttourbackend.repository;

import com.smarttour.smarttourbackend.model.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {
    List<Tour> findByIsActiveTrue();
    List<Tour> findByDestinationContainingIgnoreCase(String destination);
    List<Tour> findByTourType(Tour.TourType tourType);
    List<Tour> findByDifficultyLevel(Tour.DifficultyLevel difficultyLevel);
    List<Tour> findByPriceBetween(Double minPrice, Double maxPrice);
    List<Tour> findByDurationBetween(Integer minDuration, Integer maxDuration);
    
    @Query("SELECT t FROM Tour t WHERE t.isActive = true AND t.startDate > :currentDate ORDER BY t.startDate ASC")
    List<Tour> findUpcomingTours(@Param("currentDate") LocalDateTime currentDate);
    
    @Query("SELECT t FROM Tour t WHERE t.isActive = true AND t.registrationDeadline > :currentDate ORDER BY t.registrationDeadline ASC")
    List<Tour> findToursWithOpenRegistration(@Param("currentDate") LocalDateTime currentDate);
    
    @Query("SELECT t FROM Tour t WHERE t.isActive = true AND " +
           "(:destination IS NULL OR LOWER(t.destination) LIKE LOWER(CONCAT('%', :destination, '%'))) AND " +
           "(:tourType IS NULL OR t.tourType = :tourType) AND " +
           "(:difficultyLevel IS NULL OR t.difficultyLevel = :difficultyLevel) AND " +
           "(:minPrice IS NULL OR t.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR t.price <= :maxPrice)")
    List<Tour> findToursWithFilters(@Param("destination") String destination,
                                   @Param("tourType") Tour.TourType tourType,
                                   @Param("difficultyLevel") Tour.DifficultyLevel difficultyLevel,
                                   @Param("minPrice") Double minPrice,
                                   @Param("maxPrice") Double maxPrice);
}
