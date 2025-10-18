/**
 * Type definitions for Next.js generateMetadata functions
 *
 * Provides type-safe interfaces for metadata generation with automatic
 * parameter type inference and consistent typing across pages.
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */

import type { Metadata } from "next";

/**
 * Props shape for generateMetadata with dynamic params
 *
 * @template TParams - Shape of the dynamic route parameters (e.g., { id: string })
 *
 * @example
 * ```tsx
 * type MyPageMetadataProps = MetadataProps<{ id: string; slug: string }>;
 * ```
 */
export type MetadataProps<TParams = { id: string }> = {
  params: Promise<TParams>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * Type for generateMetadata function with custom parameter shape
 *
 * @template TParams - Shape of the dynamic route parameters
 *
 * @example
 * ```tsx
 * const generateMetadata: GenerateMetadata<{ id: string }> = async ({ params }) => {
 *   const { id } = await params;
 *   return { title: `Report ${id}` };
 * };
 * ```
 */
export type GenerateMetadata<TParams = { id: string }> = (
  props: MetadataProps<TParams>,
) => Promise<Metadata> | Metadata;
