import { Module } from "@nestjs/common"
import { FeedRankingStrategyFactory } from "@/posts/feed-ranking.strategy"
import { ModerationModule } from "@/moderation/moderation.module"
import { PostsController } from "@/posts/posts.controller"
import { PostsService } from "@/posts/posts.service"
import { CreatePostUseCase } from "@/posts/use-cases/create-post.use-case"
import { GetFeedPostsUseCase } from "@/posts/use-cases/get-feed-posts.use-case"

@Module({
    imports: [ModerationModule],
    controllers: [PostsController],
    providers: [
        PostsService,
        FeedRankingStrategyFactory,
        CreatePostUseCase,
        GetFeedPostsUseCase,
    ],
    exports: [PostsService],
})
export class PostsModule {}