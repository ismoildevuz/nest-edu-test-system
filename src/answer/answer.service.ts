import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Answer } from './models/answer.model';
import { QuestionService } from '../question/question.service';
import { Question } from '../question/models/question.model';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AnswerService {
  constructor(
    @InjectModel(Answer) private answerRepository: typeof Answer,
    private readonly questionService: QuestionService,
  ) {}

  async create(createAnswerDto: CreateAnswerDto) {
    await this.questionService.findOne(createAnswerDto.question_id);
    const newAnswer = await this.answerRepository.create({
      id: uuid(),
      ...createAnswerDto,
    });
    return this.findOne(newAnswer.id);
  }

  async findAll() {
    return this.answerRepository.findAll({
      attributes: ['id', 'answer', 'is_right', 'question_id'],
      include: [Question],
    });
  }

  async findOne(id: string) {
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

  async update(id: string, updateAnswerDto: UpdateAnswerDto) {
    await this.findOne(id);
    if (updateAnswerDto.question_id) {
      await this.questionService.findOne(updateAnswerDto.question_id);
    }
    await this.answerRepository.update(updateAnswerDto, { where: { id } });
    return this.findOne(id);
  }

  async remove(id: string) {
    const answer = await this.findOne(id);
    await this.answerRepository.destroy({ where: { id } });
    return answer;
  }
}
