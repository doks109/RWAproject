package hr.riteh.dominik.RWAproject.shop.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "items")
public class Post {
    @Id
    private String _id;
    private String ime;
    private String kategorija;
    private String opis;
    private double cijena;
    private int popust;
    private int raspolozivo;
    private String putanjaSlike;

    @Override
    public String toString() {
        return "Post{" +
                "_id='" + _id + '\'' +
                ", ime='" + ime + '\'' +
                ", kategorija='" + kategorija + '\'' +
                ", opis='" + opis + '\'' +
                ", cijena=" + cijena +
                ", popust=" + popust +
                ", raspolozivo=" + raspolozivo +
                ", putanjaSlike='" + putanjaSlike + '\'' +
                '}';
    }

    public String get_id() {
        return _id;
    }

    public String getIme() {
        return ime;
    }

    public void setIme(String ime) {
        this.ime = ime;
    }

    public String getKategorija() {
        return kategorija;
    }

    public void setKategorija(String kategorija) {
        this.kategorija = kategorija;
    }

    public String getOpis() {
        return opis;
    }

    public void setOpis(String opis) {
        this.opis = opis;
    }

    public double getCijena() {
        return cijena;
    }

    public void setCijena(double cijena) {
        this.cijena = cijena;
    }

    public int getRaspolozivo() {
        return raspolozivo;
    }

    public void setRaspolozivo(int raspolozivo) {
        this.raspolozivo = raspolozivo;
    }

    public String getPutanjaSlike() {
        return putanjaSlike;
    }

    public void setPutanjaSlike(String putanjaSlike) {
        this.putanjaSlike = putanjaSlike;
    }
    public int getPopust() {
        return popust;
    }

    public void setPopust(int popust) {
        this.popust = popust;
    }

    public Post() {
    }
}
