# Esquema de datos (Prisma)

```prisma
model Usuario {
  id                 Int       @id @default(autoincrement())
  email              String    @unique
  password           String
  role               Role      @default(ALUMNO)
  mustChangePassword Boolean   @default(true)
  resetToken         String?
  resetTokenExpiry   DateTime?
  alumno             Alumno?
  createdAt          DateTime  @default(now())
  @@index([role])
}

model Alumno {
  id                  Int         @id @default(autoincrement())
  nombre              String
  matricula           String      @unique
  carrera             String
  cuacuatrimestre_actual Int
  estado              String      @default("ACTIVO")
  foto                String?
  curp                String?
  fecha_nacimiento    DateTime?
  lugar_nacimiento    String?
  sexo                String?
  estado_civil        String?
  calle               String?
  numero              String?
  colonia             String?
  codigo_postal       String?
  telefono            String?
  ciudad              String?
  estado_direccion    String?
  documentos          Documento[]
  usuarioId           Int         @unique
  usuario             Usuario     @relation(fields: [usuarioId], references: [id])
  createdAt           DateTime    @default(now())
  @@index([estado])
  @@index([carrera])
  @@index([createdAt])
}

model Documento {
  id           Int             @id @default(autoincrement())
  tipo         String
  url          String
  estado       EstadoDocumento @default(EN_REVISION)
  razonRechazo String?
  alumnoId     Int
  alumno       Alumno          @relation(fields: [alumnoId], references: [id])
  createdAt    DateTime        @default(now())
  @@unique([alumnoId, tipo])
  @@index([estado])
  @@index([alumnoId])
  @@index([createdAt])
}

model AuditLog {
  id        Int      @id @default(autoincrement())
  accion    String
  entidad   String
  entidadId Int?
  detalle   String?
  usuarioId Int?
  ip        String?
  createdAt DateTime @default(now())
  @@index([accion])
  @@index([usuarioId])
  @@index([createdAt])
}

enum EstadoDocumento { PENDIENTE EN_REVISION APROBADO RECHAZADO }
enum Role { ADMIN ALUMNO DEVELOPER }
```

## Acciones de auditoría registradas
`LOGIN` · `LOGIN_FALLIDO` · `CREAR_ALUMNO` · `ELIMINAR_ALUMNO` · `CAMBIAR_ESTADO_ALUMNO` · `APROBAR_DOCUMENTO` · `RECHAZAR_DOCUMENTO` · `ACTUALIZAR_DOCUMENTO` · `CREAR_BACKUP`

Relevante para [[Modulo-Analitica]] (variables de entrada) y para [[App-Android]] (qué mostrar en pantallas de consulta).
