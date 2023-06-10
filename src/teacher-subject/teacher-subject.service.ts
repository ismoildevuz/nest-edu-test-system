import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateTeacherSubjectDto } from './dto/create-teacher-subject.dto';
import { v4 as uuid } from 'uuid';
import { InjectModel } from '@nestjs/sequelize';
import { TeacherSubject } from './models/teacher-subject.model';
import { Teacher } from '../teacher/models/teacher.model';
import { Subject } from '../subject/models/subject.model';
import { TeacherService } from './../teacher/teacher.service';
import { SubjectService } from './../subject/subject.service';

@Injectable()
export class TeacherSubjectService {
  constructor(
    @InjectModel(TeacherSubject)
    private teacherSubjectRepository: typeof TeacherSubject,
    private readonly teacherService: TeacherService,
    private readonly subjectService: SubjectService,
  ) {}

  async create(createTeacherSubjectDto: CreateTeacherSubjectDto) {
    const { teacher_id, subject_id } = createTeacherSubjectDto;
    await this.teacherService.findOne(createTeacherSubjectDto.teacher_id);
    await this.subjectService.findOne(createTeacherSubjectDto.subject_id);
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
    return this.findOne(newTeacherSubject.id);
  }

  async findAll() {
    return this.teacherSubjectRepository.findAll({
      attributes: ['id'],
      include: [Teacher, Subject],
    });
  }

  async findOne(id: string) {
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

  async remove(id: string) {
    const teacherSubject = await this.findOne(id);
    await this.teacherSubjectRepository.destroy({ where: { id } });
    return teacherSubject;
  }
}
