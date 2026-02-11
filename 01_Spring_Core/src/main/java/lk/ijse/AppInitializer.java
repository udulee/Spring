package lk.ijse;

import lk.ijse.bean.MyConnection;
import lk.ijse.bean.SpringBean;
import lk.ijse.bean.TestBean;
import lk.ijse.config.AppConfig;
import lk.ijse.newTestBean.NewTestBean;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class AppInitializer {
    public static void main(String[] args) {
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext();
        context.register(AppConfig.class);
        context.refresh();

        //Bean ID
        SpringBean springBean= (SpringBean) context.getBean("springBean");
        System.out.println("Bean : " + springBean);
        //by class name
        TestBean testBean1 = context.getBean(TestBean.class);
        System.out.println("Bean : " + testBean1);
        //by bean ID
        TestBean testBean2 = (TestBean) context.getBean("exampleBean");
        System.out.println("Bean : " + testBean2);
        //by beanID & className
        TestBean testBean3 = context.getBean("exampleBean",TestBean.class);
        System.out.println("Bean : " + testBean3);


        MyConnection myConnection1 = (MyConnection) context.getBean("connection");
        System.out.println("MyConnection : " + myConnection1);
        MyConnection myConnection2 = context.getBean("connection",MyConnection.class);
        System.out.println("MyConnection : " + myConnection2);



        context.registerShutdownHook();
    }
}