import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";

export default async function migrations(request, response) {
  try {
    if (!["GET", "POST"].includes(request.method)) {
      return response.status(405).end();
    }

    const dbClient = await database.getNewClient();

    const isDryRun = request.method === "GET";

    const migrations = await migrationRunner({
      dbClient: dbClient,
      dryRun: isDryRun,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    });

    if (migrations.length > 0 && !isDryRun) {
      return response.status(201).json(migrations);
    }

    return response.status(200).json(migrations);
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await dbClient.end();
  }
}
