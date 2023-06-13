import { Module, forwardRef } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Question } from './models/question.model';
import { TestModule } from '../test/test.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forFeature([Question]),
    forwardRef(() => TestModule),
    JwtModule,
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
