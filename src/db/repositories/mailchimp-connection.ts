import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { encryptToken, decryptToken } from "@/lib/encryption";
import type { MailchimpConnection } from "@/db/schema";

/**
 * Repository pattern for Mailchimp connections
 * Handles all database operations + encryption/decryption
 */

export class MailchimpConnectionRepository {
  /**
   * Find connection by Kinde user ID
   */
  async findByKindeUserId(
    kindeUserId: string,
  ): Promise<MailchimpConnection | null> {
    const [connection] = await db
      .select()
      .from(schema.mailchimpConnections)
      .where(eq(schema.mailchimpConnections.kindeUserId, kindeUserId))
      .limit(1);

    return connection || null;
  }

  /**
   * Get decrypted access token for user
   */
  async getDecryptedToken(kindeUserId: string): Promise<{
    accessToken: string;
    serverPrefix: string;
    isActive: boolean;
  } | null> {
    const connection = await this.findByKindeUserId(kindeUserId);

    if (!connection) return null;
    if (!connection.isActive) return null;

    try {
      const accessToken = decryptToken(connection.accessToken);
      return {
        accessToken,
        serverPrefix: connection.serverPrefix,
        isActive: connection.isActive,
      };
    } catch (error) {
      console.error("Failed to decrypt token:", error);
      return null;
    }
  }

  /**
   * Create new connection (encrypts token before saving)
   */
  async create(data: {
    kindeUserId: string;
    accessToken: string;
    serverPrefix: string;
    accountId?: string;
    email?: string;
    username?: string;
    metadata?: Record<string, unknown>;
  }): Promise<MailchimpConnection> {
    const encryptedToken = encryptToken(data.accessToken);

    const [connection] = await db
      .insert(schema.mailchimpConnections)
      .values({
        kindeUserId: data.kindeUserId,
        accessToken: encryptedToken,
        serverPrefix: data.serverPrefix,
        accountId: data.accountId,
        email: data.email,
        username: data.username,
        metadata: data.metadata as {
          dc: string;
          role?: string;
          accountName?: string;
          login?: { email?: string; login_id?: string };
        },
        isActive: true,
        lastValidatedAt: new Date(),
      })
      .returning();

    return connection;
  }

  /**
   * Update connection (re-encrypt token if provided)
   */
  async update(
    kindeUserId: string,
    data: Partial<{
      accessToken: string;
      serverPrefix: string;
      isActive: boolean;
      lastValidatedAt: Date;
      metadata: Record<string, unknown>;
    }>,
  ): Promise<MailchimpConnection | null> {
    const updates: Record<string, unknown> = { ...data, updatedAt: new Date() };

    // Re-encrypt token if updating
    if (data.accessToken) {
      updates.accessToken = encryptToken(data.accessToken);
    }

    const [updated] = await db
      .update(schema.mailchimpConnections)
      .set(updates)
      .where(eq(schema.mailchimpConnections.kindeUserId, kindeUserId))
      .returning();

    return updated || null;
  }

  /**
   * Mark connection as inactive (soft delete)
   */
  async deactivate(kindeUserId: string): Promise<boolean> {
    const result = await db
      .update(schema.mailchimpConnections)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(schema.mailchimpConnections.kindeUserId, kindeUserId));

    return result.rowCount > 0;
  }

  /**
   * Hard delete connection (for GDPR/user deletion)
   */
  async delete(kindeUserId: string): Promise<boolean> {
    const result = await db
      .delete(schema.mailchimpConnections)
      .where(eq(schema.mailchimpConnections.kindeUserId, kindeUserId));

    return result.rowCount > 0;
  }

  /**
   * Update last validated timestamp (for token health checks)
   */
  async touchValidation(kindeUserId: string): Promise<void> {
    await db
      .update(schema.mailchimpConnections)
      .set({ lastValidatedAt: new Date() })
      .where(eq(schema.mailchimpConnections.kindeUserId, kindeUserId));
  }
}

// Singleton instance
export const mailchimpConnectionRepo = new MailchimpConnectionRepository();
