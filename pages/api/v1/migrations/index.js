import migrationRunner from 'node-pg-migrate'
import { join } from "node:path"
import database from "infra/database.js"

export default async function migrations(request, response) {

  if (!["GET", "POST"].includes(request.method)) {
    return response.status(405).end();
  }

  const dbClient = await database.getNewClient();

  const isDryRun = request.method === "GET"

  const migrations = await migrationRunner({
    dbClient: dbClient,
    dryRun: isDryRun,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations"
  })

  await dbClient.end();

  if (migrations.length > 0 && !isDryRun) {
    return response.status(201).json(migrations);
  }


  return response.status(200).json(migrations);
}

