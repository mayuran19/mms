package com.mayuran19.mms;

import org.springframework.boot.SpringApplication;

public class TestMmsApplication {

    public static void main(String[] args) {
        SpringApplication.from(MmsApplication::main).with(TestcontainersConfiguration.class).run(args);
    }

}
