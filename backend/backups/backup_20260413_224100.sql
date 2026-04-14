--
-- PostgreSQL database dump
--

\restrict DJYFkn13ULwVQnAEvWf8Ai5G9IB7SJvVq93q6GsTbdEUnZG33eWfkUrvcaLfNGA

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: EstadoDocumento; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EstadoDocumento" AS ENUM (
    'PENDIENTE',
    'APROBADO',
    'RECHAZADO',
    'EN_REVISION'
);


ALTER TYPE public."EstadoDocumento" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'ALUMNO',
    'DEVELOPER'
);


ALTER TYPE public."Role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Alumno; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Alumno" (
    id integer NOT NULL,
    nombre text NOT NULL,
    matricula text NOT NULL,
    carrera text NOT NULL,
    cuatrimestre_actual integer NOT NULL,
    estado text DEFAULT 'ACTIVO'::text NOT NULL,
    "usuarioId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    curp text,
    estado_civil text,
    fecha_nacimiento timestamp(3) without time zone,
    lugar_nacimiento text,
    sexo text,
    calle text,
    ciudad text,
    codigo_postal text,
    colonia text,
    estado_direccion text,
    numero text,
    telefono text,
    foto text
);


ALTER TABLE public."Alumno" OWNER TO postgres;

--
-- Name: Alumno_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Alumno_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Alumno_id_seq" OWNER TO postgres;

--
-- Name: Alumno_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Alumno_id_seq" OWNED BY public."Alumno".id;


--
-- Name: AuditLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AuditLog" (
    id integer NOT NULL,
    accion text NOT NULL,
    entidad text NOT NULL,
    "entidadId" integer,
    detalle text,
    "usuarioId" integer,
    ip text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AuditLog" OWNER TO postgres;

--
-- Name: AuditLog_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."AuditLog_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."AuditLog_id_seq" OWNER TO postgres;

--
-- Name: AuditLog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."AuditLog_id_seq" OWNED BY public."AuditLog".id;


--
-- Name: Documento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Documento" (
    id integer NOT NULL,
    tipo text NOT NULL,
    url text NOT NULL,
    estado public."EstadoDocumento" DEFAULT 'EN_REVISION'::public."EstadoDocumento" NOT NULL,
    "alumnoId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "razonRechazo" text
);


ALTER TABLE public."Documento" OWNER TO postgres;

--
-- Name: Documento_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Documento_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Documento_id_seq" OWNER TO postgres;

--
-- Name: Documento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Documento_id_seq" OWNED BY public."Documento".id;


--
-- Name: Usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Usuario" (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role public."Role" DEFAULT 'ALUMNO'::public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "mustChangePassword" boolean DEFAULT true NOT NULL,
    "resetToken" text,
    "resetTokenExpiry" timestamp(3) without time zone
);


ALTER TABLE public."Usuario" OWNER TO postgres;

--
-- Name: Usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Usuario_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Usuario_id_seq" OWNER TO postgres;

--
-- Name: Usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Usuario_id_seq" OWNED BY public."Usuario".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Alumno id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Alumno" ALTER COLUMN id SET DEFAULT nextval('public."Alumno_id_seq"'::regclass);


--
-- Name: AuditLog id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog" ALTER COLUMN id SET DEFAULT nextval('public."AuditLog_id_seq"'::regclass);


--
-- Name: Documento id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Documento" ALTER COLUMN id SET DEFAULT nextval('public."Documento_id_seq"'::regclass);


--
-- Name: Usuario id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuario" ALTER COLUMN id SET DEFAULT nextval('public."Usuario_id_seq"'::regclass);


--
-- Data for Name: Alumno; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Alumno" (id, nombre, matricula, carrera, cuatrimestre_actual, estado, "usuarioId", "createdAt", curp, estado_civil, fecha_nacimiento, lugar_nacimiento, sexo, calle, ciudad, codigo_postal, colonia, estado_direccion, numero, telefono, foto) FROM stdin;
\.


--
-- Data for Name: AuditLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AuditLog" (id, accion, entidad, "entidadId", detalle, "usuarioId", ip, "createdAt") FROM stdin;
1	LOGIN_FALLIDO	AUTH	\N	Intento fallido — darkcabrera@gmail.com	\N	::1	2026-04-14 05:21:01.642
2	LOGIN_FALLIDO	AUTH	\N	Intento fallido — darkcabrera@gmail.com	\N	::1	2026-04-14 05:21:02.898
3	LOGIN_FALLIDO	AUTH	\N	Intento fallido — darkcabrera@gmail.com	\N	::1	2026-04-14 05:21:15.909
4	LOGIN_FALLIDO	AUTH	\N	Intento fallido — tic-310134@utnay.edu.mx	\N	::1	2026-04-14 05:21:25.73
5	LOGIN_FALLIDO	AUTH	\N	Intento fallido — tic-310134@utnay.edu.mx	\N	::1	2026-04-14 05:21:26.745
6	LOGIN	AUTH	2	Login exitoso — paperlessutndev@gmail.com (DEVELOPER)	2	::1	2026-04-14 05:37:17.291
7	LOGIN	AUTH	2	Login exitoso — paperlessutndev@gmail.com (DEVELOPER)	2	::1	2026-04-14 05:39:38.316
\.


--
-- Data for Name: Documento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Documento" (id, tipo, url, estado, "alumnoId", "createdAt", "razonRechazo") FROM stdin;
\.


--
-- Data for Name: Usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Usuario" (id, email, password, role, "createdAt", "mustChangePassword", "resetToken", "resetTokenExpiry") FROM stdin;
1	tic-3103134@utnay.edu.mx	$2b$10$AyAEPkwnWf30J/KYpbbzEOmE4KXSzobYsyofQBuC/8LlM7bvbtlg2	ADMIN	2026-04-14 05:20:32.348	f	\N	\N
2	paperlessutndev@gmail.com	$2b$12$Imsb7IVWkCyc0IEpau8zSeB0LEFcME2QaqaUjfFhCOyv.ob6Ttuk2	DEVELOPER	2026-04-14 05:33:36.891	f	\N	\N
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
ca36ae47-04ac-48b0-8202-75bd733a6b23	fd677e88db6eefded0cf1232a9c06ee0dcd21b769bfd37678c8f259a75b057d5	2026-04-13 23:20:30.716439-06	20260331213809_init_usuario	\N	\N	2026-04-13 23:20:30.708833-06	1
1f86fe47-e587-43b7-a8c6-0d078fa2962c	6f0a34e0df4ebb8c2155ecbe98fb4462ca2838e8952999e83f3a426ae70d6854	2026-04-13 23:20:30.727223-06	20260331224828_add_alumno_model	\N	\N	2026-04-13 23:20:30.716963-06	1
371a1dd8-f858-4aa6-aa3e-21573e5e1d06	fabcea60d8952de5683ad56a2fae255f8d3f627caae6da31593c9ff140e0c4ba	2026-04-13 23:20:30.734469-06	20260331231928_add_documento_model	\N	\N	2026-04-13 23:20:30.72776-06	1
ccd42796-d5e9-4cd4-82f0-c393b51138b5	9ef9a5e0bb5ccdca47a0ba5ef11d2664af0ebd4a64ae63f01f0ccc07b629946a	2026-04-13 23:20:30.736798-06	20260402001721_add_must_change_password	\N	\N	2026-04-13 23:20:30.735008-06	1
203639cf-c73e-49b7-a563-a97762e786b3	7955901b72c23942c44f97961f06dddbd29043f708955fdc0d3a9a619e531bb2	2026-04-13 23:20:30.738912-06	20260402071409_add_profile_fields	\N	\N	2026-04-13 23:20:30.737277-06	1
3ab0d3bb-bf5c-4772-a262-4c3b301eef4f	85b35ec3c820515af32e0d513dc2daf623b199a8256231d6fd3d63b58be9dc6d	2026-04-13 23:20:30.740974-06	20260402172651_fix_profile_fields	\N	\N	2026-04-13 23:20:30.739415-06	1
d10c5d48-c699-435c-8650-606531c4bb23	e0d483c01e0cff8d824ece2c13a158ff1e648368d05d70f9087bdc4ede722730	2026-04-13 23:20:30.742669-06	20260403062310_add_en_revison	\N	\N	2026-04-13 23:20:30.741386-06	1
53f82d08-2e0b-4557-b291-b3bbbf80612f	3fe2c093cb375818386ffb0c31864b44e88429d3c17d44ad5407cd700203de42	2026-04-13 23:20:30.745536-06	20260408160549_add_reset_token	\N	\N	2026-04-13 23:20:30.743138-06	1
b7eea513-2787-4409-8c55-1d4dd2ed8dd7	069cbe263e696d7385c94a0290c0127c9fad1e4ae91d137fd100cd1f7039688f	2026-04-13 23:20:31.610422-06	20260414052031_add_developer_role	\N	\N	2026-04-13 23:20:31.582718-06	1
\.


--
-- Name: Alumno_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Alumno_id_seq"', 1, false);


--
-- Name: AuditLog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."AuditLog_id_seq"', 7, true);


--
-- Name: Documento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Documento_id_seq"', 1, false);


--
-- Name: Usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Usuario_id_seq"', 2, true);


--
-- Name: Alumno Alumno_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Alumno"
    ADD CONSTRAINT "Alumno_pkey" PRIMARY KEY (id);


--
-- Name: AuditLog AuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY (id);


--
-- Name: Documento Documento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Documento"
    ADD CONSTRAINT "Documento_pkey" PRIMARY KEY (id);


--
-- Name: Usuario Usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuario"
    ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Alumno_carrera_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Alumno_carrera_idx" ON public."Alumno" USING btree (carrera);


--
-- Name: Alumno_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Alumno_createdAt_idx" ON public."Alumno" USING btree ("createdAt");


--
-- Name: Alumno_estado_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Alumno_estado_idx" ON public."Alumno" USING btree (estado);


--
-- Name: Alumno_matricula_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Alumno_matricula_key" ON public."Alumno" USING btree (matricula);


--
-- Name: Alumno_usuarioId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Alumno_usuarioId_key" ON public."Alumno" USING btree ("usuarioId");


--
-- Name: AuditLog_accion_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AuditLog_accion_idx" ON public."AuditLog" USING btree (accion);


--
-- Name: AuditLog_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AuditLog_createdAt_idx" ON public."AuditLog" USING btree ("createdAt");


--
-- Name: AuditLog_usuarioId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AuditLog_usuarioId_idx" ON public."AuditLog" USING btree ("usuarioId");


--
-- Name: Documento_alumnoId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Documento_alumnoId_idx" ON public."Documento" USING btree ("alumnoId");


--
-- Name: Documento_alumnoId_tipo_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Documento_alumnoId_tipo_key" ON public."Documento" USING btree ("alumnoId", tipo);


--
-- Name: Documento_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Documento_createdAt_idx" ON public."Documento" USING btree ("createdAt");


--
-- Name: Documento_estado_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Documento_estado_idx" ON public."Documento" USING btree (estado);


--
-- Name: Usuario_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Usuario_email_key" ON public."Usuario" USING btree (email);


--
-- Name: Usuario_role_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Usuario_role_idx" ON public."Usuario" USING btree (role);


--
-- Name: Alumno Alumno_usuarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Alumno"
    ADD CONSTRAINT "Alumno_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public."Usuario"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Documento Documento_alumnoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Documento"
    ADD CONSTRAINT "Documento_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES public."Alumno"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict DJYFkn13ULwVQnAEvWf8Ai5G9IB7SJvVq93q6GsTbdEUnZG33eWfkUrvcaLfNGA

