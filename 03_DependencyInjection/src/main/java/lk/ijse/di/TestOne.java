package lk.ijse.di;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope("prototype")
public class TestOne implements DIInterface {
    //property injection
    //@Autowired
    DI di;
   /*
   //constructor injection
   @Autowired
    public TestOne(DI di) {
        this.di = di;
    }*/

    //setter method through injection
  /*  @Autowired
    public void setter(DI di) {
        this.di = di;
    }
*/

    //Interface through injection
    @Autowired
    @Override
    public void inject(DI di) {
        this.di = di;
    }

    public void chatWithTestTwo() {
        di.chat();
    }
}