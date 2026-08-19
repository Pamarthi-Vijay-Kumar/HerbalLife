package com.example.HerbalLife.serviceimpl;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.HerbalLife.entity.Review;
import com.example.HerbalLife.repository.ReviewRepository;
import com.example.HerbalLife.service.ReviewService;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository repository;

    @Override
    public Review addReview(Review review) {

        review.setDate(LocalDate.now().toString());

        return repository.save(review);
    }

    @Override
    public List<Review> getReviewsByProduct(int pid) {

        List<Review> reviews = repository.findByPid(pid);

        reviews.sort(Comparator.comparing(Review::getDate).reversed());

        return reviews;
    }

    @Override
    public double getAverageRating(int pid) {

        List<Review> reviews = repository.findByPid(pid);

        if (reviews.isEmpty()) {
            return 0;
        }

        double sum = 0;

        for (Review review : reviews) {
            sum += review.getRating();
        }

        return Math.round((sum / reviews.size()) * 10.0) / 10.0;
    }

}
