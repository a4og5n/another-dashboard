# Data Access Layer (DAL)

This directory contains the Data Access Layer for the application, which separates data access logic from business logic and UI components.

## Structure

- `models/`: Data models and schemas
- `repositories/`: Data access patterns and abstractions
- `services/`: Business logic services

## Best Practices

1. Keep data validation close to the data models
2. Use repository pattern to abstract data access
3. Implement business logic in service classes
4. Keep the DAL independent of UI concerns
