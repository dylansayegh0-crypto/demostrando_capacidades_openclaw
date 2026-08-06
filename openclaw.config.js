module.exports = {
  agent: {
    name: "main"
  },

  gateway: {
    host: "127.0.0.1",
    port: 18789
  },

  memory: {
    enabled: true,
    storage: "./memory"
  },

  taskflow: {
    enabled: true,
    persistence: "sqlite"
  }
};