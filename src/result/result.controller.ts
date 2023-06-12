import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { ResultService } from './result.service';
import { CreateResultDto } from './dto/create-result.dto';

@Controller('result')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Post()
  async create(@Body() createResultDto: CreateResultDto) {
    return this.resultService.create(createResultDto);
  }

  @Get()
  async findAll() {
    return this.resultService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.resultService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.resultService.remove(id);
  }
}
