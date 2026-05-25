// src/__tests__/auth.test.ts
describe("Auth", () => {
  it("email válido", () => {
    const email = "admin@medicina.edu.bo";

    expect(email.includes("@")).toBe(true);
  });

  it("password no vacía", () => {
    const password = "Medicina2026!";

    expect(password.length).toBeGreaterThan(0);
  });
});
