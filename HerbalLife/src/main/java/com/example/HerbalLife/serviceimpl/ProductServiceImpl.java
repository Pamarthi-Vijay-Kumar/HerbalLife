package com.example.HerbalLife.serviceimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.HerbalLife.entity.ProtineProducts;
import com.example.HerbalLife.repository.ProtineProductsRepository;
import com.example.HerbalLife.service.ProductService;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProtineProductsRepository repository;

    @Override
    public ProtineProducts saveProduct(ProtineProducts product) {
        return repository.save(product);
    }

    @Override
    public List<ProtineProducts> getAllProducts() {
        return repository.findAll();
    }

    @Override
    public ProtineProducts getProduct(int pid) {
        return repository.findByPid(pid);
    }

    @Override
    public ProtineProducts updateProduct(ProtineProducts product) {

        ProtineProducts existing = repository.findByPid(product.getPid());

        if (existing != null) {

            product.setId(existing.getId());

            return repository.save(product);

        }

        return null;
    }

    @Override
    public void deleteProduct(int pid) {

        ProtineProducts product = repository.findByPid(pid);

        if (product != null) {
            repository.delete(product);
        }

    }

    @Override
    public List<ProtineProducts> getRelatedProducts(int pid) {

        ProtineProducts current = repository.findByPid(pid);

        if (current == null || current.getCategory() == null || current.getCategory().isEmpty()) {
            return new java.util.ArrayList<>();
        }

        List<ProtineProducts> sameCategory = repository.findByCategory(current.getCategory());

        List<ProtineProducts> related = new java.util.ArrayList<>();

        for (ProtineProducts p : sameCategory) {

            if (p.getPid() != pid) {
                related.add(p);
            }

            if (related.size() >= 4) {
                break;
            }

        }

        return related;

    }

    @Override
    public boolean decrementStock(int pid, int quantity) {

        ProtineProducts product = repository.findByPid(pid);

        if (product == null) {
            return false;
        }

        int newStock = product.getStock() - quantity;

        product.setStock(Math.max(newStock, 0));

        repository.save(product);

        return true;

    }

}