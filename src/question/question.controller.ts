import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  async create(
    @Body() createQuestionDto: CreateQuestionDto,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.questionService.create(createQuestionDto, authHeader);
  }

  @Get()
  async findAll(@Headers('Authorization') authHeader: string) {
    return this.questionService.findAll(authHeader);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.questionService.findOne(id, authHeader);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.questionService.update(id, updateQuestionDto, authHeader);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.questionService.remove(id, authHeader);
  }
}
