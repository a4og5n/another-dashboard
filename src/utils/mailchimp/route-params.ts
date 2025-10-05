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

  const validatedParams = paramsSchema.parse(rawParams);
  const validatedSearchParams = searchParamsSchema.parse(rawSearchParams);

  return { validatedParams, validatedSearchParams };
}
