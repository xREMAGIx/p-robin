# Project Robin

Fullstack CMS E-commerce project

Status: In Progress

## Tech Stack

**Client**

- [Elysia - Eden](https://github.com/elysiajs/eden)
- [Astro](https://astro.build/)
- [Node](https://nodejs.org/en/)

**CMS**

- [Elysia - Eden](https://github.com/elysiajs/eden)
- [React-Vite](https://vitejs.dev/)
- [Bun](https://bun.dev/)

**Server**

- [Elysia](https://github.com/elysiajs/elysia)
- [Drizzle](https://drizzlekit.com/)
- [Bun](https://bun.dev/)

**Database**

- [PostgreSQL](https://www.postgresql.org/)

**Tooling**

- [Moonrepo](https://moonrepo.dev/)

## Moonrepo tooling

First you should install Moonrepo [docs](https://moonrepo.dev/docs/install)

### Task commands

In each projects in `apps/`, they will contain `moon.yml` with multiple task commands. Below table will list and explain commands that you can run

#### General

| Command              | Description                                 |
| -------------------- | ------------------------------------------- |
| `moon :dev`          | Run all projects in develop with `.env.dev` |
| `moon :install`      | Install `node_modules` in all projects      |
| `moon :clearModules` | Remove `node_modules` in all projects       |

#### Client

| Command                    | Description                      |
| -------------------------- | -------------------------------- |
| `moon client:dev`          | Run client in develop            |
| `moon client:install`      | Install `node_modules` in client |
| `moon client:clearModules` | Remove `node_modules` in client  |

#### CMS

| Command                 | Description                   |
| ----------------------- | ----------------------------- |
| `moon cms:dev`          | Run cms in develop            |
| `moon cms:install`      | Install `node_modules` in cms |
| `moon cms:clearModules` | Remove `node_modules` in cms  |

#### Server

| Command                             | Description                                                                  |
| ----------------------------------- | ---------------------------------------------------------------------------- |
| `moon server:dev`                   | Run all projects in develop                                                  |
| `moon server:install`               | Install `node_modules` in all projects                                       |
| `moon server:clearModules`          | Remove `node_modules` in all projects                                        |
| `moon server:generateMigration`     | Generate migration file of Drizzle                                           |
| `moon server:migrate`               | Run migration                                                                |
| `moon server:studio`                | Run `Drizzle Studio` at https://local.drizzle.studio                         |
| `file=<file_name> moon server:seed` | Run the seed file script (<file_name>.ts) which is located in `seeds` folder |

### Code generation

All code generation templates are located in `templates` folder, to generate, run this command at `root` directory:

```
moon generate <template_name>
```

| Template                      | Description                                                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `moon generate cms-module`    | Generate files in `pages`, `containers`, `services` includes simple code that execute CRUD function in cms project |
| `moon generate server-module` | Generate files in `controllers`, `models`, `services` includes simple code that execute CRUD in server project     |
