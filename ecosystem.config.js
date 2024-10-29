module.exports = {
    apps: [
      {
        name: "leetcode-kiut-api",
        script: "./server.js",
        instances: "1",
        exec_mode: "cluster",
        watch: false,
        env: {
          NODE_ENV: "development",
        },
        env_production: {
          NODE_ENV: "production",
        },
      },
      {
        name: "leetcode-kiut-cdn",
        script: "./cdn/server.js",
        instances: "1",
        exec_mode: "cluster",
        watch: false,
        env: {
          NODE_ENV: "development",
        },
        env_production: {
          NODE_ENV: "production",
        },
      },
    ],
  };