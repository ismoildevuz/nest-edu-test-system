import {
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  Model,
  Table,
  HasMany,
} from 'sequelize-typescript';
import { Subject } from '../../subject/models/subject.model';
import { Question } from '../../question/models/question.model';
import { Result } from '../../result/models/result.model';

interface TestAttrs {
  id: string;
  name: string;
  type: string;
  time_limit: number;
  subject_id: string;
}

@Table({ tableName: 'test' })
export class Test extends Model<Test, TestAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  type: string;

  @Column({
    type: DataType.INTEGER,
  })
  time_limit: number;

  @ForeignKey(() => Subject)
  @Column({
    type: DataType.STRING,
  })
  subject_id: string;

  @BelongsTo(() => Subject)
  subject: Subject;

  @HasMany(() => Question)
  question: Question;

  @HasMany(() => Result)
  result: Result;
}
