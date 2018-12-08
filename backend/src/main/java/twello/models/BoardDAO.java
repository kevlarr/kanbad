package twello.models;

import io.dropwizard.hibernate.AbstractDAO;
import org.hibernate.SessionFactory;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.util.UUID;

public class BoardDAO extends AbstractDAO<Workspace> {
    public BoardDAO(SessionFactory factory) {
        super(factory);
    }

    public Board findByIdentifier(UUID identifier) {
        // FIXME kvlr: This could be abstracted better
        CriteriaBuilder b = currentSession().getCriteriaBuilder();
        CriteriaQuery<Board> crit = b.createQuery(Board.class);
        Root<Board> root = crit.from(Board.class);

        crit.where(b.equal(root.get("identifier"), identifier));

        return currentSession().createQuery(crit).getSingleResult();
    }

    public void save(Board board) {
        currentSession().saveOrUpdate(board);
    }

    public void delete(Board board) {
        currentSession().delete(board);
    }
}
