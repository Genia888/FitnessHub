# Stage 0: Plan and Define Sprints

**Mandatory**  
**Purpose:** To divide the development phase into short, manageable iterations.

---

## Table of Contents
1. [Overview](#overview)
2. [Sprint Planning Instructions](#sprint-planning-instructions)
3. [MoSCoW Prioritization Framework](#moscow-prioritization-framework)
4. [Sprint Breakdown](#sprint-breakdown)
5. [Task Dependencies](#task-dependencies)
6. [Team Assignments](#team-assignments)
7. [Deliverable Section](#deliverable-section)

---

## Overview

This document outlines the sprint planning strategy for the FitnessHub MVP development. The project is divided into multiple sprints, each lasting 1-2 weeks, with clearly defined goals, deliverables, and responsibilities.

**Project Context:**
- **Application Type:** Fitness management platform with user, trainer, and admin roles
- **Tech Stack:** Flask (Backend), Vanilla JS (Frontend), SQLite (Database)
- **Team Size:** 3 developers (Sebastien, Evgeni, Elhadj)
- **Total Development Time:** ~8-10 weeks (4-5 sprints)

---

## Sprint Planning Instructions

### 1. Break Down User Stories
- Decompose each user story into smaller, actionable tasks
- Each task should be completable within 1-3 days
- Tasks must have clear acceptance criteria
- Link tasks to specific files/modules in the codebase

### 2. Prioritize Using MoSCoW
- **Must Have:** Critical features required for MVP launch
- **Should Have:** Important features that add significant value
- **Could Have:** Nice-to-have features if time permits
- **Won't Have:** Features explicitly out of scope for MVP

### 3. Identify Dependencies
- Map technical dependencies between tasks
- Identify blockers that could delay progress
- Ensure backend API endpoints are ready before frontend integration
- Database schema must be finalized before CRUD operations

### 4. Define Sprint Duration
- **Recommendation:** 2-week sprints
- **Sprint 0:** 1 week (setup and planning)
- **Regular Sprints:** 2 weeks each
- **Buffer:** Include time for testing, bug fixes, and documentation

### 5. Assign Responsibilities
- Distribute tasks based on team expertise
- Balance workload across team members
- Ensure knowledge sharing and no single point of failure
- Cross-functional tasks for better collaboration

---

## MoSCoW Prioritization Framework

### Must Have (Critical for MVP)
- ✅ User authentication and registration
- ✅ User profile management (CRUD operations)
- ✅ Role-based access control (User, Trainer, Admin)
- ✅ Trainer dashboard with client list
- ✅ User dashboard with subscription status
- ✅ Workout schedule display
- ✅ Nutrition schedule display
- ✅ Basic subscription management
- ✅ Responsive UI for main pages

### Should Have (High Value)
- ⚡ Product shop/boutique functionality
- ⚡ Shopping cart and checkout
- ⚡ Review and rating system
- ⚡ Messaging system between users and trainers
- ⚡ Subscription upgrade/downgrade flow
- ⚡ Admin panel for user management
- ⚡ Test data generation scripts

### Could Have (Nice to Have)
- 💡 Real-time notifications
- 💡 Advanced analytics dashboard
- 💡 Email notifications
- 💡 Social media integration
- 💡 Mobile-optimized views
- 💡 Dark mode

### Won't Have (Out of Scope for MVP)
- ❌ Video calling between trainer and user
- ❌ Smartwatch/fitness tracker integration
- ❌ Payment gateway integration (real payments)
- ❌ Mobile native apps (iOS/Android)
- ❌ Multi-language support
- ❌ Advanced AI workout recommendations

---

## Sprint Breakdown

### Sprint 0: Setup and Foundation (Week 1)
**Duration:** 1 week  
**Goal:** Set up development environment and project infrastructure

#### Tasks:
1. **Repository Setup** (Sebastien)
   - Initialize Git repository
   - Create `.gitignore` for Python, Node, and IDE files
   - Set up branch protection rules
   - Define Git workflow (feature branches, PR reviews)
   - **Files:** `.gitignore`, `README.md`

2. **Environment Configuration** (Sebastien)
   - Set up Python virtual environment
   - Install dependencies from `requirements.txt`
   - Configure Flask application structure
   - Set up SQLite database
   - **Files:** `requirements.txt`, `config.py`, `run.py`

3. **Database Schema Design** (Sebastien)
   - Create database tables (Users, Subscriptions, Products, etc.)
   - Define relationships and constraints
   - Create initial migration scripts
   - **Files:** `create_table.sql`, `create_users.sql`

4. **Frontend Structure** (Evgeni)
   - Organize HTML pages structure
   - Set up CSS architecture (variables, base styles)
   - Create reusable UI components
   - **Files:** `styles/`, `pages/`, `scripts/`

5. **Documentation** (All)
   - Define user stories and acceptance criteria
   - Create sprint backlog
   - Document API endpoints (initial draft)
   - **Files:** `Documentation/`

#### Deliverables:
- ✅ Working development environment for all team members
- ✅ Database schema created and tested
- ✅ Project structure documented
- ✅ Sprint backlog with prioritized tasks

---

### Sprint 1: Authentication & Core Pages (Weeks 2-3)
**Duration:** 2 weeks  
**Goal:** Implement user authentication and main static pages

#### Backend Tasks (Sebastien):
1. **Authentication API** (Must Have)
   - POST `/api/v1/auth/register` - User registration
   - POST `/api/v1/auth/login` - User login with JWT
   - POST `/api/v1/auth/logout` - User logout
   - GET `/api/v1/auth/me` - Get current user info
   - **Files:** `app/api/v1/auth.py`, `app/models/user.py`
   - **Acceptance Criteria:**
     - Password hashing with bcrypt
     - JWT token generation and validation
     - Error handling for invalid credentials
     - Email validation

2. **User Model & Repository** (Must Have)
   - Implement User model with role field
   - CRUD operations in repository pattern
   - Password encryption
   - **Files:** `app/models/user.py`, `app/persistence/repository.py`

3. **Test Data Creation** (Should Have)
   - Create script to generate test users
   - Include users with different roles (user, trainer, admin)
   - **Files:** `create_test_data.py`, `show_test_users.py`

#### Frontend Tasks (Evgeni):
1. **Landing Page** (Must Have)
   - Hero section with CTA
   - Features showcase
   - Trainer profiles section
   - Contact form
   - **Files:** `landing_page/index.html`, `landing_page/css/`
   - **Dependencies:** Static assets (images, fonts)

2. **Login & Registration Pages** (Must Have)
   - Login form with validation
   - Registration form with role selection
   - Password strength indicator
   - Form error handling
   - **Files:** `pages/login.html`, `pages/connexion.html`
   - **Scripts:** `scripts/login.js`, `scripts/connexion.js`

3. **API Service Layer** (Must Have)
   - Create fetch wrapper for API calls
   - Handle authentication headers
   - Error handling and user feedback
   - **Files:** `scripts/api-service.js`, `scripts/auth-manager.js`

#### Integration Tasks (Evgeni + Sebastien):
1. **Connect Frontend to Auth API**
   - Integrate login form with `/api/v1/auth/login`
   - Integrate registration form with `/api/v1/auth/register`
   - Store JWT token in localStorage/cookies
   - Implement auth state management
   - **Files:** `scripts/cookie.js`, `scripts/auth-manager.js`

#### Deliverables:
- ✅ Fully functional authentication system (backend + frontend)
- ✅ Working login and registration pages
- ✅ Landing page with navigation
- ✅ Test users created in database
- ✅ API documentation for auth endpoints

---

### Sprint 2: User Dashboard & Profiles (Weeks 4-5)
**Duration:** 2 weeks  
**Goal:** Implement user profile management and basic dashboards

#### Backend Tasks (Sebastien):
1. **User Profile API** (Must Have)
   - GET `/api/v1/user/:id` - Get user profile
   - PUT `/api/v1/user/:id` - Update user profile
   - GET `/api/v1/user/:id/subscription` - Get user subscription
   - **Files:** `app/api/v1/user.py`
   - **Acceptance Criteria:**
     - Authorization check (user can only edit own profile)
     - Input validation
     - Profile picture upload support

2. **Subscription API** (Should Have)
   - GET `/api/v1/subscription` - List all subscriptions
   - POST `/api/v1/subscription/:id/subscribe` - Subscribe user
   - **Files:** `app/api/v1/subscription.py`, `app/models/subscription.py`

3. **Workout & Nutrition Schedule API** (Must Have)
   - GET `/api/v1/workout-schedule/:userId` - Get user's workout plan
   - GET `/api/v1/nutrition-schedule/:userId` - Get user's nutrition plan
   - **Files:** `app/api/v1/workout_schedule.py`, `app/api/v1/nutrition_schedule.py`

#### Frontend Tasks (Evgeni):
1. **User Account Page** (Must Have)
   - Display user profile information
   - Edit profile form
   - Change password functionality
   - Subscription status display
   - **Files:** `pages/user_account.html`, `scripts/user_account.js`

2. **Subscriber Dashboard** (Should Have)
   - Display assigned workout schedule
   - Display nutrition plan
   - Show upcoming sessions
   - Progress tracking (basic)
   - **Files:** `pages/subscriber.html`, `scripts/subscriber.js`

3. **Subscription Page** (Should Have)
   - Display available subscription plans
   - Comparison table
   - Subscribe button with API integration
   - **Files:** `pages/abonnement.html`, `scripts/abonnement.js`

#### Testing Tasks (Sebastien):
1. **Create Test Data Scripts** (Should Have)
   - Generate realistic workout schedules
   - Generate nutrition plans
   - Assign schedules to test users
   - **Files:** `create_test_data.py`

#### Deliverables:
- ✅ User profile view and edit functionality
- ✅ Subscriber dashboard with workout/nutrition display
- ✅ Subscription listing and enrollment
- ✅ Test data for schedules and subscriptions
- ✅ Responsive design for user pages

---

### Sprint 3: Trainer Dashboard & Management (Weeks 6-7)
**Duration:** 2 weeks  
**Goal:** Build trainer-specific features and client management

#### Backend Tasks (Sebastien):
1. **Trainer-Client Relationship** (Must Have)
   - GET `/api/v1/user/trainer/:trainerId/clients` - Get trainer's clients
   - POST `/api/v1/user/assign-trainer` - Assign trainer to user
   - **Files:** `app/api/v1/user.py`

2. **Schedule Management API** (Should Have)
   - POST `/api/v1/workout-schedule` - Create workout schedule
   - PUT `/api/v1/workout-schedule/:id` - Update schedule
   - DELETE `/api/v1/workout-schedule/:id` - Delete schedule
   - POST `/api/v1/nutrition-schedule` - Create nutrition plan
   - PUT `/api/v1/nutrition-schedule/:id` - Update plan
   - **Files:** `app/api/v1/workout_schedule.py`, `app/api/v1/nutrition_schedule.py`

3. **Messaging System** (Could Have)
   - POST `/api/v1/message` - Send message
   - GET `/api/v1/message/:userId` - Get messages for user
   - **Files:** `app/api/v1/message.py`, `app/models/message.py`

#### Frontend Tasks (Elhadj + Evgeni):
1. **Trainer Dashboard** (Must Have)
   - List of assigned clients
   - Client search and filter
   - Quick stats overview
   - Navigation to client details
   - **Files:** `pages/trainer.html`, `scripts/trainer.js`

2. **Coach Account Page** (Must Have)
   - Trainer profile management
   - Availability settings
   - Specializations/certifications
   - **Files:** `pages/coach_account.html`, `scripts/coach_account.js`

3. **Client List Page** (Should Have)
   - Detailed client information
   - Assign/edit workout schedules
   - Assign/edit nutrition plans
   - Client progress view
   - **Files:** `pages/clients_list.html`, `scripts/coach-dashboard.js`

4. **Coach Navigation** (Must Have)
   - Role-based menu
   - Quick actions sidebar
   - **Files:** `scripts/coach-navigation.js`

#### Integration Tasks (All):
1. **End-to-End Testing**
   - Test trainer-client workflow
   - Test schedule creation and assignment
   - Verify authorization rules

#### Deliverables:
- ✅ Trainer dashboard with client management
- ✅ Schedule creation and assignment functionality
- ✅ Messaging system (basic)
- ✅ Client list with details
- ✅ Role-based navigation working correctly

---

### Sprint 4: Shop & Final Features (Weeks 8-9)
**Duration:** 2 weeks  
**Goal:** Implement e-commerce features and finalize MVP

#### Backend Tasks (Sebastien):
1. **Product Shop API** (Should Have)
   - GET `/api/v1/products` - List all products
   - GET `/api/v1/products/:id` - Get product details
   - POST `/api/v1/products` - Create product (admin only)
   - PUT `/api/v1/products/:id` - Update product
   - DELETE `/api/v1/products/:id` - Delete product
   - **Files:** `app/api/v1/product_shop.py`, `app/models/product_shop.py`

2. **Review System** (Should Have)
   - POST `/api/v1/review` - Create review
   - GET `/api/v1/review/:productId` - Get product reviews
   - **Files:** `app/api/v1/review.py`, `app/models/review.py`

3. **Order Management** (Could Have)
   - POST `/api/v1/order` - Create order
   - GET `/api/v1/order/:userId` - Get user orders
   - **Files:** `app/api/v1/order.py` (if created)

#### Frontend Tasks (Evgeni):
1. **Boutique/Shop Page** (Should Have)
   - Product grid layout
   - Product search and filters
   - Add to cart functionality
   - **Files:** `pages/boutique.html`, `scripts/boutique.js`, `scripts/shop.js`

2. **Shopping Cart** (Should Have)
   - Cart items display
   - Update quantity
   - Remove items
   - Calculate total
   - Checkout button
   - **Files:** `pages/cart.html`, `scripts/cart.js`

3. **Product Details Modal** (Could Have)
   - Product images gallery
   - Description and specifications
   - Reviews display
   - Add review form
   - **Files:** `scripts/shop.js`

#### UI/UX Improvements (All):
1. **Responsive Design** (Must Have)
   - Mobile-friendly layouts
   - Tablet breakpoints
   - Touch-friendly interactions
   - **Files:** All CSS files in `styles/`

2. **Animations & Interactions** (Could Have)
   - Smooth page transitions
   - Loading states
   - Form validation feedback
   - **Files:** `styles/animations.css`, `vendor/gsap/`

3. **Accessibility** (Should Have)
   - Keyboard navigation
   - ARIA labels
   - Focus indicators
   - Screen reader support

#### Bug Fixes & Polish (All):
1. **Critical Bugs** (Must Have)
   - Fix authentication issues
   - Resolve data persistence bugs
   - Fix API error handling

2. **Performance Optimization** (Should Have)
   - Optimize database queries
   - Minimize API calls
   - Lazy load images

3. **Code Cleanup** (Should Have)
   - Remove console.logs
   - Clean up commented code
   - Refactor duplicated code

#### Deliverables:
- ✅ Fully functional product shop
- ✅ Shopping cart with checkout flow
- ✅ Review and rating system
- ✅ All pages responsive and accessible
- ✅ MVP ready for testing and demo

---

### Sprint 5: Testing & Documentation (Weeks 10)
**Duration:** 1 week  
**Goal:** Final testing, bug fixes, and documentation

#### Testing Tasks (All):
1. **Integration Testing**
   - Test all user workflows end-to-end
   - Test different user roles
   - Cross-browser testing

2. **User Acceptance Testing**
   - Demo to stakeholders
   - Gather feedback
   - Prioritize final fixes

3. **Performance Testing**
   - Load testing for API
   - Frontend performance audit
   - Database query optimization

#### Documentation Tasks (All):
1. **Technical Documentation** (Must Have)
   - API documentation (endpoints, parameters, responses)
   - Database schema documentation
   - Deployment guide
   - **Files:** `Documentation/`

2. **User Documentation** (Should Have)
   - User manual
   - FAQ
   - Troubleshooting guide

3. **Code Documentation** (Should Have)
   - Add docstrings to Python functions
   - Add JSDoc comments to JavaScript
   - Update README.md

#### Deliverables:
- ✅ Fully tested MVP
- ✅ Complete technical documentation
- ✅ Deployment-ready application
- ✅ User guide and documentation

---

## Task Dependencies

### Critical Path Dependencies

```
Database Schema (Sprint 0)
    ↓
User Model & Auth API (Sprint 1)
    ↓
Frontend Auth Integration (Sprint 1)
    ↓
User Profile API (Sprint 2)
    ↓
Dashboard Pages (Sprint 2)
    ↓
Trainer-Client Relationship (Sprint 3)
    ↓
Schedule Management (Sprint 3)
```

### Parallel Tracks

**Track 1: Authentication Flow**
- Backend: Auth API → User Model → JWT Implementation
- Frontend: Login Page → Registration Page → Auth State Management

**Track 2: Dashboard Development**
- Backend: Profile API → Schedule API → Subscription API
- Frontend: User Dashboard → Trainer Dashboard → Schedule Display

**Track 3: E-commerce**
- Backend: Product API → Review API → Order API
- Frontend: Shop Page → Cart → Checkout

### Dependency Matrix

| Task | Depends On | Blocks |
|------|-----------|--------|
| Database Schema | None | All API development |
| Auth API | Database Schema | User Profile API, All protected routes |
| Login Page | Auth API | All authenticated pages |
| User Profile API | Auth API | Dashboard pages |
| Trainer Dashboard | Trainer-Client API, Auth | Schedule assignment |
| Product API | Database Schema | Shop frontend |
| Shop Page | Product API | Cart functionality |

---

## Team Assignments

### Sebastien (Backend Developer)
**Primary Responsibilities:**
- Backend API development (Flask)
- Database schema and migrations
- Authentication and authorization
- Data models and repositories
- Test data generation
- API documentation

**Sprints:**
- Sprint 0: Database setup, Flask configuration
- Sprint 1: Authentication API, User model
- Sprint 2: Profile API, Subscription API, Schedule API
- Sprint 3: Trainer API, Messaging API
- Sprint 4: Product API, Review API
- Sprint 5: Testing, documentation

**Key Files:**
- `app/api/v1/*.py`
- `app/models/*.py`
- `app/persistence/repository.py`
- `config.py`
- `create_test_data.py`

---

### Evgeni (Frontend Developer)
**Primary Responsibilities:**
- Frontend pages development
- JavaScript functionality
- API integration (frontend)
- UI/UX implementation
- Responsive design
- Shop/E-commerce features

**Sprints:**
- Sprint 0: Frontend structure, CSS architecture
- Sprint 1: Landing page, Login/Registration pages
- Sprint 2: User dashboard, Subscriber page, Subscription page
- Sprint 3: Client list UI (support Elhadj)
- Sprint 4: Shop, Cart, Product pages
- Sprint 5: UI polish, accessibility

**Key Files:**
- `pages/*.html`
- `scripts/*.js`
- `styles/*.css`
- `landing_page/`

---

### Elhadj (Frontend Developer)
**Primary Responsibilities:**
- Trainer-specific pages
- Coach dashboard
- Client management UI
- Navigation components
- Form validation
- UI components

**Sprints:**
- Sprint 0: UI components, base styles
- Sprint 1: Support login/registration pages
- Sprint 2: Support user pages, forms
- Sprint 3: Trainer dashboard, Coach pages, Client list
- Sprint 4: UI improvements, animations
- Sprint 5: Testing, bug fixes

**Key Files:**
- `pages/trainer.html`, `pages/coach_account.html`, `pages/clients_list.html`
- `scripts/trainer.js`, `scripts/coach-dashboard.js`, `scripts/coach-navigation.js`
- `styles/coach-dashboard.css`

---

## Deliverable Section

### Complete Sprint Plan Summary

#### Sprint 0 (1 week): Foundation
- **Owner:** All team members
- **Deadline:** End of Week 1
- **Deliverables:**
  - ✅ Development environment setup
  - ✅ Database schema created (`create_table.sql`, `create_users.sql`)
  - ✅ Project structure documented
  - ✅ Prioritized backlog (MoSCoW)

#### Sprint 1 (2 weeks): Authentication & Core Pages
- **Owners:** Sebastien (Backend), Evgeni (Frontend)
- **Deadline:** End of Week 3
- **Deliverables:**
  - ✅ Authentication API with JWT
  - ✅ Login and Registration pages functional
  - ✅ Landing page complete
  - ✅ Test users created
  - ✅ Frontend-backend integration working

#### Sprint 2 (2 weeks): User Dashboard & Profiles
- **Owners:** Sebastien (Backend), Evgeni (Frontend)
- **Deadline:** End of Week 5
- **Deliverables:**
  - ✅ User profile CRUD operations
  - ✅ Subscriber dashboard with schedules
  - ✅ Subscription management
  - ✅ Test data for schedules
  - ✅ Responsive user pages

#### Sprint 3 (2 weeks): Trainer Dashboard
- **Owners:** Sebastien (Backend), Elhadj + Evgeni (Frontend)
- **Deadline:** End of Week 7
- **Deliverables:**
  - ✅ Trainer dashboard with client list
  - ✅ Schedule creation and assignment
  - ✅ Messaging system (basic)
  - ✅ Role-based navigation
  - ✅ Trainer-client workflows tested

#### Sprint 4 (2 weeks): Shop & Final Features
- **Owners:** Sebastien (Backend), Evgeni (Frontend), All (Polish)
- **Deadline:** End of Week 9
- **Deliverables:**
  - ✅ Product shop functional
  - ✅ Shopping cart and checkout
  - ✅ Review system
  - ✅ All pages responsive
  - ✅ Critical bugs fixed
  - ✅ MVP feature-complete

#### Sprint 5 (1 week): Testing & Documentation
- **Owners:** All team members
- **Deadline:** End of Week 10
- **Deliverables:**
  - ✅ End-to-end testing complete
  - ✅ API documentation
  - ✅ User guide
  - ✅ Deployment-ready MVP
  - ✅ Final demo prepared

---

### Acceptance Criteria (Overall MVP)

#### Functional Requirements
- ✅ Users can register and log in
- ✅ Users can view and edit their profiles
- ✅ Users can subscribe to services
- ✅ Trainers can view their client list
- ✅ Trainers can assign workout and nutrition schedules
- ✅ Users can view their assigned schedules
- ✅ Users can browse and purchase products
- ✅ Users can leave reviews
- ✅ Role-based access control works correctly

#### Technical Requirements
- ✅ All API endpoints documented
- ✅ Database schema normalized and optimized
- ✅ Frontend works on desktop and mobile
- ✅ No critical security vulnerabilities
- ✅ Code follows team coding standards
- ✅ Test coverage for critical paths

#### Quality Requirements
- ✅ Page load time < 3 seconds
- ✅ No console errors in production
- ✅ Accessible (WCAG AA standards)
- ✅ Cross-browser compatible (Chrome, Firefox, Safari)
- ✅ Responsive design (mobile, tablet, desktop)

---

### Risk Management

#### Identified Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Team member unavailable | High | Medium | Cross-train on key features, documentation |
| API delays blocking frontend | High | Medium | Create mock data/endpoints for parallel work |
| Scope creep | Medium | High | Strict MoSCoW prioritization, sprint reviews |
| Technical debt accumulation | Medium | Medium | Code reviews, refactoring time in sprints |
| Integration issues | High | Medium | Early integration, continuous testing |
| Database performance | Low | Low | Query optimization, indexing |

---

### Success Metrics

#### Sprint Success Criteria
- All "Must Have" tasks completed
- No critical bugs open
- Sprint demo successful
- Documentation updated
- Code reviewed and merged

#### Overall Project Success
- MVP launched on time (Week 10)
- All core features functional
- Positive stakeholder feedback
- Technical documentation complete
- Team velocity stable across sprints

---

## References

### Key Project Files
- **Backend API Routes:** `app/api/v1/`
- **Data Models:** `app/models/`
- **Frontend Pages:** `pages/`
- **Frontend Scripts:** `scripts/`
- **Styles:** `styles/`
- **Database Scripts:** `create_table.sql`, `create_users.sql`
- **Test Data:** `create_test_data.py`, `show_test_users.py`
- **Configuration:** `config.py`, `run.py`

### Documentation
- [Stage 1: Team Formation and Idea Development](Documentation/(Stage%201)%20Team%20Formation%20and%20Idea%20Development.md)
- [Stage 2: Project Charter Development](Documentation/(Stage%202)%20Project%20Charter%20Development.md)
- [Stage 3: Technical Documentation](Documentation/(Stage%203)%20Technical%20Documentation.md)
- [Stage 4: MVP Development and Execution](Documentation/(Stage%204)%20MVP%20Development%20and%20Execution.md)
- [README.md](README.md)

---

**Document Version:** 1.0  
**Last Updated:** October 23, 2025  
**Authors:** Sebastien, Evgeni, Elhadj  
**Status:** Active Sprint Planning Document
