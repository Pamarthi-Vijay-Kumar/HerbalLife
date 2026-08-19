package com.example.HerbalLife.service;

import java.util.List;

import com.example.HerbalLife.entity.Wishlist;

public interface WishlistService {

    Wishlist addToWishlist(Wishlist wishlist);

    List<Wishlist> getWishlist(String email);

    void removeFromWishlist(int pid, String email);

    boolean isInWishlist(int pid, String email);

}
