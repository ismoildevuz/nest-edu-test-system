import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { Admin } from '../../admin/models/admin.model';

interface ImageAttrs {
  id: string;
  file_name: string;
}

@Table({ tableName: 'image' })
export class Image extends Model<Image, ImageAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  file_name: string;

  @HasMany(() => Admin)
  admin: Admin;
}
