package com.example.HerbalLife.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.HerbalLife.entity.Order;
import com.example.HerbalLife.entity.ProtineProducts;
import com.example.HerbalLife.entity.User;
import com.example.HerbalLife.repository.OrderRepository;
import com.example.HerbalLife.repository.ProtineProductsRepository;
import com.example.HerbalLife.repository.UserRepository;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProtineProductsRepository productRepository;

    @GetMapping("/admin/dashboard-stats")
    public Map<String, Object> getStats() {

        List<Order> allOrders = orderRepository.findAll();

        List<Order> validOrders = new ArrayList<>();

        for (Order order : allOrders) {
            if (!"Cancelled".equals(order.getStatus())) {
                validOrders.add(order);
            }
        }

        // ---- Totals ----

        int totalRevenue = 0;

        for (Order order : validOrders) {
            totalRevenue += order.getTotalPrice();
        }

        Map<String, Object> stats = new HashMap<>();

        stats.put("totalRevenue", totalRevenue);
        stats.put("totalOrders", allOrders.size());
        stats.put("totalUsers", userRepository.count());
        stats.put("totalProducts", productRepository.count());

        // ---- Best Sellers (by quantity sold) ----

        Map<String, Integer> soldByProduct = new HashMap<>();

        for (Order order : validOrders) {

            String name = order.getPname();

            soldByProduct.put(name, soldByProduct.getOrDefault(name, 0) + order.getQuantity());

        }

        List<Map<String, Object>> bestSellers = new ArrayList<>();

        for (Map.Entry<String, Integer> entry : soldByProduct.entrySet()) {

            Map<String, Object> item = new HashMap<>();
            item.put("name", entry.getKey());
            item.put("sold", entry.getValue());

            bestSellers.add(item);

        }

        bestSellers.sort((a, b) -> (int) b.get("sold") - (int) a.get("sold"));

        if (bestSellers.size() > 5) {
            bestSellers = bestSellers.subList(0, 5);
        }

        stats.put("bestSellers", bestSellers);

        // ---- Revenue Trend (last 7 days) ----

        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;

        Map<String, Integer> revenueByDay = new LinkedHashMap<>();

        LocalDate today = LocalDate.now();

        for (int i = 6; i >= 0; i--) {
            revenueByDay.put(today.minusDays(i).format(formatter), 0);
        }

        for (Order order : validOrders) {

            String date = order.getOrderDate();

            if (date != null && revenueByDay.containsKey(date)) {
                revenueByDay.put(date, revenueByDay.get(date) + order.getTotalPrice());
            }

        }

        List<Map<String, Object>> revenueTrend = new ArrayList<>();

        for (Map.Entry<String, Integer> entry : revenueByDay.entrySet()) {

            Map<String, Object> point = new HashMap<>();
            point.put("date", entry.getKey());
            point.put("revenue", entry.getValue());

            revenueTrend.add(point);

        }

        stats.put("revenueTrend", revenueTrend);

        // ---- Low Stock Products (stock <= 5) ----

        List<ProtineProducts> allProducts = productRepository.findAll();

        List<Map<String, Object>> lowStock = new ArrayList<>();

        for (ProtineProducts product : allProducts) {

            if (product.getStock() <= 5) {

                Map<String, Object> item = new HashMap<>();
                item.put("pname", product.getPname());
                item.put("stock", product.getStock());

                lowStock.add(item);

            }

        }

        stats.put("lowStock", lowStock);

        return stats;

    }

}
