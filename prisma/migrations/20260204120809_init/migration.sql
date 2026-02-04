-- CreateTable
CREATE TABLE "Steel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "producer" TEXT NOT NULL,
    "C" DOUBLE PRECISION NOT NULL,
    "Cr" DOUBLE PRECISION NOT NULL,
    "V" DOUBLE PRECISION NOT NULL,
    "Mo" DOUBLE PRECISION NOT NULL,
    "W" DOUBLE PRECISION NOT NULL,
    "Co" DOUBLE PRECISION NOT NULL,
    "edge" DOUBLE PRECISION NOT NULL,
    "toughness" DOUBLE PRECISION NOT NULL,
    "corrosion" DOUBLE PRECISION NOT NULL,
    "sharpen" DOUBLE PRECISION NOT NULL,
    "ht_curve" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "use_case" TEXT NOT NULL,
    "pros" TEXT[],
    "cons" TEXT[],

    CONSTRAINT "Steel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Knife" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "maker" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "whySpecial" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "Knife_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Glossary" (
    "id" SERIAL NOT NULL,
    "term" TEXT NOT NULL,
    "def" TEXT NOT NULL,

    CONSTRAINT "Glossary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQ" (
    "id" SERIAL NOT NULL,
    "q" TEXT NOT NULL,
    "a" TEXT NOT NULL,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "coords" DOUBLE PRECISION[],
    "region" TEXT NOT NULL,
    "desc" TEXT NOT NULL,

    CONSTRAINT "Producer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SteelToKnife" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SteelToKnife_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SteelToKnife_B_index" ON "_SteelToKnife"("B");

-- AddForeignKey
ALTER TABLE "_SteelToKnife" ADD CONSTRAINT "_SteelToKnife_A_fkey" FOREIGN KEY ("A") REFERENCES "Knife"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SteelToKnife" ADD CONSTRAINT "_SteelToKnife_B_fkey" FOREIGN KEY ("B") REFERENCES "Steel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
