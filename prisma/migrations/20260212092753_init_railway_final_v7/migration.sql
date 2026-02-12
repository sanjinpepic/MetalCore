-- AlterTable
ALTER TABLE "FAQ" ADD COLUMN     "category" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Glossary" ADD COLUMN     "category" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "level" TEXT NOT NULL DEFAULT '';
