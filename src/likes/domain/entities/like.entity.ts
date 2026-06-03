export class LikeEntity {
  constructor(
    public readonly id: string,
    public readonly postId: string,
    public readonly userId: string,
    public readonly createdAt: Date = new Date(),
  ) {}
}