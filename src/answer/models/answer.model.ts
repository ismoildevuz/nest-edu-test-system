import {
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  Model,
  Table,
  HasMany,
} from 'sequelize-typescript';
import { Question } from '../../question/models/question.model';

interface AnswerAttrs {
  id: string;
  answer: string;
  is_right: boolean;
  question_id: string;
}

@Table({ tableName: 'answer' })
export class Answer extends Model<Answer, AnswerAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  answer: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  is_right: boolean;

  @ForeignKey(() => Question)
  @Column({
    type: DataType.STRING,
  })
  question_id: string;

  @BelongsTo(() => Question)
  question: Question;
}
