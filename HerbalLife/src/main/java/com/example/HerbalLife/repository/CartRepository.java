package com.example.HerbalLife.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.HerbalLife.entity.Cart;

public interface CartRepository extends MongoRepository<Cart, String> {

    Cart findByPidAndEmail(int pid, String email);

    List<Cart> findByEmail(String email);

}