package twello.resources;

import org.hibernate.SessionFactory;
import twello.models.WorkspaceDAO;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import java.util.Optional;

@Path("/api/v1")
@Produces(MediaType.APPLICATION_JSON)
public class ApiResourceV1 {
    private SessionFactory factory;

    public ApiResourceV1(SessionFactory factory) {
        this.factory = factory;
    }

    @GET
    public String getHello(@QueryParam("name") Optional<String> queryTitle) {
        return String.format("Hello, %s!", queryTitle.orElse("world"));
    }

    @Path("workspaces")
    public WorkspacesResource getWorkspacesResource() {
        return new WorkspacesResource(new WorkspaceDAO(factory));
    }
}
