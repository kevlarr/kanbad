package twello.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.*;
import java.util.UUID;

@Entity
@Table(name="boards")
public class Board {
    @ManyToOne
    private Workspace workspace;

    public void setWorkspace(Workspace workspace) {
        this.workspace = workspace;
    }

    public Workspace getWorkspace() {
        return this.workspace;
    }

    /**
     * The internal, "database only" id
     */
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    public Long getId() {
        return id;
    }

    /**
     * The unique, publicly visible identifier
     */
    private UUID identifier;

    @JsonProperty
    public UUID getIdentifier() { return identifier; }

    public void setIdentifier(UUID identifier) { this.identifier = identifier; }

    /**
     * Non-unique title
     */
    @Length(min=1, max=30)
    private String title;

    @JsonProperty
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) { this.title = title; }


    public Board() { /* For Jackson deserialization */ }

    public Board(Workspace workspace, UUID identifier, String title) {
        this.workspace = workspace;
        this.identifier = identifier;
        this.title = title;
    }
}
