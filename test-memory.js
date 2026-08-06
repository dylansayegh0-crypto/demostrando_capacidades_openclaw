const { ingress, retrieval } = require("./src/memory");

ingress("GPT-5.5 es el motor de razonamiento.");
ingress("Ollama genera embeddings locales.");
ingress("SQLite almacena memoria persistente.");

console.log("=== Retrieval ===");

console.log(
    retrieval("SQLite")
);