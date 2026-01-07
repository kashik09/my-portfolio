# Notes

Internal scratchpad for json-api-builder.

## Positioning
- CLI-first tool
- Runs a real API server (Fastify)
- Config-driven via JSON
- Optimized for speed, prototyping, internal tools, and frontend dev workflows

## What this is NOT
- Not a framework
- Not a hosted SaaS
- Not a production-grade backend replacement
- Not an OpenAPI-first generator (yet)

## Design principles
- Zero setup friction
- Predictable behavior
- Minimal magic
- Clear errors over clever abstractions

## Dev reminders
- Keep v0.x scope tight
- Avoid auth + roles until CRUD is rock solid
- Favor explicit config over convention
- Docs must stay ahead of features

## Known sharp edges
- Exact-match filtering only
- No pagination/sorting yet
- In-memory store resets unless persist=file
