import { In } from 'typeorm';
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

const getByIds = async (ids: string[]) => {
  return await ds.getRepository(Service).find({
    where: { id: In(ids) }
  });
};

const createService = async (service: CreateServiceDto) => {
  return await ds.getRepository(Service).save(service);
};

const createServices = async (products: CreateServiceDto[]) => {
  return await ds.getRepository(Service).save(products);
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
  getByIds,
  createService,
  createServices,
  updateService,
  deleteService
};
