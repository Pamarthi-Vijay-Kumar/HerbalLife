package com.example.HerbalLife.serviceimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.HerbalLife.entity.Cart;
import com.example.HerbalLife.repository.CartRepository;
import com.example.HerbalLife.service.CartService;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository repository;

    @Override
    public Cart addToCart(Cart cart) {

        // Check if the product already exists in the cart
    	Cart existingCart = repository.findByPidAndEmail(
    	        cart.getPid(),
    	        cart.getEmail()
    	);

        if (existingCart != null) {

            // Increase quantity
            existingCart.setQuantity(existingCart.getQuantity() + cart.getQuantity());

            return repository.save(existingCart);
        }

        // New product
        return repository.save(cart);
    }

    @Override
    public List<Cart> getCart(String email) {

        return repository.findByEmail(email);

    }

    @Override
    public void deleteCart(String id) {
        repository.deleteById(id);
    }

    @Override
    public Cart updateQuantity(String id, int quantity) {

        Cart cart = repository.findById(id).orElse(null);

        if (cart == null) {
            return null;
        }

        if (quantity < 1) {
            repository.deleteById(id);
            return null;
        }

        cart.setQuantity(quantity);

        return repository.save(cart);

    }

}