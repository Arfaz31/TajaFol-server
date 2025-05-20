/* eslint-disable no-console */
import { Server } from 'http';
import mongoose from 'mongoose';
import { config } from './app/config';
import app from './app';
import { seedSuperAdmin } from './app/DB';
const port=process.env.port||config.port 

let server: Server;
async function main() {
  await mongoose.connect(config.database_url as string);
  seedSuperAdmin();
  server = app.listen(port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
}

process.on('uncaughtException', (err) => {
  console.log(err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.log(err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});

main();