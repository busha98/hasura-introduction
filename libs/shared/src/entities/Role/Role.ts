import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { User } from '@app/shared/entities/User/User';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  value: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToMany(() => User, user => user.roles)
  users: User[];
}
