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
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post()
  async create(
    @Body() createAnswerDto: CreateAnswerDto,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.answerService.create(createAnswerDto, authHeader);
  }

  @Get()
  async findAll(@Headers('Authorization') authHeader: string) {
    return this.answerService.findAll(authHeader);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.answerService.findOne(id, authHeader);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAnswerDto: UpdateAnswerDto,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.answerService.update(id, updateAnswerDto, authHeader);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.answerService.remove(id, authHeader);
  }
}
