import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '@app/shared/entities/User/User';
import { Comment } from '@app/shared/entities/Comment/Comment';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  text: string;

  @ManyToOne(
    () => User,
    user => user.posts,
  )
  creator: User;

  @OneToMany(
    () => Comment,
    comment => comment.post,
  )
  comments: Comment[];
}
