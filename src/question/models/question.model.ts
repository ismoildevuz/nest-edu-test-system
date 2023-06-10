import {
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  Model,
  Table,
  HasMany,
} from 'sequelize-typescript';
import { Test } from '../../test/models/test.model';
import { Answer } from '../../answer/models/answer.model';

interface QuestionAttrs {
  id: string;
  question: string;
  is_multiple_answer: boolean;
  test_id: string;
}

@Table({ tableName: 'question' })
export class Question extends Model<Question, QuestionAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  question: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  is_multiple_answer: boolean;

  @ForeignKey(() => Test)
  @Column({
    type: DataType.STRING,
  })
  test_id: string;

  @BelongsTo(() => Test)
  test: Test;

  @HasMany(() => Answer)
  answer: Answer;
}
