-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'DEVELOPER';

-- AlterTable
ALTER TABLE "Documento" ADD COLUMN     "razonRechazo" TEXT;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "accion" TEXT NOT NULL,
    "entidad" TEXT NOT NULL,
    "entidadId" INTEGER,
    "detalle" TEXT,
    "usuarioId" INTEGER,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuditLog_accion_idx" ON "AuditLog"("accion");

-- CreateIndex
CREATE INDEX "AuditLog_usuarioId_idx" ON "AuditLog"("usuarioId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "Alumno_estado_idx" ON "Alumno"("estado");

-- CreateIndex
CREATE INDEX "Alumno_carrera_idx" ON "Alumno"("carrera");

-- CreateIndex
CREATE INDEX "Alumno_createdAt_idx" ON "Alumno"("createdAt");

-- CreateIndex
CREATE INDEX "Documento_estado_idx" ON "Documento"("estado");

-- CreateIndex
CREATE INDEX "Documento_alumnoId_idx" ON "Documento"("alumnoId");

-- CreateIndex
CREATE INDEX "Documento_createdAt_idx" ON "Documento"("createdAt");

-- CreateIndex
CREATE INDEX "Usuario_role_idx" ON "Usuario"("role");
