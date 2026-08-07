# OpenClaw Hybrid Agent v1.0
## TaskFlow + Memoria Contextual Vectorial Persistente

## 1. Descripción del proyecto

Este proyecto implementa un agente híbrido basado en OpenClaw v2026.x capaz de ejecutar flujos de trabajo multietapa utilizando:

- TaskFlow para la planificación y ejecución de subtareas.
- SQLite para persistencia de estados.
- Memoria contextual basada en embeddings.
- Recuperación semántica mediante similitud coseno.
- Ollama + nomic-embed-text para generación de embeddings locales.
- Sistema de respaldo cuando el motor externo no está disponible.

El objetivo es demostrar la integración entre razonamiento, ejecución y memoria persistente dentro de una arquitectura de agente.

---

# 2. Arquitectura general

Flujo principal:

```
Usuario
  |
  v
GPT-5.5
  |
  v
TaskFlow
  |
  v
Ejecución de subtareas
  |
  v
SQLite Persistence
  |
  v
Memoria Vectorial
  |
  v
Retrieval Semántico
  |
  v
Resultado
```

La arquitectura separa responsabilidades:

- GPT-5.5: razonamiento y planificación.
- TaskFlow: ejecución y control del flujo.
- SQLite: almacenamiento persistente.
- Embeddings: representación semántica de información.
- Retrieval: recuperación contextual basada en significado.

---

# 3. Entorno utilizado

## Versiones

- OpenClaw: `2026.6.11-beta.2`
- Node.js: `24.18.0`
- Sistema operativo: Windows
- Agente: `main`

## Gateway local

```
127.0.0.1:18789
```

El Gateway permanece limitado al entorno local sin exposición pública directa.

---

# 4. Estructura del proyecto

```
demostrando_capacidades_openclaw

├── src
│   ├── database.js
│   ├── memory.js
│   └── taskflow.js
│
├── storage
│   └── taskflow.db
│
├── logs
│   └── taskflow-result.txt
│
├── memory
│   └── 2026-08-06.md
│
├── docs
│   └── architecture.md
│
├── test-db.js
├── test-memory.js
├── test-flow.js
├── package.json
└── .env.example
```

---

# 5. TaskFlow

Archivo:

```
src/taskflow.js
```

TaskFlow implementa un motor de ejecución de tareas con persistencia.

Capacidades:

- Creación de tareas.
- Generación de subtareas.
- Asociación entre tareas y subtareas.
- Persistencia de estados.
- Ejecución asíncrona.
- Control del ciclo de vida.

Estados:

```
pending
   |
   v
running
   |
   v
completed
```

Ejemplo:

Tarea principal:

```
Validación arquitectura híbrida OpenClaw
```

Subtareas:

```
1. Analizar GPT-5.5 como componente cognitivo.

2. Analizar Ollama + nomic-embed-text
   como motor de embeddings.

3. Analizar SQLite como almacenamiento persistente.
```

---

# 6. Memoria contextual semántica

Archivo:

```
src/memory.js
```

La memoria utiliza embeddings para representar información mediante vectores.

Tecnologías:

```
Ollama
+
nomic-embed-text
+
SQLite
```

Flujo:

```
Texto
 |
 v
Generación embedding
 |
 v
Vector almacenado
 |
 v
Nueva consulta
 |
 v
Comparación vectorial
 |
 v
Ranking semántico
```

---

# 7. Ingress y Retrieval

## Ingress

Permite incorporar información a la memoria.

Ejemplo:

```javascript
await ingress(
"SQLite almacena memoria persistente."
);
```

Proceso:

```
Texto
 |
 v
Embedding
 |
 v
SQLite
```

---

## Retrieval semántico

La búsqueda utiliza similitud coseno.

Proceso:

1. La consulta genera un embedding.
2. Se recuperan memorias almacenadas.
3. Se comparan vectores.
4. Se ordenan resultados por similitud.

Ejemplo:

Consulta:

```
memoria persistente
```

Resultado:

```
SQLite almacena memoria persistente.

Similarity:
0.94
```

---

# 8. Persistencia SQLite

Archivo:

```
src/database.js
```

Motor:

```
better-sqlite3
```

Base:

```
storage/taskflow.db
```

Tablas:

## tasks

```
id
title
status
```

Guarda tareas principales.


## subtasks

```
id
task_id
description
status
```

Guarda subtareas.


## memories

```
id
text
embedding
created_at
```

Guarda memoria contextual y vectores.

---

# 9. Correcciones aplicadas luego del feedback

Durante la primera evaluación se detectó una dependencia directa del servicio local Ollama.

Se realizaron las siguientes mejoras:

## Configuración dinámica

Se incorporó:

```
dotenv
```

para cargar variables desde `.env`.

Variables utilizadas:

```
OLLAMA_HOST
EMBEDDING_MODEL
DATABASE_PATH
OPENCLAW_AGENT
OPENCLAW_GATEWAY
```

---

## Eliminación de configuración fija

Antes:

```
localhost:11434
```

estaba escrito directamente en el código.

Ahora:

```
process.env.OLLAMA_HOST
```

permite modificar la configuración sin cambiar archivos fuente.

---

## Manejo de errores

Se agregó:

- Timeout de conexión.
- Captura de errores.
- Sistema fallback.

Nuevo flujo:

```
Consulta
 |
 v
Intentar Ollama
 |
 +---- Disponible
 |        |
 |        v
 |   Embedding real
 |
 +---- No disponible
          |
          v
    Embedding fallback local
```

Esto permite ejecutar las pruebas aunque Ollama no esté disponible.

---

# 10. Pruebas automatizadas

Ejecutar:

```bash
npm test
```

Ejecuta:

```
test-db.js
test-memory.js
test-flow.js
```

Valida:

- Base SQLite.
- Creación de tareas.
- Persistencia.
- Generación de embeddings.
- Retrieval semántico.
- Ejecución TaskFlow.
- Integración general.

---

# 11. Evidencia de validación

Última ejecución:

```
npm test
```

Resultado:

```
=== Retrieval Semántico ===

SQLite almacena memoria persistente.

Similarity:
0.94


=== Test TaskFlow OpenClaw ===

Subtareas ejecutadas correctamente.


VALIDACIÓN COMPLETADA
```

---

# 12. Prueba de resiliencia

Se verificó el funcionamiento sin dependencia obligatoria de Ollama.

Prueba:

Detener servicio:

```powershell
ollama stop nomic-embed-text
```

Ejecutar:

```powershell
npm test
```

Resultado esperado:

```
Ollama no disponible.
Usando embedding fallback.
```

Resultado final:

```
VALIDACIÓN COMPLETADA
```

---

# 13. Variables de entorno

Archivo:

```
.env.example
```

Configuración:

```
OLLAMA_HOST=http://127.0.0.1:11434

EMBEDDING_MODEL=nomic-embed-text

DATABASE_PATH=storage/taskflow.db

OPENCLAW_AGENT=main

OPENCLAW_GATEWAY=http://127.0.0.1:18789
```

---

# 14. Portabilidad

El proyecto utiliza rutas relativas mediante:

```
path.join()
```

Compatible con:

- Windows
- Linux
- macOS

---

# 15. Conclusión

Este proyecto demuestra una arquitectura completa de agente híbrido utilizando:

- OpenClaw.
- GPT-5.5 como componente cognitivo.
- TaskFlow para ejecución.
- Ollama + nomic-embed-text para embeddings.
- SQLite para persistencia.
- Memoria contextual semántica.
- Recuperación mediante similitud coseno.

La solución mantiene funcionamiento local, posee persistencia de estado y tolerancia ante fallos externos.

Estado final:

```
PROYECTO VALIDADO

TASKFLOW: OK
MEMORIA SEMÁNTICA: OK
SQLITE: OK
EMBEDDINGS: OK
TESTS: OK
```

Versión:

```
v1.0-openclaw-validation
```