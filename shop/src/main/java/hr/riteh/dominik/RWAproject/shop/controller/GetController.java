package hr.riteh.dominik.RWAproject.shop.controller;

import hr.riteh.dominik.RWAproject.shop.model.Post;
import hr.riteh.dominik.RWAproject.shop.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("http://localhost:3000/")
public class GetController {

    @Autowired
    PostRepository repo;
    @GetMapping("/posts")
    public ResponseEntity<List<Post>> getAllPosts(){
        List<Post> posts = repo.findAll();

        for(Post post : posts){
            if(post.getCijena() > 190){
                System.out.println(post.getIme() + " na stanju");
            }
        }

        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/posts/{id}")
    public ResponseEntity<Optional<Post>> getSinglePost(@PathVariable String id){
        return new ResponseEntity<Optional<Post>>(repo.findById(id), HttpStatus.OK);
    }
}
