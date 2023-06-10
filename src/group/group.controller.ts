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
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Body() createGroupDto: CreateGroupDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.groupService.create(createGroupDto, images);
  }

  @Get()
  async findAll() {
    return this.groupService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.groupService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images'))
  async update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.groupService.update(id, updateGroupDto, images);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.groupService.remove(id);
  }
}
