import { Injectable } from "@nestjs/common"
import { CreatePostDto } from "@/posts/posts.dtos"
import { PrismaService } from "@/shared/prisma.service"
import { CreatePostUseCase } from "@/posts/use-cases/create-post.use-case"
import { GetFeedPostsUseCase } from "@/posts/use-cases/get-feed-posts.use-case"

@Injectable()
export class PostsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly createPostUseCase: CreatePostUseCase,
        private readonly getFeedPostsUseCase: GetFeedPostsUseCase,  
    ) {}

    async create(data: CreatePostDto) {
        return this.createPostUseCase.execute(data)
    }

    findAll() {
        return this.prisma.post.findMany({
            orderBy: { createdAt: "desc" },
        })
    }

    findById(id: string) {
        return this.prisma.post.findUnique({
            where: { id },
        })
    }

    async getFeedPosts(categoryId?: string) {
        return this.getFeedPostsUseCase.execute(categoryId)
    }
}
