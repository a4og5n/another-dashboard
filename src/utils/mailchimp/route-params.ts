import { notFound } from "next/navigation";
import { z } from "zod";

export async function processRouteParams<T, U>({
  params,
  searchParams,
  paramsSchema,
  searchParamsSchema,
}: {
  params: Promise<unknown>;
  searchParams: Promise<unknown>;
  paramsSchema: z.ZodSchema<T>;
  searchParamsSchema: z.ZodSchema<U>;
}) {
  const rawParams = await params;
  const rawSearchParams = await searchParams;

  // Validate params - trigger 404 for invalid route parameters
  const paramsResult = paramsSchema.safeParse(rawParams);
  if (!paramsResult.success) {
    notFound();
  }

  // Validate search params - use safeParse to handle gracefully
  const searchParamsResult = searchParamsSchema.safeParse(rawSearchParams);
  if (!searchParamsResult.success) {
    notFound();
  }

  return {
    validatedParams: paramsResult.data,
    validatedSearchParams: searchParamsResult.data,
  };
}
