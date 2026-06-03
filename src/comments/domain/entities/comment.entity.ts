export class CommentEntity {
  constructor(
    public readonly id: string,
    public readonly postId: string,
    public readonly authorId: string,
    public readonly content: string,
    public readonly createdAt: Date = new Date(),
  ) {}
}

// src/comments/domain/interfaces/comment.repository.interface.ts
export const COMMENT_REPOSITORY = Symbol('COMMENT_REPOSITORY');

export interface ICommentRepository {
  save(comment: CommentEntity): Promise<void>;
  findByPostId(postId: string): Promise<CommentEntity[]>;
}