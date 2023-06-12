import { Module, forwardRef } from '@nestjs/common';
import { ResultAnswerService } from './result_answer.service';
import { ResultAnswerController } from './result_answer.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ResultAnswer } from './models/result_answer.model';
import { ResultQuestionModule } from '../result_question/result_question.module';
import { AnswerModule } from '../answer/answer.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ResultAnswer]),
    forwardRef(() => ResultQuestionModule),
    forwardRef(() => AnswerModule),
  ],
  controllers: [ResultAnswerController],
  providers: [ResultAnswerService],
  exports: [ResultAnswerService],
})
export class ResultAnswerModule {}
