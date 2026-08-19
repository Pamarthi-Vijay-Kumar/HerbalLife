package com.example.HerbalLife.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.HerbalLife.entity.Review;
import com.example.HerbalLife.service.ReviewService;

@RestController
@RequestMapping("/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    @Autowired
    private ReviewService service;

    // Add Review
    @PostMapping
    public ResponseEntity<Review> add(@RequestBody Review review) {

        return ResponseEntity.ok(service.addReview(review));

    }

    // Get Reviews For A Product (with average rating)
    @GetMapping("/{pid}")
    public ResponseEntity<Map<String, Object>> getByProduct(@PathVariable int pid) {

        List<Review> reviews = service.getReviewsByProduct(pid);

        double average = service.getAverageRating(pid);

        Map<String, Object> response = new HashMap<>();

        response.put("reviews", reviews);
        response.put("average", average);
        response.put("count", reviews.size());

        return ResponseEntity.ok(response);

    }

}
