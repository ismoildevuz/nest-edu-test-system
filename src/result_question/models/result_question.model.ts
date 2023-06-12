import {
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  Model,
  Table,
  HasMany,
} from 'sequelize-typescript';
import { Result } from '../../result/models/result.model';
import { Question } from '../../question/models/question.model';
import { ResultAnswer } from '../../result_answer/models/result_answer.model';

interface ResultQuestionAttrs {
  id: string;
  is_right: boolean;
  result_id: string;
  question_id: string;
}

@Table({ tableName: 'result_question' })
export class ResultQuestion extends Model<ResultQuestion, ResultQuestionAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  is_right: boolean;

  @ForeignKey(() => Result)
  @Column({
    type: DataType.STRING,
  })
  result_id: string;

  @ForeignKey(() => Question)
  @Column({
    type: DataType.STRING,
  })
  question_id: string;

  @BelongsTo(() => Result)
  result: Result;

  @BelongsTo(() => Question)
  question: Question;

  @HasMany(() => ResultAnswer)
  resultAnswer: ResultAnswer;
}
