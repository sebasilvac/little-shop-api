import {
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';

@Controller('files')
@Auth()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('products')
  @Auth(ValidRoles.admin)
  @UseInterceptors(FileInterceptor('file'))
  async uploadProductFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'text/csv' })],
      }),
    )
    file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    await this.filesService.loadProductFile(file.buffer.toString(), user);

    return {
      originalName: file.originalname,
      userName: user.fullName,
      userId: user.id,
    };
  }
}
