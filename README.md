# Voice Owl Conversation Service

## Setup instructions
- Prereqs: Node 18+ (tested on Node 22) and MongoDB reachable via `DATABASE_URL`.
- Install deps: `npm install`.
- Environment: copy `.env.development.local` (or create `.env`) and set at least:
  - `DATABASE_URL=mongodb://<user>:<pass>@localhost:27017/voice-owl?authSource=admin`
  - Optional: `PORT=3000` (or any free port).
- If running local Mongo via Docker: `docker compose up -d mongo`.

## How to run the project
- Dev (watch): `npm run start:dev`
- Single run: `npm run start` (or `PORT=3002 npm run start` to pick a free port).
- Swagger UI: `http://localhost:<PORT>/api` (documents sessions/events endpoints and payload schemas with example).

## Assumptions made
- MongoDB is available at the `DATABASE_URL` you provide; no in-memory fallback is used.
- Session creation is idempotent on `sessionId`; events require an existing session and are linked via `sessionId` and stored with the session ObjectId.
- Default port is 3000 unless `PORT` is set.
- Validation is enabled globally; payloads must follow the DTO shapes documented in Swagger.
- for Events and Session, separate module was not chosen as according to the requirement they both have the same controller path, so I added them both in single and seperated the concern by adding separate DTOs, Schema, Service files

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
