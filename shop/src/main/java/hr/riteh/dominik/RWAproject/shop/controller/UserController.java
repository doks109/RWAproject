package hr.riteh.dominik.RWAproject.shop.controller;

import hr.riteh.dominik.RWAproject.shop.model.User;
import hr.riteh.dominik.RWAproject.shop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin("http://localhost:3000/")
public class UserController {
    @Autowired
    UserRepository userRepository;

    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable String userId) {
        try {
            Optional<User> user = userRepository.findById(userId);
            User currentUser = user.get();
            return ResponseEntity.ok(currentUser);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @PreAuthorize("hasRole('ROLE_USER')")
    @PatchMapping("/userInfo/{userId}")
    public ResponseEntity<String> additionalUserInfo(@PathVariable String userId, @RequestBody User updatedUser) {
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                user.setName(updatedUser.getName());
                user.setSurname(updatedUser.getSurname());
                user.setAddress(updatedUser.getAddress());
                userRepository.save(user);
                return ResponseEntity.ok("Uspješno dodano!");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Greška kod dodavanja.");
        }
    }
}
