package com.example.HerbalLife.serviceimpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.example.HerbalLife.entity.Order;
import com.example.HerbalLife.service.EmailService;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendOrderConfirmation(Order order) {

        // Email sending failures should never block an order from being
        // placed, so any exception here is caught and logged, not thrown.
        try {

            SimpleMailMessage message = new SimpleMailMessage();

            message.setTo(order.getEmail());
            message.setSubject("HerbalLife - Order Confirmation");

            String body =
                    "Hi " + order.getFullname() + ",\n\n" +
                    "Thank you for your order! Here are the details:\n\n" +
                    "Product: " + order.getPname() + "\n" +
                    "Quantity: " + order.getQuantity() + "\n" +
                    "Total: Rs. " + order.getTotalPrice() + "\n" +
                    "Payment Mode: " + order.getPaymentMode() + "\n" +
                    "Delivery Address: " + order.getAddress() + "\n\n" +
                    "We'll notify you as your order status updates.\n\n" +
                    "Thanks for shopping with HerbalLife!";

            message.setText(body);

            mailSender.send(message);

        } catch (Exception e) {

            System.out.println("Failed to send order confirmation email: " + e.getMessage());

        }

    }

}
