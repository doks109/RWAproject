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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("http://localhost:3000/")
public class ItemsController {
    @Autowired
    UserRepository userRepository;
    @Autowired
    CartRepository cartRepository;
    @Autowired
    CartItemRepository cartItemRepository;
    @Autowired
    PostRepository postRepository;

    @PreAuthorize("hasRole('ROLE_USER')")
    @PostMapping("/addItem/{id}/{kolicina}/{cijena}")
    public ResponseEntity<String> addItemToCart(@PathVariable String id, @PathVariable int kolicina, @PathVariable double cijena, @RequestBody String userId) {
        Optional<User> user = userRepository.findById(userId);
        User currentUser = user.get();
        CartItem cartItem = new CartItem();
        Optional<Post> post = postRepository.findById(id);
        Post currentPost = post.get();

        if (currentPost.getRaspolozivo() > 0) {
            Optional<Cart> cart = cartRepository.findById(currentUser.cartId);
            Cart currentCart = cart.get();
            cartItem.setItemId(id);
            cartItem.setCartId(currentUser.cartId);
            cartItem.setKolicina(kolicina);
            currentCart.setUkupnaCijena(currentCart.getUkupnaCijena() + cijena);
            currentPost.setRaspolozivo(currentPost.getRaspolozivo() - kolicina);
            userRepository.save(currentUser);
            cartRepository.save(currentCart);
            cartItemRepository.save(cartItem);
            postRepository.save(currentPost);
            return ResponseEntity.ok("Uspješna kupnja.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('ROLE_USER')")
    @DeleteMapping("/deleteItem/{userId}/{itemId}/{cijena}")
    public HttpStatus deleteItemFromCart(@PathVariable String userId, @PathVariable String itemId, @PathVariable double cijena) {
        try {
            Optional<Post> post = postRepository.findById(itemId);
            Post currentPost = post.get();
            Optional<User> user = userRepository.findById(userId);
            if (user.isPresent()) {
                User currentUser = user.get();
                if (currentUser.getCartId() != null) {
                    Optional<Cart> cart = cartRepository.findById(currentUser.cartId);
                    Cart currentCart = cart.get();
                    List<CartItem> cartItem = cartItemRepository.findAll();
                    for (CartItem c : cartItem) {
                        if (c.getItemId().equals(itemId) && c.getCartId().equals(currentCart.getId())) {
                            cartItemRepository.deleteById(c.getId());
                            currentCart.setUkupnaCijena(currentCart.getUkupnaCijena() - cijena);
                            cartRepository.save(currentCart);
                            currentPost.setRaspolozivo(currentPost.getRaspolozivo() + 1);
                            postRepository.save(currentPost);
                            return HttpStatus.OK;
                        }
                    }
                }
            }
            return HttpStatus.NOT_FOUND;
        } catch (Exception e) {
            e.printStackTrace();
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }

    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/userTotalPrice/{userId}")
    public ResponseEntity<Double> getUserTotalPrice(@PathVariable String userId) {
        Double totalPrice;
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isPresent()) {
                User currentUser = userOptional.get();
                if (currentUser.getCartId() != null) {
                    Optional<Cart> cartOptional = cartRepository.findById(currentUser.getCartId());
                    if (cartOptional.isPresent()) {
                        Cart currentCart = cartOptional.get();
                        totalPrice = currentCart.getUkupnaCijena();
                        return new ResponseEntity<>(totalPrice, HttpStatus.OK);
                    }
                }
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PreAuthorize("hasRole('ROLE_USER')")
    @DeleteMapping("/clearUserPosts/{userId}")
    public HttpStatus deleteUserPosts(@PathVariable String userId) {
        try {
            Optional<User> user = userRepository.findById(userId);
            if (user.isPresent()) {
                User currentUser = user.get();
                if (currentUser.getCartId() != null) {
                    Optional<Cart> cart = cartRepository.findById(currentUser.cartId);
                    Cart currentCart = cart.get();
                    List<CartItem> cartItem = cartItemRepository.findAll();
                    for (CartItem c : cartItem) {
                        if (c.getCartId().equals(currentCart.getId())) {
                            Optional<Post> post = postRepository.findById(c.getItemId());
                            Post currentPost = post.get();
                            cartItemRepository.deleteById(c.getId());
                            currentCart.setUkupnaCijena(0);
                            cartRepository.save(currentCart);
                            currentPost.setRaspolozivo(currentPost.getRaspolozivo() + 1);
                            postRepository.save(currentPost);
                        }
                    }
                    return HttpStatus.OK;
                }
            }
            return HttpStatus.NOT_FOUND;
        } catch (Exception e) {
            e.printStackTrace();
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }
}

