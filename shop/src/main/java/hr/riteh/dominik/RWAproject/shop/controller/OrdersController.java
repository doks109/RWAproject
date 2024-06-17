package hr.riteh.dominik.RWAproject.shop.controller;

import hr.riteh.dominik.RWAproject.shop.model.*;
import hr.riteh.dominik.RWAproject.shop.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.*;

@RestController
@CrossOrigin("http://localhost:3000/")
public class OrdersController {
    @Autowired
    OrderRepository orderRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    CartRepository cartRepository;
    @Autowired
    CartItemRepository cartItemRepository;
    @Autowired
    PostRepository postRepository;

    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/getUserOrders/{userId}")
    public ResponseEntity<List<Order>> getUserOrdersWithPrices(@PathVariable String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        User currentUser = userOptional.get();
        List<Order> ordersWithPrices = new ArrayList<>();

        for (String orderId : currentUser.orders) {
            Optional<Order> orderOptional = orderRepository.findById(orderId);
            orderOptional.ifPresent(ordersWithPrices::add);
        }
        return new ResponseEntity<>(ordersWithPrices, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/getAllOrders")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders;
        List<Order> activeOrders = new ArrayList<>();
        orders = orderRepository.findAll();
        for(Order order : orders){
            if(!order.isFinished()){
                activeOrders.add(order);
            }
        }

        return new ResponseEntity<>(activeOrders, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/getFinishedOrders")
    public ResponseEntity<List<Order>> getFinishedOrders() {
        List<Order> orders;
        List<Order> activeOrders = new ArrayList<>();
        orders = orderRepository.findAll();
        for(Order order : orders){
            if(order.isFinished()){
                activeOrders.add(order);
            }
        }

        return new ResponseEntity<>(activeOrders, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ROLE_USER')")
    @PostMapping("/placeOrder/{userId}")
    public ResponseEntity<Order> placeOrder(@PathVariable String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        User currentUser = userOptional.get();
        Optional<Cart> cart = cartRepository.findById(currentUser.cartId);
        Cart currentCart = cart.get();

        if(currentCart.getUkupnaCijena() == 0){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else{
            Order order = new Order();
            order.setCartId(currentCart.getId());
            order.setDate(new Timestamp(System.currentTimeMillis()));
            order.setPrice(currentCart.getUkupnaCijena());
            order.setFinished(false);
            order.setCustomerName(currentUser.getName());
            order.setCustomerSurname(currentUser.getSurname());
            order.setCustomerAddress(currentUser.getAddress());

            Order savedOrder = orderRepository.save(order);

            currentUser.orders.add(savedOrder.getId());
            userRepository.save(currentUser);

            Cart newCart = new Cart();
            cartRepository.save(newCart);
            currentUser.setCartId(newCart.getId());
            userRepository.save(currentUser);

            return new ResponseEntity<>(savedOrder, HttpStatus.CREATED);
        }
    }
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/confirmOrder/{orderId}")
    public ResponseEntity<String> confirmOrder(@PathVariable String orderId) {
        try {
            Optional<Order> order = orderRepository.findById(orderId);
            Order currentOrder = order.get();
            String currentCartId = currentOrder.getCartId();
            List<CartItem> cartItem = cartItemRepository.findAll();
            for (CartItem item : cartItem) {
                if(item.getCartId().equals(currentCartId)){
                    item.setKupljeno(true);
                    cartItemRepository.save(item);
                }
            }
            currentOrder.setFinished(true);
            orderRepository.save(currentOrder);
        }
        catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok("Uspješno potvrđeno !");
    }


    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/mostSoldItems")
    public ResponseEntity<List<Post>> getMostSoldItems() {
        List<CartItem> cartItems = cartItemRepository.findAll();

        if (cartItems.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        Map<String, Integer> itemSales = new HashMap<>();
        for (CartItem cartItem : cartItems) {
            if (cartItem.isKupljeno()) {
                itemSales.put(cartItem.getItemId(), itemSales.getOrDefault(cartItem.getItemId(), 0) + cartItem.getKolicina());
            }
        }

        if (itemSales.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        Optional<Map.Entry<String, Integer>> mostSoldItemEntry = itemSales.entrySet().stream()
                .max(Map.Entry.comparingByValue());

        if (mostSoldItemEntry.isPresent()) {
            String mostSoldItemId = mostSoldItemEntry.get().getKey();
            Optional<Post> mostSoldPost = postRepository.findById(mostSoldItemId);
            if (mostSoldPost.isPresent()) {
                return ResponseEntity.ok(Collections.singletonList(mostSoldPost.get()));
            } else {
                return ResponseEntity.noContent().build();
            }
        } else {
            return ResponseEntity.noContent().build();
        }
    }
    @GetMapping("/mostSoldItemCount")
    public ResponseEntity<Integer> getMostSoldItemCount() {
        List<CartItem> cartItems = cartItemRepository.findAll();

        Map<String, Integer> itemSales = new HashMap<>();
        for (CartItem cartItem : cartItems) {
            if (cartItem.isKupljeno()) {
                itemSales.put(cartItem.getItemId(), itemSales.getOrDefault(cartItem.getItemId(), 0) + cartItem.getKolicina());
            }
        }

        Optional<Map.Entry<String, Integer>> mostSoldItemEntry = itemSales.entrySet().stream().max(Map.Entry.comparingByValue());

        return mostSoldItemEntry.map(entry -> ResponseEntity.ok(entry.getValue())).orElseGet(() -> ResponseEntity.ok(0));
    }
}
