package twello.resources;

import io.dropwizard.hibernate.UnitOfWork;
import twello.models.Workspace;
import twello.models.WorkspaceDAO;

import javax.persistence.NoResultException;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.LinkedHashMap;
import java.util.UUID;

@Produces(MediaType.APPLICATION_JSON)
public class WorkspacesResource {
    private final WorkspaceDAO dao;

    public WorkspacesResource(WorkspaceDAO dao) {
        this.dao = dao;
    }

    @POST
    @Path("new")
    @UnitOfWork
    public Object createWorkspace(LinkedHashMap<String, Object> json) {
        Workspace ws = new Workspace(UUID.randomUUID());
        dao.save(ws);
        return ws;
    }

    @GET
    @Path("{identifier}")
    @UnitOfWork
    public Workspace getWorkspace(@PathParam("identifier") String identifier) {
        UUID uuid;

        try {
            uuid = UUID.fromString(identifier);
        } catch (IllegalArgumentException ex) {
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }

        try {
            return dao.findByIdentifier(uuid);
        }
        catch (NoResultException ex) {
            throw new WebApplicationException(Response.Status.NOT_FOUND);
        }
    }

}
