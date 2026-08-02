module.exports = {
  apps: [
    {
      name: "allan-construction",
      script: "dist/index.cjs",
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
