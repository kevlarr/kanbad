package twello;

import io.dropwizard.Application;
import io.dropwizard.db.DataSourceFactory;
import io.dropwizard.hibernate.HibernateBundle;
import io.dropwizard.migrations.MigrationsBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import twello.models.Board;
import twello.models.Workspace;
import twello.resources.ApplicationResource;

public class TwelloApplication extends Application<TwelloConfiguration> {
    private HibernateBundle<TwelloConfiguration> hibernate;
    private MigrationsBundle<TwelloConfiguration> migrations;

    public static void main(String[] args) throws Exception {
        new TwelloApplication().run(args);
    }

    @Override
    public String getName() {
        return "twello";
    }

    @Override
    public void initialize(Bootstrap<TwelloConfiguration> bootstrap) {
        hibernate = new HibernateBundle<TwelloConfiguration>(
            Workspace.class,
            Board.class
        ) {
            @Override
            public DataSourceFactory getDataSourceFactory(TwelloConfiguration configuration) {
                return configuration.getDataSourceFactory();
            }
        };

        migrations = new MigrationsBundle<TwelloConfiguration>() {
            @Override
            public DataSourceFactory getDataSourceFactory(TwelloConfiguration configuration) {
                return configuration.getDataSourceFactory();
            }

            @Override
            public String getMigrationsFileName() {
                return "migrations.yml";
            }
        };

        bootstrap.addBundle(hibernate);
        bootstrap.addBundle(migrations);
    }

    @Override
    public void run(TwelloConfiguration conf, Environment env) {
        env.jersey().register(new ApplicationResource(hibernate.getSessionFactory()));
    }
}
