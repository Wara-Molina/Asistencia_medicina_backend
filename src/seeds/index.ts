/** src/seeds/index.ts */

import "reflect-metadata";

import { initDatabase, AppDataSource } from "../config/database";

import { hashPassword } from "../services/authService";

import { Usuario, UsuarioRol } from "../models/Usuario";

import { Docente } from "../models/Docente";

import { Ubicacion, UbicacionTipo } from "../models/Ubicacion";

import { Materia, MateriaEstado } from "../models/Materia";

import { Paralelo } from "../models/Paralelo";

import { Horario, TipoActividad, HorarioEstado } from "../models/Horario";

async function seed() {
  await initDatabase();

  const uRepo = AppDataSource.getRepository(Usuario);

  const dRepo = AppDataSource.getRepository(Docente);

  const lRepo = AppDataSource.getRepository(Ubicacion);

  const mRepo = AppDataSource.getRepository(Materia);

  const pRepo = AppDataSource.getRepository(Paralelo);

  const hRepo = AppDataSource.getRepository(Horario);

  console.log("\n🌱 Iniciando seed...\n");

  // ADMIN

  let admin = await uRepo.findOneBy({
    email: "admin@medicina.edu.bo",
  });

  if (!admin) {
    admin = uRepo.create({
      email: "admin@medicina.edu.bo",

      password: await hashPassword("Admin@2024!"),

      rol: UsuarioRol.ADMIN,

      nombreCompleto: "Administrador",

      docenteId: null,
    });

    await uRepo.save(admin);

    console.log("✅ Admin creado");
  }

  // DIRECTOR

  let director = await uRepo.findOneBy({
    email: "director@medicina.edu.bo",
  });

  if (!director) {
    director = uRepo.create({
      email: "director@medicina.edu.bo",

      password: await hashPassword("Director@2024!"),

      rol: UsuarioRol.DIRECTOR,

      nombreCompleto: "Director Medicina",

      docenteId: null,
    });

    await uRepo.save(director);

    console.log("✅ Director creado");
  }

  // DOCENTE

  let docente = await dRepo.findOneBy({
    cedula: "1234567",
  });

  if (!docente) {
    docente = dRepo.create({
      nombreCompleto: "Dr. Carlos Mendoza",

      email: "c.mendoza@medicina.edu.bo",

      cedula: "1234567",

      departamento: "Anatomía",
    });

    docente = await dRepo.save(docente);

    console.log("✅ Docente creado");

    await uRepo.save(
      uRepo.create({
        email: docente.email,

        password: await hashPassword(docente.cedula),

        rol: UsuarioRol.DOCENTE,

        docenteId: docente.id,

        nombreCompleto: docente.nombreCompleto,
      }),
    );
  }

  // HOSPITAL

  let hospital = await lRepo.findOneBy({
    nombre: "Hospital HUAYNA POTOSI",
  });

  if (!hospital) {
    hospital = lRepo.create({
      nombre: "Hospital HUAYNA POTOSI",

      tipo: UbicacionTipo.HOSPITAL,

      latitud: -16.479603,

      longitud: -68.193263,

      radioValidacion: 300,
    });

    hospital = await lRepo.save(hospital);

    console.log("✅ Hospital creado");
  }

  // MATERIA

  let materia: Materia | null = await mRepo.findOneBy({
    codigo: "MED101",
  });

  if (!materia) {
    const nuevaMateria = mRepo.create({
      nombre: "Anatomía Humana",

      codigo: "MED101",

      creditos: 5,

      semestre: 1,

      estado: MateriaEstado.ACTIVO,
    });

    materia = await mRepo.save(nuevaMateria);

    console.log("✅ Materia creada");
  }

  // PARALELO

  let paralelo: Paralelo | null = await pRepo.findOne({
    where: {
      numero: "A",

      docenteId: docente.id,
    },
  });

  if (!paralelo && materia) {
    const nuevoParalelo = pRepo.create({
      materiaId: materia.id,

      numero: "A",

      docenteId: docente.id,

      capacidad: 40,

      semestreAcademico: "2026-1",
    });

    paralelo = await pRepo.save(nuevoParalelo);

    console.log("✅ Paralelo creado");
  }

  // HORARIO

  if (paralelo && hospital) {
    let horario = await hRepo.findOne({
      where: {
        paraleloId: paralelo.id,

        ubicacionId: hospital.id,
      },
    });

    if (!horario) {
      horario = await hRepo.save(
        hRepo.create({
          paraleloId: paralelo.id,

          diaSemana: 1,

          horaInicio: "08:00:00",

          horaFin: "12:00:00",

          ubicacionId: hospital.id,

          tipoActividad: TipoActividad.ROTE,

          estado: HorarioEstado.ACTIVO,
        }),
      );

      console.log("✅ Horario creado");
    }

    console.log("HORARIO:", horario.id);
  }

  console.log("\nSeed completado\n");

  await AppDataSource.destroy();
}

seed().catch((e) => {
  console.error(e);

  process.exit(1);
});
