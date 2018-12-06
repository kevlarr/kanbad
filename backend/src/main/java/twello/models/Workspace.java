package twello.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.UUID;

public class Workspace {
    /*
     * Fields
     */

    /**
     * The internal database id
     */
    private long id;

    @JsonProperty
    public long getId() { return id; }

    /**
     * The publicly visible (and way less guessable) identifier
     */
    private UUID identifier;

    @JsonProperty
    public UUID getUuid() { return identifier; }

    /*
     * Constructors
     */

    public Workspace() { /* For Jackson */ }

    public Workspace(long id, UUID identifier) {
        this.id = id;
        this.identifier = identifier;
    }
}
