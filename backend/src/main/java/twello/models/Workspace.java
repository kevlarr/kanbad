package twello.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import java.util.UUID;

@Entity
@Table(name="workspaces")
public class Workspace {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    public Long getId() { return id; }

    /**
     * The publicly visible (and way less guessable) identifier
     */
    private UUID identifier;

    @JsonProperty
    public UUID getIdentifier() { return identifier; }

    /*
     * Constructors
     */

    public Workspace() { /* For Jackson */ }

    public Workspace(UUID identifier) {
        this.identifier = identifier;
    }

    public Workspace(long id, UUID identifier) {
        this(identifier);
        this.id = id;
    }
}
