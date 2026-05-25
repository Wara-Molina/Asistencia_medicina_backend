import { DocenteService } from "../../services/docenteService";
import { AppError } from "../../middlewares/errorHandler";
import { DocenteEstado } from "../../models/Docente";

jest.mock("../../services/authService", () => ({
  hashPassword: jest.fn().mockResolvedValue("HASH_TEST"),
}));

describe("DocenteService", () => {
  let service: DocenteService;

  beforeEach(() => {
    service = new DocenteService();

    (service as any).docenteRepository = {
      findByEmail: jest.fn(),

      findByCedula: jest.fn(),

      create: jest.fn(),
    };

    (service as any).usuarioRepository = {
      save: jest.fn(),

      create: jest.fn((v) => v),
    };

    (service as any).auditService = {
      registrar: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("debe crear docente y credenciales iniciales", async () => {
    const payload = {
      nombreCompleto: "Carlos Mendoza",

      email: "carlos@test.com",

      cedula: "1234567",

      departamento: "Anatomía",
    };

    (service as any).docenteRepository.findByEmail.mockResolvedValue(null);

    (service as any).docenteRepository.findByCedula.mockResolvedValue(null);

    (service as any).docenteRepository.create.mockResolvedValue({
      id: "DOC1",

      ...payload,

      estado: DocenteEstado.ACTIVO,
    });

    const result = await service.crear(payload);

    expect(result.docente.email).toBe(payload.email);

    expect(result.docente.estado).toBe(DocenteEstado.ACTIVO);

    expect(result.credencialesIniciales.password).toBe("1234567");

    expect((service as any).usuarioRepository.save).toHaveBeenCalled();
  });

  test("debe fallar si email ya existe", async () => {
    const payload = {
      nombreCompleto: "Carlos",

      email: "dup@test.com",

      cedula: "111111",

      departamento: "Anatomía",
    };

    (service as any).docenteRepository.findByEmail.mockResolvedValue({
      id: "1",
    });

    await expect(service.crear(payload)).rejects.toThrow(AppError);
  });
});
