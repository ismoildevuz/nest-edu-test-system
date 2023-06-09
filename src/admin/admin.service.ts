import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from './models/admin.model';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthAdminDto } from './dto/auth-admin.dto';
import { ImageService } from './../image/image.service';
import { Role } from '../role/models/role.model';
import { Image } from '../image/models/image.model';
import { RoleService } from './../role/role.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin) private adminRepository: typeof Admin,
    private readonly imageService: ImageService,
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
  ) {}

  // async register(createAdminDto: CreateAdminDto) {
  //   const adminByEmail = await this.getAdminByEmail(createAdminDto.email);
  //   if (adminByEmail) {
  //     throw new BadRequestException('Email already registered!');
  //   }
  //   const hashed_password = await bcrypt.hash(createAdminDto.password, 7);
  //   const newAdmin = await this.adminRepository.create({
  //     id: uuid(),
  //     ...createAdminDto,
  //     hashed_password,
  //   });
  //   const tokens = await this.getTokens(newAdmin);
  //   const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
  //   const updatedAdmin = await this.adminRepository.update(
  //     {
  //       hashed_refresh_token,
  //     },
  //     {
  //       where: { id: newAdmin.id },
  //     },
  //   );
  //   const adminData = await this.adminRepository.findOne({
  //     where: { id: newAdmin.id },
  //     attributes: ['id', 'email'],
  //   });
  //   const response = {
  //     status: 200,
  //     data: {
  //       token: tokens.access_token,
  //       admin: adminData,
  //     },
  //     success: true,
  //   };
  //   return response;
  // }

  async login(authAdminDto: AuthAdminDto) {
    const { login, password } = authAdminDto;
    const admin = await this.getAdminByLogin(login);
    if (!admin) {
      throw new UnauthorizedException('Login or password is wrong');
    }
    const isMatchPass = await bcrypt.compare(password, admin.hashed_password);
    if (!isMatchPass) {
      throw new UnauthorizedException('Login or password is wrong');
    }
    const tokens = await this.getTokens(admin);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    await this.adminRepository.update(
      {
        hashed_refresh_token,
      },
      {
        where: { id: admin.id },
      },
    );
    const adminData = await this.adminRepository.findOne({
      where: { id: admin.id },
      attributes: [
        'id',
        'full_name',
        'email',
        'phone',
        'telegram',
        'role_id',
        'image_id',
      ],
      include: [Role, Image],
    });
    const response = {
      token: tokens.access_token,
      admin: adminData,
    };
    return response;
  }

  async create(createAdminDto: CreateAdminDto, images: Express.Multer.File[]) {
    await this.roleService.findOne(createAdminDto.role_id);
    const uploadedImages = await this.imageService.create(images);
    const adminByLogin = await this.getAdminByLogin(createAdminDto.login);
    if (adminByLogin) {
      throw new BadRequestException('Login already registered!');
    }
    const hashed_password = await bcrypt.hash(createAdminDto.password, 7);
    const newAdmin = await this.adminRepository.create({
      id: uuid(),
      ...createAdminDto,
      hashed_password,
      image_id: uploadedImages[0]?.id,
    });
    return this.findOne(newAdmin.id);
  }

  async findAll() {
    return this.adminRepository.findAll({
      attributes: [
        'id',
        'full_name',
        'email',
        'phone',
        'telegram',
        'role_id',
        'image_id',
      ],
      include: [Role, Image],
    });
  }

  async findOne(id: string) {
    const admin = await this.adminRepository.findOne({
      where: { id },
      attributes: [
        'id',
        'full_name',
        'email',
        'phone',
        'telegram',
        'role_id',
        'image_id',
      ],
      include: [Role, Image],
    });
    if (!admin) {
      throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
    }
    return admin;
  }

  async update(
    id: string,
    updateAdminDto: UpdateAdminDto,
    images: Express.Multer.File[],
  ) {
    const admin = await this.findOne(id);
    if (updateAdminDto.login) {
      const adminByLogin = await this.getAdminByLogin(updateAdminDto.login);
      if (adminByLogin && adminByLogin.id != id) {
        throw new BadRequestException('Login already registered!');
      }
    }
    if (updateAdminDto.password) {
      const hashed_password = await bcrypt.hash(updateAdminDto.password, 7);
      await this.adminRepository.update({ hashed_password }, { where: { id } });
    }
    if (updateAdminDto.role_id) {
      await this.roleService.findOne(updateAdminDto.role_id);
    }
    if (images.length) {
      if (admin.image_id) {
        await this.adminRepository.update(
          { image_id: null },
          { where: { id } },
        );
        await this.imageService.remove(admin.image_id);
      }
      const uploadedImages = await this.imageService.create(images);
      await this.adminRepository.update(
        { image_id: uploadedImages[0]?.id },
        { where: { id } },
      );
    }
    await this.adminRepository.update(updateAdminDto, { where: { id } });
    return this.findOne(id);
  }

  async remove(id: string) {
    const admin = await this.findOne(id);
    await this.adminRepository.destroy({ where: { id } });
    if (admin.image_id) {
      await this.imageService.remove(admin.image_id);
    }
    return admin;
  }

  async getTokens(admin: Admin) {
    const jwtPayload = {
      id: admin.id,
      login: admin.login,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async verifyAccessToken(authHeader: string) {
    try {
      const access_token = authHeader.split(' ')[1];
      const admin = await this.jwtService.verify(access_token, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });
      return admin;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async getAdminByLogin(login: string) {
    const admin = await this.adminRepository.findOne({
      where: { login },
    });
    return admin;
  }
}
