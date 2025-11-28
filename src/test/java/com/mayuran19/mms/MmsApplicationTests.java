package com.mayuran19.mms;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
class MmsApplicationTests {

    @Test
    void contextLoads() {
    }

}
