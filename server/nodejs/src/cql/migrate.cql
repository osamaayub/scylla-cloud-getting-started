CREATE TABLE IF NOT EXISTS todos.items
(
    id UUID,
    name TEXT,
    completed    BOOLEAN,
    PRIMARY KEY (id)
);