import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ICommentRepository } from '../domain/interfaces/comment.repository.interface';
import { CommentEntity } from '../domain/entities/comment.entity';

@Injectable()
export class PrismaCommentRepository implements ICommentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(comment: CommentEntity): Promise<void> {
    await this.prisma.comment.create({
      data: {
        id: comment.id,
        postId: comment.postId,
        authorId: comment.authorId,
        content: comment.content,
        createdAt: comment.createdAt,
      },
    });
  }

}