-- AlterTable
ALTER TABLE "Steel" ADD COLUMN     "parent" TEXT[],
ADD COLUMN     "pm" BOOLEAN NOT NULL DEFAULT false;
