package twello.models;

import io.dropwizard.hibernate.AbstractDAO;
import org.hibernate.SessionFactory;

import java.util.UUID;

public class WorkspaceDAO extends AbstractDAO<Workspace> {
    public WorkspaceDAO(SessionFactory factory) {
        super(factory);
    }

    public Workspace findByIdentifier(UUID identifier) {
        // FIXME
        return new Workspace(1, identifier);
    }
}
