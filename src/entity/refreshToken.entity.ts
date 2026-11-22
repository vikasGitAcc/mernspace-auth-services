import {
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    UpdateDateColumn,
    CreateDateColumn,
    Entity,
} from "typeorm";
import { User } from "./user.entity";

@Entity("refresh_tokens")
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "timestamp" })
    expiresAt: Date;

    @ManyToOne(() => User)
    user: User;

    @UpdateDateColumn()
    updatedAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}
