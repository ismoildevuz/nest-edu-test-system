import {
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  Model,
  Table,
} from 'sequelize-typescript';
import { Role } from '../../role/models/role.model';
import { Image } from '../../image/models/image.model';

interface AdminAttrs {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  telegram: string;
  login: string;
  hashed_password: string;
  hashed_refresh_token: string;
  role_id: string;
  image_id: string;
}

@Table({ tableName: 'admin' })
export class Admin extends Model<Admin, AdminAttrs> {
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

  @ForeignKey(() => Role)
  @Column({
    type: DataType.STRING,
  })
  role_id: string;

  @ForeignKey(() => Image)
  @Column({
    type: DataType.STRING,
  })
  image_id: string;

  @BelongsTo(() => Role)
  role: Role;

  @BelongsTo(() => Image)
  image: Image;
}
