import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { v4 as uuid } from 'uuid';
import { InjectModel } from '@nestjs/sequelize';
import { Subject } from './models/subject.model';
import { ImageService } from '../image/image.service';
import { Image } from '../image/models/image.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SubjectService {
  constructor(
    @InjectModel(Subject) private subjectRepository: typeof Subject,
    private readonly imageService: ImageService,
    private readonly jwtService: JwtService,
  ) {}

  async create(
    createSubjectDto: CreateSubjectDto,
    images: Express.Multer.File[],
    authHeader: string,
  ) {
    await this.isSuperAdmin(authHeader);
    const uploadedImages = await this.imageService.create(images);
    const newSubject = await this.subjectRepository.create({
      id: uuid(),
      ...createSubjectDto,
      image_id: uploadedImages[0]?.id,
    });
    return this.getOne(newSubject.id);
  }

  async findAll(authHeader: string) {
    await this.isAdmin(authHeader);
    return this.subjectRepository.findAll({
      attributes: ['id', 'name', 'image_id'],
      include: [Image],
    });
  }

  async findOne(id: string, authHeader: string) {
    await this.isAdmin(authHeader);
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
    authHeader: string,
  ) {
    await this.isSuperAdmin(authHeader);
    const subject = await this.getOne(id);
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
    return this.getOne(id);
  }

  async remove(id: string, authHeader: string) {
    await this.isSuperAdmin(authHeader);
    const subject = await this.getOne(id);
    await this.subjectRepository.destroy({ where: { id } });
    if (subject.image_id) {
      await this.imageService.remove(subject.image_id);
    }
    return subject;
  }

  async getOne(id: string) {
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
