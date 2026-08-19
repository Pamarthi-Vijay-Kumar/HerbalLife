package com.example.HerbalLife.service;

import java.util.List;

import com.example.HerbalLife.entity.ProtineProducts;

public interface ProductService {

    ProtineProducts saveProduct(ProtineProducts product);

    List<ProtineProducts> getAllProducts();

    ProtineProducts getProduct(int pid);

    ProtineProducts updateProduct(ProtineProducts product);

    void deleteProduct(int pid);

    List<ProtineProducts> getRelatedProducts(int pid);

    boolean decrementStock(int pid, int quantity);

}