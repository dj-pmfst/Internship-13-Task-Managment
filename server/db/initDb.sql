CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL DEFAULT 'Empty Task',
    description TEXT DEFAULT NULL,
    assignee TEXT DEFAULT NULL,
    
    status TEXT NOT NULL
        DEFAULT 'blocked'
        CHECK (status IN ('blocked', 'todo', 'in_progress', 'in_review', 'done')),

    priority TEXT NOT NULL
        DEFAULT 'low'
        CHECK(priority IN ('low', 'mid', 'high')),
    
    type TEXT NOT NULL
        DEFAULT 'feature'
        CHECK (type IN ('feature', 'bugfix', 'improvement')),
    
    est_start_date TIMESTAMPTZ DEFAULT NULL,
    est_end_date TIMESTAMPTZ DEFAULT NULL,
    est_duration INT DEFAULT NULL,
    
    archived BOOLEAN NOT NULL DEFAULT FALSE,
    archived_at TIMESTAMPTZ DEFAULT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_archived_true
ON tasks(created_at)
WHERE archived = true;