CREATE TABLE history (
	uuid BINARY(16) NOT NULL,
	origin BINARY(16) NOT NULL,

	amount SMALLINT DEFAULT 1,

	client_ip VARBINARY(16) NOT NULL,
	server_ip VARBINARY(16) NOT NULL,

	client_lat VARCHAR(255) NOT NULL,
	server_lat VARCHAR(255) NOT NULL,

	client_lng VARCHAR(255) NOT NULL,
	server_lng VARCHAR(255) NOT NULL,

	created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	
	PRIMARY KEY (uuid),
	FOREIGN KEY (origin) REFERENCES origin(uuid) ON DELETE CASCADE
)

CREATE TABLE origin (
	uuid BINARY(16) NOT NULL,
	title VARCHAR(255) NOT NULL,

	created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	
	UNIQUE (title)
	PRIMARY KEY (uuid)
)

ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;