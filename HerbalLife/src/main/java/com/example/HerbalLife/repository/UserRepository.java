package com.example.HerbalLife.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.HerbalLife.entity.User;

public interface UserRepository extends MongoRepository<User, String> {

    boolean existsByEmail(String email);

    User findByEmail(String email);

}