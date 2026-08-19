package com.example.HerbalLife.service;

import java.util.List;

import com.example.HerbalLife.entity.Review;

public interface ReviewService {

    Review addReview(Review review);

    List<Review> getReviewsByProduct(int pid);

    double getAverageRating(int pid);

}
