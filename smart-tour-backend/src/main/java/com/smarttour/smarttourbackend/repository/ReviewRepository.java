package com.smarttour.smarttourbackend.repository;

import com.smarttour.smarttourbackend.model.Review;
import com.smarttour.smarttourbackend.model.Tour;
import com.smarttour.smarttourbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByTour(Tour tour);
    List<Review> findByUser(User user);
    Optional<Review> findByUserAndTour(User user, Tour tour);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.tour = :tour")
    Double findAverageRatingByTour(@Param("tour") Tour tour);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.tour = :tour")
    Long countByTour(@Param("tour") Tour tour);
    
    @Query("SELECT r FROM Review r WHERE r.tour = :tour ORDER BY r.createdAt DESC")
    List<Review> findByTourOrderByCreatedAtDesc(@Param("tour") Tour tour);
}
