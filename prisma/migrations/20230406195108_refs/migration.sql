-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Instance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "model" TEXT NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'chat',
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '[]',
    "pointer" TEXT NOT NULL,
    "refs" TEXT NOT NULL DEFAULT '[]',
    "summary" TEXT,
    "output" TEXT,
    "keywords" TEXT
);
INSERT INTO "new_Instance" ("content", "created", "id", "keywords", "mode", "model", "output", "pointer", "summary", "title") SELECT "content", "created", "id", "keywords", "mode", "model", "output", "pointer", "summary", "title" FROM "Instance";
DROP TABLE "Instance";
ALTER TABLE "new_Instance" RENAME TO "Instance";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
