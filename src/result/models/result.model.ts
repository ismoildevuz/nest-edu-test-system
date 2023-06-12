import {
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  Model,
  Table,
  HasMany,
} from 'sequelize-typescript';
import { Student } from '../../student/models/student.model';
import { Test } from '../../test/models/test.model';
import { ResultQuestion } from '../../result_question/models/result_question.model';

interface ResultAttrs {
  id: string;
  time_spent: number;
  student_id: string;
  test_id: string;
}

@Table({ tableName: 'result' })
export class Result extends Model<Result, ResultAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.INTEGER,
  })
  time_spent: number;

  @ForeignKey(() => Student)
  @Column({
    type: DataType.STRING,
  })
  student_id: string;

  @ForeignKey(() => Test)
  @Column({
    type: DataType.STRING,
  })
  test_id: string;

  @BelongsTo(() => Student)
  student: Student;

  @BelongsTo(() => Test)
  test: Test;

  @HasMany(() => ResultQuestion)
  resultQuestion: ResultQuestion;
}
