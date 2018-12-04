package twello;

import io.dropwizard.Application;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import twello.resources.HelloBoardResource;

public class TwelloApplication extends Application<TwelloConfiguration> {
    public static void main(String[] args) throws Exception {
        new TwelloApplication().run(args);
    }

    @Override
    public String getName() {
        return "twello-world";
    }

    @Override
    public void initialize(Bootstrap<TwelloConfiguration> bootstrap) {
        // TODO
    }

    @Override
    public void run(TwelloConfiguration conf, Environment env) {
        env.jersey().register(new HelloBoardResource());
    }
}
