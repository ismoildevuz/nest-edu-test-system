import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Test } from './models/test.model';
import { SubjectService } from '../subject/subject.service';
import { v4 as uuid } from 'uuid';
import { Subject } from '../subject/models/subject.model';

@Injectable()
export class TestService {
  constructor(
    @InjectModel(Test) private testRepository: typeof Test,
    private readonly subjectService: SubjectService,
  ) {}

  async create(createTestDto: CreateTestDto) {
    await this.subjectService.findOne(createTestDto.subject_id);
    const newTest = await this.testRepository.create({
      id: uuid(),
      ...createTestDto,
    });
    return this.findOne(newTest.id);
  }

  async findAll() {
    return this.testRepository.findAll({
      attributes: [
        'id',
        'name',
        'type',
        'time_limit',
        'createdAt',
        'subject_id',
      ],
      include: [Subject],
    });
  }

  async findOne(id: string) {
    const test = await this.testRepository.findOne({
      where: { id },
      attributes: [
        'id',
        'name',
        'type',
        'time_limit',
        'createdAt',
        'subject_id',
      ],
      include: [Subject],
    });
    if (!test) {
      throw new HttpException('Test not found', HttpStatus.NOT_FOUND);
    }
    return test;
  }

  async update(id: string, updateTestDto: UpdateTestDto) {
    await this.findOne(id);
    if (updateTestDto.subject_id) {
      await this.subjectService.findOne(updateTestDto.subject_id);
    }
    await this.testRepository.update(updateTestDto, { where: { id } });
    return this.findOne(id);
  }

  async remove(id: string) {
    const test = await this.findOne(id);
    await this.testRepository.destroy({ where: { id } });
    return test;
  }
}
