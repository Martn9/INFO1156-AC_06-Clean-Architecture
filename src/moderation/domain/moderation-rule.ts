// src/moderation/domain/moderation-rule.ts

export class ModerationRule {
    /**
     * Transforma una palabra en una expresión regular fuzzy
     * Ej: "spam" -> /s.*?p.*?a.*?m/i
     */
    static buildFuzzyRegex(word: string): RegExp {
        const fuzzyPattern = word.split("").join(".*?")
        return new RegExp(fuzzyPattern, "i")
    }

    /**
     * Evalúa si un texto contiene alguna de las palabras prohibidas
     */
    static containsForbiddenWord(
        text: string,
        forbiddenWords: string[],
    ): boolean {
        return forbiddenWords.some((word) => {
            const regex = this.buildFuzzyRegex(word)
            return regex.test(text)
        })
    }
}
