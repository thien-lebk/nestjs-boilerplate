import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusSeedService } from './status-seed.service';
import { Status } from 'src/statuses/entities/status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Status])],
  providers: [StatusSeedService],
  exports: [StatusSeedService],
})
export class StatusSeedModule {}
