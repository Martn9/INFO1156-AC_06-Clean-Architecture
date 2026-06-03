import { Category } from "./category.entity"

export interface ICategoriesRepository {
    findAll(): Promise<Category[]>
}
