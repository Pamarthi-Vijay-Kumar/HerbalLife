package com.example.HerbalLife.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.HerbalLife.entity.Order;
import com.example.HerbalLife.service.OrderService;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    @Autowired
    private OrderService service;

    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody Order order) {

        Order saved = service.placeOrder(order);

        if (saved == null) {
            return ResponseEntity.badRequest().body(
                    "This product is out of stock or the requested quantity is unavailable."
            );
        }

        return ResponseEntity.ok(saved);

    }

    // Admin: get all orders across all customers
    @GetMapping("/all")
    public List<Order> getAllOrders() {

        return service.getAllOrders();

    }

    // Admin: update an order's status
    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {

        Order updated = service.updateStatus(id, body.get("status"));

        if (updated == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updated);

    }

    @GetMapping("/{email}")
    public List<Order> getOrders(@PathVariable String email) {

        return service.getOrders(email);

    }

}