/*
  Warnings:

  - A unique constraint covering the columns `[alumnoId,tipo]` on the table `Documento` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Alumno" ADD COLUMN     "foto" TEXT;

-- AlterTable
ALTER TABLE "Documento" ALTER COLUMN "estado" SET DEFAULT 'EN_REVISION';

-- CreateIndex
CREATE UNIQUE INDEX "Documento_alumnoId_tipo_key" ON "Documento"("alumnoId", "tipo");
