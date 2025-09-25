package com.smarttour.smarttourbackend.service;

import com.smarttour.smarttourbackend.model.Tour;
import com.smarttour.smarttourbackend.repository.TourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TourService {
    
    @Autowired
    private TourRepository tourRepository;
    
    public List<Tour> getAllTours() {
        return tourRepository.findByIsActiveTrue();
    }
    
    public Optional<Tour> findById(Long id) {
        return tourRepository.findById(id);
    }
    
    public List<Tour> findByDestination(String destination) {
        return tourRepository.findByDestinationContainingIgnoreCase(destination);
    }
    
    public List<Tour> findByTourType(Tour.TourType tourType) {
        return tourRepository.findByTourType(tourType);
    }
    
    public List<Tour> findByDifficultyLevel(Tour.DifficultyLevel difficultyLevel) {
        return tourRepository.findByDifficultyLevel(difficultyLevel);
    }
    
    public List<Tour> findByPriceRange(Double minPrice, Double maxPrice) {
        return tourRepository.findByPriceBetween(minPrice, maxPrice);
    }
    
    public List<Tour> findByDurationRange(Integer minDuration, Integer maxDuration) {
        return tourRepository.findByDurationBetween(minDuration, maxDuration);
    }
    
    public List<Tour> getUpcomingTours() {
        return tourRepository.findUpcomingTours(LocalDateTime.now());
    }
    
    public List<Tour> getToursWithOpenRegistration() {
        return tourRepository.findToursWithOpenRegistration(LocalDateTime.now());
    }
    
    public List<Tour> searchTours(String destination, Tour.TourType tourType, 
                                 Tour.DifficultyLevel difficultyLevel, 
                                 Double minPrice, Double maxPrice) {
        return tourRepository.findToursWithFilters(destination, tourType, difficultyLevel, minPrice, maxPrice);
    }
    
    public Tour createTour(Tour tour) {
        return tourRepository.save(tour);
    }
    
    public Tour updateTour(Tour tour) {
        return tourRepository.save(tour);
    }
    
    public void deleteTour(Long id) {
        tourRepository.deleteById(id);
    }
    
    public Tour deactivateTour(Long id) {
        Optional<Tour> tourOpt = tourRepository.findById(id);
        if (tourOpt.isPresent()) {
            Tour tour = tourOpt.get();
            tour.setIsActive(false);
            return tourRepository.save(tour);
        }
        return null;
    }
}
