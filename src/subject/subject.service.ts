import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { v4 as uuid } from 'uuid';
import { InjectModel } from '@nestjs/sequelize';
import { Subject } from './models/subject.model';
import { ImageService } from '../image/image.service';
import { Image } from '../image/models/image.model';

@Injectable()
export class SubjectService {
  constructor(
    @InjectModel(Subject) private subjectRepository: typeof Subject,
    private readonly imageService: ImageService,
  ) {}

  async create(
    createSubjectDto: CreateSubjectDto,
    images: Express.Multer.File[],
  ) {
    const uploadedImages = await this.imageService.create(images);
    const newSubject = await this.subjectRepository.create({
      id: uuid(),
      ...createSubjectDto,
      image_id: uploadedImages[0]?.id,
    });
    return this.findOne(newSubject.id);
  }

  async findAll() {
    return this.subjectRepository.findAll({
      attributes: ['id', 'name', 'image_id'],
      include: [Image],
    });
  }

  async findOne(id: string) {
    const subject = await this.subjectRepository.findOne({
      where: { id },
      attributes: ['id', 'name', 'image_id'],
      include: [Image],
    });
    if (!subject) {
      throw new HttpException('Subject not found', HttpStatus.NOT_FOUND);
    }
    return subject;
  }

  async update(
    id: string,
    updateSubjectDto: UpdateSubjectDto,
    images: Express.Multer.File[],
  ) {
    const subject = await this.findOne(id);
    if (images.length) {
      if (subject.image_id) {
        await this.subjectRepository.update(
          { image_id: null },
          { where: { id } },
        );
        await this.imageService.remove(subject.image_id);
      }
      const uploadedImages = await this.imageService.create(images);
      await this.subjectRepository.update(
        { image_id: uploadedImages[0]?.id },
        { where: { id } },
      );
    }
    await this.subjectRepository.update(updateSubjectDto, { where: { id } });
    return this.findOne(id);
  }

  async remove(id: string) {
    const subject = await this.findOne(id);
    await this.subjectRepository.destroy({ where: { id } });
    if (subject.image_id) {
      await this.imageService.remove(subject.image_id);
    }
    return subject;
  }
}
