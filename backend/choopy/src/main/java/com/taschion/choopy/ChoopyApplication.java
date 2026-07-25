package com.taschion.choopy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ChoopyApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChoopyApplication.class, args);
	}

}
