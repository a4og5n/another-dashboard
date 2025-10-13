/**
 * Drizzle ORM database mock utilities for testing
 * Provides mock database connection and query builders
 *
 * Usage:
 * import { setupDatabaseMocks, mockDb } from "@/test/mocks/drizzle-db";
 *
 * beforeEach(() => {
 *   setupDatabaseMocks();
 * });
 */

import { vi } from "vitest";
import type { MailchimpConnection } from "@/db/schema";

/**
 * In-memory storage for mock database operations
 */
export const mockDatabaseStorage = {
  mailchimpConnections: new Map<string, MailchimpConnection>(),
};

/**
 * Reset all in-memory database storage
 */
export function resetDatabaseStorage() {
  mockDatabaseStorage.mailchimpConnections.clear();
}

/**
 * Mock query builder for Drizzle ORM select operations
 */
class MockSelectQueryBuilder {
  private limitValue: number | null = null;

  from(_table: unknown) {
    return this;
  }

  where(_condition: unknown) {
    // Simplified mock - returns all connections
    return this;
  }

  limit(limit: number) {
    this.limitValue = limit;
    return this;
  }

  async execute() {
    const connections = Array.from(
      mockDatabaseStorage.mailchimpConnections.values(),
    );

    let results = connections;
    if (this.limitValue !== null) {
      results = results.slice(0, this.limitValue);
    }

    return results;
  }

  // Make the query builder thenable for direct awaiting
  then(
    onFulfilled?: (value: MailchimpConnection[]) => unknown,
    onRejected?: (reason: unknown) => unknown,
  ) {
    return this.execute().then(onFulfilled, onRejected);
  }
}

/**
 * Mock query builder for Drizzle ORM insert operations
 */
class MockInsertQueryBuilder {
  private valuesData: Partial<MailchimpConnection> | null = null;
  private shouldReturn = false;

  values(data: Partial<MailchimpConnection>) {
    this.valuesData = data;
    return this;
  }

  returning() {
    this.shouldReturn = true;
    return this;
  }

  async execute() {
    if (!this.valuesData) {
      throw new Error("No values provided for insert");
    }

    const newConnection: MailchimpConnection = {
      id: Math.random().toString(36).substring(7),
      kindeUserId: this.valuesData.kindeUserId || "",
      accessToken: this.valuesData.accessToken || "",
      serverPrefix: this.valuesData.serverPrefix || "",
      accountId: this.valuesData.accountId || null,
      email: this.valuesData.email || null,
      username: this.valuesData.username || null,
      metadata: this.valuesData.metadata || null,
      isActive: this.valuesData.isActive ?? true,
      lastValidatedAt: this.valuesData.lastValidatedAt || new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockDatabaseStorage.mailchimpConnections.set(
      newConnection.kindeUserId,
      newConnection,
    );

    return this.shouldReturn ? [newConnection] : [];
  }

  // Make the query builder thenable for direct awaiting
  then(
    onFulfilled?: (value: MailchimpConnection[]) => unknown,
    onRejected?: (reason: unknown) => unknown,
  ) {
    return this.execute().then(onFulfilled, onRejected);
  }
}

/**
 * Mock query builder for Drizzle ORM update operations
 */
class MockUpdateQueryBuilder {
  private setData: Partial<MailchimpConnection> | null = null;
  private shouldReturn = false;

  set(data: Partial<MailchimpConnection>) {
    this.setData = data;
    return this;
  }

  where(_condition: unknown) {
    // Simplified mock
    return this;
  }

  returning() {
    this.shouldReturn = true;
    return this;
  }

  async execute() {
    if (!this.setData) {
      throw new Error("No data provided for update");
    }

    // Find and update the first connection (simplified)
    let updated: MailchimpConnection | null = null;
    for (const [
      kindeUserId,
      connection,
    ] of mockDatabaseStorage.mailchimpConnections.entries()) {
      const updatedConnection = {
        ...connection,
        ...this.setData,
        updatedAt: new Date(),
      };
      mockDatabaseStorage.mailchimpConnections.set(
        kindeUserId,
        updatedConnection,
      );
      updated = updatedConnection;
      break; // Update first match only
    }

    const result = {
      rowCount: updated ? 1 : 0,
      rows: this.shouldReturn && updated ? [updated] : [],
    };

    // Spread the updated connection into the result for returning() support
    return this.shouldReturn && updated
      ? Object.assign([updated], result)
      : result;
  }

  // Make the query builder thenable for direct awaiting
  then(
    onFulfilled?: (value: unknown) => unknown,
    onRejected?: (reason: unknown) => unknown,
  ) {
    return this.execute().then(onFulfilled, onRejected);
  }
}

/**
 * Mock query builder for Drizzle ORM delete operations
 */
class MockDeleteQueryBuilder {
  where(_condition: unknown) {
    return this;
  }

  async execute() {
    let deleted = 0;

    // Delete first connection (simplified)
    for (const [
      kindeUserId,
    ] of mockDatabaseStorage.mailchimpConnections.entries()) {
      mockDatabaseStorage.mailchimpConnections.delete(kindeUserId);
      deleted++;
      break; // Delete first match only
    }

    return { rowCount: deleted };
  }

  // Make the query builder thenable for direct awaiting
  then(
    onFulfilled?: (value: { rowCount: number }) => unknown,
    onRejected?: (reason: unknown) => unknown,
  ) {
    return this.execute().then(onFulfilled, onRejected);
  }
}

/**
 * Mock database object with Drizzle ORM methods
 */
export const mockDb = {
  select: vi.fn(() => new MockSelectQueryBuilder()),
  insert: vi.fn((_table: unknown) => new MockInsertQueryBuilder()),
  update: vi.fn((_table: unknown) => new MockUpdateQueryBuilder()),
  delete: vi.fn((_table: unknown) => new MockDeleteQueryBuilder()),
};

/**
 * Mock schema object
 */
export const mockSchema = {
  mailchimpConnections: {
    kindeUserId: "kindeUserId",
    accessToken: "accessToken",
    serverPrefix: "serverPrefix",
    accountId: "accountId",
    email: "email",
    username: "username",
    metadata: "metadata",
    isActive: "isActive",
    lastValidatedAt: "lastValidatedAt",
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  },
};

/**
 * Set up database mocks at module level
 * This must happen before any database imports
 */
vi.mock("@/db", () => ({
  db: mockDb,
  schema: mockSchema,
}));

/**
 * Helper to add a mock connection to the database
 */
export function addMockConnection(connection: Partial<MailchimpConnection>) {
  const fullConnection: MailchimpConnection = {
    id: connection.id || Math.random().toString(36).substring(7),
    kindeUserId: connection.kindeUserId || "",
    accessToken: connection.accessToken || "",
    serverPrefix: connection.serverPrefix || "us1",
    accountId: connection.accountId || null,
    email: connection.email || null,
    username: connection.username || null,
    metadata: connection.metadata || null,
    isActive: connection.isActive ?? true,
    lastValidatedAt: connection.lastValidatedAt || new Date(),
    createdAt: connection.createdAt || new Date(),
    updatedAt: connection.updatedAt || new Date(),
  };

  mockDatabaseStorage.mailchimpConnections.set(
    fullConnection.kindeUserId,
    fullConnection,
  );

  return fullConnection;
}

/**
 * Helper to get a mock connection from the database
 */
export function getMockConnection(
  kindeUserId: string,
): MailchimpConnection | undefined {
  return mockDatabaseStorage.mailchimpConnections.get(kindeUserId);
}

/**
 * Helper to delete a mock connection from the database
 */
export function deleteMockConnection(kindeUserId: string): boolean {
  return mockDatabaseStorage.mailchimpConnections.delete(kindeUserId);
}
