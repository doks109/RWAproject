package hr.riteh.dominik.RWAproject.shop.model;


import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "items")
public class Post {
    private String ime;
    private String kategorija;
    private String opis;
    private double cijena;
    private boolean raspolozivo;
    private String putanjaSlike;


    @Override
    public String toString() {
        return "Post{" +
                "ime='" + ime + '\'' +
                ", kategorija='" + kategorija + '\'' +
                ", opis='" + opis + '\'' +
                ", cijena=" + cijena +
                ", raspolozivo=" + raspolozivo +
                ", putanjaSlike='" + putanjaSlike + '\'' +
                '}';
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

    public boolean isRaspolozivo() {
        return raspolozivo;
    }

    public void setRaspolozivo(boolean raspolozivo) {
        this.raspolozivo = raspolozivo;
    }

    public String getPutanjaSlike() {
        return putanjaSlike;
    }

    public void setPutanjaSlike(String putanjaSlike) {
        this.putanjaSlike = putanjaSlike;
    }

    public Post() {
    }
}
