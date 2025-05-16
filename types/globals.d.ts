export {};

// Create a type for the roles
export type Roles = "Admin" | "Donor";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
