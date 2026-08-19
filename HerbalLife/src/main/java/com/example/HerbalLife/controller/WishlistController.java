package com.example.HerbalLife.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.HerbalLife.entity.Wishlist;
import com.example.HerbalLife.service.WishlistService;

@RestController
@RequestMapping("/wishlist")
@CrossOrigin(origins = "http://localhost:5173")
public class WishlistController {

    @Autowired
    private WishlistService service;

    @PostMapping
    public Wishlist add(@RequestBody Wishlist wishlist) {

        return service.addToWishlist(wishlist);

    }

    @GetMapping("/{email}")
    public List<Wishlist> getAll(@PathVariable String email) {

        return service.getWishlist(email);

    }

    @DeleteMapping("/{pid}/{email}")
    public void remove(@PathVariable int pid, @PathVariable String email) {

        service.removeFromWishlist(pid, email);

    }

    @GetMapping("/check/{pid}/{email}")
    public ResponseEntity<Map<String, Boolean>> check(
            @PathVariable int pid,
            @PathVariable String email) {

        Map<String, Boolean> result = new HashMap<>();
        result.put("inWishlist", service.isInWishlist(pid, email));

        return ResponseEntity.ok(result);

    }

}
