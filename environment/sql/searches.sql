DROP TABLE IF EXISTS "searches";

CREATE TABLE "searches"(
    "search_id" serial PRIMARY KEY,
    "success" BOOLEAN NOT NULL,
    "created_on" TIMESTAMP
);