package com.example.HerbalLife.serviceimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.HerbalLife.entity.Order;
import com.example.HerbalLife.entity.ProtineProducts;
import com.example.HerbalLife.repository.OrderRepository;
import com.example.HerbalLife.service.EmailService;
import com.example.HerbalLife.service.OrderService;
import com.example.HerbalLife.service.ProductService;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository repository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ProductService productService;

    @Override
    public Order placeOrder(Order order) {

        ProtineProducts product = productService.getProduct(order.getPid());

        if (product == null || product.getStock() < order.getQuantity()) {
            // Out of stock / insufficient quantity available
            return null;
        }

        if (order.getStatus() == null || order.getStatus().isEmpty()) {
            order.setStatus("Placed");
        }

        order.setOrderDate(java.time.LocalDate.now().toString());

        Order saved = repository.save(order);

        productService.decrementStock(order.getPid(), order.getQuantity());

        emailService.sendOrderConfirmation(saved);

        return saved;
    }

    @Override
    public List<Order> getOrders(String email) {

        return repository.findByEmail(email);

    }

    @Override
    public List<Order> getAllOrders() {

        return repository.findAll();

    }

    @Override
    public Order updateStatus(String id, String status) {

        Order order = repository.findById(id).orElse(null);

        if (order == null) {
            return null;
        }

        order.setStatus(status);

        return repository.save(order);

    }

}