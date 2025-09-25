package com.smarttour.smarttourbackend.controller;

import com.smarttour.smarttourbackend.model.Tour;
import com.smarttour.smarttourbackend.service.TourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tours")
@CrossOrigin(origins = "*")
public class TourController {
    
    @Autowired
    private TourService tourService;
    
    @GetMapping
    public ResponseEntity<List<Tour>> getAllTours() {
        List<Tour> tours = tourService.getAllTours();
        return ResponseEntity.ok(tours);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Tour> getTourById(@PathVariable Long id) {
        Optional<Tour> tour = tourService.findById(id);
        return tour.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Tour>> searchTours(
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) Tour.TourType tourType,
            @RequestParam(required = false) Tour.DifficultyLevel difficultyLevel,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {
        
        List<Tour> tours = tourService.searchTours(destination, tourType, difficultyLevel, minPrice, maxPrice);
        return ResponseEntity.ok(tours);
    }
    
    @GetMapping("/upcoming")
    public ResponseEntity<List<Tour>> getUpcomingTours() {
        List<Tour> tours = tourService.getUpcomingTours();
        return ResponseEntity.ok(tours);
    }
    
    @GetMapping("/open-registration")
    public ResponseEntity<List<Tour>> getToursWithOpenRegistration() {
        List<Tour> tours = tourService.getToursWithOpenRegistration();
        return ResponseEntity.ok(tours);
    }
    
    @GetMapping("/destination/{destination}")
    public ResponseEntity<List<Tour>> getToursByDestination(@PathVariable String destination) {
        List<Tour> tours = tourService.findByDestination(destination);
        return ResponseEntity.ok(tours);
    }
    
    @GetMapping("/type/{tourType}")
    public ResponseEntity<List<Tour>> getToursByType(@PathVariable Tour.TourType tourType) {
        List<Tour> tours = tourService.findByTourType(tourType);
        return ResponseEntity.ok(tours);
    }
    
    @GetMapping("/difficulty/{difficultyLevel}")
    public ResponseEntity<List<Tour>> getToursByDifficulty(@PathVariable Tour.DifficultyLevel difficultyLevel) {
        List<Tour> tours = tourService.findByDifficultyLevel(difficultyLevel);
        return ResponseEntity.ok(tours);
    }
    
    @GetMapping("/price-range")
    public ResponseEntity<List<Tour>> getToursByPriceRange(
            @RequestParam Double minPrice, 
            @RequestParam Double maxPrice) {
        List<Tour> tours = tourService.findByPriceRange(minPrice, maxPrice);
        return ResponseEntity.ok(tours);
    }
    
    @GetMapping("/duration-range")
    public ResponseEntity<List<Tour>> getToursByDurationRange(
            @RequestParam Integer minDuration, 
            @RequestParam Integer maxDuration) {
        List<Tour> tours = tourService.findByDurationRange(minDuration, maxDuration);
        return ResponseEntity.ok(tours);
    }
    
    @PostMapping
    public ResponseEntity<Tour> createTour(@RequestBody Tour tour) {
        Tour createdTour = tourService.createTour(tour);
        return ResponseEntity.ok(createdTour);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Tour> updateTour(@PathVariable Long id, @RequestBody Tour tour) {
        tour.setId(id);
        Tour updatedTour = tourService.updateTour(tour);
        return ResponseEntity.ok(updatedTour);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTour(@PathVariable Long id) {
        tourService.deleteTour(id);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Tour> deactivateTour(@PathVariable Long id) {
        Tour tour = tourService.deactivateTour(id);
        if (tour != null) {
            return ResponseEntity.ok(tour);
        }
        return ResponseEntity.notFound().build();
    }
}
