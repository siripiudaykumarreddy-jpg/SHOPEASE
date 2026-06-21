package com.ecommerce.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryRequest {

    @NotBlank(message = "something must be typed")
    private String name;
    private String description;
}
