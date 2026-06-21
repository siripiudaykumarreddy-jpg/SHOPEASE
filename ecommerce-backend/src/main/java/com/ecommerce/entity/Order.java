package com.ecommerce.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name="orders")
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="user_id",nullable = false)
    private User user;
    @OneToMany(mappedBy = "order",cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;
    @Column(name="total_amount",nullable = false,precision = 10,scale = 2)
    private BigDecimal totalAmount;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="coupon_id",nullable = true)
    private Coupon coupon;
    @Column(name = "discount_amount", precision = 10, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status=OrderStatus.PENDING;
    @Column(nullable = false,name="shipping_address")
    private String shippingAddress;
    @Column(name="created_at")
    private LocalDateTime createdAt=LocalDateTime.now();
    public enum OrderStatus{
        PENDING,CONFIRMED,SHIPPED,DELIVERED,CANCELLED
    }
}
