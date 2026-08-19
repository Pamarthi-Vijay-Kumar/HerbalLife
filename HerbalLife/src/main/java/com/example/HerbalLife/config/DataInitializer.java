package com.example.HerbalLife.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.HerbalLife.entity.User;
import com.example.HerbalLife.repository.UserRepository;
import com.example.HerbalLife.util.PasswordUtil;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) {

        String adminEmail = "admin@herballife.com";

        if (!userRepository.existsByEmail(adminEmail)) {

            User admin = new User();

            admin.setName("Administrator");
            admin.setEmail(adminEmail);
            admin.setMobile("0000000000");
            admin.setDob("");
            admin.setPassword(PasswordUtil.hash("admin123"));
            admin.setRole("ADMIN");

            userRepository.save(admin);

            System.out.println("Default admin account created: " + adminEmail + " / admin123");

        }

    }

}
