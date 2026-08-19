package com.example.HerbalLife.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.HerbalLife.entity.Cart;
import com.example.HerbalLife.service.CartService;

@RestController
@RequestMapping("/cart")
@CrossOrigin(origins="http://localhost:5173")
public class CartController {

    @Autowired
    private CartService service;

    @PostMapping
    public Cart add(@RequestBody Cart cart){

        return service.addToCart(cart);

    }

    @GetMapping("/{email}")
    public List<Cart> getAll(@PathVariable String email) {

        return service.getCart(email);

    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id){

        service.deleteCart(id);

    }

    @PutMapping("/{id}")
    public Cart updateQuantity(@PathVariable String id, @RequestBody Map<String, Integer> body) {

        return service.updateQuantity(id, body.get("quantity"));

    }

    @GetMapping("/test")
    public String test() {
        return "Cart Controller Working";
    }

}
