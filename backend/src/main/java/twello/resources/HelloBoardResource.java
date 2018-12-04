package twello.resources;

import com.codahale.metrics.annotation.Timed;
import twello.models.Board;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Path("/hello-board")
@Produces(MediaType.APPLICATION_JSON)
public class HelloBoardResource {
    private final String template = "Hello, %s!";
    private final String defaultTitle = "Board";
    private final AtomicLong counter;

    public HelloBoardResource() {
        this.counter = new AtomicLong();
    }

    @GET
    @Timed
    public Board getHelloBoard(@QueryParam("title") Optional<String> queryTitle) {
        String title = String.format(template, queryTitle.orElse(defaultTitle));
        return new Board(counter.incrementAndGet(), title);
    }

}
