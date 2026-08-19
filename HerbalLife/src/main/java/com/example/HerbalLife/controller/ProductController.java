package com.example.HerbalLife.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.HerbalLife.entity.ProtineProducts;
import com.example.HerbalLife.service.ProductService;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductService service;

    // Add Product
    @PostMapping
    public ResponseEntity<ProtineProducts> save(@RequestBody ProtineProducts product) {

        return ResponseEntity.ok(service.saveProduct(product));

    }

    // Get All Products
    @GetMapping
    public ResponseEntity<List<ProtineProducts>> getAll() {

        return ResponseEntity.ok(service.getAllProducts());

    }

    // Get Product By PID
    @GetMapping("/{pid}")
    public ResponseEntity<ProtineProducts> getById(@PathVariable int pid) {

        ProtineProducts product = service.getProduct(pid);

        if (product == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(product);

    }

    // Update Product
    @PutMapping("/{pid}")
    public ResponseEntity<ProtineProducts> update(@PathVariable int pid,
                                                  @RequestBody ProtineProducts product) {

        product.setPid(pid);

        ProtineProducts updated = service.updateProduct(product);

        if (updated == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updated);

    }

    // Delete Product
    @DeleteMapping("/{pid}")
    public ResponseEntity<String> delete(@PathVariable int pid) {

        service.deleteProduct(pid);

        return ResponseEntity.ok("Product Deleted Successfully");

    }

    // Related Products (same category, up to 4)
    @GetMapping("/related/{pid}")
    public ResponseEntity<List<ProtineProducts>> getRelated(@PathVariable int pid) {

        return ResponseEntity.ok(service.getRelatedProducts(pid));

    }

}