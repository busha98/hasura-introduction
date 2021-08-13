import {
  Entity,
  Column,
  CreateDateColumn,
  Index,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Role } from '@app/shared/entities/Role/Role';
import { Post } from '@app/shared/entities/Post/Post';
import { Comment } from '@app/shared/entities/Comment/Comment';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ default: false })
  removed: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'text', select: false })
  password: string;

  @Column({ type: 'text', select: false })
  salt: string;

  @ManyToMany(
    () => Role,
    role => role.users,
  )
  @JoinTable()
  roles: Role[];

  @OneToMany(
    () => Post,
    post => post.creator,
  )
  posts: Post[];

  @OneToMany(
    () => Comment,
    comment => comment.user,
  )
  comments: Comment[];
}
