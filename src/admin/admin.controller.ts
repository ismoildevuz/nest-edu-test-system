import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Headers,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AuthDto } from './dto/auth.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('auth/signin')
  async login(@Body() AuthDto: AuthDto) {
    return this.adminService.login(AuthDto);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Body() createAdminDto: CreateAdminDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Headers('Authorization') authHeader: string,
  ) {
    return this.adminService.create(createAdminDto, images, authHeader);
  }

  @Get()
  async findAll(@Headers('Authorization') authHeader: string) {
    return this.adminService.findAll(authHeader);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.adminService.findOne(id, authHeader);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images'))
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Headers('Authorization') authHeader: string,
  ) {
    return this.adminService.update(id, updateAdminDto, images, authHeader);
  }

  @Patch('role/:id')
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.adminService.updateRole(id, updateRoleDto, authHeader);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.adminService.remove(id, authHeader);
  }
}
