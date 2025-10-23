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

# FitnessHub Backend Work by Sebastien

# Phase A – API & Database Design

Defined the data models (User, Coach, Product, Subscription) with appropriate fields: first_name, last_name, picture, coach_experience, etc.

Created database schema / migrations (tables, relations) pour gérer coaches, users, produits, abonnements.

# Phase B – API Endpoints Implementation

Built register endpoint (POST /api/v1/register) to create users or coaches.

Built login/authentication endpoint to validate credentials, generate tokens, return user data.

Built product endpoints: e.g. GET /api/v1/product_shop to retrieve product list.

Built coach endpoints: e.g. GET /api/v1/user/coach to retrieve coach data.

Possibly endpoints to manage subscriptions, user profile, etc.

# Phase C – Security & Token Handling

Integrated JWT (token-based authentication) or token mechanism for secure access.

Middleware / guards to ensure protected routes require valid token.

Hashing passwords (ex: bcrypt) and storing securely in database.

# Phase D – Swagger / API Documentation

Set up Swagger (OpenAPI) documentation, exposing the API schema, endpoints, models, and responses.

Ensured endpoints, request bodies, response payloads match front-end expectations (fields, naming).

# Phase E – Testing & Integration

Tested endpoints via Postman / Swagger to ensure data operations work (CRUD).

Validated correct JSON output, correct status codes, error handling.

Debugged mismatches with front-end: aligning JSON keys with front-end usage.


- We have a main branch on git hub and one branch for each member
- When a task seems good we merge on the main and call other member to pull the modification

# 2. Monitor Progress and Adjust
# Daily Stand-Ups

Every day, we hold a short 5–15 minute meeting on Discord to review our progress.
Each team member explains:

What they did yesterday

What they plan to do today

If they are facing any blockers

This allows us to identify problems early and help each other when something is stuck.
For example:

Evgeni (Front-End) shares updates about connecting pages like coach.html or shop.html with the backend.

Sébastien (Back-End) explains the API progress or fixes issues with authentication routes or database connections.

# Project Management Tools

We use Trello and a shared whiteboard to organize our tasks and follow the Agile method.
Each card in Trello represents a task, with three columns:

To Do – tasks planned for the current sprint

In Progress – what’s currently being developed

Done – completed tasks

We regularly update task statuses to visualize overall progress.
This method helps us track:

Sprint velocity (tasks completed per sprint)

Percentage of tasks completed vs. planned

Number of bugs or integration issues fixed each week

# Adjust When Needed

We frequently adjust sprint goals and task ownership depending on progress:

If one member finishes early, they anticipate the next task or help another teammate.
For example, when one front-end developer finished building static pages, he started connecting them to the backend API.

If the backend was delayed, the front-end team worked on static mock pages and prepared API integrations in advance.

Tasks were reassigned when necessary to balance workload and maintain steady progress.

# Metrics and Tracking

During each sprint, we monitored a few key indicators:

Sprint velocity: average number of tasks completed per week

Task completion rate: proportion of completed tasks vs. planned ones


# 3. Conduct Sprint Reviews and Retrospectives

We worked with four weeks of sprints. At the end of each sprint, our team of three met to talk about the progress and test the new features.
We didn’t do real sprint reviews, but we tested all the new pages and backend features directly on our own branches before pushing to the main branch. This helped us make sure everything was working correctly before integration.

During our retrospectives, we talked about what went well and what we could do better.
We noticed that our communication improved a lot during the project. We also got better with the backend, especially with connecting the API to the frontend. Finally, we improved our debugging skills — we learned how to find and fix bugs faster.

For the next sprints, we planned to keep this same workflow, but with better time management and clearer task organization.


# 4. Final Integration and QA Testing
# 5. Deliverables
- presentation of the article of shop ( without buying )
- presentation of the subscription ( easy, medium, elite )
- display message between coach and user with workout and diet
- a coach can choose a user and add diet and workout program
- list of coach
- register a coach or user
