# 0. Plan and Define Sprints
  - Week 1
    => Sebastien - backend : create structure of table and model/api
    => Evgeni - Elhadj - frontend : create all pages of the project in HTML and CSS
  - Week 2
    => Sebastien - backend : create structure of table and model/api
    => Sebastien - backend : create data to be display by default when the user display pages data for shop, default account admin and coach sample.
    => Evgeni - Elhadj front end : improve pages/styles
  - Week 3
    => Sebastien backend : create structure of table and model/api
    => Evgeni - Elhadj backend/front : work to link backend and frontend together to display data dynamiclly
  - Week 4
    => Evgeni - Sebastien - Elhadj backend/front : work to link backend and frontend + debug
    => Evgeni - made the Landing page of the project 
    => create documentation of stage 4


# 1. Execute Development Tasks

## Elhadj
Has a part of the "frontend" specialist member, my focus was on the visual aspect firstly, then I worked on the backend (linked back and front together mostly) when all the pages was finish.
Here is my contribution in details: 

# Phase 1 – Front-End Structure & Static Pages

Created main HTML pages

Built the base layout with header, navigation menu, and containers for each section.

Added global styles through main.css and organized assets (images, icons).

Structured the project folder properly:
pages/, scripts/, styles/, and public/images/ready.

# Phase 2 – API Integration & Dynamic Rendering

Connected the Front-End with the Back-End API using fetch() calls.

Created shop.js → fetches products from http://127.0.0.1:5000/api/v1/product_shop and displays them dynamically.

Created coach.js → fetches coaches from the backend (/api/v1/user/coach) and renders coach cards.

Replaced static HTML with dynamic generation using JavaScript.

Added debugging logs in the console to verify data flow.

# Phase 3 – Cookie, Token & Session Management

Built a dedicated cookie.js file with modules:

CookieManager → handles saving, retrieving, and deleting tokens.

UserSession → stores and retrieves user profile data.

CartManager & SubscriptionManager → for cart and subscription state.

Linked cookie.js to key pages (shop, coaches, subscriptions, etc.).

Implemented persistent session logic using cookies and localStorage.

Created connexion.js → manages login form submission, sends POST request to the backend,
receives { token, user }, stores both, and redirects based on role (coach or user).

Updated login.js → same pattern, but for user/coach registration with token storage.

# Phase 4 – UI & Visual Adjustments

Refined the look of dynamically loaded content: product and coach cards.

Improved grid layout consistency, padding, and spacing.

Adjusted image sizes (larger visuals for products).

Re-aligned button colors to match FitnessHub’s visual identity.

Verified responsive design and maintained previous style after connecting the backend.

Ensured UI stayed modern and cohesive even after adding dynamic rendering.

# Phase 5 – Authentication Flow Testing & Backend Validation

Linked login.html and connexion.html with backend endpoints.

Confirmed that user and coach registration/connection correctly POST requests to the API.

Verified token creation and cookie storage in the browser.

Tested integration with Swagger to confirm new users/coaches are saved in the backend.

Began debugging and verifying role-based redirections (user_account.html, coach_account.html).



# 2. Monitor Progress and Adjust
- We used the methode agile to check the progress of the project
- two call by week
- We have a main branch on git hub and one branch for each member
- When a task seems good we merge on the main and call other member to pull the modification


# 3. Conduct Sprint Reviews and Retrospectives
- We used Discord to check for Progress time
- we check two time by week where we are in the project


# 4. Final Integration and QA Testing
# 5. Deliverables
- presentation of the article of shop ( without buying )
- presentation of the subscription ( easy, medium, elite )
- display message between coach and user with workout and diet
- a coach can choose a user and add diet and workout program
- list of coach
- register a coach or user
