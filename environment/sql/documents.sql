DROP TABLE IF EXISTS "documents";

CREATE TABLE "documents"(
    "doc_id" serial PRIMARY KEY,
    "doc_name" VARCHAR (30) UNIQUE NOT NULL,
    "doc_title" VARCHAR (200) UNIQUE NOT NULL
);