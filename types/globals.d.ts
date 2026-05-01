export {};

// Create a type for the roles
export type Roles = "Admin" | "Donor" | "InStore";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
