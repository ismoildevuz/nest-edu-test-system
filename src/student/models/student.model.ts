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
import { Group } from '../../group/models/group.model';

interface StudentAttrs {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  telegram: string;
  login: string;
  hashed_password: string;
  hashed_refresh_token: string;
  group_id: string;
  image_id: string;
}

@Table({ tableName: 'student' })
export class Student extends Model<Student, StudentAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  full_name: string;

  @Column({
    type: DataType.STRING,
  })
  email: string;

  @Column({
    type: DataType.STRING,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
  })
  telegram: string;

  @Column({
    type: DataType.STRING,
  })
  login: string;

  @Column({
    type: DataType.STRING,
  })
  hashed_password: string;

  @Column({
    type: DataType.STRING,
  })
  hashed_refresh_token: string;

  @ForeignKey(() => Group)
  @Column({
    type: DataType.STRING,
  })
  group_id: string;

  @ForeignKey(() => Image)
  @Column({
    type: DataType.STRING,
  })
  image_id: string;

  @BelongsTo(() => Group)
  group: Group;

  @BelongsTo(() => Image)
  image: Image;
}
