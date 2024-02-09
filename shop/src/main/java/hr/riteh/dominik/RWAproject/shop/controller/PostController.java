package hr.riteh.dominik.RWAproject.shop.controller;

import hr.riteh.dominik.RWAproject.shop.model.Post;
import hr.riteh.dominik.RWAproject.shop.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PostController {

    @Autowired
    PostRepository repo;

    @PostMapping("/post")
    public Post addPost(@RequestBody Post post){
        return repo.save(post);
    }
}
