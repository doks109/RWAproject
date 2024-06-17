package hr.riteh.dominik.RWAproject.shop.repository;

import hr.riteh.dominik.RWAproject.shop.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface OrderRepository extends MongoRepository<Order, String> {
}
