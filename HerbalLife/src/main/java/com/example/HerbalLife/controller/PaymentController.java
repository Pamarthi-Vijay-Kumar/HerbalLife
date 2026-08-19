package com.example.HerbalLife.controller;

import java.util.HashMap;
import java.util.Map;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/payment")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    // Create a Razorpay order. Amount is expected in RUPEES from the frontend;
    // Razorpay's API requires the smallest currency unit (paise), so it is
    // multiplied by 100 here.
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> body) {

        try {

            int amountInRupees = Integer.parseInt(body.get("amount").toString());

            Map<String, Object> payload = new HashMap<>();
            payload.put("amount", amountInRupees * 100);
            payload.put("currency", "INR");
            payload.put("payment_capture", 1);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBasicAuth(keyId, keySecret);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    "https://api.razorpay.com/v1/orders",
                    HttpMethod.POST,
                    request,
                    Map.class
            );

            Map<String, Object> result = new HashMap<>();
            result.put("orderId", response.getBody().get("id"));
            result.put("amount", response.getBody().get("amount"));
            result.put("currency", response.getBody().get("currency"));
            result.put("keyId", keyId);

            return ResponseEntity.ok(result);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.status(500).body(
                    "Failed to create Razorpay order: " + e.getMessage()
            );

        }

    }

    // Verify the signature Razorpay sends back after a successful payment.
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> body) {

        try {

            String orderId = body.get("razorpay_order_id");
            String paymentId = body.get("razorpay_payment_id");
            String signature = body.get("razorpay_signature");

            String payload = orderId + "|" + paymentId;

            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(keySecret.getBytes("UTF-8"), "HmacSHA256"));

            byte[] hashBytes = mac.doFinal(payload.getBytes("UTF-8"));

            StringBuilder sb = new StringBuilder();
            for (byte b : hashBytes) {
                int unsigned = b & 0xff;
                if (unsigned < 16) {
                    sb.append('0');
                }
                sb.append(Integer.toHexString(unsigned));
            }

            boolean valid = sb.toString().equals(signature);

            Map<String, Object> result = new HashMap<>();
            result.put("valid", valid);

            return ResponseEntity.ok(result);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.status(500).body(
                    "Verification failed: " + e.getMessage()
            );

        }

    }

}
