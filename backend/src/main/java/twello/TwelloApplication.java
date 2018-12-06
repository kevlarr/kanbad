package twello;

import io.dropwizard.Application;
import io.dropwizard.db.DataSourceFactory;
import io.dropwizard.migrations.MigrationsBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import twello.resources.HelloBoardResource;

public class TwelloApplication extends Application<TwelloConfiguration> {
    public static void main(String[] args) throws Exception {
        new TwelloApplication().run(args);
    }

    @Override
    public String getName() {
        return "twello";
    }

    @Override
    public void initialize(Bootstrap<TwelloConfiguration> bootstrap) {
        bootstrap.addBundle(new MigrationsBundle<TwelloConfiguration>() {
            @Override
            public DataSourceFactory getDataSourceFactory(TwelloConfiguration configuration) {
                return configuration.getDataSourceFactory();
            }

            @Override
            public String getMigrationsFileName() {
                return "migrations.yml";
            }
        });
    }

    @Override
    public void run(TwelloConfiguration conf, Environment env) {
        env.jersey().register(new HelloBoardResource());
    }
}
