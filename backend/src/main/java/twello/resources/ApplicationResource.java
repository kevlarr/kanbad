package twello.resources;

import org.hibernate.SessionFactory;

import javax.ws.rs.Path;

@Path("/")
public class ApplicationResource {
    private SessionFactory factory;

    public ApplicationResource(SessionFactory factory) {
        this.factory = factory;
    }

    @Path("api/v1")
    public ApiResourceV1 apiv1() {
        return new ApiResourceV1(factory);
    }
}
