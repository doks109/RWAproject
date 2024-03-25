package hr.riteh.dominik.RWAproject.shop.repository;

import hr.riteh.dominik.RWAproject.shop.model.Cart;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CartRepository extends MongoRepository<Cart, String> {
}
