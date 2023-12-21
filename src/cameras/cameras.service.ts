import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { CreateCameraDto } from './dto/create-camera.dto';
import { Camera } from './entities/camera.entity';
import { NullableType } from '../utils/types/nullable.type';
import { FilterUserDto, SortUserDto } from './dto/query-user.dto';

@Injectable()
export class CamerasService {
  constructor(
    @InjectRepository(Camera)
    private camerasRepository: Repository<Camera>,
  ) {}

  create(createCameraDto: CreateCameraDto): Promise<Camera> {
    return this.camerasRepository.save(
      this.camerasRepository.create(createCameraDto),
    );
  }

  findManyWithPagination({
    // filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Camera[]> {
    const where: FindOptionsWhere<Camera> = {};
    // if (filterOptions?.roles?.length) {
    //   where.role = filterOptions.roles.map((role) => ({
    //     id: role.id,
    //   }));
    // }

    return this.camerasRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });
  }

  findOne(fields: EntityCondition<Camera>): Promise<NullableType<Camera>> {
    return this.camerasRepository.findOne({
      where: fields,
    });
  }

  update(id: Camera['id'], payload: DeepPartial<Camera>): Promise<Camera> {
    return this.camerasRepository.save(
      this.camerasRepository.create({
        id,
        ...payload,
      }),
    );
  }

  async softDelete(id: Camera['id']): Promise<void> {
    await this.camerasRepository.softDelete(id);
  }
}
