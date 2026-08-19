package com.example.HerbalLife.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.HerbalLife.entity.Order;

public interface OrderRepository extends MongoRepository<Order, String>{

    List<Order> findByEmail(String email);

}