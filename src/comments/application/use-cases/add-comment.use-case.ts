import { Inject, Injectable } from '@nestjs/common';
import { CommentEntity } from '../../domain/entities/comment.entity';
import { ICommentRepository, COMMENT_REPOSITORY } from '../../domain/interfaces/comment.repository.interface';
import { IPostRepository, POST_REPOSITORY } from '../../../posts/domain/interfaces/post.repository.interface'; 

@Injectable()
export class AddCommentUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: ICommentRepository,
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(postId: string, authorId: string, content: string): Promise<CommentEntity> {
    const newId = crypto.randomUUID();
    const comment = new CommentEntity(newId, postId, authorId, content);
    await this.commentRepository.save(comment);

    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new Error('Publicación no encontrada');
    }

    const RELEVANCE_SCORE_PER_COMMENT = 5;
    post.increaseRelevanceScore(RELEVANCE_SCORE_PER_COMMENT); 

    await this.postRepository.save(post);

    return comment;
  }
}