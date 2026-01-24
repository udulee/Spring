package lk.ijse.bean;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.*;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class SpringBean01 implements BeanNameAware, BeanFactoryAware,
        ApplicationContextAware, InitializingBean, DisposableBean {
    public  SpringBean01() {
        System.out.println("SpringBeanOne - Object Created");
    }
    @Override
    public void setBeanFactory(BeanFactory beanFactory) throws BeansException {
        System.out.println("SpringBeanOne - BeanFactoryAware");
    }

    @Override
    public void setBeanName(String name) {
        System.out.println("SpringBeanOne - BeanNameAware");
    }

    @Override
    public void destroy() throws Exception {
        System.out.println("SpringBeanOne - DisposableBean");
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println("SpringBeanOne - InitializingBean");
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        System.out.println("SpringBeanOne - ApplicationContextAware");
    }
}