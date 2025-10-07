import { db } from "@/db";
import { oauthStates } from "@/db/schema";
import { eq, and, gt, lt } from "drizzle-orm";
import type { NewOAuthState } from "@/db/schema";

/**
 * OAuth State Repository
 * Manages temporary OAuth state storage for CSRF protection
 */
class OAuthStateRepository {
  /**
   * Store OAuth state for verification during callback
   */
  async create(data: NewOAuthState) {
    const [state] = await db.insert(oauthStates).values(data).returning();
    return state;
  }

  /**
   * Verify and consume OAuth state (one-time use)
   * Returns the state if valid, null if expired or not found
   */
  async verifyAndConsume(
    stateValue: string,
    kindeUserId: string,
    provider: string,
  ) {
    // Find valid state that hasn't expired
    const [state] = await db
      .select()
      .from(oauthStates)
      .where(
        and(
          eq(oauthStates.state, stateValue),
          eq(oauthStates.kindeUserId, kindeUserId),
          eq(oauthStates.provider, provider),
          gt(oauthStates.expiresAt, new Date()),
        ),
      )
      .limit(1);

    if (!state) {
      return null;
    }

    // Delete the state (one-time use)
    await db.delete(oauthStates).where(eq(oauthStates.id, state.id));

    return state;
  }

  /**
   * Clean up expired states (can be run periodically)
   */
  async cleanupExpired() {
    const result = await db
      .delete(oauthStates)
      .where(lt(oauthStates.expiresAt, new Date()));

    return result;
  }
}

export const oauthStateRepo = new OAuthStateRepository();
