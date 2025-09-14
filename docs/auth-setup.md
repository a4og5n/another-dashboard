# Kinde Authentication Setup Guide

This guide walks through setting up Kinde authentication for the Next.js Dashboard application.

## Prerequisites

- Node.js 18+ installed
- A Kinde account ([sign up here](https://app.kinde.com/register))
- Access to the project repository

## 1. Kinde Configuration

### Create a Kinde Application

1. Log in to your [Kinde dashboard](https://app.kinde.com/)
2. Navigate to "Applications" in the sidebar
3. Click "Add application"
4. Choose "Regular web app" as the application type
5. Set the following URLs:
   - **Allowed callback URLs**: `http://localhost:3000/api/auth/kinde_callback`
   - **Allowed logout redirect URLs**: `http://localhost:3000`
   - **Home URL**: `http://localhost:3000`

### Get Your Credentials

From your Kinde application dashboard, note down:

- **Client ID**
- **Client Secret**
- **Domain** (your Kinde tenant URL)

### Optional: Google OAuth Setup

If you want to enable Google OAuth:

1. In your Kinde application, go to "Authentication" → "Social connections"
2. Enable Google and configure it with your Google OAuth credentials
3. Note the **Connection ID** for Google

## 2. Environment Variables

Copy the environment variables template:

```bash
cp env.example .env.local
```

Update `.env.local` with your Kinde credentials:

```bash
# Kinde Authentication
KINDE_CLIENT_ID="your_kinde_client_id"
KINDE_CLIENT_SECRET="your_kinde_client_secret"
KINDE_ISSUER_URL="https://your-tenant.kinde.com"
KINDE_SITE_URL="http://localhost:3000"
KINDE_POST_LOGOUT_REDIRECT_URL="http://localhost:3000"
KINDE_POST_LOGIN_REDIRECT_URL="http://localhost:3000/mailchimp"

# Optional: For Google OAuth
KINDE_GOOGLE_CONNECTION_ID="your_google_connection_id"
```

### Environment Variables Reference

| Variable                         | Required | Description                                               |
| -------------------------------- | -------- | --------------------------------------------------------- |
| `KINDE_CLIENT_ID`                | ✅       | Your Kinde application client ID                          |
| `KINDE_CLIENT_SECRET`            | ✅       | Your Kinde application client secret                      |
| `KINDE_ISSUER_URL`               | ✅       | Your Kinde tenant URL (e.g., `https://yourapp.kinde.com`) |
| `KINDE_SITE_URL`                 | ✅       | Your application URL (e.g., `http://localhost:3000`)      |
| `KINDE_POST_LOGOUT_REDIRECT_URL` | ✅       | Where to redirect after logout                            |
| `KINDE_POST_LOGIN_REDIRECT_URL`  | ✅       | Where to redirect after login                             |
| `KINDE_GOOGLE_CONNECTION_ID`     | ❌       | Google OAuth connection ID (optional)                     |

## 3. Development Setup

### Install Dependencies

Dependencies are already included in `package.json`:

```bash
pnpm install
```

### Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## 4. Testing Authentication

### Authentication Flow

1. **Visit the app**: Navigate to `http://localhost:3000`
2. **Access protected route**: Try to visit `http://localhost:3000/mailchimp`
3. **Redirect to login**: You should be redirected to `/login`
4. **Login options**: Choose between:
   - **Google OAuth** (if configured)
   - **Email/password** authentication
5. **Success redirect**: After login, you'll be redirected to `/mailchimp`

### Health Check

Test your authentication configuration:

```bash
curl http://localhost:3000/api/auth/health
```

This should return configuration status and authentication state.

### Test Commands

Run the authentication tests:

```bash
# Run all auth-related tests
pnpm test auth

# Run user menu component tests
pnpm test user-menu

# Run all tests
pnpm test
```

## 5. Production Deployment

### Environment Variables

For production, update your environment variables:

```bash
KINDE_SITE_URL="https://your-production-domain.com"
KINDE_POST_LOGOUT_REDIRECT_URL="https://your-production-domain.com"
KINDE_POST_LOGIN_REDIRECT_URL="https://your-production-domain.com/mailchimp"
```

### Kinde Application URLs

Update your Kinde application settings for production:

- **Allowed callback URLs**: `https://your-domain.com/api/auth/kinde_callback`
- **Allowed logout redirect URLs**: `https://your-domain.com`
- **Home URL**: `https://your-domain.com`

## 6. Architecture Overview

### Authentication Components

- **`AuthProvider`**: Server component that fetches auth state
- **`AuthWrapper`**: Client component for protecting routes
- **`UserMenu`**: Dropdown menu for authenticated users
- **`AuthLoading`**: Loading states during auth operations

### Route Protection

- **Public routes**: `/`, `/login`, `/register`, `/api/auth`
- **Protected routes**: `/mailchimp/*` (requires authentication)
- **Middleware**: Handles authentication checks and redirects

### API Endpoints

- **`/api/auth/[kindeAuth]`**: Kinde authentication handler
- **`/api/auth/health`**: Configuration validation endpoint

## 7. Troubleshooting

### Common Issues

**1. "Authentication required" errors**

- Check that your Kinde credentials are correct
- Verify callback URLs match your environment
- Ensure middleware is working with `http://localhost:3000/api/auth/health`

**2. Infinite redirect loops**

- Check `KINDE_POST_LOGIN_REDIRECT_URL` is not a protected route that requires auth
- Verify middleware configuration excludes auth routes

**3. Google OAuth not working**

- Ensure `KINDE_GOOGLE_CONNECTION_ID` is set correctly
- Verify Google OAuth is enabled in your Kinde application
- Check Google OAuth credentials in Kinde dashboard

**4. TypeScript errors**

- Run `pnpm type-check` to identify issues
- Ensure all imports use path aliases (`@/`)
- Check that types are properly exported from schema files

### Debug Mode

Enable debug logging:

```bash
DEBUG_API_CALLS="true"
```

This will provide detailed logs for troubleshooting authentication issues.

### Support

- **Kinde Documentation**: https://docs.kinde.com/
- **Project Issues**: Check the repository issues for known problems
- **Development**: Run `pnpm pre-commit` before committing changes

## 8. Security Considerations

- Never commit `.env.local` or expose secrets in client-side code
- Use HTTPS in production
- Regularly rotate your Kinde client secret
- Review and configure appropriate session timeouts in Kinde
- Monitor authentication logs for suspicious activity

## 9. Additional Features

### User Permissions & Roles

The system supports role-based access control:

```typescript
// Check permissions
const hasPermission = await authService.hasPermission("read:dashboard");

// Check roles
const isAdmin = await authService.hasRole("admin");
```

Available roles: `admin`, `user`, `viewer`
Available permissions: `read:dashboard`, `write:dashboard`, `admin:settings`, `read:mailchimp`, `write:mailchimp`

### Extending Authentication

To add new authentication features:

1. Update schemas in `src/schemas/auth/`
2. Add corresponding types in `src/types/auth/`
3. Extend the `AuthService` class
4. Add tests following established patterns

The authentication system is designed to be extensible while maintaining consistency with the existing codebase architecture.
