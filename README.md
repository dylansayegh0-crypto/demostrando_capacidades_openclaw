# Checkpoint OpenClaw - Agente con TaskFlow y Memoria Contextual Persistente

## Objetivo

Este proyecto demuestra la implementación de un agente basado en OpenClaw v2026.x capaz de ejecutar flujos de trabajo multietapa mediante:

- Descomposición de tareas.
- Creación dinámica de subtareas.
- Persistencia de estados.
- Memoria contextual persistente.
- Generación real de embeddings.
- Recuperación semántica mediante similitud coseno.

La arquitectura validada implementa el siguiente flujo:

```text
Tarea
  ↓
Subtareas
  ↓
TaskFlow
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

# Arquitectura general

La solución utiliza una arquitectura híbrida:

```text
              GPT-5.5
                 |
                 ↓
             TaskFlow
                 |
                 ↓
       Motor de Memoria Semántica
                 |
                 ↓
              SQLite
                 |
                 ↓
       Recuperación Contextual
```

---

# GPT-5.5

GPT-5.5 funciona como componente cognitivo del agente.

Responsabilidades:

- Interpretación del objetivo.
- Planificación del flujo.
- División de tareas complejas.
- Coordinación de subtareas.
- Generación de conclusiones.

El modelo actúa como capa de razonamiento superior del sistema.

---

# TaskFlow programático

Archivo:

```
src/taskflow.js
```

El proyecto implementa un motor TaskFlow propio mediante Node.js.

Funciones principales:

- Creación de tareas.
- Creación dinámica de subtareas.
- Asociación entre tareas y subtareas.
- Actualización de estados.
- Persistencia mediante SQLite.

Cada ejecución genera identificadores únicos mediante UUID.

Estados utilizados:

```
pending
running
completed
```

Ejemplo de flujo:

```
Tarea principal:

Validación arquitectura híbrida OpenClaw


Subtareas:

1. Analizar GPT-5.5 como orquestador cognitivo.

2. Analizar Ollama + nomic-embed-text
   como generador local de embeddings.

3. Analizar SQLite como sistema
   de memoria persistente.
```

---

# Motor de memoria contextual semántica

Archivo:

```
src/memory.js
```

El sistema implementa una memoria contextual basada en embeddings reales.

La solución utiliza:

```
Ollama + nomic-embed-text
```

No utiliza búsqueda por texto ni coincidencias simples.

El funcionamiento es:

```text
Texto ingresado
        ↓
Ollama genera embedding vectorial
        ↓
Vector almacenado en SQLite
        ↓
Consulta genera nuevo embedding
        ↓
Comparación matemática
        ↓
Ranking por similitud
```

---

# Ingress

El módulo Ingress permite incorporar nueva información al sistema de memoria.

Ejemplo:

```javascript
await ingress(
"SQLite almacena memoria persistente."
);
```

Proceso:

```
Texto
 ↓
Embedding
 ↓
Persistencia SQLite
```

Los datos son almacenados en la tabla:

```
memories
```

dentro de:

```
storage/taskflow.db
```

---

# Retrieval Semántico

La recuperación utiliza similitud coseno entre vectores.

Proceso:

1. Se genera el embedding de la consulta.
2. Se consultan memorias almacenadas.
3. Se calcula similitud entre vectores.
4. Se ordenan resultados por relevancia.

Ejemplo:

Consulta:

```
memoria persistente
```

Resultado:

```
SQLite almacena memoria persistente.

Similarity: 0.94


Ollama genera embeddings locales.

Similarity: 0.40


GPT-5.5 es el motor de razonamiento.

Similarity: 0.40
```

Esto demuestra recuperación basada en significado y no solamente coincidencia textual.

---

# Ollama + nomic-embed-text

Ollama funciona como motor local de embeddings.

Responsabilidades:

- Conversión de texto a vectores.
- Representación semántica.
- Generación de información utilizada por Retrieval.

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

La base contiene las siguientes tablas:

---

## Tabla tasks

```
id
title
status
```

Almacena las tareas principales.

---

## Tabla subtasks

```
id
task_id
description
status
```

Almacena las subtareas asociadas.

---

## Tabla memories

```
id
text
embedding
created_at
```

Almacena:

- Texto contextual.
- Vector generado por Ollama.
- Fecha de creación.

---

# Implementación propia

Además de la integración con OpenClaw, el proyecto implementa:

- Motor TaskFlow propio.
- Sistema de memoria semántica.
- Persistencia vectorial mediante SQLite.
- Generación de embeddings locales.
- Recuperación mediante similitud coseno.
- Pruebas automatizadas.

---

# Flujo validado

La ejecución completa valida:

```text
Crear tarea
      ↓
Crear subtareas
      ↓
Guardar estados iniciales
      ↓
Ejecutar TaskFlow
      ↓
Actualizar estados
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

- Subtareas creadas.
- Estados finales.
- Memoria utilizada.
- Resultados del retrieval semántico.

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

- Creación de tareas.
- Persistencia SQLite.
- Generación de embeddings.
- Recuperación semántica.
- Ejecución del TaskFlow.
- Integración con OpenClaw.

---

# Resultado actual de validación

Última ejecución:

```bash
npm test
```

Resultado:

```
TaskFlow creado correctamente.

Subtareas generadas:

Analizar GPT-5.5
Analizar Ollama + nomic-embed-text
Analizar SQLite + sqlite-vec


Estado inicial:

pending


Estado final:

completed
```

Retrieval:

```
=== Retrieval Semántico ===

SQLite almacena memoria persistente.
Similarity: 0.94
```

---

# Manejo de integración externa

La integración con OpenClaw depende del proveedor externo.

Si ocurre:

- Falta de respuesta.
- Límite de cuota.
- Problemas de autenticación.

El sistema:

- Detecta timeout.
- Mantiene funcionando TaskFlow.
- Mantiene funcionando SQLite.
- Mantiene funcionando la memoria semántica.

Ejemplo:

```
TIMEOUT: OpenClaw no respondió
```

La validación local continúa correctamente.

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

Esto elimina dependencias de rutas absolutas.

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
│   ├── taskflow.db
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

# Mejoras realizadas después de la primera revisión

## Memoria contextual

Antes:

```
Búsqueda básica mediante coincidencia de texto.
```

Después:

```
Embeddings reales mediante Ollama.
Similitud coseno.
Ranking semántico.
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
Estados persistentes.
Estados dinámicos:
pending → completed

UUID únicos.
Ejecución real de subtareas.
```

---

## Portabilidad

Antes:

```
Rutas absolutas dependientes del sistema.
```

Después:

```
Uso de path.join().
Compatibilidad multiplataforma.
```

---

# Conclusión final

Este proyecto demuestra una arquitectura completa de agente utilizando OpenClaw con:

- GPT-5.5 para razonamiento.
- TaskFlow para gestión de procesos.
- Ollama + nomic-embed-text para embeddings locales.
- SQLite para persistencia.
- Memoria contextual semántica.
- Recuperación mediante similitud coseno.
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

La validación completa se reproduce mediante:

```bash
npm test
```

obteniendo una comprobación automática de todos los componentes principales del sistema.