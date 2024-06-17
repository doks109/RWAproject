package hr.riteh.dominik.RWAproject.shop.repository;

import hr.riteh.dominik.RWAproject.shop.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    Optional<User> findByUsername(String username);

}
