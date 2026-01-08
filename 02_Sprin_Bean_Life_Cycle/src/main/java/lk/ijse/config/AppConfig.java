package lk.ijse.config;

import lk.ijse.bean.SpringBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan("lk.ijse.bean")

public class AppConfig {

    public AppConfig(){
        System.out.println("AppConfig");
    }
    @Bean
    SpringBean springBean(){
        return new SpringBean();
    }
}
