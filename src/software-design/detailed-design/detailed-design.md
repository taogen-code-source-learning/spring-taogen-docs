# spring-taogen Detailed Design

## Module Detailed Design

### IoC

#### The Goals of IoC

1\. XML-based IoC

```java
public static void main(String[] args) {
    BeanFactory beanFactory = new ClassPathXmlApplicationContext("applicationContext.xml");
    MyBean bean = (MyBean) beanFactory.getBean("MyBean");
    bean.sayHello();
}
```

2\. Annotation-based IoC

```java
public static void main(String[] args) {
    AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext("com.taogen");
    MyBean myBean = (MyBean) ctx.getBean("MyBean");
    myBean.sayHello();
}
```

3\. Java-based IoC

```java
public static void main(String[] args) {
    ApplicationContext ctx = new AnnotationConfigApplicationContext(AppConfig.class);
    MyBean myBean = ctx.getBean(MyBean.class);
    myBean.sayHello();
}
```

```java
@Configuration
public class AppConfig
{
    @Bean
    public MyBean myBean()
    {
        return new MyBean();
    }
}
```

#### Detailed Design

##### Business logic flow chart

- Scan files
  - Scan class files
  - Scan XML files
- Parse class files and get class metadata
- Convert metadata to beanDefinitions
- Register beanDefinitions in the beanFactory
- Initialize beans

##### UML Class Diagrams (how to implement all requirements in object-oriented)

Actions:

- Try to simplify the structure of the class hierarchy and the methods of classes. We just need to implement a simpler version of Spring, so we need a simpler structure of the class hierarchy.

[Spring Framework's IoC class analysis](/software-design/spring-framework/spring-framework-analysis.html#ioc)

##### UML Activity Diagram (Implement details)

##### UML Sequence Diagram (Implement details)

##### Core Function Implementation Algorithm

##### Requirements Implementations
