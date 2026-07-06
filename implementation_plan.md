# Customer Sign Up, Login, and Profile Management — Implementation Plan

We will add customer registration (sign up), login, and profile dashboard features:
1. **Database Schema**: Add `email` and `phone` columns to `users`, and create an `addresses` table (one-to-many relationship) to support multiple shipment addresses (Home, Office, Other).
2. **Backend REST APIs**:
   * `POST /api/auth/signup`: Registers a new customer user (`ROLE_USER`).
   * `GET /api/users/profile`: Retrieves the logged-in customer's details and addresses.
   * `PUT /api/users/profile`: Updates profile fields (`username`, optional `password`, `phone`, `addresses`). Email is read-only.
3. **Spring Security**: Enable `ROLE_USER` permissions for profile paths, and ensure custom security configs protect personal profiles.
4. **Frontend integration**:
   * Combine Login and Sign Up into a unified modal.
   * Add a profile management screen (`#/profile`) matching the Midnight Indigo & Rose Gold theme where users can edit their profile and manage their shipping addresses.

---

## Proposed Changes

### 1. Database & Model Layer (Lombok Enabled)

#### [MODIFY] [User.java](file:///d:/Project/Antigravity/Sample/backend/src/main/java/com/vastraloom/api/model/User.java)
* Add fields:
  * `@Column(unique = true)` `email`
  * `phone`
  * `@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)` `@JoinColumn(name = "user_id")` `List<Address> addresses`

#### [NEW] [Address.java](file:///d:/Project/Antigravity/Sample/backend/src/main/java/com/vastraloom/api/model/Address.java)
Create JPA entity representing shipping addresses:
* `id` (Long, PK)
* `addressType` (String: e.g. "HOME", "OFFICE", "OTHER")
* `fullName` (String, recipient's name)
* `streetAddress` (String)
* `city` (String)
* `state` (String)
* `pincode` (String)
* `landmark` (String)
* `country` (String)

---

### 2. Backend Security & API Layer

#### [MODIFY] [WebSecurityConfig.java](file:///d:/Project/Antigravity/Sample/backend/src/main/java/com/vastraloom/api/config/WebSecurityConfig.java)
* Permit `POST /api/auth/signup` publicly.
* Require authentication (`hasAnyRole("USER", "ADMIN")`) for:
  * `GET /api/users/profile`
  * `PUT /api/users/profile`

#### [NEW] [UserProfileResponse.java](file:///d:/Project/Antigravity/Sample/backend/src/main/java/com/vastraloom/api/dto/UserProfileResponse.java)
DTO for user profile information:
* `username`, `email`, `phone`, `addresses` list.

#### [NEW] [ProfileUpdateRequest.java](file:///d:/Project/Antigravity/Sample/backend/src/main/java/com/vastraloom/api/dto/ProfileUpdateRequest.java)
DTO containing profile update payload:
* `username`, `password` (optional), `phone`, `addresses` list.

#### [NEW] [SignupRequest.java](file:///d:/Project/Antigravity/Sample/backend/src/main/java/com/vastraloom/api/dto/SignupRequest.java)
DTO containing registration payload:
* `username`, `email`, `password`, `phone`.

#### [MODIFY] [AuthController.java](file:///d:/Project/Antigravity/Sample/backend/src/main/java/com/vastraloom/api/controller/AuthController.java)
* Add `/api/auth/signup` endpoint:
  * Verifies if username/email already exists.
  * Encodes password using `PasswordEncoder` BCrypt.
  * Saves new `User` with role `"ROLE_USER"`.

#### [NEW] [UserController.java](file:///d:/Project/Antigravity/Sample/backend/src/main/java/com/vastraloom/api/controller/UserController.java)
* Implement `/api/users/profile` (GET):
  * Gets authenticated username from SecurityContext.
  * Queries database and returns `UserProfileResponse`.
* Implement `/api/users/profile` (PUT):
  * Validates update requests.
  * Updates username, password (if provided), and phone.
  * Syncs/replaces user's address collection.

---

### 3. Frontend Integration & UI Screens

#### [MODIFY] [AuthContext.jsx](file:///d:/Project/Antigravity/Sample/frontend/src/context/AuthContext.jsx)
* Expand to manage customer authentication:
  * `isCustomerLoggedIn` state, `customerToken`, and `customerInfo`.
  * `signup(username, email, password, phone)` calling `POST /api/auth/signup`.
  * `customerLogin(usernameOrEmail, password)` calling `POST /api/auth/login`.
  * `fetchProfile()` calling `GET /api/users/profile`.
  * `updateProfile(profileData)` calling `PUT /api/users/profile`.

#### [MODIFY] [Navbar.jsx](file:///d:/Project/Antigravity/Sample/frontend/src/components/Navbar.jsx)
* Add "Profile" option if customer is logged in.
* Trigger a new combined Login/Signup modal.

#### [NEW] [AuthModal.jsx](file:///d:/Project/Antigravity/Sample/frontend/src/components/AuthModal.jsx) + `.css`
Create a unified modal with tabs:
* **Login Tab**: User signs in with username/email and password.
* **Register Tab**: Fields for username, email, password, and phone number.

#### [NEW] [ProfileDashboard.jsx](file:///d:/Project/Antigravity/Sample/frontend/src/admin/ProfileDashboard.jsx) + `.css`
Create a user profile center (`#/profile` route) with forms:
* **Profile Settings**: Edit Username, Phone (Email remains read-only).
* **Security Settings**: Option to update password.
* **Shipment Address Book**:
  * Lists saved addresses.
  * Multi-type selectors: "Home", "Office", "Other".
  * Address fields: Recipient's Full Name, Street Address, Landmark, City, State, Pincode, and Country.
  * Inline forms to Add/Edit addresses and delete buttons.

#### [MODIFY] [App.jsx](file:///d:/Project/Antigravity/Sample/frontend/src/App.jsx)
* Add `#/profile` route rendering `ProfileDashboard`.

---

## Verification Plan

### Automated Tests
* Run `mvnw clean package` on backend to ensure all dependencies resolve.
* Run `npm run build` on frontend to verify React files compile.

### Manual Verification
1. **Registration**: Sign up a new customer and verify database has user stored with `ROLE_USER` and hashed password.
2. **Login**: Log in as a customer, verify JWT token is stored, and UI redirects or updates navbar.
3. **View Profile**: Access `#/profile`, verifying details load correctly from the backend database.
4. **Edit Settings**: Update username and phone, verify update in DB, and ensure email input is read-only.
5. **Manage Addresses**: Add Home, Office, and Other addresses, modify one, delete one, and verify PostgreSQL database entries are updated.
