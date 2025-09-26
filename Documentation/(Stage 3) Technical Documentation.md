# 0. Define User Stories and Mockups
## User Stories (with MoSCoW Prioritization)

### Must Have



### First wireframes

[![Preview de la maquette](./maquette.png)](https://www.figma.com/site/pXa4R4BEWpKBJKWSCMSXLB/Untitled?node-id=0-1&t=jpmidpSvAxUgBVX2-1)

# 2. Define Components, Classes, and Database Design  

ClasseId_For_All_Tables is the parent of Product_shop, Personne, Exercice, Exercise_schedule, Reviews, Subscription, Message

```mermaid
classDiagram
direction TB
	
	class ClasseId_For_All_Tables {
		+String id
		+Timestamp created_at
		+Timestamp updated_at
	}

    class Product_shop {
      +String name
      +String description
      +String picture
	    +String picture2
	    +String picture3
	    +Float price
	    +bool is_active
	    +bool is_in_stock
    }

    class Personne {
      +String pseudo
      +String email
      +String password
	    +String last_name
	    +String first_name
	    +String adress1
	    +String adress2
	    +String postal code
	    +String city
      +String picture
      +Float weight
      +Float size
    }


    class Exercice {
      +String description
      +String picture
      +String category<Arms,Legs,Back,...>
      +Float time
    }

    class Exercise_schedule {
      +Date date_exercice
      +String comment
    }


    class Admin {
	    +bool is_admin
	    +removeReviews()
      +addArticle()
    }

    class User {
	    +bool is_subscribe
      +String physical_constraint
      +String allergy_comment
	    +addReview()
    }

    class Reviews {
	    +String text
	    +Integer rating
    }

    class Coach {
	    +String certif
	    +String description
	    +String experience
	    +bool is_coach
	    +bool is_diet
	    +addTraining()
    }

    class Subscription {
	    +Date date
	    +Boolean OptionDiet
	    +Boolean OptionMessage
    }

    class Message {
	    +Date dateStar
	    +Boolean is_read
	    +String text
    }
    Exercice <-- Exercise_schedule
    User <-- Exercise_schedule
    Coach <-- Exercice
    Personne <|-- Admin
    Personne <|-- User
    Coach <-- Reviews
    User <-- Reviews
    Coach <-- Subscription
    User <-- Subscription
    Coach <-- Message
    User <-- Message
    Personne <|-- Coach


```

# 1. Design System Architecture: 
- Front-end: CSS, JS, HTML
- Back-end: Python
- Database: sqlite


  # 4. Document External and Internal APIs

| **Action**            | **Endpoint**               | **Method** | **Input**                                                                                                         | **Output**                                                                                                                                                                             |
| --------------------- | -------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Get All Users**     | `/api/v1/users`            | GET        | *(none)*                                                                                                          | `json { "users": [ { "id": 1, "name": "John Doe", "role": "coach", "email": "john@example.com" }, { "id": 2, "name": "Sarah Lee", "role": "diet", "email": "sarah@example.com" } ] } ` |
| **Get User by ID**    | `/api/v1/users/{user_id}`  | GET        | `user_id` (URL param)                                                                                             | `json { "id": 1, "name": "John Doe", "role": "coach", "email": "john@example.com" } `                                                                                                  |
| **Get Users by Role** | `/api/v1/users?role=coach` | GET        | `role` (query param)                                                                                              | `json { "users": [ { "id": 1, "name": "John Doe", "role": "coach" } ] } `                                                                                                              |
| **Create User**       | `/api/v1/users`            | POST       | `json { "name": "Anna Smith", "email": "anna@example.com", "password": "securePass123", "role": "simple_user" } ` | `json { "message": "User created successfully", "user": { "id": 3, "name": "Anna Smith", "role": "simple_user" } } `                                                                   |
| **Update User**       | `/api/v1/users/{user_id}`  | PUT        | `json { "name": "Anna Smith", "role": "coach" } `                                                                 | `json { "message": "User updated successfully", "user": { "id": 3, "name": "Anna Smith", "role": "coach" } } `                                                                         |
| **Delete User**       | `/api/v1/users/{user_id}`  | DELETE     | `user_id` (URL param)                                                                                             | `json { "message": "User deleted successfully" } `                                                                                                                                     |

All users are in a table users but they have Boolean/TYPE to specify if there are
-Admin
-Diet
-Coach
-Subscriber
-Simple user register

