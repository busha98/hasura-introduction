import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '@app/shared/entities/User/User';
import { Post } from '@app/shared/entities/Post/Post';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  text: string;

  @ManyToOne(
    () => User,
    user => user.comments,
  )
  user: User;

  @ManyToOne(
    () => Post,
    post => post.comments,
  )
  post: Post;
}
