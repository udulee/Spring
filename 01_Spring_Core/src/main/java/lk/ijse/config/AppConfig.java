package lk.ijse.config;

import lk.ijse.bean.MyConnection;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan(basePackages = {"lk.ijse.bean", "lk.ijse.newTestBean"})
//@ComponentScan(basePackageClasses = NewTestBean.class)
public class AppConfig {

    public AppConfig() {
        System.out.println("AppConfig");
    }

    @Bean("connection")
    MyConnection myConnection() {
        return new MyConnection();
    }
}
