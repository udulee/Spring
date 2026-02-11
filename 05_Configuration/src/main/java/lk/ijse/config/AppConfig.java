package lk.ijse.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.ImportResource;

@Configuration
@ComponentScan(basePackages = "lk.ijse.bean")
@Import({AppConfig01.class,AppConfig02.class})
@ImportResource("classpath:hibernate.cfg.xml")
//@ImportResource("fill:C/hibernate.cfg.xml")
public class AppConfig {
    public AppConfig() {
        System.out.println("AppConfig Constructor");
    }
}
