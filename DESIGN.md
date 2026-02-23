## Next Improvements (ordered)
1) Global exception filter  
   - Goal: normalize error responses, hide internals, add traceId.  
   - Plan: Implement `HttpExceptionFilter` with standard shape `{ statusCode, message, path, timestamp, traceId }`; apply in `main.ts`.  
   - Open question: log level for 4xx vs 5xx? (Proposed: warn for 4xx, error for 5xx).

2) Input sanitization pipeline  
   - Goal: block script/formula injection and strip dangerous chars before hitting business logic.  
   - Plan: Add a global pipe/interceptor using `sanitize-html` or a lightweight custom sanitizer; apply to string fields in DTOs only.  
   - Note: keep HTML tags allowed list empty for now.

3) Rate limiting  
   - Goal: reduce abuse on public endpoints.  
   - Plan: Add `@nestjs/throttler` with policy e.g. `100 requests / 15 min` per IP; exempt healthz if added.

4) DTO hardening for JSON fields  
   - Goal: replace loose `Record<string, any>` with structured schemas.  
   - Plan: define nested DTOs for `metadata`, `payload` shapes (user_speech/bot_speech/system) and use `@ValidateNested`, `@Type`.  
   - Benefit: better Swagger, safer validation, clearer contracts.

5) Test plan  
   - Unit: services (session create/upsert, event create with missing session, close session).  
   - E2E: REST flows (create session → post event → fetch session with populated events; close session).  
   - Contract: snapshot Swagger JSON to detect API drift.  
   - Infra: health check once added.

## Additional nice-to-haves
- Graceful shutdown hooks (`app.enableShutdownHooks`).
- CORS allowlist for the client domains.
- Structured request logging (morgan or Nest interceptor) with traceId correlation.
