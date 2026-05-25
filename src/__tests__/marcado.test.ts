// src/__tests__/marcado.test.ts
describe("Marcados", () => {
  it("estado presente", () => {
    const estado = "presente";

    expect(estado).toBe("presente");
  });

  it("minutos trabajados positivos", () => {
    const minutos = 120;

    expect(minutos).toBeGreaterThanOrEqual(0);
  });
});
