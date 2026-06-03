import { Inject, Injectable } from "@nestjs/common"
import { ICategoriesRepository } from "../domain/categories.repository.interface"
import { Category } from "../domain/category.entity"

@Injectable()
export class GetCategoriesUseCase {
    constructor(
        @Inject("ICategoriesRepository")
        private readonly categoriesRepository: ICategoriesRepository,
    ) {}

    async execute(): Promise<Category[]> {
        // Simplemente le pide al repositorio que traiga todas las categorías
        return this.categoriesRepository.findAll()
    }
}
