package lk.ijse.bean;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component("exampleBean")
@Scope("prototype")
//@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class TestBean {
    public  TestBean() {
        System.out.println("TestBean is created");
    }
    public void printMessage() {
        System.out.println("printMessage method called");
    }
}
