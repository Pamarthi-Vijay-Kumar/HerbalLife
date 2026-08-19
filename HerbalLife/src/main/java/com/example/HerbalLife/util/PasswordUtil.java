package com.example.HerbalLife.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Simple SHA-256 password hashing.
 * NOTE: for production use, prefer BCrypt (spring-security-crypto),
 * which adds per-password salting and is designed to be slow.
 * SHA-256 is used here to avoid adding a new Maven dependency,
 * since this environment does not have network access to
 * resolve one.
 */
public class PasswordUtil {

    private static final String SALT = "HerbalLife-Static-Salt";

    public static String hash(String rawPassword) {

        try {

            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            byte[] hashBytes = digest.digest(
                (SALT + rawPassword).getBytes("UTF-8")
            );

            StringBuilder sb = new StringBuilder();

            for (byte b : hashBytes) {

                // Mask to an unsigned 0-255 value before converting to hex.
                // Without this mask, negative byte values (anything >= 0x80,
                // roughly half of all SHA-256 output bytes) can be
                // sign-extended by the formatter, corrupting the hash.
                int unsigned = b & 0xff;

                if (unsigned < 16) {
                    sb.append('0');
                }

                sb.append(Integer.toHexString(unsigned));

            }

            return sb.toString();

        } catch (NoSuchAlgorithmException | java.io.UnsupportedEncodingException e) {
            throw new RuntimeException("Password hashing failed", e);
        }

    }

    public static boolean matches(String rawPassword, String hashedPassword) {
        return hash(rawPassword).equals(hashedPassword);
    }

}
