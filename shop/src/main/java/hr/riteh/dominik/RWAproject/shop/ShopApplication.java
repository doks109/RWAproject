package hr.riteh.dominik.RWAproject.shop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;

@SpringBootApplication
public class ShopApplication {

	@RequestMapping("/")
	public static void main(String[] args) {
		SpringApplication.run(ShopApplication.class, args);
	}
}
