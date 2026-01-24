package lk.ijse.config;

import lk.ijse.bean.A;
import lk.ijse.bean.B;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig01 {
    public AppConfig01() {
        System.out.println("AppConfig01 Constructor");
    }
    @Bean
    public A a(){
        return new A();
    }
    @Bean
    public B b(){
        return new B();
    }
}
