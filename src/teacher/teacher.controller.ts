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
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Body() createTeacherDto: CreateTeacherDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.teacherService.create(createTeacherDto, images);
  }

  @Get()
  async findAll() {
    return this.teacherService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.teacherService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images'))
  async update(
    @Param('id') id: string,
    @Body() updateTeacherDto: UpdateTeacherDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.teacherService.update(id, updateTeacherDto, images);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.teacherService.remove(id);
  }
}
