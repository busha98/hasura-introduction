import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '@app/shared/entities/Role/Role';
import { User } from '@app/shared/entities/User/User';
import { Post } from '@app/shared/entities/Post/Post';
import { Comment } from '@app/shared/entities/Comment/Comment';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Post,
      Comment,
      Role,
    ]),
  ],
})
export class DBModule {}
