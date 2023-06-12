import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Question } from './models/question.model';
import { TestService } from '../test/test.service';
import { v4 as uuid } from 'uuid';
import { Test } from '../test/models/test.model';
import { Answer } from '../answer/models/answer.model';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question) private questionRepository: typeof Question,
    private readonly testService: TestService,
  ) {}

  async create(createQuestionDto: CreateQuestionDto) {
    await this.testService.findOne(createQuestionDto.test_id);
    const newQuestion = await this.questionRepository.create({
      id: uuid(),
      ...createQuestionDto,
    });
    return this.findOne(newQuestion.id);
  }

  async findAll() {
    return this.questionRepository.findAll({
      attributes: ['id', 'question', 'is_multiple_answer', 'test_id'],
      include: [Test, Answer],
    });
  }

  async findOne(id: string) {
    const question = await this.questionRepository.findOne({
      where: { id },
      attributes: ['id', 'question', 'is_multiple_answer', 'test_id'],
      include: [Test, Answer],
    });
    if (!question) {
      throw new HttpException('Question not found', HttpStatus.NOT_FOUND);
    }
    return question;
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto) {
    await this.findOne(id);
    if (updateQuestionDto.test_id) {
      await this.testService.findOne(updateQuestionDto.test_id);
    }
    await this.questionRepository.update(updateQuestionDto, { where: { id } });
    return this.findOne(id);
  }

  async remove(id: string) {
    const question = await this.findOne(id);
    await this.questionRepository.destroy({ where: { id } });
    return question;
  }
}
