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

//        SpringBean springBean1 = new SpringBean();
//        SpringBean springBean2 = new SpringBean();
//        System.out.println("POJO"+springBean1);
//        System.out.println("POJO"+springBean2);
//
//        SpringBean springBean3 = context.getBean(SpringBean.class);
//        SpringBean springBean4 = context.getBean(SpringBean.class);
//        System.out.println("Bean"+springBean3);
//        System.out.println("Bean"+springBean4);


//        SpringBean springBean = (SpringBean) context.getBean("springBean");
//        System.out.println(springBean);
//
//        //call by class
//        TestBean testBeanClass = context.getBean(TestBean.class);
//        System.out.println(testBeanClass);
//
//        //call by id
//        TestBean testBeanId = (TestBean) context.getBean("exampleBean");
//        System.out.println(testBeanId);
//
//        //call by id and class
//        TestBean testBeanIdClass = context.getBean("exampleBean", TestBean.class);
//        System.out.println(testBeanIdClass);
//
//        //call to method
//        TestBean print = context.getBean(TestBean.class);
//        print.PrintMessage();
//
//        NewTestBean newTestBean = context.getBean(NewTestBean.class);
//        System.out.println(newTestBean);

        MyConnection myConnection1 = (MyConnection)context.getBean("connection");
        System.out.println(myConnection1);

        context.registerShutdownHook();

    }
}