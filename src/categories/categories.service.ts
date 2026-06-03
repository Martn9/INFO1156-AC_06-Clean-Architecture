import { Injectable } from "@nestjs/common"
import { GetCategoriesUseCase } from "./application/get-categories.use-case"

@Injectable()
export class CategoriesService {
    constructor(private readonly getCategoriesUseCase: GetCategoriesUseCase) {}

    async findAll() {
        return this.getCategoriesUseCase.execute()
    }
}
