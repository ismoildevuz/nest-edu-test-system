import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './models/role.model';
import { v4 as uuid } from 'uuid';
import { Admin } from '../admin/models/admin.model';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role) private roleRepository: typeof Role,
    @InjectModel(Admin) private adminRepository: typeof Admin,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    createRoleDto.name = createRoleDto.name.trim().toLowerCase();
    const roleByname = await this.getRoleByName(createRoleDto.name);
    if (roleByname) {
      throw new BadRequestException('Name already taken!');
    }
    return this.roleRepository.create({ id: uuid(), ...createRoleDto });
  }

  async findAll() {
    return this.roleRepository.findAll({
      attributes: ['id', 'name', 'description'],
    });
  }

  async findOne(id: string) {
    const role = await this.roleRepository.findOne({
      where: { id },
      attributes: ['id', 'name', 'description'],
    });
    if (!role) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    await this.findOne(id);
    if (updateRoleDto.name) {
      updateRoleDto.name = updateRoleDto.name.trim().toLowerCase();
    }
    const roleByname = await this.getRoleByName(updateRoleDto.name);
    if (roleByname && roleByname.id != id) {
      throw new BadRequestException('Name already taken!');
    }
    await this.roleRepository.update(updateRoleDto, { where: { id } });
    return this.findOne(id);
  }

  async remove(id: string) {
    const role = await this.findOne(id);
    const admin = await this.adminRepository.findAll({
      where: { role_id: id },
    });
    if (admin.length) {
      throw new BadRequestException('The role is in use');
    }
    await this.roleRepository.destroy({ where: { id } });
    return role;
  }

  async getRoleByName(name: string) {
    const role = await this.roleRepository.findOne({
      where: { name },
    });
    return role;
  }
}
