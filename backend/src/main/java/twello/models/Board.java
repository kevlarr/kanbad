package twello.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.validator.constraints.Length;

public class Board {
    /*
     * Fields
     */

    private long id;

    @JsonProperty
    public long getId() {
        return id;
    }

    @Length(max=10)
    private String title;

    @JsonProperty
    public String getTitle() {
        return title;
    }

    /*
     * Constructors
     */

    public Board() { /* For Jackson deserialization */ }

    public Board(long id, String title) {
        this.id = id;
        this.title = title;
    }
}
