package com.example.HerbalLife.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.HerbalLife.entity.Coupon;
import com.example.HerbalLife.repository.CouponRepository;

@RestController
@RequestMapping("/coupons")
@CrossOrigin(origins = "http://localhost:5173")
public class CouponController {

    @Autowired
    private CouponRepository repository;

    // Admin: create a coupon
    @PostMapping
    public ResponseEntity<?> add(@RequestBody Coupon coupon) {

        if (repository.findByCodeIgnoreCase(coupon.getCode()) != null) {
            return ResponseEntity.badRequest().body("A coupon with this code already exists");
        }

        coupon.setCode(coupon.getCode().toUpperCase());

        return ResponseEntity.ok(repository.save(coupon));

    }

    // Admin: list all coupons
    @GetMapping("/all")
    public List<Coupon> getAll() {

        return repository.findAll();

    }

    // Admin: delete a coupon
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {

        repository.deleteById(id);

        return ResponseEntity.ok("Coupon Deleted");

    }

    // Admin: toggle active status
    @PutMapping("/{id}/active")
    public ResponseEntity<?> toggleActive(@PathVariable String id, @RequestBody Map<String, Boolean> body) {

        Coupon coupon = repository.findById(id).orElse(null);

        if (coupon == null) {
            return ResponseEntity.notFound().build();
        }

        coupon.setActive(body.get("active"));

        return ResponseEntity.ok(repository.save(coupon));

    }

    // Customer: validate a coupon code against an order amount
    @PostMapping("/validate")
    public ResponseEntity<?> validate(@RequestBody Map<String, Object> body) {

        String code = (String) body.get("code");
        int amount = Integer.parseInt(body.get("amount").toString());

        Coupon coupon = repository.findByCodeIgnoreCase(code);

        if (coupon == null || !coupon.isActive()) {
            return ResponseEntity.badRequest().body("Invalid or expired coupon code");
        }

        if (amount < coupon.getMinOrderAmount()) {
            return ResponseEntity.badRequest().body(
                    "This coupon requires a minimum order of ₹" + coupon.getMinOrderAmount()
            );
        }

        int discountAmount = (amount * coupon.getDiscountPercent()) / 100;

        Map<String, Object> result = new HashMap<>();
        result.put("valid", true);
        result.put("code", coupon.getCode());
        result.put("discountPercent", coupon.getDiscountPercent());
        result.put("discountAmount", discountAmount);
        result.put("finalAmount", amount - discountAmount);

        return ResponseEntity.ok(result);

    }

}
