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
import { TestService } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post()
  async create(
    @Body() createTestDto: CreateTestDto,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.testService.create(createTestDto, authHeader);
  }

  @Get()
  async findAll(@Headers('Authorization') authHeader: string) {
    return this.testService.findAll(authHeader);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.testService.findOne(id, authHeader);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTestDto: UpdateTestDto,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.testService.update(id, updateTestDto, authHeader);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.testService.remove(id, authHeader);
  }
}
