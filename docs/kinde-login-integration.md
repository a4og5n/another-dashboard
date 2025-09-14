# Key Requirements

- Embedded login: The authentication flow must keep the user on our domain/URL (not redirect to a Kinde-hosted login page).
- Google login enabled, with Kinde email/password as backup.
- Support both local development and production (Vercel) environments.
  +- Authentication and route protection are handled via middleware and the service layer (for business logic and API calls). A data access layer (DAL) may be introduced in the future if persistent user data is required.

- Embedded login: The authentication flow must keep the user on our domain/URL (not redirect to a Kinde-hosted login page).
- Google login enabled, with Kinde email/password as backup.
- Support both local development and production (Vercel) environments.

# MVP Authentication Flow Best Practices

...existing content...

# Next Steps / Implementation Checklist

1. Create a Kinde account and tenant.
2. Register the Next.js dashboard app in Kinde.
3. Enable Google login and email/password in Kinde settings.
4. Obtain Kinde credentials (client ID, secret, domain, etc.).
5. Add credentials as environment variables for local and Vercel environments.
6. Implement /login and /logout routes/pages.
7. Protect /mailchimp and subroutes with authentication middleware or wrapper.
8. Display user info (name, email, avatar) in the UI.
9. Show a loading indicator while authentication is checked.
10. Test the flow locally and on Vercel.

# Future Enhancements

- Add support for multiple user roles and role-based page restrictions.
- Advanced error handling and session expiry management.
- Support for additional social login providers (e.g., Microsoft).
- Custom user profile fields and claims.
- Improved UI/UX for login and error states.

# References

- [Kinde Documentation](https://kinde.com/docs/)
- [Next.js Authentication Patterns](https://nextjs.org/docs/app/building-your-application/authentication)
- Project docs: see `/docs/PRD.md` and `/docs/project-management/` for requirements and roadmap.

For the MVP, focus on these authentication flow best practices:

1. Protect routes with middleware or a wrapper—redirect unauthenticated users to /login.
2. Dedicated /login and /logout endpoints or buttons.
3. Preserve intended destination on login (optional, but improves UX).
4. Use secure, HTTP-only cookies for session tokens (Kinde SDK usually handles this).
5. Show a loading indicator while checking authentication status.
6. Store Kinde credentials in environment variables.

The rest (like token expiry handling, advanced error states, and role-based access) can be added after the MVP.

# Kinde Login Integration Planning

This document will serve as a guide for gathering requirements and answers needed to create a tailored implementation plan for integrating Kinde login into the MVP.

## Questions & Answers

### 1. What is the desired authentication flow?

_Question:_ Should users be required to log in before accessing any part of the dashboard, or only certain routes? Is logout required, or is a simple login sufficient for MVP?
_Answer:_

- The root page (/) should be available publicly.
- The /mailchimp route and its subroutes should be accessible only to logged-in users.
- Both login and logout features are required.
- Recommendation: Place the login page at its own URL (e.g., /login) and redirect logged-out users there when they try to access protected routes. This is a standard, user-friendly pattern and allows for a clear, customizable login experience.

### 2. Which user roles or permissions are needed?

_Question:_ Do you want to support multiple roles (e.g., admin, user, client) now, or just a generic authenticated user for MVP? Will you need to restrict access to certain pages based on roles?
_Answer:_

- For the MVP, only a generic authenticated user will be implemented (no roles yet).
- All logged-in users are treated the same; /mailchimp and subroutes are protected for authenticated users only.
- To minimize future refactoring:
  - Use a central auth context or hook (e.g., `useAuth`) that returns user info and (in the future) roles/permissions.
  - Protect routes using a function or middleware (e.g., `requireAuth()`), so role checks can be added in one place later.
  - Reserve a field for roles/permissions in the user/session model, even if it’s just a placeholder for now.
- This approach keeps the MVP simple but makes it easy to add roles and page restrictions in future versions.

---

### 3. What user data do you need from Kinde?

_Question:_ Is basic profile info (name, email, avatar) enough, or do you need custom claims? Will you display user info in the UI (e.g., profile menu)?
_Answer:_

- For the MVP, basic profile info (name, email, avatar) is enough.
- User info should be displayed in the UI (e.g., profile menu or header).

---

### 4. What is your Kinde environment setup?

_Question:_ Do you already have a Kinde tenant set up, or do you need to create one? Do you have the required credentials (client ID, secret, domain, etc.)?
_Answer:_

- No Kinde account or tenant has been created yet. This will be done after completing this planning document.
- Guidance needed for:
  - Creating a Kinde account and tenant
  - Registering the application (Next.js dashboard) in Kinde
  - Obtaining required credentials: client ID, client secret, domain, etc.
- Requirement: The authentication flow must keep the user on our domain/URL (embedded login), not redirect to a Kinde-hosted login page. This adds complexity but is required for the desired UX.
- Implementation guidance for embedded login (not hosted page) will be needed.

---

### 5. How should authentication state be handled?

_Question:_ Should sessions persist across browser restarts (long-lived), or just per session? Do you want to use cookies, localStorage, or rely on Kinde’s SDK defaults?
_Answer:_

- For the MVP, use Kinde’s SDK defaults for authentication state.
- This typically means secure, HTTP-only cookies for session management.
- Sessions will persist across browser restarts (unless the user logs out or the session expires).
- This approach is secure, easy to implement, and requires minimal custom code.

---

### 6. What is your preferred user experience?

_Question:_ Should unauthenticated users be redirected to a login page, or see a public landing page? Should there be a loading state while authentication is checked?
_Answer:_

- Unauthenticated users should be redirected to a login page when accessing protected routes.
- Best practice: Show a loading indicator while authentication is being checked, then redirect or render the appropriate content once the check is complete. This prevents UI flicker and improves user experience.

---

### 7. Do you need social login or just email/password?

_Question:_ Will you enable Google, Microsoft, or other providers, or just Kinde’s default email/password?
_Answer:_

- Enable Google login for users.
- Kinde’s default email/password login should be available as a backup option.

---

### 8. Do you need to support local development and production environments?

_Question:_ Should the implementation work seamlessly both locally and on Vercel? Will you use environment variables for Kinde credentials?
_Answer:_

- Yes, both local development and production environments must be supported.
- The implementation should work seamlessly both locally and on Vercel.
- Yes, environment variables will be used for Kinde credentials.

---

_Please answer each question above. Your responses will guide the implementation plan for Kinde login integration._
