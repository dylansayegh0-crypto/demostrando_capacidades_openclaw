require("dotenv").config();

const db = require("./database");
const axios = require("axios");


// Configuración dinámica mediante variables de entorno

const OLLAMA_HOST =
    process.env.OLLAMA_HOST || "http://127.0.0.1:11434";

const EMBEDDING_MODEL =
    process.env.EMBEDDING_MODEL || "nomic-embed-text";



// Generación de embeddings

async function createEmbedding(text) {

    try {

        const response = await axios.post(
            `${OLLAMA_HOST}/api/embeddings`,
            {
                model: EMBEDDING_MODEL,
                prompt: text
            },
            {
                timeout: 3000
            }
        );


        console.log(
            "Embedding generado mediante Ollama"
        );


        return response.data.embedding;


    } catch(error) {


        console.log(
            "Ollama no disponible. Usando embedding local de respaldo."
        );


        return mockEmbedding(text);

    }

}



// Embedding local de respaldo
// Permite ejecutar los tests sin depender de servicios externos

function mockEmbedding(text) {


    const vector = [];


    for(let i = 0; i < 10; i++) {


        let value = 0;


        for(const char of text) {

            value += char.charCodeAt(0) * (i + 1);

        }


        vector.push(
            (value % 1000) / 1000
        );

    }


    return vector;

}



// Similitud coseno

function cosineSimilarity(a,b) {


    let dot = 0;
    let normA = 0;
    let normB = 0;


    for(let i = 0; i < a.length; i++) {


        dot += a[i] * b[i];

        normA += a[i] * a[i];

        normB += b[i] * b[i];

    }


    return dot /
        (
            Math.sqrt(normA) *
            Math.sqrt(normB)
        );

}



// INGRESSION
// Guarda información contextual persistente

async function ingress(text) {


    const embedding =
        await createEmbedding(text);



    db.prepare(`
        INSERT INTO memories
        (
            text,
            embedding
        )
        VALUES
        (?,?)
    `)
    .run(
        text,
        JSON.stringify(embedding)
    );


    console.log(
        "Memoria almacenada:",
        text
    );

}



// RETRIEVAL SEMÁNTICO
// Recuperación mediante similitud vectorial

async function retrieval(query) {


    console.log(
        "\n=== Retrieval Semántico ==="
    );


    const queryEmbedding =
        await createEmbedding(query);



    const rows =
        db.prepare(`
            SELECT *
            FROM memories
        `)
        .all();



    const results =
        rows
        .map(item => {


            const vector =
                JSON.parse(item.embedding);



            return {

                text: item.text,

                similarity:
                    cosineSimilarity(
                        queryEmbedding,
                        vector
                    )

            };


        })
        .sort(
            (a,b) =>
            b.similarity - a.similarity
        )
        .slice(0,5);



    console.table(results);


    return results;

}



module.exports = {
    ingress,
    retrieval
};