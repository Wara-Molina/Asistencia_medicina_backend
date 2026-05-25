// src/__tests__/reporte.test.ts
describe("Reportes", () => {
  it("calcula porcentaje", () => {
    const presentes = 8;

    const total = 10;

    const porcentaje = (presentes * 100) / total;

    expect(porcentaje).toBe(80);
  });

  it("ranking ordenado", () => {
    const ranking = [
      90,

      80,

      70,
    ];

    expect(ranking[0]).toBeGreaterThan(ranking[1]);
  });
});
