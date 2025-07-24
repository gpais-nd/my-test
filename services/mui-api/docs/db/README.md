# Database

We use a Postgres database to store the app's data, to see it's data or make any modification use any database client and connect using the credentials provided by the team for the `.env` file.

**Make sure you are connected to a xxx_xx_xx_FULL VPN**, otherwise you won't be able to connect.

## Knex

We are using [Knex](http://knexjs.org/) as SQL Query builder, using it's API we connect our backend to the database

## Migrations

We use migrations to perform database schema changes, the database was initially created with a .sql file, that is why not all the changes were registered in the migrations folder, if you want to see that script please request it to a team member.

[Migrations](http://knexjs.org/guide/migrations.html) allow us to perform database changes safely, to create a migration file run `yarn knex:migrate:make -- {migration_name}`, the `migration_name` should be a self descriptive title of the operation that file performs, for example `yarn knex:migrate:make -- create_users_table`.

The database that will receive the changes depends on the configuration set inside `src/configs.ts`.

Once we have a migration created we can perform any of the following commands:

- `yarn knex:migrate:latest` runs all the pending migrations to the database
- `yarn knex:migrate:rollback` undo all the migrations made to the database
- `yarn knex:migrate:up` runs the following migration only
- `yarn knex:migrate:down` undo the latest migration only

# After creating a new table

If a new table is created using migrations, the following query must be run at the end of the migration in order to give the user `local` the proper permissions.

```typescript
import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(
    `DO
    $do$
    BEGIN
       IF EXISTS (
          SELECT FROM pg_catalog.pg_roles
          WHERE  rolname = 'local') THEN
    
          GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES IN SCHEMA public TO local;
       END IF;
    END
    $do$;`
  );
}

export async function down(knex: Knex): Promise<void> {
  return;
}
```
