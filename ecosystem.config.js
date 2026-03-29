module.exports = {
  apps: [
    {
      name: "catch-columbus",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "/home/u-XXXXXXXX/domains/catchcolumbus.com/public_html",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
    },
  ],
};
