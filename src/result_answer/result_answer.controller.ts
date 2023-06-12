import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { ResultAnswerService } from './result_answer.service';
import { CreateResultAnswerDto } from './dto/create-result_answer.dto';

@Controller('result-answer')
export class ResultAnswerController {
  constructor(private readonly resultAnswerService: ResultAnswerService) {}

  @Post()
  async create(@Body() createResultAnswerDto: CreateResultAnswerDto) {
    return this.resultAnswerService.create(createResultAnswerDto);
  }

  @Get()
  async findAll() {
    return this.resultAnswerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.resultAnswerService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.resultAnswerService.remove(id);
  }
}
