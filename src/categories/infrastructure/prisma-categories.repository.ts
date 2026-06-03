import { Injectable } from "@nestjs/common"
import { PrismaClient } from "@prisma/client"
import { ICategoriesRepository } from "../domain/categories.repository.interface"
import { Category } from "../domain/category.entity"

@Injectable()
export class PrismaCategoriesRepository implements ICategoriesRepository {
   
    private readonly prismaClient = new PrismaClient()

    async findAll(): Promise<Category[]> {

        const prismaCategories = await this.prismaClient.category.findMany({
            orderBy: { name: "asc" },
        })
        
        return prismaCategories.map(
            (cat) => new Category(cat.id, cat.name)
        )
    }
}