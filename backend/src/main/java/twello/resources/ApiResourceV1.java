package twello.resources;

import org.hibernate.SessionFactory;
import twello.models.BoardDAO;
import twello.models.CardDAO;
import twello.models.WorkspaceDAO;

import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Produces(MediaType.APPLICATION_JSON)
public class ApiResourceV1 {
    private SessionFactory factory;

    public ApiResourceV1(SessionFactory factory) {
        this.factory = factory;
    }

    @Path("workspaces")
    public WorkspacesResource getWorkspacesResource() {
        return new WorkspacesResource(new WorkspaceDAO(factory));
    }

    @Path("boards")
    public BoardsResource getBoardsResource() {
        return new BoardsResource(
            new BoardDAO(factory),
            new WorkspaceDAO(factory)
        );
    }

    @Path("cards")
    public CardsResource getCardsResource() {
        return new CardsResource(
                new CardDAO(factory),
                new BoardDAO(factory)
        );
    }
}
