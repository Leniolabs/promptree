-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Instance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "model" TEXT NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'chat',
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "pointer" TEXT NOT NULL,
    "summary" TEXT,
    "output" TEXT,
    "keywords" TEXT
);
