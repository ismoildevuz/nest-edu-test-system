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
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthDto } from './dto/auth.dto';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post('auth/signin')
  async login(@Body() AuthDto: AuthDto) {
    return this.teacherService.login(AuthDto);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Body() createTeacherDto: CreateTeacherDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Headers('Authorization') authHeader: string,
  ) {
    return this.teacherService.create(createTeacherDto, images, authHeader);
  }

  @Get()
  async findAll(@Headers('Authorization') authHeader: string) {
    return this.teacherService.findAll(authHeader);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.teacherService.findOne(id, authHeader);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images'))
  async update(
    @Param('id') id: string,
    @Body() updateTeacherDto: UpdateTeacherDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Headers('Authorization') authHeader: string,
  ) {
    return this.teacherService.update(id, updateTeacherDto, images, authHeader);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.teacherService.remove(id, authHeader);
  }
}
