import { Module } from "@nestjs/common"
import { FeedRankingStrategyFactory } from "@/posts/feed-ranking.strategy"
import { ModerationModule } from "@/moderation/moderation.module"
import { PostsController } from "@/posts/posts.controller"
import { PostsService } from "@/posts/posts.service"

// 1. Importamos los Casos de Uso que creó Gerlac
import { CreatePostUseCase } from "./use-cases/create-post.use-case"
import { GetFeedPostsUseCase } from "./use-cases/get-feed-posts.use-case"

// 2. Importamos el módulo de Prisma para que PrismaService no tire error de inyección
import { PrismaModule } from "@/shared/prisma.module"

@Module({
    // Agregamos PrismaModule a los imports
    imports: [ModerationModule, PrismaModule],
    controllers: [PostsController],
    providers: [
        PostsService,
        FeedRankingStrategyFactory,
        // Agregamos los Casos de Uso a los providers para que NestJS los encuentre
        CreatePostUseCase,
        GetFeedPostsUseCase,
    ],
    exports: [PostsService],
})
export class PostsModule {}
