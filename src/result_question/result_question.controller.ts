import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { ResultQuestionService } from './result_question.service';
import { CreateResultQuestionDto } from './dto/create-result_question.dto';

@Controller('result-question')
export class ResultQuestionController {
  constructor(private readonly resultQuestionService: ResultQuestionService) {}

  @Post()
  async create(@Body() createResultQuestionDto: CreateResultQuestionDto) {
    return this.resultQuestionService.create(createResultQuestionDto);
  }

  @Get()
  async findAll() {
    return this.resultQuestionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.resultQuestionService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.resultQuestionService.remove(id);
  }
}
