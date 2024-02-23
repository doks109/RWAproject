package hr.riteh.dominik.RWAproject.shop.controller;

import hr.riteh.dominik.RWAproject.shop.model.Post;
import hr.riteh.dominik.RWAproject.shop.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("http://localhost:3000/")
public class PostsController {

    @Autowired
    PostRepository repo;
    @GetMapping("/posts")
    public ResponseEntity<List<Post>> getAllPosts(@RequestParam(name = "numberOfPosts", required = false) Integer numberOfPosts){
        List<Post> posts;

        if(numberOfPosts != null) {
            PageRequest limit = PageRequest.of(0, numberOfPosts);
            posts = repo.findAll(limit).getContent();
            return new ResponseEntity<>(posts, HttpStatus.OK);
        }

        posts = repo.findAll();
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/posts/{id}")
    public ResponseEntity<Optional<Post>> getSinglePost(@PathVariable String id){
        return new ResponseEntity<>(repo.findById(id), HttpStatus.OK);
    }

    @PostMapping("/addPost")
    public HttpStatus addPost(@RequestBody Post newPost){
        repo.save(newPost);
        return HttpStatus.CREATED;
    }

    @DeleteMapping("/post/{id}")
    public HttpStatus deleteContact(@PathVariable String id) {

        if (!repo.existsById(id)) {
            return HttpStatus.BAD_REQUEST;
        }

        repo.deleteById(id);
        return HttpStatus.OK;
    }
    @PatchMapping("/posts/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable String id, @RequestBody Post updatedPost) {
        Optional<Post> optionalPost = repo.findById(id);

        if (optionalPost.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Post existingPost = optionalPost.get();
        existingPost.setIme(updatedPost.getIme());
        existingPost.setKategorija(updatedPost.getKategorija());
        existingPost.setOpis(updatedPost.getOpis());
        existingPost.setCijena(updatedPost.getCijena());
        existingPost.setRaspolozivo(updatedPost.isRaspolozivo());
        existingPost.setPutanjaSlike(updatedPost.getPutanjaSlike());

        repo.save(existingPost);

        return ResponseEntity.ok(existingPost);
    }
}
