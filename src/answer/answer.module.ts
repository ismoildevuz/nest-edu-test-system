import { Module, forwardRef } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Answer } from './models/answer.model';
import { QuestionModule } from '../question/question.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Answer]),
    forwardRef(() => QuestionModule),
  ],
  controllers: [AnswerController],
  providers: [AnswerService],
  exports: [AnswerService],
})
export class AnswerModule {}
