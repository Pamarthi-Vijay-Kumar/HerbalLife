package com.example.HerbalLife.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.HerbalLife.entity.User;
import com.example.HerbalLife.repository.UserRepository;
import com.example.HerbalLife.util.PasswordUtil;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class UserController {
	
		@Autowired
		public UserRepository repository;
	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody User user){

	    if(repository.existsByEmail(user.getEmail())){
	        return ResponseEntity.badRequest().body("Email already exists");
	    }
	    user.setRole("USER");
	    user.setBlocked(false);
	    user.setPassword(PasswordUtil.hash(user.getPassword()));
	    repository.save(user);

	    return ResponseEntity.ok("Registration Successful");
	}
	
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody User user) {

	    User dbUser = repository.findByEmail(user.getEmail());

	    if (dbUser == null) {
	        return ResponseEntity.badRequest().body("Email not found");
	    }

	    if (!verifyAndUpgradePassword(user.getPassword(), dbUser)) {
	        return ResponseEntity.badRequest().body("Incorrect Password");
	    }

	    if (dbUser.isBlocked()) {
	        return ResponseEntity.status(403).body("This account has been blocked. Please contact support.");
	    }

	    // Return complete user object (password hash omitted)
	    dbUser.setPassword(null);

	    return ResponseEntity.ok(dbUser);

	}

	/**
	 * Checks a raw password against a stored value that may be either a
	 * SHA-256 hash (64 hex characters, the current format) or plain text
	 * (accounts created before hashing was introduced). On a successful
	 * legacy plain-text match, the stored password is silently re-saved
	 * as a proper hash so the account is upgraded going forward.
	 */
	private boolean verifyAndUpgradePassword(String rawPassword, User dbUser) {

	    String stored = dbUser.getPassword();

	    if (stored == null || rawPassword == null) {
	        return false;
	    }

	    boolean looksHashed = stored.length() == 64 && stored.matches("[0-9a-f]+");

	    if (looksHashed) {
	        return PasswordUtil.matches(rawPassword, stored);
	    }

	    // Legacy plain-text account
	    boolean matchesLegacy = stored.equals(rawPassword);

	    if (matchesLegacy) {
	        dbUser.setPassword(PasswordUtil.hash(rawPassword));
	        repository.save(dbUser);
	    }

	    return matchesLegacy;

	}

	// ===== Admin: user management =====

	@GetMapping("/users/all")
	public List<User> getAllUsers() {

	    List<User> users = repository.findAll();

	    // Never send password hashes to the client
	    users.forEach(u -> u.setPassword(null));

	    return users;

	}

	@PutMapping("/users/{id}/role")
	public ResponseEntity<?> updateRole(@PathVariable String id, @RequestBody java.util.Map<String, String> body) {

	    User user = repository.findById(id).orElse(null);

	    if (user == null) {
	        return ResponseEntity.notFound().build();
	    }

	    user.setRole(body.get("role"));
	    repository.save(user);

	    user.setPassword(null);

	    return ResponseEntity.ok(user);

	}

	@PutMapping("/users/{id}/block")
	public ResponseEntity<?> toggleBlock(@PathVariable String id, @RequestBody java.util.Map<String, Boolean> body) {

	    User user = repository.findById(id).orElse(null);

	    if (user == null) {
	        return ResponseEntity.notFound().build();
	    }

	    user.setBlocked(body.get("blocked"));
	    repository.save(user);

	    user.setPassword(null);

	    return ResponseEntity.ok(user);

	}

	@DeleteMapping("/users/{id}")
	public ResponseEntity<?> deleteUser(@PathVariable String id) {

	    repository.deleteById(id);

	    return ResponseEntity.ok("User Deleted");

	}

	// ===== Profile (used by both regular users and admins) =====

	@GetMapping("/profile/{email}")
	public ResponseEntity<?> getProfile(@PathVariable String email) {

	    User user = repository.findByEmail(email);

	    if (user == null) {
	        return ResponseEntity.notFound().build();
	    }

	    user.setPassword(null);

	    return ResponseEntity.ok(user);

	}

	@PutMapping("/profile/{email}")
	public ResponseEntity<?> updateProfile(@PathVariable String email, @RequestBody User update) {

	    User user = repository.findByEmail(email);

	    if (user == null) {
	        return ResponseEntity.notFound().build();
	    }

	    if (update.getName() != null && !update.getName().isEmpty()) {
	        user.setName(update.getName());
	    }

	    if (update.getMobile() != null && !update.getMobile().isEmpty()) {
	        user.setMobile(update.getMobile());
	    }

	    if (update.getDob() != null && !update.getDob().isEmpty()) {
	        user.setDob(update.getDob());
	    }

	    repository.save(user);

	    user.setPassword(null);

	    return ResponseEntity.ok(user);

	}

	@PutMapping("/profile/{email}/password")
	public ResponseEntity<?> changePassword(@PathVariable String email, @RequestBody java.util.Map<String, String> body) {

	    User user = repository.findByEmail(email);

	    if (user == null) {
	        return ResponseEntity.notFound().build();
	    }

	    String currentPassword = body.get("currentPassword");
	    String newPassword = body.get("newPassword");

	    if (!verifyAndUpgradePassword(currentPassword, user)) {
	        return ResponseEntity.badRequest().body("Current Password Is Incorrect");
	    }

	    if (newPassword == null || newPassword.length() < 4) {
	        return ResponseEntity.badRequest().body("New Password Must Be At Least 4 Characters");
	    }

	    user.setPassword(PasswordUtil.hash(newPassword));

	    repository.save(user);

	    return ResponseEntity.ok("Password Updated Successfully");

	}

}
