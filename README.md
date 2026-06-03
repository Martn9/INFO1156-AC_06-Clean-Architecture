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


## Aplicación de Clean Architecture: Casos de Uso para Publicaciones

**Implementado por:** Gerlac

### Archivos modificados

* `src/posts/posts.service.ts`
* `src/posts/posts.module.ts`

### Archivos creados

* `src/posts/use-cases/create-post.use-case.ts`
* `src/posts/use-cases/get-feed-posts.use-case.ts`

### Problema

El servicio `PostsService` contenía lógica de negocio relacionada tanto con la creación de publicaciones como con la construcción del feed. Esto generaba una concentración de responsabilidades en una sola clase, dificultando el mantenimiento y la evolución de la aplicación.

### Solución

Se implementaron dos casos de uso independientes:

* `CreatePostUseCase`: encargado de la moderación y creación de publicaciones.
* `GetFeedPostsUseCase`: encargado de obtener y construir la información enriquecida del feed.

`PostsService` pasó a actuar como intermediario, delegando la ejecución de estas operaciones a sus respectivos casos de uso.

### Beneficios

* Mejor separación de responsabilidades.
* Mayor alineación con los principios de Clean Architecture.
* Lógica de negocio encapsulada en componentes específicos.
* Código más fácil de mantener y extender.

## Aplicación de Clean Architecture: Migración Completa de Categorías
Implementado por: Cristoper parra

Archivos modificados
src/categories/categories.service.ts

src/categories/categories.module.ts

Archivos creados
src/categories/domain/category.entity.ts

src/categories/domain/categories.repository.interface.ts

src/categories/application/get-categories.use-case.ts

src/categories/infrastructure/prisma-categories.repository.ts

## Problema
El módulo de categorías presentaba un alto acoplamiento con la infraestructura, el servicio CategoriesService consumia directamente el cliente de Prisma para interactuar con la base de datos y manejar reglas de ordenamiento, esto violaba las capas de Clean Architecture, ya que la lógica de aplicación dependía explícitamente de un ORM externo dificultando la modularidad y el testeo aislado.

## Solución
Se realizó una migración estructurada dividiendo el módulo en capas independientes:

Dominio: Se definió una entidad pura (Category) y un contrato/puerto (ICategoriesRepository) para aislar el concepto de negocio de cualquier tecnología de persistencia.

Aplicación: Se creó el caso de uso GetCategoriesUseCase encargado de orquestar la lógica de obtención de categorías dependiendo únicamente de la interfaz del dominio.

Infraestructura: Se implementó el adaptador concreto PrismaCategoriesRepository encargado de resolver la comunicación física con Prisma y mantener el orden alfabetico original.

El CategoriesService fue refactorizado para actuar unicamente como un intermediario que delega la ejecución al caso de uso correspondiente.

## Beneficios
Desacoplamiento total de la base de datos en las capas de negocio (Principio de Inversión de Dependencias).

Estructura modular, escalable y alineada al 100% con las directrices del Core de la aplicación.

Mayor facilidad para realizar pruebas unitarias (Mocking) al depender de un contrato (interface).

Cumplimiento del Principio de Responsabilidad unica (SRP) en el servicio y controladores.
