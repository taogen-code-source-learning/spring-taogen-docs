# Spring Framework Note

## IoC


### 1. Introduction to the Spring IoC Container and Beans

The org.springframework.beans and org.springframework.context packages are the basis for Spring Framework’s IoC container. The BeanFactory interface provides an advanced configuration mechanism capable of managing any type of object. ApplicationContext is a sub-interface of BeanFactory. 

### 2. Container Overview

The org.springframework.context.ApplicationContext interface represents the Spring IoC container and is responsible for instantiating, configuring, and assembling the beans.

The configuration metadata can be represented as annotated component classes, configuration classes with factory methods, or external XML files or Groovy scripts. With either format, you may compose your application and the rich interdependencies between those components.

Several implementations of the ApplicationContext interface are part of core Spring. In stand-alone applications, it is common to create an instance of AnnotationConfigApplicationContext or ClassPathXmlApplicationContext.

**Configuration Metadata**

- Annotation-based configuration: define beans using annotation-based configuration metadata on your application’s component classes.
- Java-based configuration: define beans external to your application classes by using Java-based configuration classes. To use these features, see the @Configuration, @Bean, @Import, and @DependsOn annotations.

**Using the Container**

The ApplicationContext is the interface for an advanced factory capable of maintaining a registry of different beans and their dependencies. By using the method `T getBean(String name, Class<T> requiredType)`, you can retrieve instances of your beans.

The ApplicationContext lets you read bean definitions and access them.

```java
// create and configure beans
ApplicationContext context = new ClassPathXmlApplicationContext("services.xml", "daos.xml");

// retrieve configured instance
PetStoreService service = context.getBean("petStore", PetStoreService.class);
```

You can then use getBean to retrieve instances of your beans. The ApplicationContext interface has a few other methods for retrieving beans, but, ideally, your application code should never use them. Indeed, your application code should have no calls to the getBean() method at all and thus have no dependency on Spring APIs at all. 

### 3. Bean Overview

A Spring IoC container manages one or more beans. These beans are created with the configuration metadata that you supply to the container (for example, in the form of XML <bean/> definitions).

Within the container itself, these bean definitions are represented as BeanDefinition objects, which contain (among other information) the following metadata.

The ApplicationContext implementations also permit the registration of existing objects that are created outside the container (by users).

**Overriding Beans**

**Naming Beans**

Every bean has one or more identifiers. These identifiers must be unique within the container that hosts the bean. A bean usually has only one identifier. However, if it requires more than one, the extra ones can be considered aliases.

**Instantiating Beans**

A bean definition is essentially a recipe for creating one or more objects. The container looks at the recipe for a named bean when asked and uses the configuration metadata encapsulated by that bean definition to create (or acquire) an actual object.

### 4. Dependencies

How you go from defining a number of bean definitions that stand alone to a fully realized application where objects collaborate to achieve a goal.

**Dependency Injection**

Dependency injection (DI) is a process whereby objects define their dependencies.

The container then injects those dependencies when it creates the bean.

### 5. Bean Scopes

You can choose the scope of the objects you create through configuration instead of having to bake in the scope of an object at the Java class level. Beans can be defined to be deployed in one of a number of scopes. The Spring Framework supports six scopes, four of which are available only if you use a web-aware ApplicationContext. You can also create a custom scope.

| Scope                                                        | Description                                                  |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [singleton](https://docs.spring.io/spring-framework/reference/core/beans/factory-scopes.html#beans-factory-scopes-singleton) | (Default) Scopes a single bean definition to a single object instance for each Spring IoC container. |
| [prototype](https://docs.spring.io/spring-framework/reference/core/beans/factory-scopes.html#beans-factory-scopes-prototype) | Scopes a single bean definition to any number of object instances. |
| [request](https://docs.spring.io/spring-framework/reference/core/beans/factory-scopes.html#beans-factory-scopes-request) | Scopes a single bean definition to the lifecycle of a single HTTP request. That is, each HTTP request has its own instance of a bean created off the back of a single bean definition. Only valid in the context of a web-aware Spring `ApplicationContext`. |
| [session](https://docs.spring.io/spring-framework/reference/core/beans/factory-scopes.html#beans-factory-scopes-session) | Scopes a single bean definition to the lifecycle of an HTTP `Session`. Only valid in the context of a web-aware Spring `ApplicationContext`. |
| [application](https://docs.spring.io/spring-framework/reference/core/beans/factory-scopes.html#beans-factory-scopes-application) | Scopes a single bean definition to the lifecycle of a `ServletContext`. Only valid in the context of a web-aware Spring `ApplicationContext`. |
| [websocket](https://docs.spring.io/spring-framework/reference/web/websocket/stomp/scope.html) | Scopes a single bean definition to the lifecycle of a `WebSocket`. Only valid in the context of a web-aware Spring `ApplicationContext`. |

### 6. Customizing the Nature of a Bean

**Lifecycle Callbacks**

To interact with the container’s management of the bean lifecycle, you can implement the Spring InitializingBean and DisposableBean interfaces. The container calls afterPropertiesSet() for the former and destroy() for the latter to let the bean perform certain actions upon initialization and destruction of your beans.

The JSR-250 @PostConstruct and @PreDestroy annotations are generally considered best practice for receiving lifecycle callbacks in a modern Spring application. Using these annotations means that your beans are not coupled to Spring-specific interfaces. For details, see Using @PostConstruct and @PreDestroy.

**ApplicationContextAware and BeanNameAware**

When an ApplicationContext creates an object instance that implements the org.springframework.context.ApplicationContextAware interface, the instance is provided with a reference to that ApplicationContext. 

```java
public interface ApplicationContextAware {

	void setApplicationContext(ApplicationContext applicationContext) throws BeansException;
}
```

Thus, beans can programmatically manipulate the ApplicationContext that created them, through the ApplicationContext interface or by casting the reference to a known subclass of this interface (such as ConfigurableApplicationContext, which exposes additional functionality).

When an ApplicationContext creates a class that implements the org.springframework.beans.factory.BeanNameAware interface, the class is provided with a reference to the name defined in its associated object definition.

```java
public interface BeanNameAware {

	void setBeanName(String name) throws BeansException;
}
```

**Other Aware Interfaces**

Besides ApplicationContextAware and BeanNameAware (discussed earlier), Spring offers a wide range of Aware callback interfaces that let beans indicate to the container that they require a certain infrastructure dependency. As a general rule, the name indicates the dependency type.

### 7. Bean Definition Inheritance

A bean definition can contain a lot of configuration information, including constructor arguments, property values, and container-specific information, such as the initialization method, a static factory method name, and so on. A child bean definition inherits configuration data from a parent definition. The child definition can override some values or add others as needed. Using parent and child bean definitions can save a lot of typing. Effectively, this is a form of templating.

### 8. Container Extension Points

Typically, an application developer does not need to subclass ApplicationContext implementation classes. Instead, the Spring IoC container can be extended by plugging in implementations of special integration interfaces.

**Customizing Beans by Using a BeanPostProcessor**

The BeanPostProcessor interface defines callback methods that you can implement to provide your own (or override the container’s default) instantiation logic, dependency resolution logic, and so forth. If you want to implement some custom logic after the Spring container finishes instantiating, configuring, and initializing a bean, you can plug in one or more custom BeanPostProcessor implementations.

**Customizing Configuration Metadata with a BeanFactoryPostProcessor**

BeanFactoryPostProcessor operates on the bean configuration metadata. That is, the Spring IoC container lets a BeanFactoryPostProcessor read the configuration metadata and potentially change it before the container instantiates any beans other than BeanFactoryPostProcessor instances.

**Customizing Instantiation Logic with a FactoryBean**

You can implement the org.springframework.beans.factory.FactoryBean interface for objects that are themselves factories.

The FactoryBean interface is a point of pluggability into the Spring IoC container’s instantiation logic. If you have complex initialization code that is better expressed in Java as opposed to a (potentially) verbose amount of XML, you can create your own FactoryBean, write the complex initialization inside that class, and then plug your custom FactoryBean into the container.

### 9. Annotation-based Container Configuration

Spring provides comprehensive support for annotation-based configuration, operating on metadata in the component class itself by using annotations on the relevant class, method, or field declaration. 

- Using @Autowired
- Fine-tuning Annotation-based Autowiring with @Primary or @Fallback
- Fine-tuning Annotation-based Autowiring with @Qualifier
- Using Generics as Autowiring Qualifiers
- Using CustomAutowireConfigurer
- Injection with @Resource
- Using @Value
- Using @PostConstruct and @PreDestroy

### 10. Classpath Scanning and Managed Components

- @Component and Further Stereotype Annotations
- Automatically Detecting Classes and Registering Bean Definitions
- Using Filters to Customize Scanning
- Defining Bean Metadata within Components
- Providing a Scope for Autodetected Components
- Providing Qualifier Metadata with Annotations

### 11. Using JSR 330 Standard Annotations

### 12. Java-based Container Configuration

**Basic Concepts: @Bean and @Configuration**

The central artifacts in Spring’s Java configuration support are @Configuration-annotated classes and @Bean-annotated methods.

The @Bean annotation is used to indicate that a method instantiates, configures, and initializes a new object to be managed by the Spring IoC container. For those familiar with Spring’s <beans/> XML configuration, the @Bean annotation plays the same role as the <bean/> element. You can use @Bean-annotated methods with any Spring @Component. However, they are most often used with @Configuration beans.

Annotating a class with @Configuration indicates that its primary purpose is as a source of bean definitions. Furthermore, @Configuration classes let inter-bean dependencies be defined by calling other @Bean methods in the same class.

**Instantiating the Spring Container by Using AnnotationConfigApplicationContext**

**Using the @Bean Annotation**

**Using the @Configuration annotation**

**Composing Java-based Configurations**

### 13. Environment Abstraction

The Environment interface is an abstraction integrated in the container that models two key aspects of the application environment: profiles and properties.

A profile is a named, logical group of bean definitions to be registered with the container only if the given profile is active.

Properties play an important role in almost all applications and may originate from a variety of sources: properties files, JVM system properties, system environment variables, JNDI, servlet context parameters, ad-hoc Properties objects, Map objects, and so on. 

### 14. Registering a LoadTimeWeaver

The LoadTimeWeaver is used by Spring to dynamically transform classes as they are loaded into the Java virtual machine (JVM).

To enable load-time weaving, you can add the @EnableLoadTimeWeaving to one of your @Configuration classes

### 15. Additional Capabilities of the ApplicationContext

Internationalization using MessageSource

Standard and Custom Events

Convenient Access to Low-level Resources

Application Startup Tracking

Convenient ApplicationContext Instantiation for Web Applications

Deploying a Spring ApplicationContext as a Jakarta EE RAR File

### 16. The BeanFactory API

The BeanFactory API provides the underlying basis for Spring’s IoC functionality.

You should use an ApplicationContext unless you have a good reason for not doing so, with GenericApplicationContext and its subclass AnnotationConfigApplicationContext as the common implementations for custom bootstrapping. These are the primary entry points to Spring’s core container for all common purposes: loading of configuration files, triggering a classpath scan, programmatically registering bean definitions and annotated classes, and (as of 5.0) registering functional bean definitions.

Because an ApplicationContext includes all the functionality of a BeanFactory, it is generally recommended over a plain BeanFactory, except for scenarios where full control over bean processing is needed. Within an ApplicationContext (such as the GenericApplicationContext implementation), several kinds of beans are detected by convention (that is, by bean name or by bean type — in particular, post-processors), while a plain DefaultListableBeanFactory is agnostic about any special beans.


## Appendixes

[Spring Framework Documentation](https://docs.spring.io/spring-framework/reference/index.html)
