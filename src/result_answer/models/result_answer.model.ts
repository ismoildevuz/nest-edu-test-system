import {
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  Model,
  Table,
} from 'sequelize-typescript';
import { Answer } from '../../answer/models/answer.model';
import { ResultQuestion } from '../../result_question/models/result_question.model';

interface ResultAnswerAttrs {
  id: string;
  result_question_id: string;
  answer_id: string;
}

@Table({ tableName: 'result_answer' })
export class ResultAnswer extends Model<ResultAnswer, ResultAnswerAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => ResultQuestion)
  @Column({
    type: DataType.STRING,
  })
  result_question_id: string;

  @ForeignKey(() => Answer)
  @Column({
    type: DataType.STRING,
  })
  answer_id: string;

  @BelongsTo(() => ResultQuestion)
  resultQuestion: ResultQuestion;

  @BelongsTo(() => Answer)
  answer: Answer;
}
