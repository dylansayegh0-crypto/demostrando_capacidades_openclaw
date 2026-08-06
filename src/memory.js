const fs = require("fs");
const path = require("path");

const memoryFile = path.join(__dirname, "..", "storage", "vectors.json");

function loadMemory() {
    if (!fs.existsSync(memoryFile)) {
        return [];
    }

    return JSON.parse(fs.readFileSync(memoryFile, "utf8"));
}

function saveMemory(memory) {
    fs.writeFileSync(
        memoryFile,
        JSON.stringify(memory, null, 2)
    );
}

// Ingress
function ingress(text) {

    const memory = loadMemory();

    memory.push({
        id: Date.now(),
        text
    });

    saveMemory(memory);
}

// Retrieval
function retrieval(query) {

    const memory = loadMemory();

    return memory.filter(item =>
        item.text.toLowerCase().includes(query.toLowerCase())
    );

}

module.exports = {
    ingress,
    retrieval
};