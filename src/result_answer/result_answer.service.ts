import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateResultAnswerDto } from './dto/create-result_answer.dto';
import { v4 as uuid } from 'uuid';
import { InjectModel } from '@nestjs/sequelize';
import { ResultAnswer } from './models/result_answer.model';
import { ResultQuestionService } from '../result_question/result_question.service';
import { AnswerService } from '../answer/answer.service';
import { ResultQuestion } from '../result_question/models/result_question.model';
import { Answer } from '../answer/models/answer.model';

@Injectable()
export class ResultAnswerService {
  constructor(
    @InjectModel(ResultAnswer)
    private resultAnswerRepository: typeof ResultAnswer,
    private readonly resultQuestionService: ResultQuestionService,
    private readonly answerService: AnswerService,
  ) {}

  async create(createResultAnswerDto: CreateResultAnswerDto) {
    await this.resultQuestionService.findOne(
      createResultAnswerDto.result_question_id,
    );
    await this.answerService.getOne(createResultAnswerDto.answer_id);
    const newResultAnswer = await this.resultAnswerRepository.create({
      id: uuid(),
      ...createResultAnswerDto,
    });
    return this.findOne(newResultAnswer.id);
  }

  async findAll() {
    return this.resultAnswerRepository.findAll({
      attributes: ['id', 'result_question_id', 'answer_id'],
      include: [ResultQuestion, Answer],
    });
  }

  async findOne(id: string) {
    const resultAnswer = await this.resultAnswerRepository.findOne({
      where: { id },
      attributes: ['id', 'result_question_id', 'answer_id'],
      include: [ResultQuestion, Answer],
    });
    if (!resultAnswer) {
      throw new HttpException('Result Answer not found', HttpStatus.NOT_FOUND);
    }
    return resultAnswer;
  }

  async remove(id: string) {
    const resultAnswer = await this.findOne(id);
    await this.resultAnswerRepository.destroy({ where: { id } });
    return resultAnswer;
  }
}
