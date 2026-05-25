import { GeoService } from "../services/geoService";

describe("GeoService Hospital HUAYNA POTOSI", () => {
  const geo = new GeoService();

  /*
    Hospital HUAYNA POTOSI
    LAT: -16.479603
    LNG: -68.193263
  */

  it("distancia cero mismo punto hospital", () => {
    const d = geo.calcularDistancia(
      -16.479603,
      -68.193263,

      -16.479603,
      -68.193263,
    );

    expect(d).toBe(0);
  });

  it("acepta docente dentro del hospital", () => {
    const valido = geo.validarRadio(
      -16.47952,
      -68.19329,

      -16.479603,
      -68.193263,

      300,
    );

    expect(valido).toBe(true);
  });

  it("rechaza docente fuera del radio", () => {
    const valido = geo.validarRadio(
      -16.3,
      -68.1,

      -16.479603,
      -68.193263,

      300,
    );

    expect(valido).toBe(false);
  });

  it("calcula distancia real hospital-docente", () => {
    const d = geo.calcularDistancia(
      -16.47952,
      -68.19329,

      -16.479603,
      -68.193263,
    );

    console.log("DISTANCIA HUAYNA POTOSI =>", d, "metros");

    expect(d).toBeLessThan(300);

    expect(d).toBeGreaterThan(0);
  });

  it("rechaza ubicación extremadamente lejana", () => {
    const d = geo.calcularDistancia(
      -16.479603,
      -68.193263,

      -17.783327,
      -63.18214,
    );

    expect(d).toBeGreaterThan(100000);
  });
});
