package twello.resources;

import io.dropwizard.hibernate.UnitOfWork;
import org.hibernate.validator.constraints.NotEmpty;
import twello.models.Board;
import twello.models.BoardDAO;
import twello.models.Workspace;
import twello.models.WorkspaceDAO;

import javax.persistence.NoResultException;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.UUID;

@Produces(MediaType.APPLICATION_JSON)
public class BoardsResource {
    private final BoardDAO dao;
    private final WorkspaceDAO workspaceDao;

    public BoardsResource(BoardDAO dao, WorkspaceDAO workspaceDao) {
        this.dao = dao;
        this.workspaceDao = workspaceDao;
    }

    @GET
    @UnitOfWork
    public List<Board> getBoards(
        @QueryParam("workspace") @NotEmpty String workspaceIdentifier
    ) {
        Workspace workspace = loadWorkspace(workspaceIdentifier);
        return dao.findByWorkspace(workspace);
    }

    @POST
    @Path("new")
    @UnitOfWork
    public Board createBoard(
        @QueryParam("workspace") @NotEmpty String workspaceIdentifier,
        @Valid Board board
    ) {
        Workspace workspace = loadWorkspace(workspaceIdentifier);

        board.setWorkspace(workspace);
        board.setIdentifier(UUID.randomUUID());
        dao.save(board);

        return board;
    }

    @GET
    @Path("{identifier}")
    @UnitOfWork
    public Board getBoard(
        @PathParam("identifier") String identifier
    ) {
        return loadBoard(identifier);
    }

    @PUT
    @Path("{identifier}")
    @UnitOfWork
    public Board updateBoard(
        @PathParam("identifier") String identifier,
        @Valid Board data
    ) {
        Board board = loadBoard(identifier);
        board.setTitle(data.getTitle());

        return board;
    }

    @DELETE
    @Path("{identifier}")
    @UnitOfWork
    public void deleteBoard(
        @PathParam("identifier") String identifier
    ) {
        dao.delete(loadBoard(identifier));
    }

    private Workspace loadWorkspace(String identifier) {
        UUID workspaceUuid;

        try {
            workspaceUuid = UUID.fromString(identifier);
        } catch (IllegalArgumentException ex) {
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }

        return workspaceDao.findByIdentifier(workspaceUuid);

    }

    private Board loadBoard(String identifier) {
        UUID uuid;

        try {
            uuid = UUID.fromString(identifier);
        } catch (IllegalArgumentException ex) {
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }

        try {
            return dao.findByIdentifier(uuid);
        } catch (NoResultException ex) {
            throw new WebApplicationException(Response.Status.NOT_FOUND);
        }
    }
}
