/**
 * Services Index
 * Centralized exports for service layer modules
 *
 * Note: This folder is reserved for future service layer implementation.
 * Current architecture:
 * - Data Access Layer (DAL): @/dal/* - Direct database/API data access
 * - Service Layer: @/services/* - Business logic and orchestration (future)
 * - Actions: @/actions/* - Server actions for client-server communication
 */

// Auth service (legacy - will be refactored)
export { AuthService, authService } from "@/services/auth.service";
