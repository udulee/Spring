package lk.ijse.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan(basePackages = "lk.ijse.bean")
public class AppConfig {
    //Full mode
    /*@Bean
    public SpringBeanOne springBeanOne(){
        //inter-bean dependency
        SpringBeanTwo springBeanTwo1 = springBeanTwo();
        SpringBeanTwo springBeanTwo2 = springBeanTwo();
        System.out.println(springBeanTwo1);
        System.out.println(springBeanTwo2);
        return new SpringBeanOne();
    }
    @Bean
    public SpringBeanTwo springBeanTwo(){
        return new SpringBeanTwo();
    }*/
}