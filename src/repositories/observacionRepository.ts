import { AppDataSource } from "../config/database";

import { ObservacionDirector } from "../models/ObservacionDirector";

export class ObservacionRepository {
  private repo = AppDataSource.getRepository(ObservacionDirector);

  findAll() {
    return this.repo.find({
      order: {
        fechaCreacion: "DESC",
      },
    });
  }

  findById(id: string) {
    return this.repo.findOneBy({
      id,
    });
  }

  create(data: Partial<ObservacionDirector>) {
    const entity = this.repo.create(data);

    return this.repo.save(entity);
  }

  save(entity: ObservacionDirector) {
    return this.repo.save(entity);
  }
}
