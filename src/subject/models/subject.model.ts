import {
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  Model,
  Table,
  HasMany,
} from 'sequelize-typescript';
import { Image } from '../../image/models/image.model';
import { TeacherSubject } from '../../teacher-subject/models/teacher-subject.model';
import { Test } from '../../test/models/test.model';

interface SubjectAttrs {
  id: string;
  name: string;
  image_id: string;
}

@Table({ tableName: 'subject' })
export class Subject extends Model<Subject, SubjectAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @ForeignKey(() => Image)
  @Column({
    type: DataType.STRING,
  })
  image_id: string;

  @BelongsTo(() => Image)
  image: Image;

  @HasMany(() => TeacherSubject)
  teacherSubject: TeacherSubject;

  @HasMany(() => Test)
  test: Test;
}
