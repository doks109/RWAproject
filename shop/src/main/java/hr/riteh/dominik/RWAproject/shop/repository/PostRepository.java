package hr.riteh.dominik.RWAproject.shop.repository;

import hr.riteh.dominik.RWAproject.shop.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PostRepository extends MongoRepository<Post, String> {

}
