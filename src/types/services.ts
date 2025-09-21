/**
 * Services Type Definitions
 * Type definitions for service registry and factory patterns
 */

/**
 * Available service names in the registry
 */
export type ServiceName = "mailchimp";

/**
 * Service registry type definition
 */
export type ServiceRegistry = {
  [K in ServiceName]: () => object;
};

/**
 * Extract service instance type from registry
 */
export type ServiceInstance<T extends ServiceName> = T extends "mailchimp"
  ? ReturnType<ServiceRegistry[T]>
  : never;
