import { Module } from "@nestjs/common"
import { ModerationController } from "./moderation.controller"
import { ModerationService } from "./moderation.service" // <-- Recuperamos el servicio original
import { ModerateContentUseCase } from "./use-cases/moderate-content.use-case"
import { PrismaForbiddenWordRepository } from "./infrastructure/prisma-forbidden-word.repository"
import { FORBIDDEN_WORD_REPOSITORY_TOKEN } from "./domain/forbidden-word.repository.interface"
import { PrismaModule } from "@/shared/prisma.module"

@Module({
    imports: [PrismaModule],
    controllers: [ModerationController],
    providers: [
        ModerationService, // <-- Proveemos el antiguo para no romper a Gerlac
        ModerateContentUseCase, // <-- Proveemos tu código limpio
        {
            provide: FORBIDDEN_WORD_REPOSITORY_TOKEN,
            useClass: PrismaForbiddenWordRepository,
        },
    ],
    exports: [ModerationService, ModerateContentUseCase], // <-- Exportamos ambos
})
export class ModerationModule {}
