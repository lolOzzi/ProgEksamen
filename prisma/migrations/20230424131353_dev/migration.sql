/*
  Warnings:

  - You are about to drop the column `mal_id` on the `Anime` table. All the data in the column will be lost.
  - Added the required column `image_url` to the `Anime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `Anime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Anime` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Anime" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "score" REAL NOT NULL,
    "listId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Anime_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Anime" ("id", "listId", "rating") SELECT "id", "listId", "rating" FROM "Anime";
DROP TABLE "Anime";
ALTER TABLE "new_Anime" RENAME TO "Anime";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
