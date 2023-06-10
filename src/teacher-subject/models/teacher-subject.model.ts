import {
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  Model,
  Table,
} from 'sequelize-typescript';
import { Teacher } from '../../teacher/models/teacher.model';
import { Subject } from '../../subject/models/subject.model';

interface TeacherSubjectAttrs {
  id: string;
  teacher_id: string;
  subject_id: string;
}

@Table({ tableName: 'teacher_subject' })
export class TeacherSubject extends Model<TeacherSubject, TeacherSubjectAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Teacher)
  @Column({
    type: DataType.STRING,
  })
  teacher_id: string;

  @ForeignKey(() => Subject)
  @Column({
    type: DataType.STRING,
  })
  subject_id: string;

  @BelongsTo(() => Teacher)
  teacher: Teacher;

  @BelongsTo(() => Subject)
  subject: Subject;
}
