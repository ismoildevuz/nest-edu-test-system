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
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Body() createSubjectDto: CreateSubjectDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Headers('Authorization') authHeader: string,
  ) {
    return this.subjectService.create(createSubjectDto, images, authHeader);
  }

  @Get()
  async findAll(@Headers('Authorization') authHeader: string) {
    return this.subjectService.findAll(authHeader);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.subjectService.findOne(id, authHeader);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images'))
  async update(
    @Param('id') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Headers('Authorization') authHeader: string,
  ) {
    return this.subjectService.update(id, updateSubjectDto, images, authHeader);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.subjectService.remove(id, authHeader);
  }
}
