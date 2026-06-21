package com.ecommerce.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name="coupons")
@Data
public class Coupon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false,unique = true)
    private String code;
    @Column(name="discount_percent",nullable = false)
    private Double discountPercent;
    @Column(name="max_usage",nullable = false)
    private Integer maxUsage;
    @Column(name="used_count",nullable = false)
    private Integer usedCount;
    @Column(name="expiry_date",nullable = false)
    private LocalDate expiryDate;
    @Column(name="is_active",nullable = false)
    private Boolean isActive=true;
}
