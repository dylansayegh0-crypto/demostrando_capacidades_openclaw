const {
    ingress,
    retrieval
} = require("./src/memory");


async function runTest() {

    console.log("=== Ingress ===");

    await ingress(
        "GPT-5.5 es el motor de razonamiento."
    );


    await ingress(
        "Ollama genera embeddings locales."
    );


    await ingress(
        "SQLite almacena memoria persistente."
    );


    console.log("\n=== Retrieval Semántico ===");


    const result =
        await retrieval(
            "memoria persistente SQLite"
        );


    console.log(result);

}


runTest()
.catch(error => {

    console.error(
        "Error en test-memory:",
        error
    );

    process.exit(1);

});