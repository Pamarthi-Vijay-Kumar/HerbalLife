package com.example.HerbalLife.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.HerbalLife.entity.ProtineProducts;

public interface ProtineProductsRepository extends MongoRepository<ProtineProducts, String> {

    ProtineProducts findByPid(int pid);

    void deleteByPid(int pid);

    List<ProtineProducts> findByCategory(String category);

}