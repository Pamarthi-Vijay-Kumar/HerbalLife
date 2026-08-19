package com.example.HerbalLife.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.HerbalLife.entity.Coupon;

public interface CouponRepository extends MongoRepository<Coupon, String> {

    Coupon findByCodeIgnoreCase(String code);

}
