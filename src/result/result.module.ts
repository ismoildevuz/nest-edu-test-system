import { Module, forwardRef } from '@nestjs/common';
import { ResultService } from './result.service';
import { ResultController } from './result.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Result } from './models/result.model';
import { StudentModule } from '../student/student.module';
import { TestModule } from '../test/test.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Result]),
    forwardRef(() => StudentModule),
    forwardRef(() => TestModule),
  ],
  controllers: [ResultController],
  providers: [ResultService],
  exports: [ResultService],
})
export class ResultModule {}
