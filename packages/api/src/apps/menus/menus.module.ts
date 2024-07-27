import { MulterModule } from "@nestjs/platform-express";
import { MenusService } from "@/apps/menus/menus.service";
import { PrismaService } from "@/providers/prisma.service";
import { BadRequestException, Module } from "@nestjs/common";
import { MenusController } from "@/apps/menus/menus.controller";

@Module({
  controllers: [MenusController],
  providers: [MenusService, PrismaService],
  imports: [
    MulterModule.register({
      dest: "./uploads/menus",
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(
            new BadRequestException("Only image files are allowed!"),
            false
          );
        }

        cb(null, true);
      },
    }),
  ],
})
export class MenusModule {}
