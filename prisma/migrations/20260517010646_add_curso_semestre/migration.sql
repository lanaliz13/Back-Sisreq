/*
  Warnings:

  - Added the required column `cursoAtual` to the `Requerimento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semestreAtual` to the `Requerimento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `requerimento` ADD COLUMN `cursoAtual` VARCHAR(191) NOT NULL,
    ADD COLUMN `semestreAtual` VARCHAR(191) NOT NULL;
