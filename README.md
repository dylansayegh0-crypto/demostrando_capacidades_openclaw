# Checkpoint OpenClaw - Agente con TaskFlow y Memoria Contextual Persistente

## Objetivo

Este proyecto demuestra la implementación de un agente basado en OpenClaw v2026.x capaz de ejecutar flujos de trabajo multietapa mediante:

- Descomposición de tareas.
- Creación dinámica de subtareas.
- Persistencia de estados.
- Memoria contextual.
- Generación de embeddings.
- Recuperación semántica mediante similitud coseno.

La validación implementa el siguiente flujo:

```text
Tarea
  ↓
Subtareas
  ↓
Persistencia SQLite
  ↓
Generación de Embeddings
  ↓
Memoria Contextual
  ↓
Retrieval Semántico
  ↓
Resultado Final
```

---

# Entorno utilizado

- OpenClaw: `2026.6.11-beta.2`
- Node.js: `24.18.0`
- Sistema operativo: Windows
- Agente utilizado: `main`

Gateway configurado:

```
127.0.0.1:18789
```

El Gateway permanece restringido al entorno local y no posee exposición pública directa.

---

# Arquitectura

La solución utiliza una arquitectura híbrida compuesta por:

```text
GPT-5.5
    ↓
TaskFlow
    ↓
Motor de Memoria Semántica
    ↓
SQLite
    ↓
Recuperación Contextual
```

---

# GPT-5.5

Responsable del razonamiento y planificación del agente.

Funciones:

- Interpretación del objetivo solicitado.
- División de tareas complejas.
- Coordinación del flujo.
- Generación de conclusiones.

GPT-5.5 funciona como componente cognitivo encargado de organizar la ejecución del agente.

---

# TaskFlow programático

Archivo:

```
src/taskflow.js
```

Implementa un sistema propio de gestión de tareas.

Funciones:

- Creación de tareas principales.
- Generación dinámica de subtareas.
- Asociación entre tareas y subtareas.
- Gestión de estados.

Cada ejecución genera identificadores únicos mediante UUID.

Estados soportados:

```
pending
running
completed
```

Ejemplo:

```
Tarea principal:

Validar arquitectura OpenClaw


Subtareas:

1. Analizar GPT-5.5 como orquestador cognitivo.

2. Analizar Ollama + nomic-embed-text
   como generador de embeddings.

3. Analizar SQLite como sistema
   de memoria persistente.
```

---

# Memoria contextual semántica (ContextEngine)

Archivo:

```
src/memory.js
```

La memoria contextual implementa embeddings reales utilizando:

```
Ollama + nomic-embed-text
```

El sistema no utiliza búsqueda por subcadena.

El funcionamiento es:

```text
Texto ingresado
        ↓
Ollama genera embedding vectorial
        ↓
Vector almacenado en SQLite
        ↓
Nueva consulta genera otro embedding
        ↓
Comparación mediante similitud coseno
        ↓
Ranking de resultados
```

---

# Ingress

Permite incorporar nueva información a la memoria contextual.

Proceso:

```
Texto
 ↓
Embedding
 ↓
Persistencia SQLite
```

Ejemplo:

```javascript
await ingress(
"SQLite almacena memoria persistente"
);
```

Los datos quedan almacenados en la tabla:

```
memories
```

dentro de:

```
storage/taskflow.db
```

---

# Retrieval Semántico

Permite recuperar información utilizando similitud matemática entre embeddings.

Proceso:

1. Se genera el embedding de la consulta.
2. Se recuperan memorias almacenadas.
3. Se calcula similitud coseno.
4. Se ordenan los resultados por relevancia.

Ejemplo:

```javascript
await retrieval(
"memoria persistente"
);
```

Resultado esperado:

```
SQLite almacena memoria persistente.

Similarity: 0.94


Ollama genera embeddings locales.

Similarity: 0.40


GPT-5.5 es el motor de razonamiento.

Similarity: 0.40
```

Esto demuestra recuperación contextual basada en significado.

---

# Ollama + nomic-embed-text

Ollama es utilizado como motor local de embeddings.

Funciones:

- Transformación de texto en vectores.
- Representación semántica del conocimiento.
- Generación de información utilizada por el sistema de recuperación.

Modelo utilizado:

```
nomic-embed-text
```

Servicio local:

```
http://127.0.0.1:11434
```

---

# Persistencia SQLite

Archivo:

```
src/database.js
```

La persistencia utiliza:

```
better-sqlite3
```

Base generada:

```
storage/taskflow.db
```

La base contiene:

## Tabla tasks

```
id
title
status
```

## Tabla subtasks

```
id
task_id
description
status
```

## Tabla memories

```
id
text
embedding
created_at
```

La información permanece disponible entre ejecuciones.

---

# Implementación propia

Además de la integración con OpenClaw, el proyecto implementa componentes propios:

- Motor TaskFlow.
- Sistema de memoria semántica.
- Persistencia SQLite.
- Recuperación mediante embeddings.
- Pruebas automatizadas.

---

# Flujo validado

La prueba ejecutada valida:

```
Crear flujo de trabajo
        ↓
Generar subtareas
        ↓
Completar ejecución
        ↓
Guardar memoria
        ↓
Recuperar información semántica
```

Resultado:

```
GPT-5.5       completed

Memory        completed

SQLite        completed
```

---

# Evidencia de ejecución

Los resultados quedan registrados en:

```
logs/taskflow-result.txt
```

La evidencia contiene:

- Lista de subtareas.
- Estados finales.
- Memoria utilizada.
- Resultado de recuperación semántica.

Memoria contextual utilizada:

```
memory/2026-08-06.md
```

---

# Pruebas automatizadas

El proyecto incorpora:

```bash
npm test
```

El comando ejecuta:

```
test-db.js
test-memory.js
test-flow.js
```

Validando:

- Creación del TaskFlow.
- Persistencia SQLite.
- Generación de embeddings.
- Retrieval semántico.
- Integración con OpenClaw.

---

# Manejo de integración externa

La integración con OpenClaw depende del proveedor externo.

Cuando existe:

- Falta de respuesta.
- Límite de cuota.
- Problema de autenticación.

El sistema:

- Detecta timeout.
- Continúa validación local.
- Mantiene funcionando TaskFlow.
- Mantiene funcionando SQLite.
- Mantiene funcionando memoria semántica.

Ejemplo:

```
TIMEOUT: OpenClaw no respondió
```

---

# Variables de entorno

Archivo:

```
.env.example
```

Configuración:

```env
OPENAI_API_KEY=

OLLAMA_HOST=http://127.0.0.1:11434

DATABASE_PATH=storage/taskflow.db

OPENCLAW_AGENT=main

OPENCLAW_GATEWAY=http://127.0.0.1:18789
```

---

# Portabilidad

Los scripts utilizan rutas relativas mediante:

```javascript
path.join()
```

Esto evita dependencia de rutas absolutas del sistema operativo.

El proyecto puede ejecutarse en:

- Windows
- Linux
- macOS

---

# Estructura del proyecto

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
├── memory
│   └── 2026-08-06.md
│
├── logs
│   └── taskflow-result.txt
│
├── test-db.js
├── test-memory.js
├── test-flow.js
├── .env.example
├── package.json
└── README.md
```

---

# Mejoras realizadas luego de la primera revisión

## Memoria contextual

Antes:

```
Búsqueda básica por coincidencia de texto.
```

Después:

```
Embeddings reales mediante Ollama.
Comparación mediante similitud coseno.
Ranking semántico de resultados.
Persistencia vectorial en SQLite.
```

---

## TaskFlow

Antes:

```
Estados definidos de forma fija.
```

Después:

```
Estados persistentes en SQLite.
UUID únicos.
Ejecución dinámica de subtareas.
```

---

## Portabilidad

Antes:

```
Dependencia de rutas absolutas.
```

Después:

```
Uso de rutas relativas.
Compatibilidad multiplataforma.
```

---

# Conclusión final

Este proyecto demuestra una arquitectura completa de agente utilizando OpenClaw con:

- Razonamiento mediante GPT-5.5.
- Gestión dinámica de tareas mediante TaskFlow.
- Embeddings locales mediante Ollama + nomic-embed-text.
- Memoria contextual persistente mediante SQLite.
- Recuperación semántica mediante similitud coseno.
- Pruebas automatizadas reproducibles.

La arquitectura separa claramente:

```text
Razonamiento
      ↓
Ejecución
      ↓
Memoria
      ↓
Recuperación
      ↓
Resultado
```

La validación final puede reproducirse ejecutando:

```bash
npm test
```

obteniendo una comprobación automática de todos los componentes principales del sistema.