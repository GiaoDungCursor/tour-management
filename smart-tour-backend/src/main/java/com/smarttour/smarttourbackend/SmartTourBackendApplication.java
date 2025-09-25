package com.smarttour.smarttourbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableAsync
@EnableScheduling
public class SmartTourBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartTourBackendApplication.class, args);
    }

}
