package com.ecommerce.dto;


import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequest {
@NotBlank(message = "product name should be there")
    private String name;
private String description;
@NotNull(message="price is required")
    @DecimalMin(value="0.0",inclusive=false,message="price greater than zero")
    private BigDecimal price;
@NotNull(message = "stock quantity is required")
@Min(value = 0, message = "Stock cannot be negative")
private Integer stockQuantity;

    private String imageUrl;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

}
