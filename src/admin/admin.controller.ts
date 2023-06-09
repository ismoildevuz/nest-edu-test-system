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
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Body() createAdminDto: CreateAdminDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.adminService.create(createAdminDto, images);
  }

  @Get()
  async findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images'))
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.adminService.update(id, updateAdminDto, images);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
}
