import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { env } from "@/lib/config";

/**
 * Token Encryption/Decryption using AES-256-GCM
 * Ensures tokens are encrypted at rest in database
 * Uses Node.js built-in crypto module (no external dependencies)
 */

// Convert base64 encryption key to Buffer (32 bytes for AES-256)
const SECRET_KEY = Buffer.from(env.ENCRYPTION_KEY || "", "base64");

if (SECRET_KEY.length !== 32) {
  throw new Error(
    "ENCRYPTION_KEY must be 32 bytes (base64 encoded). Generate with: openssl rand -base64 32",
  );
}

/**
 * Encrypt a token (access token, refresh token, etc.)
 * @param plaintext - Token to encrypt
 * @returns Encrypted string in format: iv:authTag:ciphertext (all base64)
 */
export function encryptToken(plaintext: string): string {
  try {
    // Generate random IV (12 bytes is standard for GCM)
    const iv = randomBytes(12);

    // Create cipher with AES-256-GCM
    const cipher = createCipheriv("aes-256-gcm", SECRET_KEY, iv);

    // Encrypt the plaintext
    const encrypted = Buffer.concat([
      cipher.update(plaintext, "utf8"),
      cipher.final(),
    ]);

    // Get authentication tag
    const authTag = cipher.getAuthTag();

    // Return format: iv:authTag:ciphertext (all base64)
    return `${iv.toString("base64")}:${authTag.toString("base64")}:${encrypted.toString("base64")}`;
  } catch (error) {
    console.error("Token encryption failed:", error);
    throw new Error("Failed to encrypt token");
  }
}

/**
 * Decrypt a token
 * @param encrypted - Encrypted string in format: iv:authTag:ciphertext
 * @returns Decrypted plaintext token
 */
export function decryptToken(encrypted: string): string {
  try {
    // Parse the encrypted string
    const parts = encrypted.split(":");
    if (parts.length !== 3) {
      throw new Error("Invalid encrypted token format");
    }

    const [ivBase64, authTagBase64, ciphertextBase64] = parts;
    const iv = Buffer.from(ivBase64, "base64");
    const authTag = Buffer.from(authTagBase64, "base64");
    const ciphertext = Buffer.from(ciphertextBase64, "base64");

    // Create decipher
    const decipher = createDecipheriv("aes-256-gcm", SECRET_KEY, iv);
    decipher.setAuthTag(authTag);

    // Decrypt
    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);

    return decrypted.toString("utf8");
  } catch (error) {
    console.error("Token decryption failed:", error);
    throw new Error("Failed to decrypt token");
  }
}

/**
 * Test encryption/decryption (development only)
 */
export function testEncryption() {
  if (env.NODE_ENV !== "development") return;

  const testToken = "test-token-123-abc";
  const encrypted = encryptToken(testToken);
  const decrypted = decryptToken(encrypted);

  console.assert(testToken === decrypted, "Encryption test failed!");
  console.log("✅ Encryption test passed");
  console.log(`  Original: ${testToken}`);
  console.log(`  Encrypted: ${encrypted.substring(0, 50)}...`);
  console.log(`  Decrypted: ${decrypted}`);
}
