# Backend TypeScript migration

Run `npm install` after pulling changes, then `npm run typecheck` to check the
converted routes. CI runs this command before the existing test suite.

The backend remains CommonJS. TypeScript routes use `import = require(...)` and
`export = router`, preserving the router value returned by existing `require()`
calls. `app.js` registers `tsx/cjs` before loading routes, so both `node bin/www`
and the existing PM2/Docker entry points support the migration. `tsx` is a
production dependency and transpiles at runtime; there is no emitted backend
build directory. Type checking is a separate required CI gate.

Mocha preloads the same runtime through `.mocharc.json`, including parallel
workers. For standalone scripts importing TypeScript directly, use
`node --require tsx/cjs your-script.js`.

`tsconfig.json` enables strict checks for TypeScript routes while allowing imports
from existing JavaScript modules without checking all legacy JavaScript. New
`.ts` files under `routes/` are automatically included. JavaScript imports can
still expose untyped values; this pilot does not claim end-to-end backend type
safety. The dynamic model registry has a local model contract in `chat.ts` which
must stay aligned with `db/schemas.js` until models are migrated.

The first converted routes are `achievements.ts` and `chat.ts`. Their responses,
authorization, parsing, and persistence behavior are preserved. Request body
fields start as `unknown`; TypeScript does not replace runtime input validation.
Keep broader behavior changes and structural refactors in separate changes.
