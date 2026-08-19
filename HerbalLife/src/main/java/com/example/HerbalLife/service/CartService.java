package com.example.HerbalLife.service;

import java.util.List;

import com.example.HerbalLife.entity.Cart;

public interface CartService {

    Cart addToCart(Cart cart);

    List<Cart> getCart(String email);

    void deleteCart(String id);

    Cart updateQuantity(String id, int quantity);

}