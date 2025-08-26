# Services

This directory contains business logic services that use repositories to access data.

## Guidelines

- Services contain business logic and workflows
- Services use repositories for data access
- Services should be independent of UI concerns
- Use dependency injection for testability

## Example

```typescript
// Example service class
export class ExampleService {
  // Implement methods for business operations

  // For example:
  async processData(input: InputType): Promise<OutputType> {
    // Implement business logic here
  }
}
```
