import { Injectable } from "@nestjs/common"
import { PrismaClient } from "@prisma/client"
import { ICategoriesRepository } from "../domain/categories.repository.interface"
import { Category } from "../domain/category.entity"
import { PrismaService } from '@/shared/prisma.service';

@Injectable()
export class PrismaCategoriesRepository implements ICategoriesRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(): Promise<Category[]> {
        const prismaCategories = await this.prisma.category.findMany({
            orderBy: { name: "asc" },
        })

        return prismaCategories.map((cat) => new Category(cat.id, cat.name))
    }
}
