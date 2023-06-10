import { Module, forwardRef } from '@nestjs/common';
import { TeacherSubjectService } from './teacher-subject.service';
import { TeacherSubjectController } from './teacher-subject.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { TeacherSubject } from './models/teacher-subject.model';
import { TeacherModule } from '../teacher/teacher.module';
import { SubjectModule } from '../subject/subject.module';

@Module({
  imports: [
    SequelizeModule.forFeature([TeacherSubject]),
    forwardRef(() => TeacherModule),
    forwardRef(() => SubjectModule),
  ],
  controllers: [TeacherSubjectController],
  providers: [TeacherSubjectService],
  exports: [TeacherSubjectService],
})
export class TeacherSubjectModule {}
