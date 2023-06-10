import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './models/group.model';
import { InjectModel } from '@nestjs/sequelize';
import { ImageService } from '../image/image.service';
import { Image } from '../image/models/image.model';
import { v4 as uuid } from 'uuid';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group) private groupRepository: typeof Group,
    private readonly imageService: ImageService,
  ) {}

  async create(createGroupDto: CreateGroupDto, images: Express.Multer.File[]) {
    const uploadedImages = await this.imageService.create(images);
    const newGroup = await this.groupRepository.create({
      id: uuid(),
      ...createGroupDto,
      image_id: uploadedImages[0]?.id,
    });
    return this.findOne(newGroup.id);
  }

  async findAll() {
    return this.groupRepository.findAll({
      attributes: ['id', 'name', 'image_id'],
      include: [Image],
    });
  }

  async findOne(id: string) {
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
  ) {
    const group = await this.findOne(id);
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
    return this.findOne(id);
  }

  async remove(id: string) {
    const group = await this.findOne(id);
    await this.groupRepository.destroy({ where: { id } });
    if (group.image_id) {
      await this.imageService.remove(group.image_id);
    }
    return group;
  }
}
