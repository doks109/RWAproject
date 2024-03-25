package hr.riteh.dominik.RWAproject.shop.repository;

import hr.riteh.dominik.RWAproject.shop.model.CartItem;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CartItemRepository extends MongoRepository<CartItem, String> {
}
