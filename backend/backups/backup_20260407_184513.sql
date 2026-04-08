--
-- PostgreSQL database dump
--

\restrict S2A0PoSLJkYtMCS7rtpJEdORtYzXORU3bgB84igcQoGmobeYyyMfq9aIPKKaEvQ

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
    "mustChangePassword" boolean DEFAULT true NOT NULL
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
1	Juan Perez	UTN001	Ingeniería en Software	5	BAJA	1	2026-03-31 22:56:48.681	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
3	Alumno Prueba	UTN999	Ingeniería	1	ACTIVO	6	2026-04-02 01:23:03.544	\N	\N	\N	Tepic	\N	\N	\N	\N	\N	\N	\N	\N	\N
4	Grecia Villalobos Paredes	UTN777	Administración de Empresas	9	ACTIVO	7	2026-04-07 00:24:41.114	VIPG031217MNTLRRA8	Casado/a	2003-12-17 00:00:00	Tepic	Femenino	Persimo	Tepic	63037	Tulipanes	Nayarit	67	3111389666	foto_1775525779624.jpg
2	Daniel Lopez	UTN002	Ingeniería en Software	5	ACTIVO	4	2026-04-02 00:49:45.529	LOCL040625HNTPBSA9	Soltero/a	2000-03-30 00:00:00	Tepic	Masculino	1ro de Mayo	Jamaica	63050	Mololoa	CDMX	60	3112903814	foto_1775280687535.png
5	Samantha Beltrán Peña	UTN067	Contaduría	1	ACTIVO	8	2026-04-07 04:51:57.951	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: Documento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Documento" (id, tipo, url, estado, "alumnoId", "createdAt") FROM stdin;
1	ACTA_NACIMIENTO	archivo.pdf	APROBADO	1	2026-04-01 19:03:58.76
7	CERTIFICADO	1775197869575.pdf	APROBADO	2	2026-04-03 06:31:09.58
8	CURP	1775281511943.pdf	RECHAZADO	2	2026-04-04 05:45:11.947
10	ACTA_NACIMIENTO	1775521583053.pdf	EN_REVISION	4	2026-04-07 00:26:23.057
11	CONSTANCIA	1775537239132.pdf	APROBADO	2	2026-04-07 04:47:19.136
4	ACTA_NACIMIENTO	1775285294652.pdf	RECHAZADO	2	2026-04-03 05:38:40.066
\.


--
-- Data for Name: Usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Usuario" (id, email, password, role, "createdAt", "mustChangePassword") FROM stdin;
1	test@test.com	$2b$10$.qb.YnTQyslTNYKS86nu3e0O/eMhGEpkfmLjmwEUzrwJzYHVwjBK.	ADMIN	2026-03-31 22:13:13.267	t
3	admin@utn.com	$2b$10$JAfKrJgk4VBl9fylv/K0NOzeFQf3TY.j3VxkhDKIYd1/sZoiN2dbu	ADMIN	2026-04-02 00:46:45.119	f
5	jose@utn.com	$2b$10$YWP7D/GLhsxtamwG.VcDveiV0/8WPpFQ1cgL8s01eqfitXCOVy6dm	ALUMNO	2026-04-02 01:08:49.07	f
6	alumno@test.com	$2b$10$/W8ioez9qxGLbmG1QzXBq.sfImCPjatyyfqtCeKAME5dIumqv3Ihq	ALUMNO	2026-04-02 01:23:03.542	f
4	Danieln@test.com	$2b$10$My2k/cN./SiS2Yq9ROxx0u5Z1a0PX2R8XcohisAJvTvKS0w8kFCre	ALUMNO	2026-04-02 00:49:45.527	f
7	grecia@utn.com	$2b$10$hBAA3RNMak4X76NOqos0XeVtVuMYW09OFNPMS5FXDc56IcmKYpG3G	ALUMNO	2026-04-07 00:24:41.108	t
8	sam@utn.com	$2b$10$qgdVtT5wNhEYlmbEi.5lVu.2LPmoiE7HMiwANNKaAc.e0MJP0m.n6	ALUMNO	2026-04-07 04:51:57.949	t
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
5ebafa04-2be1-40ad-abba-9bfcb7c68909	fd677e88db6eefded0cf1232a9c06ee0dcd21b769bfd37678c8f259a75b057d5	2026-03-31 15:38:09.901624-06	20260331213809_init_usuario	\N	\N	2026-03-31 15:38:09.856139-06	1
3594d63b-f0cc-4ebb-9499-eae50c4a02c0	6f0a34e0df4ebb8c2155ecbe98fb4462ca2838e8952999e83f3a426ae70d6854	2026-03-31 16:48:28.305216-06	20260331224828_add_alumno_model	\N	\N	2026-03-31 16:48:28.266736-06	1
d99a1fca-cea3-470a-97b6-7f7a02bc8adc	fabcea60d8952de5683ad56a2fae255f8d3f627caae6da31593c9ff140e0c4ba	2026-03-31 17:19:28.389721-06	20260331231928_add_documento_model	\N	\N	2026-03-31 17:19:28.342215-06	1
b3fd6dfa-dee5-4eb7-95ae-1edc90300a2e	9ef9a5e0bb5ccdca47a0ba5ef11d2664af0ebd4a64ae63f01f0ccc07b629946a	2026-04-01 18:17:21.286237-06	20260402001721_add_must_change_password	\N	\N	2026-04-01 18:17:21.258762-06	1
d0561c88-31bc-4985-bdbe-3ce203e6dee2	7955901b72c23942c44f97961f06dddbd29043f708955fdc0d3a9a619e531bb2	2026-04-02 01:14:09.530272-06	20260402071409_add_profile_fields	\N	\N	2026-04-02 01:14:09.516724-06	1
992cfb0c-0d72-4941-b09b-03b2e7e97c78	85b35ec3c820515af32e0d513dc2daf623b199a8256231d6fd3d63b58be9dc6d	2026-04-02 11:26:51.575994-06	20260402172651_fix_profile_fields	\N	\N	2026-04-02 11:26:51.56386-06	1
5cfad72e-59ac-4f79-a2e9-acfe20f0bed0	e0d483c01e0cff8d824ece2c13a158ff1e648368d05d70f9087bdc4ede722730	2026-04-03 00:23:10.655977-06	20260403062310_add_en_revison	\N	\N	2026-04-03 00:23:10.652614-06	1
\.


--
-- Name: Alumno_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Alumno_id_seq"', 5, true);


--
-- Name: Documento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Documento_id_seq"', 11, true);


--
-- Name: Usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Usuario_id_seq"', 8, true);


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
-- PostgreSQL database dump complete
--

\unrestrict S2A0PoSLJkYtMCS7rtpJEdORtYzXORU3bgB84igcQoGmobeYyyMfq9aIPKKaEvQ

