import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { Admin } from '../../admin/models/admin.model';
import { Teacher } from '../../teacher/models/teacher.model';
import { Subject } from '../../subject/models/subject.model';

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

  @HasMany(() => Teacher)
  teacher: Teacher;

  @HasMany(() => Subject)
  subject: Subject;
}
