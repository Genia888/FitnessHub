# Class Diagram

```mermaid
classDiagram
direction TB
    class Article {
      +String nom
      +String description
      +String photo
	    +String photo2
	    +String photo3
	    +Float prix
	    +bool is_active
	    +bool is_in_stock
    }

    class Personne {
      +String pseudo
      +String email
      +String password
	    +String last_name
	    +String first_name
	    +String adresse1
	    +String adresse2
	    +String code_postal
	    +String ville
      +String photo
      +Float poids
      +Float taille
    }


    class Exercice {
      +String description
      +String photo
      +String categorie<BRAS,JAMBES,DOS,...>
      +Float duree
    }

    class Planning_Exercice {
      +Date date_exercice
      +String commentaire
    }


    class Admin {
	    +bool is_admin
	    +removeReviews()
      +addArticle()
    }

    class User {
	    +bool is_abonne
      +String limitation_exercice
      +String texte_allergie
	    +addReview()
    }

    class Coach {
	    +String certif
	    +String description
	    +String experience
	    +bool is_coach
	    +bool is_diet
	    +addTraining()
    }

    class Reviews {
	    +String text
	    +Integer rating
    }

    class Abonnement {
	    +Date dateDebut
	    +Boolean OptionDiet
	    +Boolean OptionMessage
    }

    class Message {
	    +Date dateDebut
	    +Boolean is_read
	    +String texte
    }
    
    Exercice <|-- Planning_Exercice
    User <|-- Planning_Exercice
    Coach <|-- Exercice
    Personne <|-- Admin
    Personne <|-- User
    Coach <|-- Reviews
    User <|-- Reviews
    Coach <|-- Abonnement
    User <|-- Abonnement
    Coach <|-- Message
    User <|-- Message
    Personne <|-- Coach


```

# Architecture : 
- Front-end: CSS, JS, HTML
- Back-end: Python
- Database: sqlite 
