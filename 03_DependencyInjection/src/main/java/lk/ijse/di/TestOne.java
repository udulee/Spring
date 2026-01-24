package lk.ijse.di;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TestOne implements DI{


/*    //property injection
    @Autowired
    TestAgreement  testAgreement;

    public void chatWithTestTwo(){
        testAgreement.chat();
    }*/

/*    //constructor injection
    TestAgreement testAgreement;

//    @Autowired
//    public TestOne(TestAgreement testAgreement) {
//        this.testAgreement=testAgreement;
//    }

    public TestOne(TestAgreement testAgreement) {
        this.testAgreement = testAgreement;
    }

    public void chatWithTestTwo() {
        testAgreement.chat();
    }*/

    //setter method through injection
 /*   TestAgreement testAgreement;

    @Autowired
    public void setter(TestAgreement testAgreement) {
        this.testAgreement = testAgreement;
    }
    public void chatWithTestTwo() {
        testAgreement.chat();
    }*/

    //Interface Through Injection
//    TestAgreement testAgreement;
    @Autowired
    @Override
    public void inject(DI di) {
        this.di = di;
    }
    public void chatWithTestTwo() {
        di.chat();
    }

}