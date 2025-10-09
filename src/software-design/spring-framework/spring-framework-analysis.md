# Spring Framework Analysis

## IoC 

### Spring Framework's IoC class analysis

BeanFactory and ApplicationContext

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
      - AbstractRefreshableApplicationContext
        - AbstractRefreshableConfigApplicationContext
          - AbstractXmlApplicationContext
            - ClassPathXmlApplicationContext
      - GenericApplicationContext
        - AnnotationConfigApplicationContext
  - WebApplicationContext: Interface to provide configuration for a web application. This interface adds a getServletContext() method to the generic ApplicationContext interface, and defines a well-known application attribute name that the root context must be bound to in the bootstrap process. **Methods**: `getServletContext()`

**Important methods**

1\. `ConfigurableApplicationContext.refresh()`

Load or refresh the persistent representation of the configuration, which might an XML file, properties file, or relational database schema. As this is a startup method, it should destroy already created singletons if it fails, to avoid dangling resources. In other words, after invocation of that method, either all or no singletons at all should be instantiated.

| Phase       | Trigger                                                       | What happens                                                 | Typical use                                              |
| ----------- | ------------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------- |
| **Load**    | Initial creation (e.g. constructor or first `refresh()` call) | Bean definitions are read and registered; singletons created | First startup of application context                     |
| **Refresh** | Manual call to `refresh()` or restart                         | Recreates BeanFactory and reloads bean definitions           | Reload configs dynamically or after context modification |

