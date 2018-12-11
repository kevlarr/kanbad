package twello.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import java.util.UUID;

@Entity
@Table(name="cards")
public class Card {
    @ManyToOne
    @JsonIgnoreProperties({"title"})
    private Board board;

    public void setBoard(Board board) {
        this.board = board;
    }

    public Board getBoard() {
        return this.board;
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

    /**
     * Optional card body
     */
    private String body;

    @JsonProperty
    public String getBody() {
        return this.body;
    }

    public void setBody(String body) {
        this.body = body;
    }


    public Card() { /* For Jackson deserialization */ }

    public Card(Board board, UUID identifier, String title, String body) {
        this.board = board;
        this.identifier = identifier;
        this.title = title;
    }
}
