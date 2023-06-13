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
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthDto } from './dto/auth.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('auth/signin')
  async login(@Body() AuthDto: AuthDto) {
    return this.studentService.login(AuthDto);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Body() createStudentDto: CreateStudentDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Headers('Authorization') authHeader: string,
  ) {
    return this.studentService.create(createStudentDto, images, authHeader);
  }

  @Get()
  async findAll(@Headers('Authorization') authHeader: string) {
    return this.studentService.findAll(authHeader);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.studentService.findOne(id, authHeader);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images'))
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Headers('Authorization') authHeader: string,
  ) {
    return this.studentService.update(id, updateStudentDto, images, authHeader);
  }

  @Patch('group/:id')
  async updateGroup(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.studentService.updateGroup(id, updateGroupDto, authHeader);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.studentService.remove(id, authHeader);
  }
}
