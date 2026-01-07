json-api-builder

Spin up a CRUD JSON API server from a JSON config.

A lightweight CLI tool for prototyping, internal tools, dashboards, and frontend development when you need a backend now, not next week.

What it does

Reads a JSON config file

Starts a Fastify server

Automatically creates CRUD endpoints for each resource

Supports basic validation from config

Optional persistence to disk (persist: "file") using .data/

Requirements

Node.js 18 or higher

Install
npm install

Quick start

Create a starter config:

npm run dev -- init


Run the API server:

npm run dev -- dev --config api.config.json


Open in your browser:

http://localhost:3000/
 — API index

http://localhost:3000/health
 — health check

Example with file persistence

Run using the example config:

npm run dev -- dev --config examples/basic.config.json --port 4001


This will:

Create a .data/ folder

Store each resource as a JSON file (e.g. .data/users.json)

Reload data on restart

Endpoints

For each resource (example: users):

GET /users

GET /users/:id

POST /users

PATCH /users/:id

DELETE /users/:id

Filtering

Basic filtering via query params is supported:

GET /users?name=Kashkaiii
GET /users?age=17
GET /users?active=true


Unknown filters are ignored

Matching is exact (v0.1.0)

Config format

Example api.config.json:

{
  "port": 3000,
  "persist": "memory",
  "resources": {
    "users": {
      "fields": {
        "name": "string",
        "email": "string",
        "age": "number"
      },
      "required": ["name", "email"]
    },
    "posts": {
      "fields": {
        "title": "string",
        "content": "string"
      }
    }
  }
}

Field types supported

string

number

boolean

Notes / limits (v0.1.0)

No authentication

No relations or joins

No pagination or sorting

Intended for prototyping, internal tools, and dev environments

License

This project is provided for personal and commercial use in your own projects.

You may not resell, redistribute, or publish this code as a standalone product or template without permission.

Provided “as is”, without warranty.