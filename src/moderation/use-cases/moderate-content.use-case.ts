import { Injectable, Inject } from "@nestjs/common"
import {
    IForbiddenWordRepository,
    FORBIDDEN_WORD_REPOSITORY_TOKEN,
} from "../domain/forbidden-word.repository.interface"
import { ModerationRule } from "../domain/moderation-rule"

@Injectable()
export class ModerateContentUseCase {
    constructor(
        @Inject(FORBIDDEN_WORD_REPOSITORY_TOKEN)
        private readonly forbiddenWordRepo: IForbiddenWordRepository,
    ) {}

    async execute(
        text: string,
    ): Promise<{ approved: boolean; reason?: string }> {
        const forbiddenWords = await this.forbiddenWordRepo.findAllWords()
        const hasBadWords = ModerationRule.containsForbiddenWord(
            text,
            forbiddenWords,
        )

        if (hasBadWords) {
            return {
                approved: false,
                reason: "El contenido ha sido bloqueado por uso de palabras prohibidas.",
            }
        }
        return { approved: true }
    }
}
