package lk.ijse.bean;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
public class SpringBean03 {
    //light mode
    @Bean
    public SpringBean01 springBean01(){
        //inter-bean dependency - not satisfied
        SpringBean02 springBeanTwo1 = new SpringBean02();
        SpringBean02 springBeanTwo2 = new SpringBean02();
        System.out.println(springBeanTwo1);
        System.out.println(springBeanTwo2);
        return new SpringBean01();
    }
    @Bean
    public SpringBean02 springBean02(){
        return new SpringBean02();
    }
}