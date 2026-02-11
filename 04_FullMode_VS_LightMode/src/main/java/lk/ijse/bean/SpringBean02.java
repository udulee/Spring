package lk.ijse.bean;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.*;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class SpringBean02  implements BeanNameAware, BeanFactoryAware,
        ApplicationContextAware, InitializingBean, DisposableBean {
    public  SpringBean02() {
        System.out.println("SpringBean02 - Object Created");
    }
    @Override
    public void setBeanFactory(BeanFactory beanFactory) throws BeansException {
        System.out.println("SpringBean02 - BeanFactoryAware");
    }

    @Override
    public void setBeanName(String name) {
        System.out.println("SpringBean02 - BeanNameAware");
    }

    @Override
    public void destroy() throws Exception {
        System.out.println("SpringBean02 - DisposableBean");
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println("SpringBean02 - InitializingBean");
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        System.out.println("SpringBean02 - ApplicationContextAware");
    }
}