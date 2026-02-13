CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL DEFAULT 'Empty Task',
    description TEXT,
    assignee TEXT,
    
    status TEXT NOT NULL
        DEFAULT 'blocked'
        CHECK (status IN ('blocked', 'todo', 'in_progress', 'in_review', 'done')),

    priority TEXT NOT NULL
        DEFAULT 'low'
        CHECK(priority IN ('low', 'mid', 'high')),
    
    type TEXT NOT NULL
        DEFAULT 'feature'
        CHECK (type IN ('feature', 'bugfix', 'improvement')),
    
    est_start_date TIMESTAMPTZ NOT NULL,
    est_end_date TIMESTAMPTZ NOT NULL,
    est_duration INT NOT NULL,
    
    archived BOOLEAN NOT NULL DEFAULT FALSE,
    archived_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)