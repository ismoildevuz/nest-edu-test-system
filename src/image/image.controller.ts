import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Res,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async create(@UploadedFiles() images: Express.Multer.File[]) {
    return this.imageService.create(images);
  }

  @Get()
  async findAll() {
    return this.imageService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.imageService.findOne(id);
  }

  @Get('/file/:imageName')
  async getImage(@Param('imageName') imageName: string, @Res() res: Response) {
    return this.imageService.getImage(imageName, res);
  }
}
