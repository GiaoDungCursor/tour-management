package com.example.tourismmanagement.service;

import com.example.tourismmanagement.dto.TourDTO;
import com.example.tourismmanagement.model.Category;
import com.example.tourismmanagement.model.Tour;
import com.example.tourismmanagement.repository.CategoryRepository;
import com.example.tourismmanagement.repository.TourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TourService {
    @Autowired
    private TourRepository tourRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    public List<TourDTO> getAllTours() {
        return tourRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public TourDTO getTourById(Long id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour not found with id: " + id));
        return convertToDTO(tour);
    }
    
    public TourDTO createTour(TourDTO tourDTO) {
        Tour tour = convertToEntity(tourDTO);
        Tour savedTour = tourRepository.save(tour);
        return convertToDTO(savedTour);
    }
    
    public TourDTO updateTour(Long id, TourDTO tourDTO) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour not found with id: " + id));
        
        tour.setName(tourDTO.getName());
        tour.setDescription(tourDTO.getDescription());
        tour.setDestination(tourDTO.getDestination());
        tour.setDuration(tourDTO.getDuration());
        tour.setPrice(tourDTO.getPrice());
        tour.setMaxParticipants(tourDTO.getMaxParticipants());
        tour.setAvailableSeats(tourDTO.getAvailableSeats());
        tour.setStartDate(tourDTO.getStartDate());
        tour.setEndDate(tourDTO.getEndDate());
        tour.setImageUrl(tourDTO.getImageUrl());
        tour.setItinerary(tourDTO.getItinerary());
        tour.setIncluded(tourDTO.getIncluded());
        tour.setExcluded(tourDTO.getExcluded());
        
        if (tourDTO.getCategoryId() != null) {
            Category category = categoryRepository.findById(tourDTO.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            tour.setCategory(category);
        }
        
        if (tourDTO.getStatus() != null) {
            tour.setStatus(Tour.TourStatus.valueOf(tourDTO.getStatus()));
        }
        
        Tour updatedTour = tourRepository.save(tour);
        return convertToDTO(updatedTour);
    }
    
    public void deleteTour(Long id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour not found with id: " + id));
        tourRepository.delete(tour);
    }
    
    public List<TourDTO> searchByDestination(String destination) {
        return tourRepository.findByDestinationContaining(destination).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    private TourDTO convertToDTO(Tour tour) {
        TourDTO dto = new TourDTO();
        dto.setId(tour.getId());
        dto.setName(tour.getName());
        dto.setDescription(tour.getDescription());
        dto.setDestination(tour.getDestination());
        dto.setDuration(tour.getDuration());
        dto.setPrice(tour.getPrice());
        dto.setMaxParticipants(tour.getMaxParticipants());
        dto.setAvailableSeats(tour.getAvailableSeats());
        dto.setStartDate(tour.getStartDate());
        dto.setEndDate(tour.getEndDate());
        dto.setImageUrl(tour.getImageUrl());
        dto.setStatus(tour.getStatus().name());
        dto.setItinerary(tour.getItinerary());
        dto.setIncluded(tour.getIncluded());
        dto.setExcluded(tour.getExcluded());
        
        if (tour.getCategory() != null) {
            dto.setCategoryId(tour.getCategory().getId());
            dto.setCategoryName(tour.getCategory().getName());
        }
        
        return dto;
    }
    
    private Tour convertToEntity(TourDTO dto) {
        Tour tour = new Tour();
        tour.setName(dto.getName());
        tour.setDescription(dto.getDescription());
        tour.setDestination(dto.getDestination());
        tour.setDuration(dto.getDuration());
        tour.setPrice(dto.getPrice());
        tour.setMaxParticipants(dto.getMaxParticipants());
        tour.setAvailableSeats(dto.getAvailableSeats());
        tour.setStartDate(dto.getStartDate());
        tour.setEndDate(dto.getEndDate());
        tour.setImageUrl(dto.getImageUrl());
        tour.setItinerary(dto.getItinerary());
        tour.setIncluded(dto.getIncluded());
        tour.setExcluded(dto.getExcluded());
        
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            tour.setCategory(category);
        }
        
        if (dto.getStatus() != null) {
            tour.setStatus(Tour.TourStatus.valueOf(dto.getStatus()));
        } else {
            tour.setStatus(Tour.TourStatus.AVAILABLE);
        }
        
        return tour;
    }
}
