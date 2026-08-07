# Arquitectura OpenClaw Hybrid Agent

## Descripción general

Este proyecto implementa una arquitectura híbrida de agente inteligente combinando un modelo de razonamiento, generación de embeddings locales y memoria persistente.

La arquitectura está compuesta por tres componentes principales:

- GPT-5.5 como orquestador cognitivo.
- Ollama + nomic-embed-text como sistema local de generación de embeddings.
- SQLite + sqlite-vec como memoria persistente y recuperación semántica.


## Arquitectura
            Usuario
               |
               v
          GPT-5.5
   Orquestación y razonamiento
               |
    -----------------------
    |                     |
    v                     v

 Ollama                SQLite




nomic-embed-text sqlite-vec

Generación de Memoria persistente
embeddings Recuperación semántica

               |
               v

           TaskFlow

      Gestión de tareas
      y subtareas

      pending
         |
      running
         |
      completed


## Flujo de ejecución

1. Se crea una tarea principal.
2. Se generan subtareas asociadas.
3. TaskFlow administra el ciclo de vida.
4. Cada subtarea pasa por estados:
   - pending
   - running
   - completed
5. La memoria semántica permite recuperar contexto almacenado.


## Validación realizada

La implementación fue validada mediante:
 npm test

Resultados:

- Database test: OK
- Semantic memory retrieval: OK
- TaskFlow execution: OK
- Integration validation: OK


## Conclusión

La arquitectura demuestra cómo combinar un modelo de razonamiento avanzado con componentes locales para generar un agente híbrido con capacidad de planificación, memoria persistente y ejecución controlada.

