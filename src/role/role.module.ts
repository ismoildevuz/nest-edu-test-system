import { Module, forwardRef } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './models/role.model';
import { Admin } from '../admin/models/admin.model';

@Module({
  imports: [SequelizeModule.forFeature([Role, Admin]), forwardRef(() => Admin)],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
