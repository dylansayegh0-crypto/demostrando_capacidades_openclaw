# Checkpoint OpenClaw - Agente con subtareas y memoria contextual persistente

## Objetivo

Este proyecto demuestra las capacidades de OpenClaw v2026.x para ejecutar flujos de trabajo multietapa utilizando TaskFlow, memoria contextual persistente y recuperación semántica.

La validación implementa el siguiente flujo:

**Tarea → Subtareas → Memoria Contextual → Recuperación Semántica → Resultado Final**

---

# Entorno utilizado

- OpenClaw 2026.6.11-beta.2
- Node.js 24.18.0
- Windows
- Agente: `main`
- Gateway local: `127.0.0.1`

---

# Arquitectura

La solución combina tres componentes principales.

## GPT-5.5

Responsable del razonamiento y la planificación.

Funciones:

- Interpretación de objetivos.
- División en subtareas.
- Coordinación del flujo.
- Generación de la respuesta final.

## Ollama + nomic-embed-text

Responsable de la representación semántica.

Funciones:

- Generación de embeddings.
- Representación del conocimiento.
- Recuperación por similitud.

## SQLite + sqlite-vec

Responsable de la persistencia.

Funciones:

- Almacenamiento local.
- Persistencia entre ejecuciones.
- Recuperación de contexto.

---

# Implementación propia

Además del uso del agente de OpenClaw, este proyecto implementa mediante código Node.js los componentes solicitados en el checkpoint.

## TaskFlow

Archivo:

```
src/taskflow.js
```

Implementa la creación de tareas y subtareas utilizando SQLite como almacenamiento.

Cada tarea genera un identificador único y registra automáticamente sus subtareas junto con su estado.

---

## Persistencia SQLite

Archivo:

```
src/database.js
```

Utiliza la librería **better-sqlite3** para crear automáticamente la base de datos:

```
storage/taskflow.db
```

La base contiene:

- Tabla `tasks`
- Tabla `subtasks`

Toda la información del flujo queda almacenada localmente.

---

## ContextEngine (Ingress / Retrieval)

Archivo:

```
src/memory.js
```

Implementa programáticamente las operaciones solicitadas por el checkpoint.

### Ingress

Permite almacenar información contextual.

### Retrieval

Permite recuperar información mediante búsqueda simple sobre el almacén local.

La memoria queda almacenada en:

```
storage/vectors.json
```

---

# Flujo validado

La prueba ejecutada solicita:

> Crear un flujo con tres subtareas utilizando memoria contextual y recuperación semántica.

Las subtareas generadas fueron:

1. Analizar GPT-5.5.
2. Analizar Ollama + nomic-embed-text.
3. Analizar SQLite + sqlite-vec.

---

# Evidencia de ejecución

La salida del agente quedó registrada en:

```
logs/taskflow-result.txt
```

La ejecución demuestra:

- Creación de subtareas.
- Estado de ejecución.
- Memoria contextual.
- Recuperación semántica.

También se generó memoria persistente en:

```
memory/2026-08-06.md
```

---

# Pruebas automatizadas

El proyecto incorpora pruebas ejecutables mediante:

```bash
npm test
```

Las pruebas verifican automáticamente:

- Creación del TaskFlow.
- Persistencia SQLite.
- Operaciones de memoria.
- Recuperación de información.
- Ejecución del agente OpenClaw.

Los archivos utilizados son:

```
test-db.js
test-memory.js
test-flow.js
```

---

# Variables de entorno

El proyecto incluye un archivo:

```
.env.example
```

con las variables necesarias para configurar:

- OpenAI
- Ollama
- SQLite
- OpenClaw

---

# Estructura del proyecto

```
src/
    database.js
    memory.js
    taskflow.js

storage/
    taskflow.db
    memory-seed.md

memory/
    2026-08-06.md

logs/
    taskflow-result.txt

test-db.js
test-memory.js
test-flow.js
package.json
README.md
```

---

# Seguridad

El Gateway permanece configurado únicamente sobre localhost.

```
127.0.0.1
```

No existe exposición pública del servicio.

---

# Conclusión

Este proyecto demuestra tanto el uso de OpenClaw como una implementación propia en Node.js para los componentes solicitados por el checkpoint.

Se implementó:

- TaskFlow programático.
- Persistencia mediante SQLite.
- Gestión de memoria contextual.
- Operaciones de Ingress y Retrieval.
- Pruebas automatizadas mediante `npm test`.

La arquitectura combina GPT-5.5 para el razonamiento, Ollama para la representación semántica y SQLite para la persistencia del contexto, mostrando un flujo completo y reproducible.