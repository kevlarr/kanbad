package twello.resources;

import twello.models.Workspace;
import twello.models.WorkspaceDAO;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.UUID;

@Path("/workspaces")
@Produces(MediaType.APPLICATION_JSON)
public class WorkspacesResource {
    private final WorkspaceDAO dao;

    public WorkspacesResource(WorkspaceDAO dao) {
        this.dao = dao;
    }

    @GET
    @Path("{identifier}")
    public Workspace getWorkspace(@PathParam("identifier") String identifier) {
        return dao.findByIdentifier(UUID.fromString(identifier));
    }

}
