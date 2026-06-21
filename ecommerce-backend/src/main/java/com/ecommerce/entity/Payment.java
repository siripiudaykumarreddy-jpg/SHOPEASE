package com.ecommerce.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name="payments")
@Data
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne(fetch =FetchType.LAZY)
    @JoinColumn(name="order_id",nullable = false)
    private Order order;
    @Column(name="razorpay_order_id")
    private String razorpayOrderId;
    @Column(name="razorpay_payment_id")
    private String razorpayPaymentId;
    @Column(nullable = false,precision = 10,scale = 2)
    private BigDecimal amount;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status=PaymentStatus.CREATED;
    @Column(name="created_at")
    private LocalDateTime createdAt=LocalDateTime.now();
    public enum PaymentStatus{
        CREATED,SUCCESS,FAILURE
    }
}
