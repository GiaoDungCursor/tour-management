package com.example.tourismmanagement.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BookingDTO {
    private Long id;
    
    @NotNull(message = "Tour ID is required")
    private Long tourId;
    
    private Long customerId;
    
    @NotNull(message = "Number of people is required")
    @Min(value = 1, message = "Number of people must be at least 1")
    private Integer numberOfPeople;
    
    private BigDecimal totalAmount;
    private String status;
    private String paymentStatus;
    private String specialRequests;
    
    // For response
    private String tourName;
    private String customerName;
}
