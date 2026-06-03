export class CommentEntity {
  constructor(
    public readonly id: string,
    public readonly postId: string,
    public readonly authorId: string,
    public readonly content: string,
    public readonly createdAt: Date = new Date(),
  ) {}
}