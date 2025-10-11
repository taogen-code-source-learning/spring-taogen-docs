# Spring Framework Analysis

## IoC 

### Spring Framework's IoC class analysis

#### BeanFactory and ApplicationContext

BeanFactory

- BeanFactory: The root interface for accessing a Spring bean container. This is the basic client view of a bean container. Methods: `getBean()`, `containsBean()`, `isXxxType()`, `getType()`, `getAliases()`.
  - ListableBeanFactory: Extension of the BeanFactory interface to be implemented by bean factories that can enumerate all their bean instances, rather than attempting bean lookup by name one by one as requested by clients. BeanFactory implementations that preload all their bean definitions (such as XML-based factories) may implement this interface. Methods: `containsBeanDefinition()`, `getBeanDefinition-Count/Names()`, `getBeanNamesForType(xxx)`, `getBeansOfType(xxx)`, `getBeanNamesForAnnotation(xxx)`, `getBeansWithAnnotation(xxx)`, `findAnnotationOnBean(xxx)`
  - HierarchicalBeanFactory: Sub-interface implemented by bean factories that can be part of a hierarchy. The corresponding setParentBeanFactory method for bean factories that allow setting the parent in a configurable fashion can be found in the ConfigurableBeanFactory interface. Methods: `getParentBeanFactory()`, `containsLocalBean(xxx)`
      - ConfigurableBeanFactory: Configuration interface to be implemented by most bean factories. Provides facilities to configure a bean factory, in addition to the bean factory client methods in the BeanFactory interface. Methods: `setParentBeanFactory(xxx)`, `set/get-BeanClassLoader(xxx)`, `set/get-TempClassLoader(xxx)`, `set/is-CacheBeanMetadata(xxx)`, `set/get-BeanExpressionResolver(xxx)`, `set/get-ConversionService(xxx)`, `addPropertyEditorRegistrar(xxx)`, `set/get-TypeConverter(xxx)`, `add/get-BeanPostProcessor()`, `registerScope(xxx)`, `registerAlias(xxx)`, `getDependentBeans(xxx)`, `destroyBean(xxx)` and so on.
  - AutowireCapableBeanFactory: Extension of the BeanFactory interface to be implemented by bean factories that are capable of autowiring, provided that they want to expose this functionality for existing bean instances. Methods: `createBean(xxx)`, `autowireBean(xxx)`, `configureBean(xxx)`, `autowire(xxx)`, `initializeBean(xxx)` and so on.

ApplicationContext

- ApplicationContext: Central interface to provide configuration for an application. This is read-only while the application is running, but may be reloaded if the implementation supports this. **Extends interfaces**: `ListableBeanFactory`, `HierarchicalBeanFactory`, `ResourcePatternResolver` and so on. **Methods**: `getId()`, `getApplicationName()`, `getDisplayName()`, `getStartupDate()`, `getParent()`, `getAutowireCapableBeanFactory()`
  - ConfigurableApplicationContext: SPI interface to be implemented by most if not all application contexts. Provides facilities **to configure an application context** in addition to the application context client methods in the ApplicationContext interface. Configuration and lifecycle methods are encapsulated here to avoid making them obvious to ApplicationContext client code. The present methods should only be used by startup and shutdown code. **Methods**: `setId(xxx)`, `setParent(xxx)`, `setEnvironment(xxx)`, `AddBeanFactoryPostProcessor(xxx)`, `addApplicatioListener(xxx)`, `addProtocolResolver(xxx)`, `refresh()`, `registerShutdownHook()`, `close()`, `isActive()`, `getBeanFactory()`
    - AbstractApplicationContext: Abstract implementation of the ApplicationContext interface. Doesn't mandate the type of storage used for configuration; simply implements common context functionality.
      - AbstractRefreshableApplicationContext: 1) Base class for ApplicationContext implementations which are supposed to support multiple calls to refresh(), creating a new internal bean factory instance every time. Typically (but not necessarily), such a context will be driven by a set of config locations to load bean definitions from. 2) The only method to be implemented by subclasses is loadBeanDefinitions, which gets invoked on each refresh. A concrete implementation is supposed to load bean definitions into the given DefaultListableBeanFactory, typically delegating to one or more specific bean definition readers.
        - AbstractRefreshableConfigApplicationContext: AbstractRefreshableApplicationContext subclass that adds common handling of specified config locations. Serves as base class for XML-based application context implementations such as ClassPathXmlApplicationContext and FileSystemXmlApplicationContext.
          - AbstractXmlApplicationContext: Convenient base class for ApplicationContext implementations, drawing configuration from XML documents containing bean definitions understood by an XmlBeanDefinitionReader.
            - ClassPathXmlApplicationContext: Standalone XML application context, taking the context definition files from the class path, interpreting plain paths as class path resource names that include the package path (e.g. "mypackage/myresource.txt"). Useful for test harnesses as well as for application contexts embedded within JARs.
      - GenericApplicationContext: Generic ApplicationContext implementation that holds a single internal DefaultListableBeanFactory instance and does not assume a specific bean definition format
        - GenericXmlApplicationContext: Convenient application context with built-in XML support. This is a flexible alternative to ClassPathXmlApplicationContext and FileSystemXmlApplicationContext, to be configured via setters, with an eventual refresh() call activating the context.
        - AnnotationConfigApplicationContext: Standalone application context, accepting annotated classes as input - in particular @Configuration-annotated classes, but also plain @Component types and JSR-330 compliant classes using javax.inject annotations. Allows for registering classes one by one using register(Class...) as well as for classpath scanning using scan(String...).
  - WebApplicationContext: Interface to provide configuration for a web application. This interface adds a getServletContext() method to the generic ApplicationContext interface, and defines a well-known application attribute name that the root context must be bound to in the bootstrap process. **Methods**: `getServletContext()`

Summary

BeanFactory and its implementations focus on bean management. The `DefaultListableBeanFactory` (an implementation class of `BeanFactory`)  implements `ConfigurableListableBeanFactory` interface and also `BeanDefinitionRegistry` interface. `DefaultListableBeanFactory` can hold the bean definitions and initialize instances of beans.

ApplicationContext and its implementations are the configuration center of Spring application. It is in charge of the whole process of IoC. It includes the functions of BeanFactory and holds a `DefaultListableBeanFactory` instance for bean registering and bean instantiating.


**Important methods**

1\. `ConfigurableApplicationContext.refresh()`

Load or refresh the persistent representation of the configuration, which might an XML file, properties file, or relational database schema. As this is a startup method, it should destroy already created singletons if it fails, to avoid dangling resources. In other words, after invocation of that method, either all or no singletons at all should be instantiated.

| Phase       | Trigger                                                       | What happens                                                 | Typical use                                              |
| ----------- | ------------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------- |
| **Load**    | Initial creation (e.g. constructor or first `refresh()` call) | Bean definitions are read and registered; singletons created | First startup of application context                     |
| **Refresh** | Manual call to `refresh()` or restart                         | Recreates BeanFactory and reloads bean definitions           | Reload configs dynamically or after context modification |

#### GenericApplicationContext vs AbstractRefreshableApplicationContext

1\. Both of `GenericApplicationContext` and `AbstractRefreshableApplicationContext` implement `AbstractApplicationContext`.

2\. `AbstractRefreshableApplicationContext` is only used for XML-based (IoC container) configuration. For example, `ClassPathXmlApplicationContext`.

```java
AbstractRefreshableApplicationContext ctx = new ClassPathXmlApplicationContext("applicationContext.xml");
MyBean bean = (MyBean) ctx.getBean("MyBean");
bean.sayHello();
```

3\. `GenericApplicationContext` is used for XML-based and annotation-based/Java-based configuration. For example, `GenericXmlApplicationContext`, `AnnotationConfigApplicationContext`

XML-based

```java
GenericApplicationContext ctx = new GenericXmlApplicationContext("applicationContext.xml");
MyBean bean = (MyBean) ctx.getBean("MyBean");
bean.sayHello();
```

annotation-based

```java
String basePackage = "com.taogen.springiocbyannotation";
GenericApplicationContext ctx = new AnnotationConfigApplicationContext(basePackage);
MyBean myBean = (MyBean) ctx.getBean("MyBean");
myBean.sayHello();
```

Java-based

```java
Class configurationClass = AppConfig.class;
GenericApplicationContext ctx = new AnnotationConfigApplicationContext(configurationClass);
MyBean myBean = ctx.getBean(MyBean.class);
myBean.sayHello();
```
