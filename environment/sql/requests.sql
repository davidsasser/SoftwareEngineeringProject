DROP TABLE IF EXISTS "requests";

CREATE TABLE "requests"(
    "request_id" serial PRIMARY KEY,
    "doc_name" VARCHAR (200) NOT NULL,
    "request_type" VARCHAR (200) NOT NULL
);