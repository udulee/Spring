package lk.ijse.bean;

import org.springframework.stereotype.Component;

@Component("exampleBean")
public class TestBean {

    public TestBean(){
        System.out.println("Test Bean");
    }

    public void PrintMessage(){
        System.out.println("PrintMessage");
    }
}
