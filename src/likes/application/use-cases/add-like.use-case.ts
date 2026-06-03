import { Inject, Injectable } from '@nestjs/common';
import { LikeEntity } from '../../domain/entities/like.entity';
import { ILikeRepository, LIKE_REPOSITORY } from '../../domain/interfaces/like.repository.interface';
import { IPostRepository, POST_REPOSITORY } from '../../../posts/domain/interfaces/post.repository.interface';

@Injectable()
export class AddLikeUseCase {
  constructor(
    @Inject(LIKE_REPOSITORY)
    private readonly likeRepository: ILikeRepository,
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(postId: string, userId: string): Promise<void> {
    const alreadyLiked = await this.likeRepository.hasUserLikedPost(postId, userId);
    if (alreadyLiked) {
      throw new Error('El usuario ya dio like a esta publicación');
    }

    const like = new LikeEntity(crypto.randomUUID(), postId, userId);
    await this.likeRepository.save(like);

    const post = await this.postRepository.findById(postId);
    
    const RELEVANCE_SCORE_PER_LIKE = 2;
    post.increaseRelevanceScore(RELEVANCE_SCORE_PER_LIKE);

    await this.postRepository.save(post);
  }
}