import { CreateServiceDto } from '../dtos/service.dto';
import { Service } from '../models/Service.model';
import { ds } from '../utils/datasource';

const getAll = async (limit: number = 20, offset: number = 0) => {
  return await ds.getRepository(Service).find({
    take: limit,
    skip: offset
  });
};

const getById = async (id: string) => {
  return await ds.getRepository(Service).findOne({
    where: { id }
  });
};

const createService = async (service: CreateServiceDto) => {
  return await ds.getRepository(Service).save(service);
};

const updateService = async (service: Service) => {
  return await ds.getRepository(Service).save(service);
};

const deleteService = async (id: string) => {
  return await ds.getRepository(Service).delete(id);
};

export const serviceRepo = {
  getAll,
  getById,
  createService,
  updateService,
  deleteService
};
