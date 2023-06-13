import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateResultQuestionDto } from './dto/create-result_question.dto';
import { InjectModel } from '@nestjs/sequelize';
import { ResultQuestion } from './models/result_question.model';
import { ResultService } from '../result/result.service';
import { QuestionService } from '../question/question.service';
import { v4 as uuid } from 'uuid';
import { Result } from '../result/models/result.model';
import { Question } from '../question/models/question.model';
import { ResultAnswer } from '../result_answer/models/result_answer.model';

@Injectable()
export class ResultQuestionService {
  constructor(
    @InjectModel(ResultQuestion)
    private resultQuestionRepository: typeof ResultQuestion,
    private readonly resultService: ResultService,
    private readonly questionService: QuestionService,
  ) {}

  async create(createResultQuestionDto: CreateResultQuestionDto) {
    await this.resultService.findOne(createResultQuestionDto.result_id);
    await this.questionService.getOne(createResultQuestionDto.question_id);
    const newResultQuestion = await this.resultQuestionRepository.create({
      id: uuid(),
      ...createResultQuestionDto,
    });
    return this.findOne(newResultQuestion.id);
  }

  async findAll() {
    return this.resultQuestionRepository.findAll({
      attributes: ['id', 'is_right', 'result_id', 'question_id'],
      include: [Result, Question, ResultAnswer],
    });
  }

  async findOne(id: string) {
    const resultQuestion = await this.resultQuestionRepository.findOne({
      where: { id },
      attributes: ['id', 'is_right', 'result_id', 'question_id'],
      include: [Result, Question, ResultAnswer],
    });
    if (!resultQuestion) {
      throw new HttpException('Result Question not found', HttpStatus.NOT_FOUND);
    }
    return resultQuestion;
  }

  async remove(id: string) {
    const resultQuestion = await this.findOne(id);
    await this.resultQuestionRepository.destroy({ where: { id } });
    return resultQuestion;
  }
}
