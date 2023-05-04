package twello.models;

import io.dropwizard.hibernate.AbstractDAO;
import org.hibernate.SessionFactory;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.util.List;
import java.util.UUID;

public class CardDAO extends AbstractDAO<Board> {
    public CardDAO(SessionFactory factory) {
        super(factory);
    }

    public List<Card> findByBoard(Board board) {
        CriteriaBuilder b = currentSession().getCriteriaBuilder();
        CriteriaQuery<Card> crit = b.createQuery(Card.class);
        Root<Card> root = crit.from(Card.class);

        crit.where(b.equal(root.get("board"), board));

        return currentSession().createQuery(crit).getResultList();
    }

    public Card findByIdentifier(UUID identifier) {
        CriteriaBuilder b = currentSession().getCriteriaBuilder();
        CriteriaQuery<Card> crit = b.createQuery(Card.class);
        Root<Card> root = crit.from(Card.class);

        crit.where(b.equal(root.get("identifier"), identifier));

        return currentSession().createQuery(crit).getSingleResult();
    }

    public void save(Card card) {
        currentSession().saveOrUpdate(card);
    }

    public void delete(Card card) {
        currentSession().delete(card);
    }
}
