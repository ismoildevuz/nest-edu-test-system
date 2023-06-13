import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTeacherSubjectDto } from './dto/create-teacher-subject.dto';
import { v4 as uuid } from 'uuid';
import { InjectModel } from '@nestjs/sequelize';
import { TeacherSubject } from './models/teacher-subject.model';
import { Teacher } from '../teacher/models/teacher.model';
import { Subject } from '../subject/models/subject.model';
import { TeacherService } from './../teacher/teacher.service';
import { SubjectService } from './../subject/subject.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TeacherSubjectService {
  constructor(
    @InjectModel(TeacherSubject)
    private teacherSubjectRepository: typeof TeacherSubject,
    private readonly teacherService: TeacherService,
    private readonly subjectService: SubjectService,
    private readonly jwtService: JwtService,
  ) {}

  async create(
    createTeacherSubjectDto: CreateTeacherSubjectDto,
    authHeader: string,
  ) {
    await this.isSuperAdmin(authHeader);
    const { teacher_id, subject_id } = createTeacherSubjectDto;
    await this.teacherService.getOne(createTeacherSubjectDto.teacher_id);
    await this.subjectService.getOne(createTeacherSubjectDto.subject_id);
    const teacherSubject = await this.teacherSubjectRepository.findOne({
      where: { teacher_id, subject_id },
    });
    if (teacherSubject) {
      throw new BadRequestException('Teacher already has this subject');
    }
    const newTeacherSubject = await this.teacherSubjectRepository.create({
      id: uuid(),
      ...createTeacherSubjectDto,
    });
    return this.getOne(newTeacherSubject.id);
  }

  async findAll(authHeader: string) {
    await this.isAdmin(authHeader);
    return this.teacherSubjectRepository.findAll({
      attributes: ['id'],
      include: [Teacher, Subject],
    });
  }

  async findOne(id: string, authHeader: string) {
    await this.isAdmin(authHeader);
    const teacherSubject = await this.teacherSubjectRepository.findOne({
      where: { id },
      attributes: ['id'],
      include: [Teacher, Subject],
    });
    if (!teacherSubject) {
      throw new HttpException(
        'Teacher Subject not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return teacherSubject;
  }

  async remove(id: string, authHeader: string) {
    await this.isSuperAdmin(authHeader);
    const teacherSubject = await this.getOne(id);
    await this.teacherSubjectRepository.destroy({ where: { id } });
    return teacherSubject;
  }

  async getOne(id: string) {
    const teacherSubject = await this.teacherSubjectRepository.findOne({
      where: { id },
      attributes: ['id'],
      include: [Teacher, Subject],
    });
    if (!teacherSubject) {
      throw new HttpException(
        'Teacher Subject not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return teacherSubject;
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
