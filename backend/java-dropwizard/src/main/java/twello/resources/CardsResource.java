package twello.resources;

import io.dropwizard.hibernate.UnitOfWork;
import org.hibernate.validator.constraints.NotEmpty;
import twello.models.*;
import twello.models.Board;
import twello.models.BoardDAO;

import javax.persistence.NoResultException;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.UUID;

@Produces(MediaType.APPLICATION_JSON)
public class CardsResource {
    private final CardDAO dao;
    private final BoardDAO boardDao;

    public CardsResource(CardDAO dao, BoardDAO boardDao) {
        this.dao = dao;
        this.boardDao = boardDao;
    }

    @GET
    @UnitOfWork
    public List<Card> getCards(
        @QueryParam("board") @NotEmpty String boardIdentifier
    ) {
        Board board = loadBoard(boardIdentifier);
        return dao.findByBoard(board);
    }

    @POST
    @Path("new")
    @UnitOfWork
    public Card createCard(
        @QueryParam("board") @NotEmpty String boardIdentifier,
        @Valid Card card
    ) {
        Board board = loadBoard(boardIdentifier);

        card.setBoard(board);
        card.setIdentifier(UUID.randomUUID());
        dao.save(card);

        return card;
    }

    @PUT
    @Path("{identifier}")
    @UnitOfWork
    public Card updateCard(
        @PathParam("identifier") String identifier,
        @Valid Card data
    ) {
        Card card = loadCard(identifier);
        card.setTitle(data.getTitle());
        card.setBody(data.getBody());
        return card;
    }

    @DELETE
    @Path("{identifier}")
    @UnitOfWork
    public void deleteCard(
        @PathParam("identifier") String identifier
    ) {
        dao.delete(loadCard(identifier));
    }

    private Board loadBoard(String identifier) {
        UUID boardUuid;

        try {
            boardUuid = UUID.fromString(identifier);
        } catch (IllegalArgumentException ex) {
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }

        return boardDao.findByIdentifier(boardUuid);

    }

    private Card loadCard(String identifier) {
        UUID uuid;

        try {
            uuid = UUID.fromString(identifier);
        } catch (IllegalArgumentException ex) {
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }

        Card card;

        try {
            return dao.findByIdentifier(uuid);
        } catch (NoResultException ex) {
            throw new WebApplicationException(Response.Status.NOT_FOUND);
        }
    }
}
