package hr.riteh.dominik.RWAproject.shop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class ShopApplication {

	public static void main(String[] args) {
		SpringApplication.run(ShopApplication.class, args);
	}


	@GetMapping("/")
	public String apiRoot(){
		return "https://www.youtube.com/watch?v=5PdEmeopJVQ" + " " + "https://www.mongodb.com/compatibility/spring-boot";
	}
}
