import { Module, forwardRef } from '@nestjs/common';
import { ResultQuestionService } from './result_question.service';
import { ResultQuestionController } from './result_question.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ResultQuestion } from './models/result_question.model';
import { ResultModule } from '../result/result.module';
import { QuestionModule } from '../question/question.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ResultQuestion]),
    forwardRef(() => ResultModule),
    forwardRef(() => QuestionModule),
  ],
  controllers: [ResultQuestionController],
  providers: [ResultQuestionService],
  exports: [ResultQuestionService],
})
export class ResultQuestionModule {}
