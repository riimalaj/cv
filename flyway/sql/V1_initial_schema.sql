CREATE TABLE collections (
	id SERIAL PRIMARY KEY,
	name VARCHAR(50) UNIQUE
);

CREATE TABLE lista (
	id SERIAL PRIMARY KEY,
	toive VARCHAR(150) UNIQUE,
	esittaja VARCHAR(50) UNIQUE,
	ideaStatus BOOLEAN,
	orderStatus BOOLEAN,
	deliveredStatus BOOLEAN,
	lista_id INTEGER REFERENCES lista(id)
);