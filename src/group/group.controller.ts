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
    @Headers('Authorization') authHeader: string,
  ) {
    return this.groupService.create(createGroupDto, images, authHeader);
  }

  @Get()
  async findAll(@Headers('Authorization') authHeader: string) {
    return this.groupService.findAll(authHeader);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.groupService.findOne(id, authHeader);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images'))
  async update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Headers('Authorization') authHeader: string,
  ) {
    return this.groupService.update(id, updateGroupDto, images, authHeader);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.groupService.remove(id, authHeader);
  }
}
