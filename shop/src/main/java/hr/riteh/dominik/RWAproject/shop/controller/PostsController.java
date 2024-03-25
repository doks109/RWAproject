package hr.riteh.dominik.RWAproject.shop.controller;

import hr.riteh.dominik.RWAproject.shop.model.Cart;
import hr.riteh.dominik.RWAproject.shop.model.CartItem;
import hr.riteh.dominik.RWAproject.shop.model.Post;
import hr.riteh.dominik.RWAproject.shop.model.User;
import hr.riteh.dominik.RWAproject.shop.repository.CartItemRepository;
import hr.riteh.dominik.RWAproject.shop.repository.CartRepository;
import hr.riteh.dominik.RWAproject.shop.repository.PostRepository;
import hr.riteh.dominik.RWAproject.shop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("http://localhost:3000/")
public class PostsController {

    @Autowired
    PostRepository postRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    CartRepository cartRepository;
    @Autowired
    CartItemRepository cartItemRepository;

    @GetMapping("/posts")
    public ResponseEntity<List<Post>> getAllPosts(@RequestParam(name = "numberOfPosts", required = false) Integer numberOfPosts){
        List<Post> posts;

        if(numberOfPosts != null) {
            PageRequest limit = PageRequest.of(0, numberOfPosts);
            posts = postRepository.findAll(limit).getContent();
            return new ResponseEntity<>(posts, HttpStatus.OK);
        }

        posts = postRepository.findAll();
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }
    @GetMapping("/discount")
    public ResponseEntity<List<Post>> getDiscountPosts(){
        List<Post> posts;
        List<Post> filteredPosts = new ArrayList<>();

        posts = postRepository.findAll();
        for(Post post : posts){
            if(post.getPopust() >= 15){
                filteredPosts.add(post);
            }
        }

        return new ResponseEntity<>(filteredPosts, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/userPosts/{userId}")
    public ResponseEntity<List<Post>> getUserPosts(@PathVariable String userId) {
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isPresent()) {
                User currentUser = userOptional.get();
                if (currentUser.getCartId() != null) {
                    Optional<Cart> cartOptional = cartRepository.findById(currentUser.getCartId());
                    if (cartOptional.isPresent()) {
                        Cart currentCart = cartOptional.get();
                        List<Post> userPosts = new ArrayList<>();
                        List<CartItem> cartItems = cartItemRepository.findAll();
                        for (CartItem c : cartItems) {
                            if(c.getCartId().equals(currentCart.getId())){
                                Optional<Post> postOptional = postRepository.findById(c.getItemId());
                                postOptional.ifPresent(userPosts::add);
                            }
                        }
                        return new ResponseEntity<>(userPosts, HttpStatus.OK);
                    }
                }
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/posts/{id}")
    public ResponseEntity<Optional<Post>> getSinglePost(@PathVariable String id){
        return new ResponseEntity<>(postRepository.findById(id), HttpStatus.OK);
    }
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/addPost")
    public HttpStatus addPost(@RequestBody Post newPost){
        postRepository.save(newPost);
        return HttpStatus.CREATED;
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/post/{id}")
    public HttpStatus deletePost(@PathVariable String id) {

        if (!postRepository.existsById(id)) {
            return HttpStatus.BAD_REQUEST;
        }

        postRepository.deleteById(id);

        return HttpStatus.OK;
    }
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/posts/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable String id, @RequestBody Post updatedPost) {
        Optional<Post> optionalPost = postRepository.findById(id);

        if (optionalPost.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Post existingPost = optionalPost.get();
        existingPost.setIme(updatedPost.getIme());
        existingPost.setKategorija(updatedPost.getKategorija());
        existingPost.setOpis(updatedPost.getOpis());
        existingPost.setCijena(updatedPost.getCijena());
        existingPost.setPopust(updatedPost.getPopust());
        existingPost.setRaspolozivo(updatedPost.getRaspolozivo());
        existingPost.setPutanjaSlike(updatedPost.getPutanjaSlike());

        postRepository.save(existingPost);

        return ResponseEntity.ok(existingPost);
    }
}
