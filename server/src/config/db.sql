CREATE TABLE users
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100)        NOT NULL,
    email      VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255)        NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    position   VARCHAR(32)         NOT NULL
);

-- ALTER TABLE users ADD COLUMN role
-- VARCHAR(32) NOT NULL;

ALTER TABLE users RENAME password TO password_hash;

DELETE
FROM users;

INSERT INTO users (id, name, email, password, position)
VALUES (1, 'Vadym 4', 'test1@test.com', '123456', 'frotend'),
       (2, 'Vadym 1', 'test2@test.com', '3333', 'test'),
       (3, 'Vadym 2', 'test4@test.com', '333412', 'admin');

INSERT INTO users (name, email, password, position)
VALUES ('sasba', 'sasba@sda.sda', '312ne1d221d1', 'admin') RETURNING *;

SELECT *
FROM users;

CREATE TABLE projects
(
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id    INTEGER      NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (owner_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);


SELECT u.name, CONCAT(p.title, '-', p.description) AS projects_info
FROM users AS u
         JOIN projects p on u.id = p.owner_id


SELECT u.name, COUNT(*)
FROM users AS u
         JOIN projects p on u.id = p.owner_id
GROUP BY u.name
    INSERT
INTO users (name, email, password, position)
VALUES ('sasba', 'sasba@sda.sda', '312ne1d221d1', 'admin')
    RETURNING *;

CREATE TABLE profiles
(
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER UNIQUE NOT NULL,
    avatar_url VARCHAR(500),
    bio        TEXT,
    github_url VARCHAR(500),

    FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);


INSERT INTO profiles (name, email, password, position)
VALUES ('Vadym 4', 'test1@test.com', '123456', 'frotend'),
       ('Vadym 1', 'test2@test.com', '3333', 'test'),
       ('Vadym 2', 'test4@test.com', '333412', 'admin');

SELECT CONCAT(u.name, '-', u.position) AS owner_info, pj.title, pr.github_url
FROM users u
         JOIN projects pj on u.id = pj.owner_id
         JOIN profiles pr on u.id = pr.user_id

-- --------

-- *** TASKS ***

SELECT u.name,
       t.title,
       t.sub_title,
       t.description,
       t.priority,
       t.status,
       c.content
FROM tasks AS t
         JOIN users AS u ON t.owner_id = u.id
         JOIN comments AS c ON t.id = c.task_id
WHERE t.id = 2;

SELECT * FROM tasks;

CREATE TABLE tasks
(
    id             SERIAL PRIMARY KEY,
    title          VARCHAR(255) NOT NULL,
    sub_title      VARCHAR(100) NOT NULL,
    description    TEXT,
    priority       VARCHAR(50) DEFAULT 'low',
    status         VARCHAR(50) DEFAULT 'todo',

    owner_id       INTEGER      NOT NULL,
    reporter_id    INTEGER      NOT NULL,
    qa_assignee_id INTEGER      NOT NULL,
    project_id     INTEGER      NOT NULL,
    tag_id         INTEGER      NOT NULL,

    created_at     TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (owner_id)
        REFERENCES users (id)
        ON DELETE CASCADE,

    FOREIGN KEY (reporter_id)
        REFERENCES users (id)
        ON DELETE CASCADE,

    FOREIGN KEY (qa_assignee_id)
        REFERENCES users (id)
        ON DELETE CASCADE,

    FOREIGN KEY (project_id)
        REFERENCES projects (id)
        ON DELETE CASCADE,

    FOREIGN KEY (tag_id)
        REFERENCES tags (id)
        ON DELETE CASCADE
);


INSERT INTO tasks (title,
                   sub_title,
                   description,
                   priority,
                   status,
                   owner_id,
                   reporter_id,
                   qa_assignee_id,
                   project_id,
                   tag_id)
VALUES ('Create new page', 'CRM-1592', 'CRUD page', 'medium', 'in_progress', 3, 3, 3, 1, 2),
       ('Update new page', 'CRM-1491', 'Updarte page', 'low', 'todo', 3, 3, 3, 1, 2) RETURNING *;

-- *** Comments ***
CREATE TABLE comments
(
    id         SERIAL PRIMARY KEY,
    task_id    INTEGER NOT NULL,
    owner_id   INTEGER NOT NULL,

    content    TEXT    NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (task_id)
        REFERENCES tasks (id)
        ON DELETE CASCADE,

    FOREIGN KEY (owner_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);

SELECT * FROM comments;

INSERT INTO comments (task_id,
                      owner_id,
                      content)
VALUES (2, 3, '1111'),
       (2, 3, '2222') RETURNING *;


-- *** ATTACHMENTS ***

DROP TABLE attachments;

CREATE TABLE attachments
(
    id          SERIAL PRIMARY KEY,
    task_id     INTEGER      NOT NULL,
    uploaded_by INTEGER      NOT NULL,
    file_name   VARCHAR(255) NOT NULL,
    file_url    VARCHAR(500) NOT NULL,
    file_size   VARCHAR(50)  NOT NULL,
    uploaded_at TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (task_id)
        REFERENCES tasks (id)
        ON DELETE CASCADE,

    FOREIGN KEY (uploaded_by)
        REFERENCES users (id)
        ON DELETE CASCADE
)


INSERT INTO attachments (
task_id,
uploaded_by,
file_name,
file_url,
file_size
)
VALUES
(1, 3, 'file1', '/static/file1', 3124),
(1, 3, 'file1', '/static/file2', 412)
RETURNING *;

-- *** TAGS ***

CREATE TABLE tags
(
    id    SERIAL PRIMARY KEY,
    name  VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(20)
) INSERT INTO tags (name, color)
VALUES
('PlatformAi', 'yellow'),
('ServiceTags', 'blue')
RETURNING *;


-- *******
