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
import { AuthDto } from './dto/auth.dto';
import { ImageService } from './../image/image.service';
import { Role } from '../role/models/role.model';
import { Image } from '../image/models/image.model';
import { RoleService } from './../role/role.service';
import { UpdateRoleDto } from './dto/update-role.dto';

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

  async login(authDto: AuthDto) {
    const { login, password } = authDto;
    const adminByLogin = await this.getAdminByLogin(login);
    if (!adminByLogin) {
      throw new UnauthorizedException('Login or password is wrong');
    }
    console.log(authDto, adminByLogin.hashed_password);

    const isMatchPass = await bcrypt.compare(
      password,
      adminByLogin.hashed_password,
    );
    if (!isMatchPass) {
      throw new UnauthorizedException('Login or password is wrong');
    }
    const tokens = await this.getTokens(adminByLogin);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    await this.adminRepository.update(
      {
        hashed_refresh_token,
      },
      {
        where: { id: adminByLogin.id },
      },
    );
    const admin = await this.getOne(adminByLogin.id);
    const response = {
      token: tokens.access_token,
      admin,
    };
    return response;
  }

  async create(
    createAdminDto: CreateAdminDto,
    images: Express.Multer.File[],
    authHeader: string,
  ) {
    await this.isSuperAdmin(authHeader);
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
    return this.getOne(newAdmin.id);
  }

  async findAll(authHeader: string) {
    await this.isSuperAdmin(authHeader);
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

  async findOne(id: string, authHeader: string) {
    await this.isUserSelf(id, authHeader);
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
    authHeader: string,
  ) {
    await this.isUserSelf(id, authHeader);
    const admin = await this.getOne(id);
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
    return this.getOne(id);
  }

  async updateRole(
    id: string,
    updateRoleDto: UpdateRoleDto,
    authHeader: string,
  ) {
    await this.isSuperAdmin(authHeader);
    await this.getOne(id);
    await this.roleService.findOne(updateRoleDto.role_id);
    await this.adminRepository.update(updateRoleDto, { where: { id } });
    return this.getOne(id);
  }

  async remove(id: string, authHeader: string) {
    await this.isSuperAdmin(authHeader);
    const admin = await this.getOne(id);
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
      role: admin.role.name,
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

  async getOne(id: string) {
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

  async getAdminByLogin(login: string) {
    const admin = await this.adminRepository.findOne({
      where: { login },
      attributes: [
        'id',
        'full_name',
        'email',
        'phone',
        'telegram',
        'login',
        'hashed_password',
        'role_id',
        'image_id',
      ],
      include: [Role, Image],
    });
    return admin;
  }

  async isSuperAdmin(authHeader: string) {
    const admin = await this.verifyAccessToken(authHeader);
    if (admin.role !== 'super-admin') {
      throw new UnauthorizedException('Restricted action');
    }
  }

  async isUserSelf(id: string, authHeader: string) {
    const admin = await this.verifyAccessToken(authHeader);
    if (admin.role !== 'super-admin' && admin.id !== id) {
      throw new UnauthorizedException('Restricted action');
    }
  }
}
