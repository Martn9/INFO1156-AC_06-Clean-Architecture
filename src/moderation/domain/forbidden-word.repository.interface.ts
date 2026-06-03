export const FORBIDDEN_WORD_REPOSITORY_TOKEN = Symbol(
    "FORBIDDEN_WORD_REPOSITORY_TOKEN",
)

export interface IForbiddenWordRepository {
    findAllWords(): Promise<string[]>
}
