import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { TeacherSubjectService } from './teacher-subject.service';
import { CreateTeacherSubjectDto } from './dto/create-teacher-subject.dto';

@Controller('teacher-subject')
export class TeacherSubjectController {
  constructor(private readonly teacherSubjectService: TeacherSubjectService) {}

  @Post()
  async create(@Body() createTeacherSubjectDto: CreateTeacherSubjectDto) {
    return this.teacherSubjectService.create(createTeacherSubjectDto);
  }

  @Get()
  async findAll() {
    return this.teacherSubjectService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.teacherSubjectService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.teacherSubjectService.remove(id);
  }
}
