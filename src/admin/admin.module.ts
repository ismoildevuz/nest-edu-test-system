import { Module, forwardRef } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin } from './models/admin.model';
import { ImageModule } from '../image/image.module';
import { RoleModule } from '../role/role.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forFeature([Admin]),
    forwardRef(() => ImageModule),
    forwardRef(() => RoleModule),
    JwtModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
