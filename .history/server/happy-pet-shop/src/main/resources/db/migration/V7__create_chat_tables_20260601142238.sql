-- ============================================================
-- Chatbot Support System
-- ============================================================

-- 1. Knowledge base for vector search (FAQ, policies, products)
CREATE TABLE IF NOT EXISTS knowledge_embeddings (
    id UUID PRIMARY KEY,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    embedding VECTOR(1536),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Support tickets (when AI hands off to staff)
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    customer_id UUID REFERENCES customers(id),
    staff_id UUID REFERENCES staffs(id),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',  -- PENDING, ACTIVE, CLOSED
    priority VARCHAR(10) DEFAULT 'NORMAL',           -- LOW, NORMAL, HIGH
    category VARCHAR(50),
    customer_message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    assigned_at TIMESTAMP,
    closed_at TIMESTAMP
);

-- 3. Chat messages (full conversation history)
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    sender_type VARCHAR(10) NOT NULL,  -- CUSTOMER, AI, STAFF
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_support_tickets_session ON support_tickets(session_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_staff ON support_tickets(staff_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_embeddings ON knowledge_embeddings USING ivfflat (embedding vector_cosine_ops);
