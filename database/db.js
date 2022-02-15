import {Client}  from "https://deno.land/x/postgres@v0.13.0/mod.ts";

export const client = new Client({
    hostname: "abul.db.elephantsql.com",
    database: "lelmphiv",
    user: "lelmphiv",
    password: "HC2rLb4pLhUVhu3GszaBb0GfPPIkIhKz",
    port: 5432,
  });

