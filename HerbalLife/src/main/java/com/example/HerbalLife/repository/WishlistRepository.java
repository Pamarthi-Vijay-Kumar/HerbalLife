package com.example.HerbalLife.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.HerbalLife.entity.Wishlist;

public interface WishlistRepository extends MongoRepository<Wishlist, String> {

    List<Wishlist> findByEmail(String email);

    Wishlist findByPidAndEmail(int pid, String email);

    void deleteByPidAndEmail(int pid, String email);

}
