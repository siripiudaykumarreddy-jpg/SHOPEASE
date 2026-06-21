package com.ecommerce.dto;


import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderItemRequest {
    @NotNull(message = "productId required")
    private Long productId;
    @Min(value=1,message="Quantity Atleast one there")
    private Integer quantity;

}
