package com.example.HerbalLife.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Visit http://localhost:8082/status in your browser after starting the
 * backend. If the "build" value below doesn't match what you expect, the
 * running backend is NOT the code you think it is — usually a stale
 * target/ folder, an old jar, or an old process still holding port 8082.
 */
@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class StatusController {

    @GetMapping("/status")
    public Map<String, Object> status() {

        Map<String, Object> info = new HashMap<>();

        info.put("build", "2026-08-18-legacy-password-upgrade-and-payments");
        info.put("serverTime", LocalDateTime.now().toString());
        info.put("passwordHashingActive", true);
        info.put("legacyPasswordAutoUpgrade", true);

        return info;

    }

}
