package com.example.HerbalLife.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.HerbalLife.entity.Review;

public interface ReviewRepository extends MongoRepository<Review, String> {

    List<Review> findByPid(int pid);

}
