export class LikeEntity {
  constructor(
    public readonly id: string,
    public readonly postId: string,
    public readonly userId: string,
    public readonly createdAt: Date = new Date(),
  ) {}
}

// src/likes/domain/interfaces/like.repository.interface.ts
export const LIKE_REPOSITORY = Symbol('LIKE_REPOSITORY');

export interface ILikeRepository {
  save(like: LikeEntity): Promise<void>;
  hasUserLikedPost(postId: string, userId: string): Promise<boolean>;
}