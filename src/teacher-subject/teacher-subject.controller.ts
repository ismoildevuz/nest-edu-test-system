import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { TeacherSubjectService } from './teacher-subject.service';
import { CreateTeacherSubjectDto } from './dto/create-teacher-subject.dto';

@Controller('teacher-subject')
export class TeacherSubjectController {
  constructor(
    private readonly teacherSubjectService: TeacherSubjectService,
  ) {}

  @Post()
  async create(
    @Body() createTeacherSubjectDto: CreateTeacherSubjectDto,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.teacherSubjectService.create(
      createTeacherSubjectDto,
      authHeader,
    );
  }

  @Get()
  async findAll(@Headers('Authorization') authHeader: string) {
    return this.teacherSubjectService.findAll(authHeader);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.teacherSubjectService.findOne(id, authHeader);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.teacherSubjectService.remove(id, authHeader);
  }
}
