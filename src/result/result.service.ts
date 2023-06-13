import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Result } from './models/result.model';
import { v4 as uuid } from 'uuid';
import { StudentService } from '../student/student.service';
import { TestService } from '../test/test.service';
import { Student } from '../student/models/student.model';
import { Test } from '../test/models/test.model';
import { ResultQuestion } from '../result_question/models/result_question.model';

@Injectable()
export class ResultService {
  constructor(
    @InjectModel(Result) private resultRepository: typeof Result,
    private readonly studentService: StudentService,
    private readonly testService: TestService,
  ) {}

  async create(createResultDto: CreateResultDto) {
    await this.studentService.getOne(createResultDto.student_id);
    await this.testService.getOne(createResultDto.test_id);
    const newResult = await this.resultRepository.create({
      id: uuid(),
      ...createResultDto,
    });
    return this.findOne(newResult.id);
  }

  async findAll() {
    return this.resultRepository.findAll({
      attributes: ['id', 'time_spent', 'createdAt', 'student_id', 'test_id'],
      include: [Student, Test, ResultQuestion],
    });
  }

  async findOne(id: string) {
    const result = await this.resultRepository.findOne({
      where: { id },
      attributes: ['id', 'time_spent', 'createdAt', 'student_id', 'test_id'],
      include: [Student, Test, ResultQuestion],
    });
    if (!result) {
      throw new HttpException('Result not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async remove(id: string) {
    const result = await this.findOne(id);
    await this.resultRepository.destroy({ where: { id } });
    return result;
  }
}
