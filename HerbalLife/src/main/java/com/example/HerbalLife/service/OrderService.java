package com.example.HerbalLife.service;

import java.util.List;

import com.example.HerbalLife.entity.Order;

public interface OrderService {

    Order placeOrder(Order order);

    List<Order> getOrders(String email);

    List<Order> getAllOrders();

    Order updateStatus(String id, String status);

}