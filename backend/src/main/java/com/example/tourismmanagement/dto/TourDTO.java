package com.example.tourismmanagement.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TourDTO {
    private Long id;
    
    @NotBlank(message = "Tour name is required")
    private String name;
    
    private String description;
    
    @NotBlank(message = "Destination is required")
    private String destination;
    
    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 day")
    private Integer duration;
    
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;
    
    @NotNull(message = "Max participants is required")
    @Min(value = 1, message = "Max participants must be at least 1")
    private Integer maxParticipants;
    
    @NotNull(message = "Available seats is required")
    private Integer availableSeats;
    
    @NotNull(message = "Start date is required")
    private LocalDate startDate;
    
    @NotNull(message = "End date is required")
    private LocalDate endDate;
    
    private String imageUrl;
    private String status;
    private String itinerary;
    private String included;
    private String excluded;
    private Long categoryId;
    private String categoryName;
}
