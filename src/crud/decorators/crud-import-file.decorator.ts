import { MultipartFile } from '@fastify/multipart';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CrudImportFile: (...dataOrPipes: unknown[]) => ParameterDecorator = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext): Promise<{ buffer: Buffer; filename: string; mimetype: string }> => {
    const request: any = ctx.switchToHttp().getRequest();
    const rawFile: MultipartFile = await request.file();
    if (!rawFile) {
      return null;
    }
    const buffer: Buffer = await rawFile.toBuffer();
    return { buffer, filename: rawFile.filename, mimetype: rawFile.mimetype };
  },
);
