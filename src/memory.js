const db = require("./database");
const axios = require("axios");

async function createEmbedding(text) {

    const response = await axios.post(
        "http://localhost:11434/api/embeddings",
        {
            model: "nomic-embed-text",
            prompt: text
        }
    );

    return response.data.embedding;
}


// Cosine similarity
function cosineSimilarity(a, b) {

    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {

        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];

    }

    return dot /
        (Math.sqrt(normA) * Math.sqrt(normB));
}


// INGRESSION
async function ingress(text) {

    const embedding = await createEmbedding(text);

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

}


// RETRIEVAL SEMÁNTICO
async function retrieval(query) {


    const queryEmbedding =
        await createEmbedding(query);


    const rows =
        db.prepare(`
            SELECT *
            FROM memories
        `)
        .all();


    return rows
        .map(item => {

            const vector =
                JSON.parse(item.embedding);


            return {

                text:item.text,

                similarity:
                    cosineSimilarity(
                        queryEmbedding,
                        vector
                    )

            };

        })
        .sort(
            (a,b)=>
            b.similarity-a.similarity
        )
        .slice(0,5);

}


module.exports = {
    ingress,
    retrieval
};