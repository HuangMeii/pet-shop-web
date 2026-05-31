package com.funcoders.happy_pet_shop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class HappyPetShopApplication {

	public static void main(String[] args) {
		SpringApplication.run(HappyPetShopApplication.class, args);
	}

}
