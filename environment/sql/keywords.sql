DROP TABLE IF EXISTS "keywords";

CREATE TABLE "keywords"(
 	"keyword_id" serial PRIMARY KEY,
	"doc_id" INT NOT NULL,
 	"keyword" VARCHAR (30) NOT NULL,
 	"keyword_rank" INT NOT NULL,
 	"frequency" INT NOT NULL
);