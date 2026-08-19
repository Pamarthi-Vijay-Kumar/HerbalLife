package com.example.HerbalLife.service;

import com.example.HerbalLife.entity.Order;

public interface EmailService {

    void sendOrderConfirmation(Order order);

}
