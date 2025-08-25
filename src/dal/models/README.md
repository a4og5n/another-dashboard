# Data Models

This directory contains data models and schemas that define the shape of your application's data.

## Guidelines

- Use Zod schemas to validate data
- Export TypeScript types derived from schemas
- Keep models focused on data structure, not behavior
- Consider using interfaces for better abstraction

## Example

```typescript
import { z } from 'zod';

// Define a schema with Zod
export const ExampleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  // Add more fields as needed
});

// Derive TypeScript type from schema
export type Example = z.infer<typeof ExampleSchema>;
```
