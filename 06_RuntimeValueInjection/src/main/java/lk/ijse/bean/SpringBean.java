package lk.ijse.bean;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class SpringBean {

    @Autowired(required = false)
    public SpringBean(@Value("Udulee")String name,@Value("22") int age) {
        System.out.println(name);
        System.out.println(age);
    }
    @Autowired(required = false)
    public SpringBean(@Value("nayanamali") String nameList[],@Value("12")int number) {
        System.out.println(nameList.length);
        System.out.println(number);
    }

}
