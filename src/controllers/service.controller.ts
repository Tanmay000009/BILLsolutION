import { Request, Response } from 'express';
import { serviceRepo } from '../repos/service.repo';
import { plainToInstance } from 'class-transformer';
import { UUIDValidationDto } from '../dtos/common.dto';
import { validate } from 'class-validator';
import { CreateServiceDto, UpdateServiceDto } from '../dtos/service.dto';

const getAll = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit?.toString() ?? '20');
    const offset = parseInt(req.query.offset?.toString() ?? '0');

    const services = await serviceRepo.getAll(limit, offset);
    return res.status(200).json({
      status: true,
      data: {
        services,
        limit,
        offset,
        total: services.length
      },
      message: 'Services found'
    });
  } catch (error) {
    console.log('Error in getAll: ', error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
      data: null
    });
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const uuidValidationObject = plainToInstance(UUIDValidationDto, {
      id: req.params.id
    });
    const errors = await validate(uuidValidationObject);

    if (errors.length > 0) {
      return res.status(400).json({
        status: false,
        message: 'Validation Error',
        errors,
        data: null
      });
    }

    const service = await serviceRepo.getById(uuidValidationObject.id);

    if (!service) {
      return res.status(404).json({
        status: false,
        message: 'service not found',
        data: null
      });
    }

    return res.status(200).json({
      status: true,
      data: service,
      message: 'service found'
    });
  } catch (error) {
    console.log('Error in getById: ', error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
      data: null
    });
  }
};

const createService = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized',
        data: null
      });
    }

    if (req.user.isAdmin !== true) {
      return res.status(403).json({
        status: false,
        message: 'Forbidden',
        data: null
      });
    }

    const service = plainToInstance(CreateServiceDto, req.body);
    const errors = await validate(service);

    if (errors.length > 0) {
      return res.status(400).json({
        status: false,
        message: 'Validation Error',
        errors,
        data: null
      });
    }

    const newService = await serviceRepo.createService(service);

    return res.status(201).json({
      status: true,
      data: newService,
      message: 'service created'
    });
  } catch (error) {
    console.log('Error in createService: ', error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
      data: null
    });
  }
};

const updateService = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized',
        data: null
      });
    }

    if (req.user.isAdmin !== true) {
      return res.status(403).json({
        status: false,
        message: 'Forbidden',
        data: null
      });
    }

    const uuidValidationObject = plainToInstance(UUIDValidationDto, {
      id: req.params.id
    });

    const errors = await validate(uuidValidationObject);

    if (errors.length > 0) {
      return res.status(400).json({
        status: false,
        message: 'Validation Error',
        errors,
        data: null
      });
    }

    const service = await serviceRepo.getById(uuidValidationObject.id);

    if (!service) {
      return res.status(404).json({
        status: false,
        message: 'service not found',
        data: null
      });
    }

    const serviceValidationObject = plainToInstance(UpdateServiceDto, req.body);

    const serviceValidationErrors = await validate(serviceValidationObject);

    if (serviceValidationErrors.length > 0) {
      return res.status(400).json({
        status: false,
        message: 'Validation Error',
        errors: serviceValidationErrors,
        data: null
      });
    }

    const updatedService = await serviceRepo.updateService({
      ...service,
      ...serviceValidationObject
    });

    return res.status(200).json({
      status: true,
      data: updatedService,
      message: 'service updated'
    });
  } catch (error) {
    console.log('Error in updateService: ', error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
      data: null
    });
  }
};

const deleteService = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized',
        data: null
      });
    }

    if (req.user.isAdmin !== true) {
      return res.status(403).json({
        status: false,
        message: 'Forbidden',
        data: null
      });
    }

    const uuidValidationObject = plainToInstance(UUIDValidationDto, {
      id: req.params.id
    });

    const errors = await validate(uuidValidationObject);

    if (errors.length > 0) {
      return res.status(400).json({
        status: false,
        message: 'Validation Error',
        errors,
        data: null
      });
    }

    const service = await serviceRepo.getById(uuidValidationObject.id);

    if (!service) {
      return res.status(404).json({
        status: false,
        message: 'service not found',
        data: null
      });
    }

    await serviceRepo.deleteService(service.id);

    return res.status(200).json({
      status: true,
      message: 'service deleted',
      data: null
    });
  } catch (error) {
    console.log('Error in deleteService: ', error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
      data: null
    });
  }
};

export const serviceController = {
  getAll,
  getById,
  createService,
  updateService,
  deleteService
};
