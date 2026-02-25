package jiat.ems_pro;

import jiat.ems_pro.util.HibernateUtil;
import org.apache.catalina.Context;
import org.apache.catalina.LifecycleException;
import org.apache.catalina.loader.WebappLoader;
import org.apache.catalina.startup.Tomcat;
import org.hibernate.SessionFactory;

import java.io.File;

public class Main {
    private static final int SERVER_PORT = 8080;
    private static final String CONTEXT_PATH = "/ems_pro";

    public static void main(String[] args) {
//        SessionFactory sessionFactory = HibernateUtil.getSessionFactory();

        try {
            Tomcat tomcat = new Tomcat();
            tomcat.setPort(SERVER_PORT);
            tomcat.getConnector();

            File webappDir = new File("src/main/webapp");
            Context context = tomcat.addWebapp(CONTEXT_PATH, webappDir.getAbsolutePath());

            context.addApplicationListener("org.apache.catalina.startup.ContextConfig");
            context.addApplicationListener("org.apache.catalina.startup.WebAnnotationSet");

            WebappLoader loader = new WebappLoader();
            loader.setDelegate(true);
            context.setLoader(loader);
            context.setReloadable(true);

            tomcat.start();

            System.out.println("🌐 App URL: http://localhost:" + SERVER_PORT + CONTEXT_PATH);

            tomcat.getServer().await();

        } catch (LifecycleException e){
            throw new RuntimeException("Tomcat Embedded Server Error:" + e.getMessage());

        }
    }
}
