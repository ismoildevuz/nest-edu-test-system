import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Answer } from './models/answer.model';
import { QuestionService } from '../question/question.service';
import { Question } from '../question/models/question.model';
import { v4 as uuid } from 'uuid';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AnswerService {
  constructor(
    @InjectModel(Answer) private answerRepository: typeof Answer,
    private readonly questionService: QuestionService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createAnswerDto: CreateAnswerDto, authHeader: string) {
    await this.isSuperAdmin(authHeader);
    await this.questionService.getOne(createAnswerDto.question_id);
    const newAnswer = await this.answerRepository.create({
      id: uuid(),
      ...createAnswerDto,
    });
    return this.getOne(newAnswer.id);
  }

  async findAll(authHeader: string) {
    await this.isAdmin(authHeader);
    return this.answerRepository.findAll({
      attributes: ['id', 'answer', 'is_right', 'question_id'],
      include: [Question],
    });
  }

  async findOne(id: string, authHeader: string) {
    await this.isAdmin(authHeader);
    const answer = await this.answerRepository.findOne({
      where: { id },
      attributes: ['id', 'answer', 'is_right', 'question_id'],
      include: [Question],
    });
    if (!answer) {
      throw new HttpException('Answer not found', HttpStatus.NOT_FOUND);
    }
    return answer;
  }

  async update(
    id: string,
    updateAnswerDto: UpdateAnswerDto,
    authHeader: string,
  ) {
    await this.isSuperAdmin(authHeader);
    await this.getOne(id);
    if (updateAnswerDto.question_id) {
      await this.questionService.getOne(updateAnswerDto.question_id);
    }
    await this.answerRepository.update(updateAnswerDto, { where: { id } });
    return this.getOne(id);
  }

  async remove(id: string, authHeader: string) {
    await this.isSuperAdmin(authHeader);
    const answer = await this.getOne(id);
    await this.answerRepository.destroy({ where: { id } });
    return answer;
  }

  async getOne(id: string) {
    const answer = await this.answerRepository.findOne({
      where: { id },
      attributes: ['id', 'answer', 'is_right', 'question_id'],
      include: [Question],
    });
    if (!answer) {
      throw new HttpException('Answer not found', HttpStatus.NOT_FOUND);
    }
    return answer;
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
