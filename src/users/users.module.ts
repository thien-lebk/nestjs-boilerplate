import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, UserSchemaClass } from './entities/user.schema';
import { UsersRelationalService } from './users-relational.service';
import { UsersDocumentService } from './users-document.service';
import { UsersServiceAbstract } from './users-abstract.service';
import { FilesModule } from 'src/files/files.module';
import databaseConfig from 'src/database/config/database.config';
import { DatabaseConfig } from 'src/database/config/database-config.type';

@Module({
  imports: [
    (databaseConfig() as DatabaseConfig).isDocumentDatabase
      ? MongooseModule.forFeature([
          { name: UserSchemaClass.name, schema: UserSchema },
        ])
      : TypeOrmModule.forFeature([User]),
    FilesModule,
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: UsersServiceAbstract,
      useClass: (databaseConfig() as DatabaseConfig).isDocumentDatabase
        ? UsersDocumentService
        : UsersRelationalService,
    },
  ],
  exports: [UsersServiceAbstract],
})
export class UsersModule {}
