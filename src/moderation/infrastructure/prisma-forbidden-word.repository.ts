// src/moderation/infrastructure/prisma-forbidden-word.repository.ts
import { Injectable } from "@nestjs/common"
import { PrismaService } from "@/shared/prisma.service"
import { IForbiddenWordRepository } from "../domain/forbidden-word.repository.interface"

@Injectable()
export class PrismaForbiddenWordRepository implements IForbiddenWordRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findAllWords(): Promise<string[]> {
        // Busca en tu schema.prisma el nombre exacto de esta tabla.
        // Usualmente es 'prohibitedWord' o 'forbiddenWord' en el proyecto base.
        const words = await this.prisma.prohibitedWord.findMany()
        return words.map((w) => w.word) // Ajusta 'w.word' si la columna se llama distinto
    }
}
