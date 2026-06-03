import { Module } from "@nestjs/common"
import { CategoriesController } from "@/categories/categories.controller"
import { CategoriesService } from "@/categories/categories.service"
import { GetCategoriesUseCase } from "@/categories/application/get-categories.use-case"
import { PrismaCategoriesRepository } from "@/categories/infrastructure/prisma-categories.repository"
import { PrismaModule } from '@/shared/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [CategoriesController],
    providers: [
        CategoriesService,
        GetCategoriesUseCase,
        {
            provide: "ICategoriesRepository",
            useClass: PrismaCategoriesRepository,
        },
    ],
})
export class CategoriesModule {}
