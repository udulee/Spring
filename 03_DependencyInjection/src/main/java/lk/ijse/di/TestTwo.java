package lk.ijse.di;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
public class TestTwo implements DI {
    @Override
    public void chat() {
        System.out.println("TestTwo chat");
    }
}