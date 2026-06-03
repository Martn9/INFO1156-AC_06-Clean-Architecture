export const COMMENT_REPOSITORY = Symbol('COMMENT_REPOSITORY');

export interface ICommentRepository {
  save(comment: CommentEntity): Promise<void>;
  findByPostId(postId: string): Promise<CommentEntity[]>;
}