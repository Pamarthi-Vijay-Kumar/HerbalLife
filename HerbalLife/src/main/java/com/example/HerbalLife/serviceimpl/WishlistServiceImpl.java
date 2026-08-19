package com.example.HerbalLife.serviceimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.HerbalLife.entity.Wishlist;
import com.example.HerbalLife.repository.WishlistRepository;
import com.example.HerbalLife.service.WishlistService;

@Service
public class WishlistServiceImpl implements WishlistService {

    @Autowired
    private WishlistRepository repository;

    @Override
    public Wishlist addToWishlist(Wishlist wishlist) {

        Wishlist existing = repository.findByPidAndEmail(
                wishlist.getPid(),
                wishlist.getEmail()
        );

        if (existing != null) {
            return existing;
        }

        return repository.save(wishlist);

    }

    @Override
    public List<Wishlist> getWishlist(String email) {

        return repository.findByEmail(email);

    }

    @Override
    public void removeFromWishlist(int pid, String email) {

        repository.deleteByPidAndEmail(pid, email);

    }

    @Override
    public boolean isInWishlist(int pid, String email) {

        return repository.findByPidAndEmail(pid, email) != null;

    }

}
