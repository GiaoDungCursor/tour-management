package com.smarttour.smarttourbackend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "tour_images")
public class TourImage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_id", nullable = false)
    private Tour tour;
    
    @NotBlank
    private String imageUrl;
    
    @NotBlank
    private String altText;
    
    private Boolean isMain = false;
    
    private Integer sortOrder = 0;
    
    // Constructors
    public TourImage() {}
    
    public TourImage(Tour tour, String imageUrl, String altText) {
        this.tour = tour;
        this.imageUrl = imageUrl;
        this.altText = altText;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Tour getTour() {
        return tour;
    }
    
    public void setTour(Tour tour) {
        this.tour = tour;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public String getAltText() {
        return altText;
    }
    
    public void setAltText(String altText) {
        this.altText = altText;
    }
    
    public Boolean getIsMain() {
        return isMain;
    }
    
    public void setIsMain(Boolean isMain) {
        this.isMain = isMain;
    }
    
    public Integer getSortOrder() {
        return sortOrder;
    }
    
    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }
}
