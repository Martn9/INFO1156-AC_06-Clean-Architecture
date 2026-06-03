# Feed de Publicaciones

Este proyecto implementa un feed social sencillo, sin usuarios ni autenticación, centrado en la interacción entre publicaciones, likes y comentarios. La aplicación está pensada para simular una plataforma de contenido visual con lógica de negocio realista pero acotada.

## Requerimientos

- Docker

## Resumen funcional

El sistema permite crear publicaciones con imagen, texto y descripción, agruparlas en **categorías** (Tecnología, Arte, Ciencia, etc.) y mostrarlas en un feed central que se puede **filtrar por categoría**. Cada publicación puede recibir likes y comentarios, y esas interacciones modifican cómo se percibe su importancia dentro del feed.

El comportamiento general del producto gira alrededor de tres ideas:

- **contenido**: las publicaciones son la unidad principal del sistema,
- **interacción**: likes y comentarios enriquecen cada publicación,
- **priorización**: el feed puede cambiar de orden según distintos criterios de relevancia.

El feed admite **múltiples modos de ordenamiento** —más recientes, más populares, más comentados y relevancia— implementados mediante el patrón **Strategy**, lo que permite cambiar el criterio de priorización sin modificar la lógica central.

## Lógica de negocio principal

La lógica del sistema no solo guarda datos, también construye una vista enriquecida del feed. Para cada publicación se calcula información derivada, como la cantidad de interacciones y una puntuación de relevancia que combina actividad reciente con volumen de participación.

Además, antes de persistir publicaciones y comentarios se aplica una validación/moderación para filtrar contenido problemático. La moderación utiliza **expresiones regulares fuzzy** que detectan palabras prohibidas incluso con caracteres intermedios (por ejemplo, "s p a m"). Las palabras prohibidas se gestionan desde un **panel de administración** en `/admin.html`.

El sistema también ejecuta efectos operativos cuando se crean interacciones (por ejemplo trazas y procesos internos de recálculo), reflejando un flujo típico de aplicaciones de contenido.

## Contexto técnico

La solución está construida con NestJS en backend, Prisma ORM y SQLite como almacenamiento local.

La base de datos es fija en `sqlite.db`

## Ejecución:

Para levantar todo el sistema con Docker:

1. `make setup`
2. `make run`

Este comando construye la imagen, instala dependencias dentro del contenedor, aplica migraciones Prisma, genera el cliente y arranca NestJS en modo watch.

En este flujo, los artefactos de compilación y cache de paquetes se mantienen dentro de volúmenes Docker para no ensuciar el directorio del proyecto.

La aplicación queda disponible en:

- `http://localhost:3000`
- `http://localhost:3000/docs`
- `http://localhost:5555` (Prisma Studio - Database Manager)

Comandos útiles:

- `make stop` para detener el contenedor
- `make logs` para ver logs en tiempo real

---

# Refactorización a Clean Architecture - INFO1156

## 1. Diagnóstico y Falencias Identificadas
Durante el análisis inicial del código fuente del servidor (basado en NestJS y Prisma), nuestro equipo identificó las siguientes falencias arquitectónicas que violaban los principios SOLID y dificultaban el mantenimiento:

* **Alto Acoplamiento con la Infraestructura (Violación de DIP):** Los servicios principales de negocio (ej. `PostsService`, `ModerationService`) dependían e importaban directamente `PrismaService`. Esto ataba las reglas de negocio al ORM, haciendo imposible cambiar de base de datos sin reescribir la lógica central.
* **Falta de Capa de Dominio (Violación de SRP):** No existían entidades puras de negocio. Se estaban utilizando los modelos autogenerados por Prisma y los DTOs de los controladores como si fueran objetos de dominio. Reglas matemáticas críticas, como la generación de expresiones regulares *fuzzy* para moderación, estaban mezcladas con consultas SQL.
* **Servicios "Dios" y Efectos Secundarios Ocultos:** Las interacciones (Likes y Comentarios) modificaban la relevancia del Feed mediante recálculos implícitos y acoplados, en lugar de estar orquestados por Casos de Uso claramente definidos.

## 2. Solución Aplicada (Puntos de Refactorización)
Para solucionar esto, aplicamos los principios de **Clean Architecture**, dividiendo el código en capas concéntricas con la regla estricta de que las dependencias solo pueden apuntar hacia adentro:

1. **Capa de Dominio (Domain):** Creamos clases TypeScript puras (ej. `Post`, `ModerationRule`) y contratos/interfaces (ej. `IPostRepository`, `IForbiddenWordRepository`). Aquí reside la lógica de negocio sin saber que NestJS o Prisma existen.
2. **Capa de Aplicación (Use Cases):** Separamos los servicios masivos en Casos de Uso independientes que cumplen con el Principio de Responsabilidad Única (`CreatePostUseCase`, `ModerateContentUseCase`, `AddLikeUseCase`). Estos actúan como orquestadores e inyectan las interfaces del dominio, no implementaciones concretas.
3. **Capa de Infraestructura (Adapters):** Implementamos los repositorios concretos (`PrismaPostRepository`, `PrismaForbiddenWordRepository`) que satisfacen las interfaces del dominio utilizando Prisma. 

## 3. Diagrama de Arquitectura Resultante

A continuación se presenta un diagrama de clases resumido que demuestra la Inversión de Dependencias lograda en el módulo de moderación y publicaciones:

```mermaid
classDiagram
    %% Capa de Infraestructura (Externa)
    class PrismaForbiddenWordRepository {
        - prisma: PrismaService
        + findAllWords(): Promise~string[]~
    }
    class PrismaPostRepository {
        - prisma: PrismaService
        + create(data): Promise~Post~
    }

    %% Capa de Dominio (Interna - Pura)
    namespace Domain {
        class IForbiddenWordRepository {
            <<Interface>>
            + findAllWords()* Promise~string[]~
        }
        class IPostRepository {
            <<Interface>>
            + create(data)* Promise~Post~
        }
        class ModerationRule {
            + buildFuzzyRegex(word: string)$ RegExp
            + containsForbiddenWord(text: string, words: string[])$ boolean
        }
        class Post {
            + id: string
            + title: string
            + categoryId: string
        }
    }

    %% Capa de Aplicación (Casos de Uso)
    class ModerateContentUseCase {
        - forbiddenWordRepo: IForbiddenWordRepository
        + execute(text: string): Promise~boolean~
    }
    class CreatePostUseCase {
        - postRepository: IPostRepository
        - moderationUseCase: ModerateContentUseCase
        + execute(data: CreatePostDto)
    }

    %% Relaciones (Clean Architecture)
    PrismaForbiddenWordRepository ..|> IForbiddenWordRepository : Implements
    PrismaPostRepository ..|> IPostRepository : Implements
    
    ModerateContentUseCase --> IForbiddenWordRepository : Uses (Injection)
    ModerateContentUseCase ..> ModerationRule : Uses
    
    CreatePostUseCase --> IPostRepository : Uses (Injection)
    CreatePostUseCase --> ModerateContentUseCase : Orquestrates