package com.ecommerce.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    private String description;
    @Column(nullable = false,precision = 10,scale = 2)
    private BigDecimal price;
    @Column(name="stock_quantity",nullable = false)
    private Integer stockQuantity;
    @Column(name="image_url")
    private String imageUrl;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="category_id")
    private Category category;
    @Version
    private Long version;
    @Column(name = "created_at")
    private LocalDateTime createdAt=LocalDateTime.now();
}
