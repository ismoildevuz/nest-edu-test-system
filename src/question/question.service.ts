import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Question } from './models/question.model';
import { TestService } from '../test/test.service';
import { v4 as uuid } from 'uuid';
import { Test } from '../test/models/test.model';
import { Answer } from '../answer/models/answer.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question) private questionRepository: typeof Question,
    private readonly testService: TestService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createQuestionDto: CreateQuestionDto, authHeader: string) {
    await this.isSuperAdmin(authHeader);
    await this.testService.getOne(createQuestionDto.test_id);
    const newQuestion = await this.questionRepository.create({
      id: uuid(),
      ...createQuestionDto,
    });
    return this.getOne(newQuestion.id);
  }

  async findAll(authHeader: string) {
    await this.isAdmin(authHeader);
    return this.questionRepository.findAll({
      attributes: ['id', 'question', 'is_multiple_answer', 'test_id'],
      include: [Test, Answer],
    });
  }

  async findOne(id: string, authHeader: string) {
    await this.isAdmin(authHeader);
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

  async update(
    id: string,
    updateQuestionDto: UpdateQuestionDto,
    authHeader: string,
  ) {
    await this.isSuperAdmin(authHeader);
    await this.getOne(id);
    if (updateQuestionDto.test_id) {
      await this.testService.getOne(updateQuestionDto.test_id);
    }
    await this.questionRepository.update(updateQuestionDto, { where: { id } });
    return this.getOne(id);
  }

  async remove(id: string, authHeader: string) {
    await this.isSuperAdmin(authHeader);
    const question = await this.getOne(id);
    await this.questionRepository.destroy({ where: { id } });
    return question;
  }

  async getOne(id: string) {
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
