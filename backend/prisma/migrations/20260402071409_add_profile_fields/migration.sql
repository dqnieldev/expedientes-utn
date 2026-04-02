-- AlterTable
ALTER TABLE "Alumno" ADD COLUMN     "curp" TEXT,
ADD COLUMN     "estado_civil" TEXT,
ADD COLUMN     "fecha_nacimiento" TIMESTAMP(3),
ADD COLUMN     "lugar_nacimiento" TEXT,
ADD COLUMN     "sexo" TEXT;
