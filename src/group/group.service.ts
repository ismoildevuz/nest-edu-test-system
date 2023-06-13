import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './models/group.model';
import { InjectModel } from '@nestjs/sequelize';
import { ImageService } from '../image/image.service';
import { Image } from '../image/models/image.model';
import { v4 as uuid } from 'uuid';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group) private groupRepository: typeof Group,
    private readonly imageService: ImageService,
    private readonly jwtService: JwtService,
  ) {}

  async create(
    createGroupDto: CreateGroupDto,
    images: Express.Multer.File[],
    authHeader: string,
  ) {
    await this.isSuperAdmin(authHeader);
    const uploadedImages = await this.imageService.create(images);
    const newGroup = await this.groupRepository.create({
      id: uuid(),
      ...createGroupDto,
      image_id: uploadedImages[0]?.id,
    });
    return this.getOne(newGroup.id);
  }

  async findAll(authHeader: string) {
    await this.isAdmin(authHeader);
    return this.groupRepository.findAll({
      attributes: ['id', 'name', 'image_id'],
      include: [Image],
    });
  }

  async findOne(id: string, authHeader: string) {
    await this.isAdmin(authHeader);
    const group = await this.groupRepository.findOne({
      where: { id },
      attributes: ['id', 'name', 'image_id'],
      include: [Image],
    });
    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }
    return group;
  }

  async update(
    id: string,
    updateGroupDto: UpdateGroupDto,
    images: Express.Multer.File[],
    authHeader: string,
  ) {
    await this.isSuperAdmin(authHeader);
    const group = await this.getOne(id);
    if (images.length) {
      if (group.image_id) {
        await this.groupRepository.update(
          { image_id: null },
          { where: { id } },
        );
        await this.imageService.remove(group.image_id);
      }
      const uploadedImages = await this.imageService.create(images);
      await this.groupRepository.update(
        { image_id: uploadedImages[0]?.id },
        { where: { id } },
      );
    }
    await this.groupRepository.update(updateGroupDto, { where: { id } });
    return this.getOne(id);
  }

  async remove(id: string, authHeader: string) {
    await this.isSuperAdmin(authHeader);
    const group = await this.getOne(id);
    await this.groupRepository.destroy({ where: { id } });
    if (group.image_id) {
      await this.imageService.remove(group.image_id);
    }
    return group;
  }

  async getOne(id: string) {
    const group = await this.groupRepository.findOne({
      where: { id },
      attributes: ['id', 'name', 'image_id'],
      include: [Image],
    });
    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }
    return group;
  }

  async verifyAccessToken(authHeader: string) {
    try {
      const access_token = authHeader.split(' ')[1];
      const user = await this.jwtService.verify(access_token, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async isSuperAdmin(authHeader: string) {
    const user = await this.verifyAccessToken(authHeader);
    if (user.role !== 'super-admin') {
      throw new UnauthorizedException('Restricted action');
    }
  }

  async isAdmin(authHeader: string) {
    const user = await this.verifyAccessToken(authHeader);
    if (user.role !== 'super-admin' && user.role !== 'admin') {
      throw new UnauthorizedException('Restricted action');
    }
  }
}
