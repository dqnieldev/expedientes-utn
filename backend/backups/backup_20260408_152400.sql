--
-- PostgreSQL database dump
--

\restrict 26FkZ5Fb0TxILcxBMR0tp9dDJcYc8OxxuVWaUWvGolcTXdYzv6O3FN6fz03Zt1f

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
    'ALUMNO'
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
-- Name: Documento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Documento" (
    id integer NOT NULL,
    tipo text NOT NULL,
    url text NOT NULL,
    estado public."EstadoDocumento" DEFAULT 'EN_REVISION'::public."EstadoDocumento" NOT NULL,
    "alumnoId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
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
1	Daniel Lopez	TIC-310134	Ingeniería en Desarrollo y Gestión de Software	8	ACTIVO	3	2026-04-08 16:17:15.334	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	foto_1775665315639.png
\.


--
-- Data for Name: Documento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Documento" (id, tipo, url, estado, "alumnoId", "createdAt") FROM stdin;
1	ACTA_NACIMIENTO	1775665153241.pdf	EN_REVISION	1	2026-04-08 16:19:13.245
\.


--
-- Data for Name: Usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Usuario" (id, email, password, role, "createdAt", "mustChangePassword", "resetToken", "resetTokenExpiry") FROM stdin;
3	darkcabrera@gmail.com	$2b$10$c5sbdyhEHFp/a9fMVsmdqu2AiqdSU91gUi9yPYTnSfQ1eqtX/GgtW	ALUMNO	2026-04-08 16:17:15.332	f	\N	\N
2	tic-310134@utnay.edu.mx	$2b$10$eIJdbNDLMsVYh/xTUhxZSO15z.28bi3pw5NHXKVZOLh.faK3nn9EC	ADMIN	2026-04-08 16:14:44.473	f	\N	\N
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
6d27ddbd-eb49-4f71-9fef-8c3c26054b74	fd677e88db6eefded0cf1232a9c06ee0dcd21b769bfd37678c8f259a75b057d5	2026-04-08 10:05:06.619534-06	20260331213809_init_usuario	\N	\N	2026-04-08 10:05:06.611496-06	1
2d5768bf-50a8-4604-b442-613db5270cc8	6f0a34e0df4ebb8c2155ecbe98fb4462ca2838e8952999e83f3a426ae70d6854	2026-04-08 10:05:06.63032-06	20260331224828_add_alumno_model	\N	\N	2026-04-08 10:05:06.62011-06	1
2fd40d1a-8bc1-4e85-9fab-8a32f9f27b75	fabcea60d8952de5683ad56a2fae255f8d3f627caae6da31593c9ff140e0c4ba	2026-04-08 10:05:06.637876-06	20260331231928_add_documento_model	\N	\N	2026-04-08 10:05:06.630828-06	1
4119b12f-dc00-4cd9-b335-0c598a6aa6da	9ef9a5e0bb5ccdca47a0ba5ef11d2664af0ebd4a64ae63f01f0ccc07b629946a	2026-04-08 10:05:06.640207-06	20260402001721_add_must_change_password	\N	\N	2026-04-08 10:05:06.638482-06	1
906a0a71-9e45-4a48-82c1-cfd067b4ac9f	7955901b72c23942c44f97961f06dddbd29043f708955fdc0d3a9a619e531bb2	2026-04-08 10:05:06.642253-06	20260402071409_add_profile_fields	\N	\N	2026-04-08 10:05:06.640675-06	1
ed69aeb5-37be-4d70-bf0c-23e7010952d3	85b35ec3c820515af32e0d513dc2daf623b199a8256231d6fd3d63b58be9dc6d	2026-04-08 10:05:06.644207-06	20260402172651_fix_profile_fields	\N	\N	2026-04-08 10:05:06.642719-06	1
771ef2a0-54ef-4d3a-a1ec-3051f0da2ac2	e0d483c01e0cff8d824ece2c13a158ff1e648368d05d70f9087bdc4ede722730	2026-04-08 10:05:06.646175-06	20260403062310_add_en_revison	\N	\N	2026-04-08 10:05:06.644649-06	1
2be2196f-a490-4b98-8850-8afe79039f0e	83e0e2b8078eadbed21c7eacff1ac3c07484dfbfa3ca6c49596ecb2666cb120f	2026-04-08 10:05:49.532467-06	20260408160549_add_reset_token	\N	\N	2026-04-08 10:05:49.521111-06	1
\.


--
-- Name: Alumno_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Alumno_id_seq"', 1, true);


--
-- Name: Documento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Documento_id_seq"', 1, true);


--
-- Name: Usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Usuario_id_seq"', 3, true);


--
-- Name: Alumno Alumno_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Alumno"
    ADD CONSTRAINT "Alumno_pkey" PRIMARY KEY (id);


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
-- Name: Alumno_matricula_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Alumno_matricula_key" ON public."Alumno" USING btree (matricula);


--
-- Name: Alumno_usuarioId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Alumno_usuarioId_key" ON public."Alumno" USING btree ("usuarioId");


--
-- Name: Documento_alumnoId_tipo_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Documento_alumnoId_tipo_key" ON public."Documento" USING btree ("alumnoId", tipo);


--
-- Name: Usuario_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Usuario_email_key" ON public."Usuario" USING btree (email);


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

\unrestrict 26FkZ5Fb0TxILcxBMR0tp9dDJcYc8OxxuVWaUWvGolcTXdYzv6O3FN6fz03Zt1f

