import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { Admin } from '../../admin/models/admin.model';

interface RoleAttrs {
  id: string;
  name: string;
  description: string;
}

@Table({ tableName: 'role' })
export class Role extends Model<Role, RoleAttrs> {
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
    type: DataType.TEXT,
  })
  description: string;

  @HasMany(() => Admin)
  admin: Admin;
}
