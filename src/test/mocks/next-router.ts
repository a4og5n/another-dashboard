/**
 * Next.js App Router mock utilities for testing
 * Provides mocks for useRouter, usePathname, useSearchParams, etc.
 *
 * Usage:
 * import { mockRouter } from "@/test/mocks/next-router";
 *
 * The mock is automatically set up when you import this module.
 * Just import it in your test file before the component import.
 */

import { vi } from "vitest";

/**
 * Mock router object with all useRouter methods
 */
export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
};

/**
 * Mock pathname for usePathname hook
 */
export const mockPathname = "/";

/**
 * Mock search params for useSearchParams hook
 */
export const mockSearchParams = new URLSearchParams();

/**
 * Mock params for useParams hook
 */
export const mockParams = {};

/**
 * Set up Next.js navigation mocks at module level
 * This must happen before any component imports
 */
vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => mockPathname,
  useSearchParams: () => mockSearchParams,
  useParams: () => mockParams,
  useSelectedLayoutSegment: () => null,
  useSelectedLayoutSegments: () => [],
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

/**
 * Reset all router mocks to default values
 * Call this in beforeEach() of your test files
 */
export function resetRouterMocks() {
  mockRouter.push.mockClear();
  mockRouter.replace.mockClear();
  mockRouter.refresh.mockClear();
  mockRouter.back.mockClear();
  mockRouter.forward.mockClear();
  mockRouter.prefetch.mockClear();
}

/**
 * Set mock pathname for testing
 */
export function setMockPathname(pathname: string) {
  vi.mocked(mockPathname).valueOf = () => pathname;
}

/**
 * Set mock search params for testing
 */
export function setMockSearchParams(params: Record<string, string>) {
  mockSearchParams.forEach((_, key) => mockSearchParams.delete(key));
  Object.entries(params).forEach(([key, value]) => {
    mockSearchParams.set(key, value);
  });
}

/**
 * Set mock params for testing
 */
export function setMockParams(params: Record<string, string | string[]>) {
  Object.keys(mockParams).forEach((key) => {
    delete mockParams[key as keyof typeof mockParams];
  });
  Object.assign(mockParams, params);
}
