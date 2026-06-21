package com.ecommerce.service;
import com.razorpay.Utils;
import org.springframework.transaction.annotation.Transactional;
import jakarta.mail.MessagingException;
import com.ecommerce.dto.VerifyPaymentRequest;
import com.ecommerce.dto.CreatePaymentRequest;
import com.ecommerce.dto.CreatePaymentResponse;
import com.ecommerce.entity.Order;
import com.ecommerce.entity.Payment;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.PaymentRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;


    public CreatePaymentResponse createPaymentOrder(CreatePaymentRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException(
                        "Order not found with id: " + request.getOrderId()));

        try {
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            int amountInPaise = order.getTotalAmount()
                    .multiply(BigDecimal.valueOf(100))
                    .intValue();

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "order_" + order.getId());

            com.razorpay.Order razorpayOrder = razorpayClient.orders.create(orderRequest);
            String razorpayOrderId = razorpayOrder.get("id");

            Payment payment = new Payment();
            payment.setOrder(order);
            payment.setRazorpayOrderId(razorpayOrderId);
            payment.setAmount(order.getTotalAmount());
            payment.setStatus(Payment.PaymentStatus.CREATED);
            paymentRepository.save(payment);

            return new CreatePaymentResponse(
                    razorpayOrderId,
                    razorpayKeyId,
                    order.getTotalAmount(),
                    "INR"
            );

        } catch (RazorpayException e) {
            throw new RuntimeException("Failed to create payment order: " + e.getMessage());
        }

    }
    @Transactional
    public String verifyPayment(VerifyPaymentRequest request) {

        Payment payment = paymentRepository
                .findByRazorpayOrderIdForUpdate(request.getRazorpayOrderId())
                .orElseThrow(() -> new RuntimeException("Payment record not found"));

        if (payment.getStatus() == Payment.PaymentStatus.SUCCESS) {
            return "Payment already verified. Order confirmed.";
        }

        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", request.getRazorpayOrderId());
            options.put("razorpay_payment_id", request.getRazorpayPaymentId());
            options.put("razorpay_signature", request.getRazorpaySignature());

            boolean isValidSignature = Utils.verifyPaymentSignature(options, razorpayKeySecret);

            if (!isValidSignature) {
                payment.setStatus(Payment.PaymentStatus.FAILURE);
                paymentRepository.save(payment);
                throw new RuntimeException("Payment verification failed: invalid signature");
            }

        } catch (RazorpayException e) {
            throw new RuntimeException("Signature verification error: " + e.getMessage());
        }

        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setStatus(Payment.PaymentStatus.SUCCESS);
        paymentRepository.save(payment);

        Order order = payment.getOrder();
        order.setStatus(Order.OrderStatus.CONFIRMED);
        orderRepository.save(order);

        return "Payment verified successfully. Order confirmed.";
    }
}