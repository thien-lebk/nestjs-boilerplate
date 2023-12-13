import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { SessionRelationalService } from './session-relational.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionSchema, SessionSchemaClass } from './entities/session.schema';
import { SessionDocumentService } from './session-document.service';
import { SessionAbstractService } from './session-abstract.service';
import databaseConfig from 'src/database/config/database.config';
import { DatabaseConfig } from 'src/database/config/database-config.type';

@Module({
  imports: [
    (databaseConfig() as DatabaseConfig).isDocumentDatabase
      ? MongooseModule.forFeature([
          { name: SessionSchemaClass.name, schema: SessionSchema },
        ])
      : TypeOrmModule.forFeature([Session]),
  ],
  providers: [
    {
      provide: SessionAbstractService,
      useClass: (databaseConfig() as DatabaseConfig).isDocumentDatabase
        ? SessionDocumentService
        : SessionRelationalService,
    },
  ],
  exports: [SessionAbstractService],
})
export class SessionModule {}
