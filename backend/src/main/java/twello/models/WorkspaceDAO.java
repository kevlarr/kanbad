package twello.models;

import io.dropwizard.hibernate.AbstractDAO;
import org.hibernate.SessionFactory;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.util.UUID;

public class WorkspaceDAO extends AbstractDAO<Workspace> {
    public WorkspaceDAO(SessionFactory factory) {
        super(factory);
    }

    public Workspace findByIdentifier(UUID identifier) {
        CriteriaBuilder b = currentSession().getCriteriaBuilder();
        CriteriaQuery<Workspace> crit = b.createQuery(Workspace.class);
        Root<Workspace> root = crit.from(Workspace.class);

        crit.where(b.equal(root.get("identifier"), identifier));

        return currentSession().createQuery(crit).getSingleResult();
    }

    public void save (Workspace ws) {
        currentSession().saveOrUpdate(ws);
    }
}
