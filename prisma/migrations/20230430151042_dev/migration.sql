/*
  Warnings:

  - You are about to alter the column `mal_id` on the `Anime` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Anime" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mal_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "score" REAL NOT NULL,
    "listId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Anime_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Anime" ("id", "image_url", "listId", "mal_id", "rating", "score", "title") SELECT "id", "image_url", "listId", "mal_id", "rating", "score", "title" FROM "Anime";
DROP TABLE "Anime";
ALTER TABLE "new_Anime" RENAME TO "Anime";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
