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
import { Student } from '../../student/models/student.model';

interface GroupAttrs {
  id: string;
  name: string;
  image_id: string;
}

@Table({ tableName: 'group' })
export class Group extends Model<Group, GroupAttrs> {
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

  @HasMany(() => Student)
  student: Student;
}
