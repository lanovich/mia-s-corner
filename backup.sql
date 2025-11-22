--
-- PostgreSQL database dump
--

\restrict FImAPx0SB9IQCTvqio8mpFkWFaN8L1JMpvqA1ngjT96H9Ydjh6dLTzTjhGTVU6Z

-- Dumped from database version 18.0 (Debian 18.0-1.pgdg13+3)
-- Dumped by pg_dump version 18.0 (Homebrew)

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
-- Name: ORDER_STATUS; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ORDER_STATUS" AS ENUM (
    'SUCCEEDED',
    'CANCELLED',
    'PENDING'
);


ALTER TYPE public."ORDER_STATUS" OWNER TO postgres;

--
-- Name: order_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_status AS ENUM (
    'PENDING',
    'SUCCEEDED',
    'CANCELLED'
);


ALTER TYPE public.order_status OWNER TO postgres;

--
-- Name: add_to_cart(text, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.add_to_cart(p_token text, p_product_id integer, p_size_id integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_cart_id INT;
  v_existing_item_id INT;
  v_existing_quantity INT;
BEGIN
  -- Находим корзину по токену
  SELECT id INTO v_cart_id
  FROM "cart"
  WHERE token = p_token;

  -- Если корзины нет, создаём её
  IF v_cart_id IS NULL THEN
    INSERT INTO "cart" (token)
    VALUES (p_token)
    RETURNING id INTO v_cart_id;
  END IF;

  -- Проверяем, есть ли уже такой товар в корзине
  SELECT id, quantity INTO v_existing_item_id, v_existing_quantity
  FROM "cartItem"
  WHERE cart_id = v_cart_id
    AND product_id = p_product_id
    AND size_id = p_size_id;

  -- Если товар уже есть, увеличиваем количество
  IF v_existing_item_id IS NOT NULL THEN
    UPDATE "cartItem"
    SET quantity = v_existing_quantity + 1
    WHERE id = v_existing_item_id;
  ELSE
    -- Если товара нет, добавляем его
    INSERT INTO "cartItem" (cart_id, product_id, size_id, quantity)
    VALUES (v_cart_id, p_product_id, p_size_id, 1);
  END IF;
END;
$$;


ALTER FUNCTION public.add_to_cart(p_token text, p_product_id integer, p_size_id integer) OWNER TO postgres;

--
-- Name: get_cart_with_items(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_cart_with_items(cart_token uuid) RETURNS TABLE(id uuid, user_id integer, totalamount numeric, token uuid, created_at timestamp with time zone, updated_at timestamp with time zone, items json)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY 
    SELECT 
        c.id,
        c.user_id,
        c.totalamount,
        c.token,
        c.created_at,
        c.updated_at,
        json_agg(
            json_build_object(
                'quantity', ci.quantity,
                'product', json_build_object(
                    'id', p.id,
                    'title', p.title,
                    'compound', p.compound,
                    'size', p.size,
                    'price', p.price,
                    'category_id', p.category_id,
                    'image_url', p.image_url
                )
            )
        ) AS items
    FROM cart c
    LEFT JOIN cartItem ci ON c.id = ci.cart_id
    LEFT JOIN products p ON ci.product_id = p.id
    WHERE c.token = cart_token
    GROUP BY c.id;
END;
$$;


ALTER FUNCTION public.get_cart_with_items(cart_token uuid) OWNER TO postgres;

--
-- Name: get_random_product(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_random_product() RETURNS TABLE(slug text, category_slug text)
    LANGUAGE sql
    AS $$
  select slug, category_slug
  from products
  order by random()
  limit 1;
$$;


ALTER FUNCTION public.get_random_product() OWNER TO postgres;

--
-- Name: update_compound(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_compound() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE products
  SET compound = (
    SELECT STRING_AGG(smells.name, ', ')
    FROM product_smells
    JOIN smells ON product_smells.smell_id = smells.id
    WHERE product_smells.product_id = NEW.product_id
  )
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_compound() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart (
    id integer NOT NULL,
    token text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    "fullPrice" numeric(10,2) DEFAULT 0 NOT NULL
);


ALTER TABLE public.cart OWNER TO postgres;

--
-- Name: cartItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."cartItem" (
    id integer NOT NULL,
    cart_id integer,
    product_id integer,
    quantity integer NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    size_id integer,
    CONSTRAINT "cartItem_quantity_check" CHECK ((quantity > 0))
);


ALTER TABLE public."cartItem" OWNER TO postgres;

--
-- Name: cartItem_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."cartItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."cartItem_id_seq" OWNER TO postgres;

--
-- Name: cartItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."cartItem_id_seq" OWNED BY public."cartItem".id;


--
-- Name: cart_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_id_seq OWNER TO postgres;

--
-- Name: cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_id_seq OWNED BY public.cart.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name text NOT NULL,
    slug text,
    image text,
    "order" numeric
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: histories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.histories (
    title text NOT NULL,
    id integer NOT NULL,
    description text,
    "order" integer,
    history_slug text,
    "imageUrl" text
);


ALTER TABLE public.histories OWNER TO postgres;

--
-- Name: histories_new_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.histories_new_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.histories_new_id_seq OWNER TO postgres;

--
-- Name: histories_new_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.histories_new_id_seq OWNED BY public.histories.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    phone text NOT NULL,
    email text NOT NULL,
    wishes text,
    comment text,
    token text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    items jsonb,
    "fullPrice" numeric,
    "paymentId" text,
    status public.order_status DEFAULT 'PENDING'::public.order_status,
    delivery_method text,
    delivery_price integer,
    city text,
    street text,
    building text,
    porch text,
    sfloor text,
    sflat text
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: product_detail_links; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_detail_links (
    product_id integer NOT NULL,
    detail_id integer NOT NULL
);


ALTER TABLE public.product_detail_links OWNER TO postgres;

--
-- Name: product_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_details (
    id integer NOT NULL,
    category_slug text,
    details jsonb
);


ALTER TABLE public.product_details OWNER TO postgres;

--
-- Name: product_details_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_details_id_seq OWNER TO postgres;

--
-- Name: product_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_details_id_seq OWNED BY public.product_details.id;


--
-- Name: product_sizes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_sizes (
    product_id integer NOT NULL,
    size_id integer NOT NULL,
    price numeric,
    "oldPrice" numeric,
    quantity_in_stock integer,
    is_default boolean,
    id integer NOT NULL
);


ALTER TABLE public.product_sizes OWNER TO postgres;

--
-- Name: product_sizes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.product_sizes ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.product_sizes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: product_smells; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_smells (
    product_id integer NOT NULL,
    smell_id uuid NOT NULL
);


ALTER TABLE public.product_smells OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    title text NOT NULL,
    history_id integer,
    category_id integer,
    compound text,
    slug text,
    category_slug text,
    scent_pyramid json,
    description text,
    images jsonb,
    measure text DEFAULT '''мл'':text'::text,
    episode text,
    episode_number numeric,
    search tsvector GENERATED ALWAYS AS ((setweight(to_tsvector('russian'::regconfig, COALESCE(title, ''::text)), 'A'::"char") || setweight(to_tsvector('russian'::regconfig, COALESCE(compound, ''::text)), 'B'::"char"))) STORED,
    CONSTRAINT products_measure_check CHECK ((measure = ANY (ARRAY['мл'::text, 'г'::text, 'кг'::text, 'л'::text, 'мг'::text, 'шт'::text])))
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: sizes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sizes (
    size numeric NOT NULL,
    time_of_exploitation numeric NOT NULL,
    dimensions jsonb NOT NULL,
    id integer NOT NULL,
    category_name text
);


ALTER TABLE public.sizes OWNER TO postgres;

--
-- Name: sizes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sizes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sizes_id_seq OWNER TO postgres;

--
-- Name: sizes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sizes_id_seq OWNED BY public.sizes.id;


--
-- Name: smells; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.smells (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.smells OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    phone_number text NOT NULL,
    password text NOT NULL,
    registered_at timestamp without time zone DEFAULT now(),
    role_id integer
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: cart id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart ALTER COLUMN id SET DEFAULT nextval('public.cart_id_seq'::regclass);


--
-- Name: cartItem id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."cartItem" ALTER COLUMN id SET DEFAULT nextval('public."cartItem_id_seq"'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: histories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.histories ALTER COLUMN id SET DEFAULT nextval('public.histories_new_id_seq'::regclass);


--
-- Name: product_details id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_details ALTER COLUMN id SET DEFAULT nextval('public.product_details_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: sizes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sizes ALTER COLUMN id SET DEFAULT nextval('public.sizes_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart (id, token, created_at, "fullPrice") FROM stdin;
177	0172d1f5-ff0f-4df5-b7bd-0a0be7a2c0cc	2025-09-20 00:25:21.37919	0.00
178	4a36966f-d5af-466f-8e7c-b90d4e0c8c64	2025-09-20 22:06:54.029987	1000.00
179	ee61ec9c-1927-4f26-a78b-7890799b450f	2025-10-05 13:05:21.377624	0.00
176	52aa4ae6-7583-4f56-baaf-d42b94700758	2025-09-20 00:14:06.856364	0.00
180	3c7df1a8-b175-43b5-8d83-3d15d4ae029b	2025-11-04 21:17:14.671834	550.00
175	69754eac-078c-4c3a-8c5e-1bb68bb6e0bd	2025-09-19 21:56:10.983529	1000.00
\.


--
-- Data for Name: cartItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."cartItem" (id, cart_id, product_id, quantity, created_at, size_id) FROM stdin;
2050	175	82	1	2025-09-19 23:34:28.181111	51
2051	175	83	1	2025-09-19 23:34:28.911738	51
2057	178	82	1	2025-09-20 22:06:55.631905	51
2058	178	83	1	2025-09-20 22:06:58.160912	51
2063	180	107	1	2025-11-04 21:17:15.585822	119
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, slug, image, "order") FROM stdin;
2	Диффузоры	aroma-diffusers	https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/categories/category_diffusors.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2F0ZWdvcmllcy9jYXRlZ29yeV9kaWZmdXNvcnMuanBnIiwiaWF0IjoxNzQyNjMxMTYzLCJleHAiOjE3NzQxNjcxNjN9.eHQTYMkTXJ9eU3Vkv29x26TV_pY1IH69X59lcrKY2ME	2
3	Саше	aroma-sachet	https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/categories/category_sachet.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2F0ZWdvcmllcy9jYXRlZ29yeV9zYWNoZXQuanBnIiwiaWF0IjoxNzQyNjMxMTcxLCJleHAiOjE3NzQxNjcxNzF9.FYhmHUa4-7-o8ImantjeheQVwfIx-zE1jj7lGG_ZBjo	4
1	Ароматические свечи	candles	https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/categories/category_candles.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2F0ZWdvcmllcy9jYXRlZ29yeV9jYW5kbGVzLmpwZyIsImlhdCI6MTc0NDE5MzkzNSwiZXhwIjoxNzc1NzI5OTM1fQ.QgzXIIzmzBC4SPP2ehrDl1FoEMpZgkVsmKiixPF_oH4	1
\.


--
-- Data for Name: histories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.histories (title, id, description, "order", history_slug, "imageUrl") FROM stdin;
Третья история	3	Память, ностальгия, границы реальности	3	tretia-istoriya	\N
Четвертая история	4	 Первые дни вместе, бытовая романтика	4	chetvertaya-istoriya	\N
Вторая история	2	Четыре времени года – четыре главы их истории. Они встретились в холодный вечер, когда в воздухе витал аромат глинтвейна. Весной их сердца расцвели, словно нежная сакура. Лето принесло беззаботные дни, наполненные ароматами роз и пиона. Но осень вернула его в старую кофейню, где когда-то сидели вдвоём. Там, в чашке горячего кофе, растворилась последняя надежда.	2	vtoraya-istoriya	\N
Пятая история	5	Память, потеря, семейные узы	5	pyataya-istoriya	\N
Первая история	1	Запретное чувство, ностальгия, роковая встреча	1	pervaya-istoriya	https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/histories/history_1.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvaGlzdG9yaWVzL2hpc3RvcnlfMS5qcGciLCJpYXQiOjE3NDQ5NjQ1MzUsImV4cCI6MTc3NjUwMDUzNX0.yZWPZKgihArugoyn7q35gyEtHAgPfuuFxRcMgrD3SlA
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, name, phone, email, wishes, comment, token, created_at, items, "fullPrice", "paymentId", status, delivery_method, delivery_price, city, street, building, porch, sfloor, sflat) FROM stdin;
51b90924-8d7d-4312-8b3b-944a7aa6eb57	Светлана	89657354368	dobrosvetlo@rambler.ru	\N	\N	84c9ec84-4bc8-4d83-a81c-dbcbcdcbec2f	2025-04-16 18:19:32.967	[{"id": 1093, "size": 100, "price": 500, "product": {"id": 95, "slug": "ih-sovmestnoe-proshloe-vspominalos-v-tishine", "title": "Их совместное прошлое вспоминалось в тишине", "images": [{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/ix_sovmestnoye_can_100.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvaXhfc292bWVzdG5veWVfY2FuXzEwMC5qcGciLCJpYXQiOjE3NDM5NjgwODcsImV4cCI6MTc3NTUwNDA4N30.DOBAzxS82t3vdMjOKyZe-6vuKMjI-Fw0oK1CNsu4zLc", "type": "100ml"}], "episode": "Каждый раз, когда поздними вечерами они с братишкой слишком шумели, мама неизменно грозила:\\r\\n- Если продолжите, сказки сегодня отменяются.\\r\\n...И неизменно прощала эти детские забавы. Ведь какой ребёнок, даже если захочет, перестанет шуметь больше, чем на пять минут?\\r\\nКогда брат с сестрой наконец успокаивались и ложились, мама включала в их комнате ночник (младшая боялась темноты; старший, пусть и храбрился, на самом деле тоже боялся), открывала эту самую книжку на любимой детьми, порвавшейся от времени, изрисованной страничке, и тихо, но выразительно начинала читать вслух.", "measure": "мл", "compound": "Лаванда", "history_id": 5, "category_id": 1, "description": "Свеча с ароматом лаванды, эвкалипта и апельсинового цвета. Идеальна для создания расслабляющей атмосферы в спальне или ванной — травянистый аромат, который помогает расслабиться.", "category_slug": "candles", "scent_pyramid": {"top": "древесина тикового дерева", "base": "темный мускус, амирис, пачули, сандаловое дерево", "heart": "кожа, кедр"}, "episode_number": 5.2}, "size_id": 51, "quantity": 1, "product_id": 95}, {"id": 1094, "size": 50, "price": 550, "product": {"id": 118, "slug": "ih-sovmestnoe-proshloe-vspominalos-v-tishine-aroma-diffusers", "title": "Их совместное прошлое вспоминалось в тишине", "images": [{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/ix_sovmestnoye_dif_50.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvaXhfc292bWVzdG5veWVfZGlmXzUwLmpwZyIsImlhdCI6MTc0Mzk2NzQwNCwiZXhwIjoxNzc1NTAzNDA0fQ.NEQNIt1ZYQl-mubZRdRY8hHUz7JJFOSsGAYamW0_sl0", "type": "50ml"}], "episode": "Каждый раз, когда поздними вечерами они с братишкой слишком шумели, мама неизменно грозила:\\r\\n- Если продолжите, сказки сегодня отменяются.\\r\\n...И неизменно прощала эти детские забавы. Ведь какой ребёнок, даже если захочет, перестанет шуметь больше, чем на пять минут?\\r\\nКогда брат с сестрой наконец успокаивались и ложились, мама включала в их комнате ночник (младшая боялась темноты; старший, пусть и храбрился, на самом деле тоже боялся), открывала эту самую книжку на любимой детьми, порвавшейся от времени, изрисованной страничке, и тихо, но выразительно начинала читать вслух.", "measure": "мл", "compound": "Лаванда", "history_id": 5, "category_id": 2, "description": "Аромадиффузор с нотами лаванды, эвкалипта и цветка апельсина. Подходит для создания спокойной атмосферы в доме — аромат зелени и цветов для расслабления.", "category_slug": "aroma-diffusers", "scent_pyramid": {"top": "древесина тикового дерева", "base": "темный мускус, амирис, пачули, сандаловое дерево", "heart": "кожа, кедр"}, "episode_number": 5.2}, "size_id": 119, "quantity": 1, "product_id": 118}, {"id": 1095, "size": 36, "price": 250, "product": {"id": 170, "slug": "ih-sovmestnoe-proshloe-vspominalos-v-tishine-aroma-sachet", "title": "Их совместное прошлое вспоминалось в тишине", "images": [{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/categories/category_sachet.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2F0ZWdvcmllcy9jYXRlZ29yeV9zYWNoZXQuanBnIiwiaWF0IjoxNzQzMTY4MjM3LCJleHAiOjE3NzQ3MDQyMzd9.qWIjfuZagB_kiaEN5jg8muwK0EmrA0BhZbRy6cTwuuI", "type": "main"}], "episode": "Каждый раз, когда поздними вечерами они с братишкой слишком шумели, мама неизменно грозила:\\n- Если продолжите, сказки сегодня отменяются.\\n...И неизменно прощала эти детские забавы. Ведь какой ребёнок, даже если захочет, перестанет шуметь больше, чем на пять минут?\\nКогда брат с сестрой наконец успокаивались и ложились, мама включала в их комнате ночник (младшая боялась темноты; старший, пусть и храбрился, на самом деле тоже боялся), открывала эту самую книжку на любимой детьми, порвавшейся от времени, изрисованной страничке, и тихо, но выразительно начинала читать вслух.", "measure": "г", "compound": "Лаванда", "history_id": 5, "category_id": 3, "description": "Саше с ароматом лаванды, эвкалипта и апельсина. Идеально для хранения в шкафах, гардеробных и  сумках — оставляет свежий, расслабляющий травянистый шлейф.", "category_slug": "aroma-sachet", "scent_pyramid": {"top": "", "base": "", "heart": ""}, "episode_number": 5.2}, "size_id": 122, "quantity": 1, "product_id": 170}]	1559	2f920876-000f-5000-b000-1138acb31603	SUCCEEDED	postalDelivery	259	Череповец	Архангельская	92	\N	\N	\N
35e9dd80-6c8c-4ba7-8a8a-4c325d8a009f	Иван Петров	+7 (999) 123-45-67	test@example.com	\N	\N	52aa4ae6-7583-4f56-baaf-d42b94700758	2025-10-06 15:09:43.328	[{"id": 2060, "size": 50, "price": 550, "product": {"id": 105, "slug": "vospominanie-o-zapretnoj-lyubvi-v-vishnyovom-sadu-aroma-diffusers", "title": "Воспоминание о запретной любви в вишнёвом саду", "images": [{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/vospominanya_dif_45.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvdm9zcG9taW5hbnlhX2RpZl80NS5qcGciLCJpYXQiOjE3NDM5NTA4NjEsImV4cCI6MTc3NTQ4Njg2MX0.CdgyX_1f8L31R7NEBkCnbRWiIbkLunecmhbH4hGj8cg", "type": "45ml"}, {"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/vospominanya_dif_45.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvdm9zcG9taW5hbnlhX2RpZl80NS5qcGciLCJpYXQiOjE3NDM5NTA4NjEsImV4cCI6MTc3NTQ4Njg2MX0.CdgyX_1f8L31R7NEBkCnbRWiIbkLunecmhbH4hGj8cg", "type": "45ml-double"}], "search": "'вишн':9B 'вишнев':6A 'воспоминан':1A 'запретн':3A 'любв':4A 'мерл':10B 'сад':7A 'черн':8B", "episode": "Девушка пошла в вишнёвый сад. Воспоминания о запретной любви, крепко скрываемой в её сердце, всплывали на поверхность. Она вспомнила, как встречалась с ним в этих же местах, как вместе они собирали вишню, смеялись и мечтали о будущем. Эта любовь была искренней, но из-за строгих традиций она была обречена.", "measure": "мл", "compound": "Чёрная вишня мерло", "history_id": 1, "category_id": 2, "description": "Аромадиффузор с нотами чёрной вишни, яблока, красного вина и дуба. Подходит для создания тёплой и элегантной атмосферы в доме — расслабляющая гармония фруктов и древесных нот.", "category_slug": "aroma-diffusers", "scent_pyramid": {"top": "яблоко, черная смородина", "base": "амбра, ваниль, дуб", "heart": "гвоздика, красное вино, черная вишня"}, "episode_number": 1.2}, "size_id": 119, "quantity": 1, "product_id": 105}, {"id": 2061, "size": 100, "price": 900, "product": {"id": 172, "slug": "cvetyushaya_yaposnkaya_sakura_diffusor", "title": "Мгновение под дождём из лепестков цветущей сакуры", "images": [{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/mgnoveniye_dif_100.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvbWdub3Zlbml5ZV9kaWZfMTAwLmpwZyIsImlhdCI6MTc0Mzk1MDc0MywiZXhwIjoxNzc1NDg2NzQzfQ.rk0Pmfjz4QAKfJxen5sOUj7xgmRieJeuZg95rLzab8Q", "type": "100ml"}], "search": "'дожд':3A 'лепестк':5A 'мгновен':1A 'сакур':7A,10B 'цветущ':6A,8B 'японск':9B", "episode": "Поздней весной, когда расцветала единственная в городе сакура, влюблённые часто гуляли возле неё. Тёплый ветер разносил розовые лепестки по всей округе, образовывая розовый ковёр поверх привычной взору зелёной травы.", "measure": "мл", "compound": "Цветущая японская сакура", "history_id": 2, "category_id": 2, "description": "Аромадиффузор с нотами сакуры, магнолии и вишни. Подходит для создания утончённой атмосферы в интерьере — напоминает аромат цветущего сада.", "category_slug": "aroma-diffusers", "scent_pyramid": {"top": "", "base": "", "heart": ""}, "episode_number": 2.2}, "size_id": 120, "quantity": 1, "product_id": 172}]	1450	3075ef78-000f-5000-b000-17fa46f58d32	CANCELLED	selfPickup	0	\N	\N	\N	\N	\N	\N
3f466227-9952-4719-9530-37bf1cc25078	Кирилл Евгеньевич Кривцов	9176709042	m2005826@edu.misis.ru	\N	\N	63cf687e-0570-4d73-bfa9-3862c5f6abc6	2025-09-12 16:22:42.647	[{"id": 1863, "size": 100, "price": 500, "product": {"id": 82, "slug": "vospominanie-o-zapretnoj-lyubvi-v-vishnyovom-sadu", "title": "Воспоминание о запретной любви в вишнёвом саду", "images": [{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/vospominaniya_can_100.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvdm9zcG9taW5hbml5YV9jYW5fMTAwLmpwZyIsImlhdCI6MTc0NDE5MzIxMSwiZXhwIjoxNzc1NzI5MjExfQ.Zr4v18N5UCrrnHqR_-aPLCM7kAqcTlKvNKLBGFwPmK8", "type": "100ml"}, {"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/vospominaniya_can_45.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvdm9zcG9taW5hbml5YV9jYW5fNDUuanBnIiwiaWF0IjoxNzQ0MTkzMjgzLCJleHAiOjE3NzU3MjkyODN9.lVP8RWA6VBYGzsAGct4Cy9BeLj9YjqrnEIpPqI7F8Cw", "type": "45ml"}, {"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/vospominaniya_can_165.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvdm9zcG9taW5hbml5YV9jYW5fMTY1LmpwZyIsImlhdCI6MTc0NDE5MzI5OCwiZXhwIjoxNzc1NzI5Mjk4fQ.F4snipCVMk2tSvfIv5gQwSAdfnzgnAvq3VQSl5tp8HI", "type": "165ml"}, {"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/vospominanya_can_250.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvdm9zcG9taW5hbnlhX2Nhbl8yNTAuanBnIiwiaWF0IjoxNzQ0MTkzMzExLCJleHAiOjE3NzU3MjkzMTF9.tYmieeG3CEOPc9PyXXz2-97pqp2_SjlCbMpOa3keMjc", "type": "250ml"}], "search": "'вишн':9B 'вишнев':6A 'воспоминан':1A 'запретн':3A 'любв':4A 'мерл':10B 'сад':7A 'черн':8B", "episode": "Девушка пошла в вишнёвый сад. Воспоминания о запретной любви, крепко скрываемой в её сердце, всплывали на поверхность. Она вспомнила, как встречалась с ним в этих же местах, как вместе они собирали вишню, смеялись и мечтали о будущем. Эта любовь была искренней, но из-за строгих традиций она была обречена.", "measure": "мл", "compound": "Чёрная вишня мерло", "history_id": 1, "category_id": 1, "description": "Свеча с ароматом чёрной вишни, яблока, черной смородины, мерло и дуба. Идеальна для создания элегантной атмосферы — пряный аромат с лёгкими древесными нотами.", "category_slug": "candles", "scent_pyramid": {"top": "яблоко, черная смородина", "base": "амбра, ваниль, дуб", "heart": "гвоздика, красное вино, черная вишня"}, "episode_number": 1.2}, "size_id": 51, "quantity": 1, "product_id": 82}]	500	30565c93-000f-5001-8000-18d66aa13514	CANCELLED	selfPickup	0	\N	\N	\N	\N	\N	\N
1d44c21e-2b57-422e-9f09-6143871b81c3	Кирилл (Кира), мне духи	89176709042	kriv466@gmail.com	\N	\N	716aeee2-e96b-42e4-b537-0198a7b57f8d	2025-05-22 20:35:37.265	[{"id": 1110, "size": 50, "price": 550, "product": {"id": 112, "slug": "otdyh-pod-moguchim-dubom-s-raskidistymi-derevyami-aroma-diffusers", "title": "Отдых под могучим дубом с раскидистыми деревьями", "images": [{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/otdix_pod_moguchim_dif_50.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvb3RkaXhfcG9kX21vZ3VjaGltX2RpZl81MC5qcGciLCJpYXQiOjE3NDM5NTA3NjQsImV4cCI6MTc3NTQ4Njc2NH0.5keG2F5GbVxcJ3qGzoHD5SLql4aKWfZAVK17fnClFgA", "type": "45ml"}], "episode": "Наконец она приблизилась к своему любимому месту в лесу - поляне, в центре которой одиноко рос могучий дуб. Нахлынули старые воспоминания. \\r\\nБудучи маленькой, девушка часто приходила сюда с семьёй. Именно здесь старший брат учил её лазать по деревьям, пока родители стелили плед, раскладывали тарелочки и разные вкусности. Конечно, потом детей ругали за опасные игры. \\r\\n-Я им много раз объясняла, что с дерева можно больно свалиться, но разве детство уймёшь?.. - Сказав это отцу, завершившему приготовления к пикнику, мама наконец позвала ребятишек. Они не заставили себя долго ждать и с радостными визгами побежали к красному клетчатому пледу, где уже лежали столь желанные сладости. \\r\\nОт того, что кусочки радостного детства теперь остались лишь в воспоминаниях, по щекам пошли слёзы. Прижавшись спиной к старому, покрытому мхом дубу, девушка почувствовала окутывающую её сладкую дрёму.", "measure": "мл", "compound": "Дубовый мох и янтарь", "history_id": 3, "category_id": 2, "description": "Если у Вас остались вопросы, то обратитесь к нам через любые соцсети или почту.", "category_slug": "aroma-diffusers", "scent_pyramid": {"top": "шалфей, апельсин, грейпфрут", "base": "амбра, бобы тонка, дубовый мох", "heart": "лаванда"}, "episode_number": 3.2}, "size_id": 119, "quantity": 1, "product_id": 112}]	809	2fc19e5a-000f-5001-8000-1b748c647fb9	SUCCEEDED	postalDelivery	259	Москва	Ул. Тимура Фрунзе	11 строение 44	\N	\N	\N
0783ea40-ef38-4cdf-8fc2-cec0ed3493e7	Ольга 	89522120889	tatyanka1990@mail.ru	\N	\N	2437868c-4f1c-44d7-90ec-8a68dd813bb0	2025-08-21 16:24:04.317	[{"id": 1116, "size": 100, "price": 500, "product": {"id": 83, "slug": "obuyatiya-tyoplogo-vechera-v-teni-starogo-dereva", "title": "Объятия тёплого вечера в тени старого дерева", "images": [{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/objatya_can_100.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvb2JqYXR5YV9jYW5fMTAwLmpwZyIsImlhdCI6MTc0MzE2NTA2MywiZXhwIjoxNzc0NzAxMDYzfQ.UFdETQLPS0bzBIQxx-nRJuBQ-FSp7W0xzdeBfnWjB0A", "type": "100ml"}], "episode": "Она заранее знала, что вечер будет именно таким - тёплым и уютным. Под тенью старого дерева, которое было свидетелем их детских споров и дружбы, с годами переросшей в любовь, девушка почувствовала, как летний ветер обнял её, унося прочь все тревоги. Она присела на землю и через мгновение увидела чью-то приближающуюся фигуру; не придав этому значения, перевела взгляд на благоухающие цветы.  Сердце забилось чаще. Показалось?  Он улыбнулся, и на секунду весь мир вокруг них замер. Всё, что они когда-то пережили вместе, все ожидания и печали, стали незначительными по сравнению с этой неожиданной встречей. \\r\\n– Я думал, что ты не придёшь, – сказал он, садясь рядом. Этот голос был обжигающе знакомым. \\r\\n– Я не могла бы избежать этой встречи, – ответила она, глядя в его зелёные глаза.", "measure": "мл", "compound": "Кашемировая слива", "history_id": 1, "category_id": 1, "description": "Тёплый, сладкий аромат кашемировой сливы с нотами вишни, ванили и амбры. Идеально подойдёт для создания романтической атмосферы.", "category_slug": "candles", "scent_pyramid": {"top": "цитрусовые", "base": "ваниль, фрезия, амбра, легкий мускус, сахар", "heart": "черная вишня, слива"}, "episode_number": 1.3}, "size_id": 51, "quantity": 1, "product_id": 83}, {"id": 1117, "size": 50, "price": 550, "product": {"id": 111, "slug": "dolgozhdannaya-progulka-po-lesnoj-tropinke-aroma-diffusers", "title": "Долгожданная прогулка по лесной тропинке", "images": [{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/dolgojdanya_dif_50.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvZG9sZ29qZGFueWFfZGlmXzUwLmpwZyIsImlhdCI6MTc0Mzk2NzQzNCwiZXhwIjoxNzc1NTAzNDM0fQ.x7oxF3iH4M63fJkpBxs-Hos7ZnQ0tkdGZOc58qOtr6M", "type": "main"}], "episode": "Это было самое жаркое лето за последнее десятилетие. После долгих откладываний этой прогулки она наконец решила выбраться в ближайший лес.\\r\\nЧтобы прийти к любимой полянке не в самое пекло, девушка пошла с утра, - пока солнце не успело войти в зенит.\\r\\nНа удивление, в этот раз было гораздо прохладнее, чем обычно - лес оказался окутан туманом, непривычно густым, будто незнакомым ему ранее. Даже папоротник вдоль тропинки был едва различим. К счастью, гостья леса знала эти места с детства, и ей уж точно было не заплутать среди хорошо знакомых деревьев.", "measure": "мл", "compound": "Туман и папоротник", "history_id": 3, "category_id": 2, "description": "Туман и Папоротник — это аромат, который переносит вас в сердце леса, окутанного утренним туманом. Он начинается с освежающих нот озона и бергамота, словно первый вдох чистого воздуха после дождя. Затем раскрываются успокаивающие аккорды лаванды и мяты, создавая ощущение гармонии и покоя. В основе — глубокие, землистые ноты зеленого мха, минералов и можжевельника, которые добавляют аромату природной силы и загадочности.\\n\\nВ аромадиффузоре этот запах раскрывается как прогулка по лесу: сначала вы чувствуете свежесть и легкость, затем — умиротворение, а в финале — глубокую, древесную grounding-энергию. Натуральные эфирные масла кедра, пачули, лимона, апельсина и лайма делают аромат живым и насыщенным.\\n\\nИдеально для тех, кто хочет создать атмосферу спокойствия, очищения и единения с природой. Этот аромат — как глоток свежего воздуха для души и дома.", "category_slug": "aroma-diffusers", "scent_pyramid": {"top": "озон, бергамот", "base": "мох, земля, можжевельник", "heart": "лаванда, мята"}, "episode_number": 3.1}, "size_id": 119, "quantity": 1, "product_id": 111}]	1309	30395be5-000f-5001-9000-129b80f6e6ef	SUCCEEDED	postalDelivery	259	Мурино 	Ручьевский проспект 	17	\N	\N	\N
2bb0d18d-6f22-4281-a6bd-020a49f49414	Кирилл Евгеньевич Кривцов	9176709042	m2005826@edu.misis.ru	\N	\N	63cf687e-0570-4d73-bfa9-3862c5f6abc6	2025-09-12 16:19:04.031	[{"id": 1862, "size": 50, "price": 550, "product": {"id": 112, "slug": "otdyh-pod-moguchim-dubom-s-raskidistymi-derevyami-aroma-diffusers", "title": "Отдых под могучим дубом с раскидистыми деревьями", "images": [{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/otdix_pod_moguchim_dif_50.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvb3RkaXhfcG9kX21vZ3VjaGltX2RpZl81MC5qcGciLCJpYXQiOjE3NDM5NTA3NjQsImV4cCI6MTc3NTQ4Njc2NH0.5keG2F5GbVxcJ3qGzoHD5SLql4aKWfZAVK17fnClFgA", "type": "45ml"}], "search": "'дерев':7A 'дуб':4A 'дубов':8B 'могуч':3A 'мох':9B 'отд':1A 'раскидист':6A 'янтар':11B", "episode": "Наконец она приблизилась к своему любимому месту в лесу - поляне, в центре которой одиноко рос могучий дуб. Нахлынули старые воспоминания. \\r\\nБудучи маленькой, девушка часто приходила сюда с семьёй. Именно здесь старший брат учил её лазать по деревьям, пока родители стелили плед, раскладывали тарелочки и разные вкусности. Конечно, потом детей ругали за опасные игры. \\r\\n-Я им много раз объясняла, что с дерева можно больно свалиться, но разве детство уймёшь?.. - Сказав это отцу, завершившему приготовления к пикнику, мама наконец позвала ребятишек. Они не заставили себя долго ждать и с радостными визгами побежали к красному клетчатому пледу, где уже лежали столь желанные сладости. \\r\\nОт того, что кусочки радостного детства теперь остались лишь в воспоминаниях, по щекам пошли слёзы. Прижавшись спиной к старому, покрытому мхом дубу, девушка почувствовала окутывающую её сладкую дрёму.", "measure": "мл", "compound": "Дубовый мох и янтарь", "history_id": 3, "category_id": 2, "description": "Если у Вас остались вопросы, то обратитесь к нам через любые соцсети или почту.", "category_slug": "aroma-diffusers", "scent_pyramid": {"top": "шалфей, апельсин, грейпфрут", "base": "амбра, бобы тонка, дубовый мох", "heart": "лаванда"}, "episode_number": 3.2}, "size_id": 119, "quantity": 1, "product_id": 112}]	550	30565bb9-000f-5000-8000-1588cd45631d	CANCELLED	selfPickup	0	\N	\N	\N	\N	\N	\N
1979d52d-6204-4643-b813-377505a8f79b	Николай	9181525041	kolaemelanov60@gmail.com	\N	\N	69754eac-078c-4c3a-8c5e-1bb68bb6e0bd	2025-09-19 22:35:04.878	[{"id": 2038, "size": 100, "price": 500, "product": {"id": 82, "slug": "vospominanie-o-zapretnoj-lyubvi-v-vishnyovom-sadu", "title": "Воспоминание о запретной любви в вишнёвом саду", "images": [{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/vospominaniya_can_100.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvdm9zcG9taW5hbml5YV9jYW5fMTAwLmpwZyIsImlhdCI6MTc0NDE5MzIxMSwiZXhwIjoxNzc1NzI5MjExfQ.Zr4v18N5UCrrnHqR_-aPLCM7kAqcTlKvNKLBGFwPmK8", "type": "100ml"}, {"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/vospominaniya_can_45.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvdm9zcG9taW5hbml5YV9jYW5fNDUuanBnIiwiaWF0IjoxNzQ0MTkzMjgzLCJleHAiOjE3NzU3MjkyODN9.lVP8RWA6VBYGzsAGct4Cy9BeLj9YjqrnEIpPqI7F8Cw", "type": "45ml"}, {"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/vospominaniya_can_165.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvdm9zcG9taW5hbml5YV9jYW5fMTY1LmpwZyIsImlhdCI6MTc0NDE5MzI5OCwiZXhwIjoxNzc1NzI5Mjk4fQ.F4snipCVMk2tSvfIv5gQwSAdfnzgnAvq3VQSl5tp8HI", "type": "165ml"}, {"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/vospominanya_can_250.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvdm9zcG9taW5hbnlhX2Nhbl8yNTAuanBnIiwiaWF0IjoxNzQ0MTkzMzExLCJleHAiOjE3NzU3MjkzMTF9.tYmieeG3CEOPc9PyXXz2-97pqp2_SjlCbMpOa3keMjc", "type": "250ml"}], "search": "'вишн':9B 'вишнев':6A 'воспоминан':1A 'запретн':3A 'любв':4A 'мерл':10B 'сад':7A 'черн':8B", "episode": "Девушка пошла в вишнёвый сад. Воспоминания о запретной любви, крепко скрываемой в её сердце, всплывали на поверхность. Она вспомнила, как встречалась с ним в этих же местах, как вместе они собирали вишню, смеялись и мечтали о будущем. Эта любовь была искренней, но из-за строгих традиций она была обречена.", "measure": "мл", "compound": "Чёрная вишня мерло", "history_id": 1, "category_id": 1, "description": "Свеча с ароматом чёрной вишни, яблока, черной смородины, мерло и дуба. Идеальна для создания элегантной атмосферы — пряный аромат с лёгкими древесными нотами.", "category_slug": "candles", "scent_pyramid": {"top": "яблоко, черная смородина", "base": "амбра, ваниль, дуб", "heart": "гвоздика, красное вино, черная вишня"}, "episode_number": 1.2}, "size_id": 51, "quantity": 1, "product_id": 82}, {"id": 2039, "size": 100, "price": 500, "product": {"id": 84, "slug": "sogrevayushaya-serdce-magiya-zimnej-pory", "title": "Согревающая сердце магия зимней поры", "images": [{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/sogrevayushaya_serdce_can_100.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvc29ncmV2YXl1c2hheWFfc2VyZGNlX2Nhbl8xMDAuanBnIiwiaWF0IjoxNzQ0MTkzMDk5LCJleHAiOjE3NzU3MjkwOTl9.phCsyEGL1Oz8xSiaZpznMVxco-wZnDiTjSQne0NsRZA", "type": "100ml"}], "search": "'глинтвейн':6B 'зимн':4A 'маг':3A 'пор':5A 'сердц':2A 'согрева':1A", "episode": "Они встретились зимой. В это холодное время года единственным спасением от морозов был глинтвейн, продающийся на частых новогодних ярмарках. В один из таких дней в очереди он просто заговорил с девушкой, что стояла перед ним.\\r\\nЕё зелёные глаза и потрясающе красивая внешность пленили его с первого взгляда. Это была любовь.", "measure": "мл", "compound": "Глинтвейн", "history_id": 2, "category_id": 1, "description": "Глинтвейн — это аромат, который мгновенно переносит в атмосферу праздника и зимнего уюта. Теплые ноты апельсина, лимона, яблочного сидра и клюквы создают пряно-фруктовую гармонию, напоминающую о рождественских вечерах. Натуральные эфирные масла апельсина, кедра и бучу добавляют глубину, делая аромат насыщенным и слегка древесным.\\r\\n\\r\\nВ аромадиффузоре этот запах раскрывается как глоток горячего глинтвейна: сначала вы чувствуете яркую цитрусовую свежесть, а затем погружаетесь в теплые, пряные аккорды, которые согревают и поднимают настроение. Идеально для создания праздничной атмосферы или просто для тех моментов, когда хочется почувствовать себя в центре зимней сказки.", "category_slug": "candles", "scent_pyramid": {"top": "апельсиновая цедра, корица, лимон", "base": "красное вино, древесина", "heart": "клюква, красная смородина, яблочный сидр"}, "episode_number": 2.1}, "size_id": 51, "quantity": 1, "product_id": 84}]	1000	305fee59-000f-5000-b000-1cb75510501c	CANCELLED	selfPickup	0	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: product_detail_links; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_detail_links (product_id, detail_id) FROM stdin;
87	1
84	1
85	1
86	1
90	1
81	1
88	1
94	1
95	1
97	1
83	1
89	1
82	1
91	1
92	1
93	1
\.


--
-- Data for Name: product_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_details (id, category_slug, details) FROM stdin;
1	candles	{"Воск": "Натуральный соевый воск", "Фитиль": "Деревянный", "Ароматические масла": "Премиум арома-масла с международным сертификатом безопасности IFRA"}
\.


--
-- Data for Name: product_sizes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_sizes (product_id, size_id, price, "oldPrice", quantity_in_stock, is_default, id) FROM stdin;
94	53	1200	\N	1	f	4
106	120	900	\N	0	f	80
91	51	450	500	3	t	56
91	52	700	770	2	f	57
91	53	1000	1200	2	f	58
97	53	1200	\N	0	f	16
94	51	500	\N	2	t	68
165	122	250	\N	0	t	146
97	50	350	\N	0	f	13
85	51	500	\N	5	t	32
115	119	550	\N	3	t	97
113	119	550	\N	1	t	93
95	52	770	\N	0	f	7
82	51	500	\N	0	t	2
95	53	1200	\N	0	f	8
119	119	550	\N	4	t	105
114	120	900	\N	1	f	96
82	52	770	\N	0	f	21
82	53	1200	\N	0	f	22
92	50	350	\N	0	f	59
171	122	250	\N	0	t	152
92	51	500	\N	4	t	60
104	119	550	\N	3	t	75
110	120	900	\N	0	f	88
93	50	300	350	4	f	63
86	50	350	\N	0	f	35
81	53	1200	\N	1	f	20
81	52	770	\N	1	f	19
93	51	450	500	4	t	64
94	52	770	\N	2	f	3
89	50	350	\N	3	f	47
89	51	500	\N	2	t	48
89	52	770	\N	2	f	49
112	119	550	\N	0	t	91
92	52	770	\N	0	f	61
105	120	900	\N	0	f	78
92	53	1200	\N	0	f	62
93	52	700	770	2	f	65
155	122	250	\N	0	t	136
84	50	350	\N	0	f	27
86	51	500	\N	4	t	36
86	52	770	\N	0	f	37
84	52	770	\N	0	f	29
117	119	550	\N	1	t	101
84	53	1200	\N	0	f	30
88	50	350	\N	0	f	43
88	51	500	\N	2	t	44
86	53	1200	\N	0	f	38
88	52	770	\N	0	f	45
88	53	1200	\N	0	f	46
117	120	900	\N	0	f	102
85	50	350	\N	0	f	31
93	53	1000	1200	2	f	129
163	122	250	\N	0	t	144
116	119	550	\N	2	t	99
89	53	1200	\N	1	f	50
109	119	550	\N	3	t	85
109	120	900	\N	0	f	86
83	53	1200	\N	0	f	26
83	52	770	\N	0	f	25
172	119	550	\N	0	f	154
142	122	250	\N	0	t	121
87	50	350	\N	3	f	39
83	51	500	\N	5	t	24
90	51	500	\N	3	t	52
83	50	350	\N	0	f	23
107	119	550	\N	4	t	81
107	120	900	\N	0	f	82
110	119	550	\N	3	t	87
161	122	250	\N	0	t	142
119	120	900	\N	0	f	106
135	122	250	\N	0	t	122
87	53	1200	\N	1	f	42
87	52	770	\N	1	f	41
95	50	350	\N	0	f	5
111	119	550	\N	2	t	89
167	122	250	\N	0	t	148
97	51	500	\N	5	t	14
118	120	900	\N	0	f	104
116	120	900	\N	0	f	100
111	120	900	\N	0	f	90
94	50	300	350	3	f	67
97	52	770	\N	0	f	15
118	119	550	\N	3	t	103
90	52	770	\N	0	f	53
90	53	1200	\N	0	f	54
106	119	550	\N	2	t	79
85	52	770	\N	0	f	33
132	122	250	\N	0	t	123
91	50	300	350	5	f	55
85	53	1200	\N	0	f	34
81	51	500	\N	2	t	18
112	120	900	\N	0	f	92
115	120	900	\N	1	f	98
104	120	900	\N	1	f	76
95	51	500	\N	6	t	6
113	120	900	\N	0	f	94
105	119	550	\N	2	t	77
114	119	500	550	4	t	95
87	51	500	\N	1	t	40
84	51	500	\N	6	t	28
162	122	250	\N	3	t	143
160	122	250	\N	0	t	141
90	50	350	\N	0	f	51
164	122	250	\N	0	t	145
166	122	250	\N	0	t	147
172	120	900	\N	1	t	153
168	122	250	\N	0	t	149
81	50	350	\N	1	f	17
170	122	250	\N	0	t	151
82	50	350	\N	0	f	1
156	122	250	\N	0	t	137
\.


--
-- Data for Name: product_smells; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_smells (product_id, smell_id) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, title, history_id, category_id, compound, slug, category_slug, scent_pyramid, description, images, measure, episode, episode_number) FROM stdin;
85	Мгновение под дождём из лепестков цветущей сакуры	2	1	Цветущая японская сакура	mgnovenie-pod-dozhdyom-iz-lepestkov-cvetushej-sakury	candles	{"top":"озон, вишневый цвет, магнолия","heart":"роза, вишня","base":"бобы тонка, сандаловое дерево"}	Свеча с ароматом японской сакуры: магнолия, вишня и роза. Идеальна для весны — создаёт свежую, цветочную атмосферу, напоминающую о цветении вишнёвых садов.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/mgnoveniye_can_100.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvbWdub3Zlbml5ZV9jYW5fMTAwLmpwZyIsImlhdCI6MTc0MzE2NDY0NywiZXhwIjoxNzc0NzAwNjQ3fQ.BSvm4SVc82UD9YdAonIwj93Pr-_QKfCpCQzv8McQRZY", "type": "100ml"}]	мл	Поздней весной, когда расцветала единственная в городе сакура, влюблённые часто гуляли возле неё. Тёплый ветер разносил розовые лепестки по всей округе, образовывая розовый ковёр поверх привычной взору зелёной травы.	2.2
105	Воспоминание о запретной любви в вишнёвом саду	1	2	Чёрная вишня мерло	vospominanie-o-zapretnoj-lyubvi-v-vishnyovom-sadu-aroma-diffusers	aroma-diffusers	{"top":"яблоко, черная смородина","heart":"гвоздика, красное вино, черная вишня","base":"амбра, ваниль, дуб"}	Аромадиффузор с нотами чёрной вишни, яблока, красного вина и дуба. Подходит для создания тёплой и элегантной атмосферы в доме — расслабляющая гармония фруктов и древесных нот.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/vospominanya_dif_45.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvdm9zcG9taW5hbnlhX2RpZl80NS5qcGciLCJpYXQiOjE3NDM5NTA4NjEsImV4cCI6MTc3NTQ4Njg2MX0.CdgyX_1f8L31R7NEBkCnbRWiIbkLunecmhbH4hGj8cg", "type": "45ml"}, {"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/vospominanya_dif_45.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvdm9zcG9taW5hbnlhX2RpZl80NS5qcGciLCJpYXQiOjE3NDM5NTA4NjEsImV4cCI6MTc3NTQ4Njg2MX0.CdgyX_1f8L31R7NEBkCnbRWiIbkLunecmhbH4hGj8cg", "type": "45ml-double"}]	мл	Девушка пошла в вишнёвый сад. Воспоминания о запретной любви, крепко скрываемой в её сердце, всплывали на поверхность. Она вспомнила, как встречалась с ним в этих же местах, как вместе они собирали вишню, смеялись и мечтали о будущем. Эта любовь была искренней, но из-за строгих традиций она была обречена.	1.2
84	Согревающая сердце магия зимней поры	2	1	Глинтвейн	sogrevayushaya-serdce-magiya-zimnej-pory	candles	{"top":"апельсиновая цедра, корица, лимон","heart":"клюква, красная смородина, яблочный сидр","base":"красное вино, древесина"}	Глинтвейн — это аромат, который мгновенно переносит в атмосферу праздника и зимнего уюта. Теплые ноты апельсина, лимона, яблочного сидра и клюквы создают пряно-фруктовую гармонию, напоминающую о рождественских вечерах. Натуральные эфирные масла апельсина, кедра и бучу добавляют глубину, делая аромат насыщенным и слегка древесным.\r\n\r\nВ аромадиффузоре этот запах раскрывается как глоток горячего глинтвейна: сначала вы чувствуете яркую цитрусовую свежесть, а затем погружаетесь в теплые, пряные аккорды, которые согревают и поднимают настроение. Идеально для создания праздничной атмосферы или просто для тех моментов, когда хочется почувствовать себя в центре зимней сказки.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/sogrevayushaya_serdce_can_100.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvc29ncmV2YXl1c2hheWFfc2VyZGNlX2Nhbl8xMDAuanBnIiwiaWF0IjoxNzQ0MTkzMDk5LCJleHAiOjE3NzU3MjkwOTl9.phCsyEGL1Oz8xSiaZpznMVxco-wZnDiTjSQne0NsRZA", "type": "100ml"}]	мл	Они встретились зимой. В это холодное время года единственным спасением от морозов был глинтвейн, продающийся на частых новогодних ярмарках. В один из таких дней в очереди он просто заговорил с девушкой, что стояла перед ним.\r\nЕё зелёные глаза и потрясающе красивая внешность пленили его с первого взгляда. Это была любовь.	2.1
172	Мгновение под дождём из лепестков цветущей сакуры	2	2	Цветущая японская сакура	cvetyushaya_yaposnkaya_sakura_diffusor	aroma-diffusers	{"top":"","base":"","heart":""}	Аромадиффузор с нотами сакуры, магнолии и вишни. Подходит для создания утончённой атмосферы в интерьере — напоминает аромат цветущего сада.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/mgnoveniye_dif_100.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvbWdub3Zlbml5ZV9kaWZfMTAwLmpwZyIsImlhdCI6MTc0Mzk1MDc0MywiZXhwIjoxNzc1NDg2NzQzfQ.rk0Pmfjz4QAKfJxen5sOUj7xgmRieJeuZg95rLzab8Q", "type": "100ml"}]	мл	Поздней весной, когда расцветала единственная в городе сакура, влюблённые часто гуляли возле неё. Тёплый ветер разносил розовые лепестки по всей округе, образовывая розовый ковёр поверх привычной взору зелёной травы.	2.2
82	Воспоминание о запретной любви в вишнёвом саду	1	1	Чёрная вишня мерло	vospominanie-o-zapretnoj-lyubvi-v-vishnyovom-sadu	candles	{"top":"яблоко, черная смородина","heart":"гвоздика, красное вино, черная вишня","base":"амбра, ваниль, дуб"}	Свеча с ароматом чёрной вишни, яблока, черной смородины, мерло и дуба. Идеальна для создания элегантной атмосферы — пряный аромат с лёгкими древесными нотами.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/vospominaniya_can_100.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvdm9zcG9taW5hbml5YV9jYW5fMTAwLmpwZyIsImlhdCI6MTc0NDE5MzIxMSwiZXhwIjoxNzc1NzI5MjExfQ.Zr4v18N5UCrrnHqR_-aPLCM7kAqcTlKvNKLBGFwPmK8", "type": "100ml"}, {"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/vospominaniya_can_45.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvdm9zcG9taW5hbml5YV9jYW5fNDUuanBnIiwiaWF0IjoxNzQ0MTkzMjgzLCJleHAiOjE3NzU3MjkyODN9.lVP8RWA6VBYGzsAGct4Cy9BeLj9YjqrnEIpPqI7F8Cw", "type": "45ml"}, {"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/vospominaniya_can_165.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvdm9zcG9taW5hbml5YV9jYW5fMTY1LmpwZyIsImlhdCI6MTc0NDE5MzI5OCwiZXhwIjoxNzc1NzI5Mjk4fQ.F4snipCVMk2tSvfIv5gQwSAdfnzgnAvq3VQSl5tp8HI", "type": "165ml"}, {"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/vospominanya_can_250.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvdm9zcG9taW5hbnlhX2Nhbl8yNTAuanBnIiwiaWF0IjoxNzQ0MTkzMzExLCJleHAiOjE3NzU3MjkzMTF9.tYmieeG3CEOPc9PyXXz2-97pqp2_SjlCbMpOa3keMjc", "type": "250ml"}]	мл	Девушка пошла в вишнёвый сад. Воспоминания о запретной любви, крепко скрываемой в её сердце, всплывали на поверхность. Она вспомнила, как встречалась с ним в этих же местах, как вместе они собирали вишню, смеялись и мечтали о будущем. Эта любовь была искренней, но из-за строгих традиций она была обречена.	1.2
83	Объятия тёплого вечера в тени старого дерева	1	1	Кашемировая слива	obuyatiya-tyoplogo-vechera-v-teni-starogo-dereva	candles	{"top":"цитрусовые","heart":"черная вишня, слива","base":"ваниль, фрезия, амбра, легкий мускус, сахар"}	Тёплый, сладкий аромат кашемировой сливы с нотами вишни, ванили и амбры. Идеально подойдёт для создания романтической атмосферы.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/objatya_can_100.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvb2JqYXR5YV9jYW5fMTAwLmpwZyIsImlhdCI6MTc0MzE2NTA2MywiZXhwIjoxNzc0NzAxMDYzfQ.UFdETQLPS0bzBIQxx-nRJuBQ-FSp7W0xzdeBfnWjB0A", "type": "100ml"}]	мл	Она заранее знала, что вечер будет именно таким - тёплым и уютным. Под тенью старого дерева, которое было свидетелем их детских споров и дружбы, с годами переросшей в любовь, девушка почувствовала, как летний ветер обнял её, унося прочь все тревоги. Она присела на землю и через мгновение увидела чью-то приближающуюся фигуру; не придав этому значения, перевела взгляд на благоухающие цветы.  Сердце забилось чаще. Показалось?  Он улыбнулся, и на секунду весь мир вокруг них замер. Всё, что они когда-то пережили вместе, все ожидания и печали, стали незначительными по сравнению с этой неожиданной встречей. \r\n– Я думал, что ты не придёшь, – сказал он, садясь рядом. Этот голос был обжигающе знакомым. \r\n– Я не могла бы избежать этой встречи, – ответила она, глядя в его зелёные глаза.	1.3
112	Отдых под могучим дубом с раскидистыми деревьями	3	2	Дубовый мох и янтарь	otdyh-pod-moguchim-dubom-s-raskidistymi-derevyami-aroma-diffusers	aroma-diffusers	{"top":"шалфей, апельсин, грейпфрут","heart":"лаванда","base":"амбра, бобы тонка, дубовый мох"}	Если у Вас остались вопросы, то обратитесь к нам через любые соцсети или почту.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/otdix_pod_moguchim_dif_50.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvb3RkaXhfcG9kX21vZ3VjaGltX2RpZl81MC5qcGciLCJpYXQiOjE3NDM5NTA3NjQsImV4cCI6MTc3NTQ4Njc2NH0.5keG2F5GbVxcJ3qGzoHD5SLql4aKWfZAVK17fnClFgA", "type": "45ml"}]	мл	Наконец она приблизилась к своему любимому месту в лесу - поляне, в центре которой одиноко рос могучий дуб. Нахлынули старые воспоминания. \r\nБудучи маленькой, девушка часто приходила сюда с семьёй. Именно здесь старший брат учил её лазать по деревьям, пока родители стелили плед, раскладывали тарелочки и разные вкусности. Конечно, потом детей ругали за опасные игры. \r\n-Я им много раз объясняла, что с дерева можно больно свалиться, но разве детство уймёшь?.. - Сказав это отцу, завершившему приготовления к пикнику, мама наконец позвала ребятишек. Они не заставили себя долго ждать и с радостными визгами побежали к красному клетчатому пледу, где уже лежали столь желанные сладости. \r\nОт того, что кусочки радостного детства теперь остались лишь в воспоминаниях, по щекам пошли слёзы. Прижавшись спиной к старому, покрытому мхом дубу, девушка почувствовала окутывающую её сладкую дрёму.	3.2
90	От жары спасал только стакан холодного мохито	3	1	Мятный мохито	ot-zhary-spasal-tolko-stakan-holodnogo-mohito	candles	{"top":" лайм, мята","heart":"жасмин, ананас","base":"ром"}	Мятный Мохито — это прохладный, освежающий аромат, который словно переносит вас на тропический пляж с бокалом любимого коктейля. Он начинается с ярких нот свежей мяты, которая бодрит и заряжает энергией. Затем раскрываются сочные акценты ананаса, лайма и легкий шлейф рома, добавляя тропическую сладость и игривость.\r\n\r\nВ аромадиффузоре этот запах раскрывается как глоток прохладного мохито: сначала вы чувствуете свежесть мяты, затем — цитрусовую легкость лайма, а в финале — сладковатые тропические ноты. Натуральные эфирные масла эвкалипта и мяты усиливают ощущение свежести и чистоты.\r\n\r\nИдеально для создания атмосферы легкости, бодрости и летнего настроения. Этот аромат — как мини-отпуск в вашем доме, который наполняет пространство энергией и радостью.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/ot_jari_can_100.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvb3RfamFyaV9jYW5fMTAwLmpwZyIsImlhdCI6MTc0NDE5MzM1MiwiZXhwIjoxNzc1NzI5MzUyfQ.mO_fYM2gCh5x-xj4D3COKdGG49d7-EZAnfNBsLzd7P8", "type": "100ml"}]	мл	Открыв глаза, она вспомнила: задремала у того самого дуба. Похоже, прошёл не один час: жара окутывала лес постепенно, но эта полянка не была покрыта листвой множества деревьев, и лишь тень старого дуба спасала от знойного пекла.\r\nКажется, она брала с собой мохито. Проверив сумку, она обнаружила ещё прохладный напиток. Льда, конечно, уже как не бывало.	3.3
95	Их совместное прошлое вспоминалось в тишине	5	1	Лаванда	ih-sovmestnoe-proshloe-vspominalos-v-tishine	candles	{"top":"древесина тикового дерева","heart":"кожа, кедр","base":"темный мускус, амирис, пачули, сандаловое дерево"}	Свеча с ароматом лаванды, эвкалипта и апельсинового цвета. Идеальна для создания расслабляющей атмосферы в спальне или ванной — травянистый аромат, который помогает расслабиться.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/ix_sovmestnoye_can_100.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvaXhfc292bWVzdG5veWVfY2FuXzEwMC5qcGciLCJpYXQiOjE3NDM5NjgwODcsImV4cCI6MTc3NTUwNDA4N30.DOBAzxS82t3vdMjOKyZe-6vuKMjI-Fw0oK1CNsu4zLc", "type": "100ml"}]	мл	Каждый раз, когда поздними вечерами они с братишкой слишком шумели, мама неизменно грозила:\r\n- Если продолжите, сказки сегодня отменяются.\r\n...И неизменно прощала эти детские забавы. Ведь какой ребёнок, даже если захочет, перестанет шуметь больше, чем на пять минут?\r\nКогда брат с сестрой наконец успокаивались и ложились, мама включала в их комнате ночник (младшая боялась темноты; старший, пусть и храбрился, на самом деле тоже боялся), открывала эту самую книжку на любимой детьми, порвавшейся от времени, изрисованной страничке, и тихо, но выразительно начинала читать вслух.	5.2
111	Долгожданная прогулка по лесной тропинке	3	2	Туман и папоротник	dolgozhdannaya-progulka-po-lesnoj-tropinke-aroma-diffusers	aroma-diffusers	{"top":"озон, бергамот","heart":"лаванда, мята","base":"мох, земля, можжевельник"}	Туман и Папоротник — это аромат, который переносит вас в сердце леса, окутанного утренним туманом. Он начинается с освежающих нот озона и бергамота, словно первый вдох чистого воздуха после дождя. Затем раскрываются успокаивающие аккорды лаванды и мяты, создавая ощущение гармонии и покоя. В основе — глубокие, землистые ноты зеленого мха, минералов и можжевельника, которые добавляют аромату природной силы и загадочности.\n\nВ аромадиффузоре этот запах раскрывается как прогулка по лесу: сначала вы чувствуете свежесть и легкость, затем — умиротворение, а в финале — глубокую, древесную grounding-энергию. Натуральные эфирные масла кедра, пачули, лимона, апельсина и лайма делают аромат живым и насыщенным.\n\nИдеально для тех, кто хочет создать атмосферу спокойствия, очищения и единения с природой. Этот аромат — как глоток свежего воздуха для души и дома.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/dolgojdanya_dif_50.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvZG9sZ29qZGFueWFfZGlmXzUwLmpwZyIsImlhdCI6MTc0Mzk2NzQzNCwiZXhwIjoxNzc1NTAzNDM0fQ.x7oxF3iH4M63fJkpBxs-Hos7ZnQ0tkdGZOc58qOtr6M", "type": "main"}]	мл	Это было самое жаркое лето за последнее десятилетие. После долгих откладываний этой прогулки она наконец решила выбраться в ближайший лес.\r\nЧтобы прийти к любимой полянке не в самое пекло, девушка пошла с утра, - пока солнце не успело войти в зенит.\r\nНа удивление, в этот раз было гораздо прохладнее, чем обычно - лес оказался окутан туманом, непривычно густым, будто незнакомым ему ранее. Даже папоротник вдоль тропинки был едва различим. К счастью, гостья леса знала эти места с детства, и ей уж точно было не заплутать среди хорошо знакомых деревьев.	3.1
86	Восторг наступившего лета в нежном букете	2	1	Пион и роза	vostorg-nastupivshego-leta-v-nezhnom-bukete	candles	{"top":"капли росы, нероли, бутон розы","heart":"пион, иланг-иланг, ландыш","base":"мускус, ваниль, бензоин, белый кедр"}	Пион и Роза — это нежный, романтичный аромат, который сочетает в себе мягкость пиона и изысканность розы. Пион придает композиции свежесть и легкую сладость, а роза добавляет глубину и элегантность. Вместе они создают гармоничный, цветочный букет, который наполняет пространство атмосферой нежности и уюта.\r\n\r\nВ аромадиффузоре этот запах раскрывается как весенний сад: сначала вы чувствуете яркие, свежие ноты пиона, а затем они плавно переходят в теплые, бархатистые аккорды розы. Идеально для создания расслабляющей и вдохновляющей атмосферы, которая напоминает о красоте природы.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/vostorg_can_100.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvdm9zdG9yZ19jYW5fMTAwLmpwZyIsImlhdCI6MTc0MzE2NDA4MCwiZXhwIjoxNzc0NzAwMDgwfQ.v51NPW6ocFQ3JE1nua4gwmqpQPp0zYnzHU7EGY4ajLw", "type": "100ml"}]	мл	Наступившее лето каждый день грело солнечными лучами.\r\nОн дарил ей букеты из любимых роз и пионов, она встречала его дома любимой выпечкой. \r\nОдним летним утром он сделал ей предложение - эту дату они праздновали потом ещё не одно десятилетие.	2.3
163	Отдых под могучим дубом с раскидистыми деревьями	3	3	Дубовый мох и янтарь	otdyh-pod-moguchim-dubom-s-raskidistymi-derevyami-aroma-sachet	aroma-sachet	{"top":"","base":"","heart":""}	Если у Вас остались вопросы, то обратитесь к нам через любые соцсети или почту.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/categories/category_sachet.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2F0ZWdvcmllcy9jYXRlZ29yeV9zYWNoZXQuanBnIiwiaWF0IjoxNzQzMTY4MjM3LCJleHAiOjE3NzQ3MDQyMzd9.qWIjfuZagB_kiaEN5jg8muwK0EmrA0BhZbRy6cTwuuI", "type": "main"}]	шт	Это было самое жаркое лето за последнее десятилетие. После долгих откладываний этой прогулки она наконец решила выбраться в ближайший лес.\nЧтобы прийти к любимой полянке не в самое пекло, девушка пошла с утра, - пока солнце не успело войти в зенит.\nНаконец она приблизилась к своему любимому месту в лесу - поляне, в центре которой одиноко рос могучий дуб. Нахлынули старые воспоминания. \nБудучи маленькой, девушка часто приходила сюда с семьёй. Именно здесь старший брат учил её лазать по деревьям, пока родители стелили плед, раскладывали тарелочки и разные вкусности. Конечно, потом детей ругали за опасные игры. \n-Я им много раз объясняла, что с дерева можно больно свалиться, но разве детство уймёшь?.. - Сказав это отцу, завершившему приготовления к пикнику, мама наконец позвала ребятишек. Они не заставили себя долго ждать и с радостными визгами побежали к красному клетчатому пледу, где уже лежали столь желанные сладости. \nОт того, что кусочки радостного детства теперь остались лишь в воспоминаниях, по щекам пошли слёзы. Прижавшись спиной к старому, покрытому мхом дубу, девушка почувствовала окутывающую её сладкую дрёму.	3.2
107	Согревающая сердце магия зимней поры	2	2	Глинтвейн	sogrevayushaya-serdce-magiya-zimnej-pory-aroma-diffusers	aroma-diffusers	{"top":"апельсиновая цедра, корица, лимон","heart":"клюква, красная смородина, яблочный сидр","base":"красное вино, древесина"}	Глинтвейн — это аромат, который мгновенно переносит в атмосферу праздника и зимнего уюта. Теплые ноты апельсина, лимона, яблочного сидра и клюквы создают пряно-фруктовую гармонию, напоминающую о рождественских вечерах. Натуральные эфирные масла апельсина, кедра и бучу добавляют глубину, делая аромат насыщенным и слегка древесным.\n\nВ аромадиффузоре этот запах раскрывается как глоток горячего глинтвейна: сначала вы чувствуете яркую цитрусовую свежесть, а затем погружаетесь в теплые, пряные аккорды, которые согревают и поднимают настроение. Идеально для создания праздничной атмосферы или просто для тех моментов, когда хочется почувствовать себя в центре зимней сказки.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/sogrevayushaya_serdce_dif_50.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvc29ncmV2YXl1c2hheWFfc2VyZGNlX2RpZl81MC5qcGciLCJpYXQiOjE3NDQxOTM1NTYsImV4cCI6MTc3NTcyOTU1Nn0.5U4OXg7tYEcAglMAQrbIa1QTKZiUqGcGiBuf08ssp4A", "type": "45ml"}]	мл	Они встретились зимой. В это холодное время года единственным спасением от морозов был глинтвейн, продающийся на частых новогодних ярмарках. В один из таких дней в очереди он просто заговорил с девушкой, что стояла перед ним.\r\nЕё зелёные глаза и потрясающе красивая внешность пленили его с первого взгляда. Это была любовь.	2.1
91	На кухне пеклась малиновая шарлотка	4	1	Чёрная малина и ваниль	na-kuhne-peklas-malinovaya-sharlotka	candles	{"top":"черешня","heart":"малина, клубника, слива","base":"мускус, ваниль, сахар"}	Свеча с нотами черешни, малины и ванили. Подходит для вечеров дома — вызывает ассоциации с ягодным десертом.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/na_kuhne_peklas_can_100.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvbmFfa3VobmVfcGVrbGFzX2Nhbl8xMDAuanBnIiwiaWF0IjoxNzQ0NTI5ODEwLCJleHAiOjE3NzYwNjU4MTB9.fjKG0YM2VC4M59h8l9A27lhzVEa6PwaJivsKJwfd050", "type": "100ml"}, {"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/na_kuhne_peklas_can_45.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvbmFfa3VobmVfcGVrbGFzX2Nhbl80NS5qcGciLCJpYXQiOjE3NDQ1Mjk4MzgsImV4cCI6MTc3NjA2NTgzOH0.7hOHnmPo3LQzHFNRIQwxH8-YAE9K3O9PNh3-2_OeGI0", "type": "45ml"}, {"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/na_kuhne_peklas_can_165.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvbmFfa3VobmVfcGVrbGFzX2Nhbl8xNjUuanBnIiwiaWF0IjoxNzQ0NTI5ODgzLCJleHAiOjE3NzYwNjU4ODN9.SmcHS-K_7LYKCX6xwtUYwSUlwc4HFcOhPxi6GNbndtQ", "type": "165ml"}, {"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/na_kuhne_peklas_can_250.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvbmFfa3VobmVfcGVrbGFzX2Nhbl8yNTAuanBnIiwiaWF0IjoxNzQ0NTI5ODkzLCJleHAiOjE3NzYwNjU4OTN9.asCVd8PM13WASdht7fg1asMC1Tut1dCHeIk371QlM6o", "type": "250ml"}]	мл	Он должен подойти с минуты на минуту.\r\nДевушка переживала. Съехались они неделю назад, но отпраздновать переезд пока не успели. Новая кухня, как она и мечтала, была очень уютной.\r\nК его приходу она пекла малиновую шарлотку. Аромат выпечки витал по квартире, окутывая каждый уголок сладкой смесью малины и ванили.	4.1
160	Восторг наступившего лета в нежном букете	2	3	Пион и роза	vostorg-nastupivshego-leta-v-nezhnom-bukete-aroma-sachet	aroma-sachet	{"top":"","base":"","heart":""}	Если у Вас остались вопросы, то обратитесь к нам через любые соцсети или почту.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/categories/category_sachet.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2F0ZWdvcmllcy9jYXRlZ29yeV9zYWNoZXQuanBnIiwiaWF0IjoxNzQzMTY4MjM3LCJleHAiOjE3NzQ3MDQyMzd9.qWIjfuZagB_kiaEN5jg8muwK0EmrA0BhZbRy6cTwuuI", "type": "main"}]	шт	Наступившее лето каждый день грело солнечными лучами.\r\nОн дарил ей букеты из любимых роз и пионов, она встречала его дома любимой выпечкой. \r\nОдним летним утром он сделал ей предложение - эту дату они праздновали потом ещё не одно десятилетие.	2.3
94	Он подарил ей книгу на старом чердаке	5	1	Библиотека	on-podaril-ej-knigu-na-starom-cherdake	candles	{"top":"древесина тикового дерева","heart":"кожа, кедр","base":"темный мускус, амирис, пачули, сандаловое дерево"}	Ароматическая свеча с ароматом тикового дерева, кожи и сандала. Тёплый, уютный аромат старых книг и деревянных полок.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/on_podaril_can_45.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvb25fcG9kYXJpbF9jYW5fNDUuanBnIiwiaWF0IjoxNzQzOTUwNjIxLCJleHAiOjE3NzU0ODY2MjF9.iBTw97ZKTifJf7ECRCtNmiCw5dHyhjexW6wuxhtOZUA", "type": "45ml"}, {"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/on_podaril_can_100.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvb25fcG9kYXJpbF9jYW5fMTAwLmpwZyIsImlhdCI6MTc0Mzk1MDY0MiwiZXhwIjoxNzc1NDg2NjQyfQ.Yx9LTIKHSYRcBZTZfmdssqbEL8INilsM0LeZ1LZWU4w", "type": "100ml"}, {"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/on_podaril_can_165.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvb25fcG9kYXJpbF9jYW5fMTY1LmpwZyIsImlhdCI6MTc0Mzk1MDY2MywiZXhwIjoxNzc1NDg2NjYzfQ.PO9WG7kgcLLWjQSSTtTFRnOsuAZsGCPosUVfTtFsysY", "type": "165ml"}, {"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/on_podaril_can_250.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvb25fcG9kYXJpbF9jYW5fMjUwLmpwZyIsImlhdCI6MTc0Mzk1MDY4NiwiZXhwIjoxNzc1NDg2Njg2fQ.sBgwxGMe9VLobnjX8g34oItdWeshRMtBYUU2sW43gOw", "type": "250ml"}]	мл	Старый чердак. Вдох. \r\nПоследняя игра с братишкой растворилась в пучине времени. В последние годы время текло всё стремительнее, унося дальше и дальше тёплые воспоминания. Всё, что она могла, чтобы в голове любимая картинка всплывала так же чётко, как и пятнадцать лет назад - оставить здесь всё на своих местах. \r\nСтарый диван, который теперь больше смахивал на антиквариат, проскрипел под весом девушки; в следующее мгновение парень, внешне старше лет на пять, сел на соседнее место.\r\n-Знаешь, я разбирал библиотеку родителей после...\r\n-Давай не будем, - отрезала она, - мне ещё тяжело говорить об этом.\r\n-Хорошо, - на несколько мгновений комната погрузилась в тишину, - В любом случае, держи.\r\nОн протянул девушке книгу. На осознание понадобилось несколько секунд. Это сказки. Сборник детских сказок, которые мама читала детям вечерами.	5.1
106	Объятия тёплого вечера в тени старого дерева	1	2	 Кашемировая слива	obuyatiya-tyoplogo-vechera-v-teni-starogo-dereva-aroma-diffusers	aroma-diffusers	{"top":"цитрусовые","heart":"черная вишня, слива","base":"ваниль, фрезия, амбра, легкий мускус, сахар"}	Аромадиффузор с нотами цитруса, сливы, ванили и амбры. Обволакивающий, тёплый аромат для привнесения романтики в интерьер.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/objatya_dif_45.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvb2JqYXR5YV9kaWZfNDUuanBnIiwiaWF0IjoxNzQzMTY1MDg1LCJleHAiOjE3NzQ3MDEwODV9.foevS5c76wQRsIjcW9CIsVgBuNXdcnNbWxLPm6b5_Fg", "type": "100ml"}]	мл	Она заранее знала, что вечер будет именно таким - тёплым и уютным. Под тенью старого дерева, которое было свидетелем их детских споров и дружбы, с годами переросшей в любовь, девушка почувствовала, как летний ветер обнял её, унося прочь все тревоги. Она присела на землю и через мгновение увидела чью-то приближающуюся фигуру; не придав этому значения, перевела взгляд на благоухающие цветы.  Сердце забилось чаще. Показалось?  Он улыбнулся, и на секунду весь мир вокруг них замер. Всё, что они когда-то пережили вместе, все ожидания и печали, стали незначительными по сравнению с этой неожиданной встречей. \r\n– Я думал, что ты не придёшь, – сказал он, садясь рядом. Этот голос был обжигающе знакомым. \r\n– Я не могла бы избежать этой встречи, – ответила она, глядя в его зелёные глаза.	1.3
115	В воздухе витал аромат фруктовой тарелки	4	2	Персик манго беллини	v-vozduhe-vital-aromat-fruktovoj-tarelki-aroma-diffusers	aroma-diffusers	{"top":"мандарин, персик","heart":"манго, гвоздика, маракуйя","base":"сандаловое дерево, петитгрейн"}	Персик Манго Беллини — это тропический аромат, который дарит ощущение праздника и летнего настроения. Он начинается с сочных нот мандарина и персика, создавая яркий, фруктовый взрыв. Затем раскрываются теплые аккорды сандалового дерева и петитгрейна, которые добавляют аромату глубины и мягкости, балансируя его сладость.\n\nВ аромадиффузоре этот запах раскрывается как глоток освежающего коктейля: сначала вы чувствуете свежесть цитрусов, затем — сладость персика и манго, а в финале — теплые, древесные ноты. Натуральные эфирные масла сосны, цитронеллы и петитгрейна делают аромат еще более живым и насыщенным.\n\nИдеально для создания атмосферы радости, легкости и летнего настроения. Этот аромат — как кусочек тропиков в вашем доме, который поднимает настроение и наполняет пространство солнечной энергией.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/v_vozduhe_dif_50.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvdl92b3pkdWhlX2RpZl81MC5qcGciLCJpYXQiOjE3NDM5NjcxNjUsImV4cCI6MTc3NTUwMzE2NX0.ctBKXhEA-BaDs1PeDA9regkphzi_dqdXc09W4904HZ8", "type": "50ml"}]	мл	В воздухе витал экзотический аромат фруктовой тарелки   Персик, манго, беллини   "Думаю, успею", - с этими мыслями она приступила к фруктовой тарелке. Сочные персики было легко нарезать; манго слегка недозрел, поэтому косточка отделялась тяжело. Она разрезала мякоть на квадратики и красиво разложила фрукты на тарелку.  За окном битый час шёл дождь. "Не промокнет ли он?" - последняя мысль, которая прервалась звонком в домофон. В такие моменты мчишься к нему быстрее всех на свете - когда любимый человек наконец приходит домой.	4.2
81	Тайна маскарада под звёздным небом	1	1	Абсент чёрная смородина	tajna-maskarada-pod-zvyozdnym-nebom	candles	{"top":"яблоко, шафран","heart":"ваниль, ежевика, черная смородина","base":"анис, амбра, пачули"}	Свеча с нотами абсента, чёрной смородины и мускуса. Подходит для вечеров — аромат пряный, глубокий, загадочный, вызывает ассоциации с творчеством и уединением.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/tajna_can_100.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvdGFqbmFfY2FuXzEwMC5qcGciLCJpYXQiOjE3NDMxNjM4NjUsImV4cCI6MTc3NDY5OTg2NX0.CRRDBra3G9hNIDyPUDP6ye4agPd7cNRvW6Zh4cTQiKE", "type": "100ml"}, {"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/tajna_can_45.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvdGFqbmFfY2FuXzQ1LmpwZyIsImlhdCI6MTc0MzE2Mzg0MSwiZXhwIjoxNzc0Njk5ODQxfQ.449GBoZ_6oB6GkA9jT_nVvDmEs8lrlg0JlAUI7N-EDY", "type": "45ml"}, {"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/tajna_can_165.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvdGFqbmFfY2FuXzE2NS5qcGciLCJpYXQiOjE3NDMxNjM5MjIsImV4cCI6MTc3NDY5OTkyMn0.hA-imjO5-0lFo5hpbdHHLI6fccntrQhV4LC0-sMDT5Q", "type": "165ml"}, {"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/tajna_can_250.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvdGFqbmFfY2FuXzI1MC5qcGciLCJpYXQiOjE3NDMxNjM5MzEsImV4cCI6MTc3NDY5OTkzMX0.YoK78hq4hZa4CWnCW-LG5o8btmpPugXVD1eM_xkA2AE", "type": "250ml"}]	мл	В летнюю ночь, когда звёзды сияли, как драгоценные камни с витрины, на маскараде собрались нарядные люди. Свет фонарей создавал волшебную атмосферу, а тёплый ветерок шевелил лёгкие ткани костюмов. Среди толпы выделялась девушка в платье цвета ночи, её маска завораживала блеском лунного света. Полная загадок, она танцевала, будто сама была частью неба.	1.1
135	Согревающая сердце магия зимней поры	2	3	Глинтвейн	sogrevayushaya-serdce-magiya-zimnej-pory-aroma-sachet	aroma-sachet	{"top":"апельсиновая цедра, корица, лимон","heart":"клюква, красная смородина, яблочный сидр","base":"красное вино, древесина"}	Пряно-фруктовые ноты апельсина, корицы и клюквы идеальны для зимнего гардероба. Они создают праздничное настроение и оставляют на одежде легкий, согревающий шлейф, который напоминает о рождественских вечерах.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/categories/category_sachet.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2F0ZWdvcmllcy9jYXRlZ29yeV9zYWNoZXQuanBnIiwiaWF0IjoxNzQzMTY4MjM3LCJleHAiOjE3NzQ3MDQyMzd9.qWIjfuZagB_kiaEN5jg8muwK0EmrA0BhZbRy6cTwuuI", "type": "main"}]	шт	Они встретились зимой. В это холодное время года единственным спасением от морозов был глинтвейн, продающийся на частых новогодних ярмарках. В один из таких дней в очереди он просто заговорил с девушкой, что стояла перед ним.\r\nЕё зелёные глаза и потрясающе красивая внешность пленили его с первого взгляда. Это была любовь.	2.1
110	Осенью вновь и вновь хотелось любимого кофе	2	2	Кофейня	osenyu-vnov-i-vnov-hotelos-lyubimogo-kofe-aroma-diffusers	aroma-diffusers	{"top":" кофе","heart":"карамель, сахар","base":"ваниль, молоко"}	Аромадиффузор с запахом кофе, ванили, молока и карамели. Подходит для создания уютной и тёплой атмосферы в гостиной или кафе — аромат, напоминающий о любимой кофейне.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/osenyu_dif_50.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvb3Nlbnl1X2RpZl81MC5qcGciLCJpYXQiOjE3NDMxNjQyNzAsImV4cCI6MTc3NDcwMDI3MH0.9uy1CsC1qFZcpMA5_phJ8lSKVsgOJlvLkbSGZ_C_iwk", "type": "50ml"}]	мл	Осенью постоянно хотелось греться в объятиях друг друга. Когда температура вокруг стремительно падает, сохранять тепло внутри себя им помогали совместные вечера просмотров фильмов под пледом.\r\nПрогулки пары часто заканчивались посиделками в кофейне неподалёку от дома - там особенно хорошо готовили латте, посыпали его корицей.	2.4
114	На кухне пеклась малиновая шарлотка	4	2	Чёрная малина и ваниль	na-kuhne-peklas-malinovaya-sharlotka-aroma-diffusers	aroma-diffusers	{"top":"черешня","heart":"малина, клубника, слива","base":"мускус, ваниль, сахар"}	Диффузор с нотами ягод, ванили и сахара. Идеален для расслабления дома — аромат ассоциируется с теплом и безмятежностью.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/na_kuhne_peklas_dif_50.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvbmFfa3VobmVfcGVrbGFzX2RpZl81MC5qcGciLCJpYXQiOjE3NDQ1Mjk5MTksImV4cCI6MTc3NjA2NTkxOX0.exB1iaBiQ-GfRKtk3E4kQmUSoxLCh6uZt3Klxkxi2pM", "type": "50ml"}, {"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/na_kuhne_peklas_dif_100.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvbmFfa3VobmVfcGVrbGFzX2RpZl8xMDAuanBnIiwiaWF0IjoxNzQ0NTI5OTUwLCJleHAiOjE3NzYwNjU5NTB9.a-4K85WIfG4PkUqzpCwcgNtZuMQPBfnHpbXFsGg3_Hc", "type": "100ml"}]	мл	Он должен подойти с минуты на минуту.\r\nДевушка переживала. Съехались они неделю назад, но отпраздновать переезд пока не успели. Новая кухня, как она и мечтала, была очень уютной.\r\nК его приходу она пекла малиновую шарлотку. Аромат выпечки витал по квартире, окутывая каждый уголок сладкой смесью малины и ванили.	4.1
93	Бутылка грушевого коньяка стала изюминкой вечера	4	1	Коньячная груша	butylka-grushevogo-konyaka-stala-izyuminkoj-vechera	candles	{"top":"корица, гвоздика","heart":"груша, яблоко, яблочный сидр","base":"сахар, бренди"}	Коньячная Груша — это аромат, который сочетает в себе сладость спелой груши и теплые ноты выдержанного бренди. Он начинается с сочных, ярких акцентов груши, которые сразу же поднимают настроение. Затем раскрываются глубокие, насыщенные ноты бренди, выдержанного в дубовых бочках, добавляя аромату изысканности и тепла.\r\n\r\nВ аромадиффузоре этот запах раскрывается как глоток изысканного десерта: сначала вы чувствуете свежесть и сладость груши, а затем — теплые, слегка пряные ноты коньяка. Обновленная версия стала более мягкой, что позволяет груше играть главную роль, сохраняя при этом глубину и уют.\r\n\r\nИдеально для создания атмосферы комфорта и изысканности. Этот аромат — как теплый осенний вечер, проведенный в уютном кресле с бокалом хорошего напитка. Он наполняет дом теплом и сладким уютом.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/butilka_can_100.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvYnV0aWxrYV9jYW5fMTAwLmpwZyIsImlhdCI6MTc0MzE2NDM2NywiZXhwIjoxNzc0NzAwMzY3fQ.TXgWAUTh8H15vq6W7UEW0QRhRVJhqzb-lShIaLOqz1Q", "type": "100ml"}, {"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/butilka_can_45.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvYnV0aWxrYV9jYW5fNDUuanBnIiwiaWF0IjoxNzQzMTY0NDA5LCJleHAiOjE3NzQ3MDA0MDl9.pBLlEdIb2E0ugId4yfj-ZYADzj9UpuYFnVJCfR9uPLE", "type": "45ml"}, {"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/butilka_can_165.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvYnV0aWxrYV9jYW5fMTY1LmpwZyIsImlhdCI6MTc0MzE2NDQzOSwiZXhwIjoxNzc0NzAwNDM5fQ.HuFjR7WfA9jrFOBBPM6WwrS_0WeVicJKxci1S2WzrBY", "type": "165ml"}, {"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/butilka_can_250.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvYnV0aWxrYV9jYW5fMjUwLmpwZyIsImlhdCI6MTc0MzE2NDQ0NywiZXhwIjoxNzc0NzAwNDQ3fQ.doAALRp8w9_Xx8IJRe5QqhRt8n8H1o5YjCdIus-5OJM", "type": "250ml"}]	мл	Пока он поднимался, она вытащила из духовки шарлотку. Та слегка подгорела, как и всегда. \r\n"Только на этот раз это случилось в новой духовке", - иронично подчеркнула хозяйка квартиры.\r\nДверь открылась. Она пошла встречать любимого. \r\n- А я сюрприз приготовила, - сказала она, - наконец отпразднуем переезд. Оказалось, их мысли совпали. Он протянул ей бутылку грушевого коньяка.	4.3
88	Долгожданная прогулка по лесной тропинке	3	1	Туман и папоротник	dolgozhdannaya-progulka-po-lesnoj-tropinke	candles	{"top":"озон, бергамот","heart":"лаванда, мята","base":"мох, земля, можжевельник"}	Туман и Папоротник — это аромат, который переносит вас в сердце леса, окутанного утренним туманом. Он начинается с освежающих нот озона и бергамота, словно первый вдох чистого воздуха после дождя. Затем раскрываются успокаивающие аккорды лаванды и мяты, создавая ощущение гармонии и покоя. В основе — глубокие, землистые ноты зеленого мха, минералов и можжевельника, которые добавляют аромату природной силы и загадочности.\r\n\r\nВ аромадиффузоре этот запах раскрывается как прогулка по лесу: сначала вы чувствуете свежесть и легкость, затем — умиротворение, а в финале — глубокую, древесную grounding-энергию. Натуральные эфирные масла кедра, пачули, лимона, апельсина и лайма делают аромат живым и насыщенным.\r\n\r\nИдеально для тех, кто хочет создать атмосферу спокойствия, очищения и единения с природой. Этот аромат — как глоток свежего воздуха для души и дома.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/dolgojdanya_can_100.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvZG9sZ29qZGFueWFfY2FuXzEwMC5qcGciLCJpYXQiOjE3NDM5Njc0NDYsImV4cCI6MTc3NTUwMzQ0Nn0.g_RrgEq9zowQW_qlqNEBVj_j4LVSogG-_I-kwOSmM6U", "type": "main"}]	мл	Это было самое жаркое лето за последнее десятилетие. После долгих откладываний этой прогулки она наконец решила выбраться в ближайший лес.\r\nЧтобы прийти к любимой полянке не в самое пекло, девушка пошла с утра, - пока солнце не успело войти в зенит.\r\nНа удивление, в этот раз было гораздо прохладнее, чем обычно - лес оказался окутан туманом, непривычно густым, будто незнакомым ему ранее. Даже папоротник вдоль тропинки был едва различим. К счастью, гостья леса знала эти места с детства, и ей уж точно было не заплутать среди хорошо знакомых деревьев.	3.1
104	Тайна маскарада под звёздным небом	1	2	Абсент чёрная смородина	tajna-maskarada-pod-zvyozdnym-nebom-aroma-diffusers	aroma-diffusers	{"top":"яблоко, шафран","heart":"ваниль, ежевика, черная смородина","base":"анис, амбра, пачули"}	Диффузор с ароматом аниса, ягод чёрной смородины и амбры. Отлично для кабинета или спальни — ассоциируется с глубиной, уединением и изысканностью.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/tajna_dif_50.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvdGFqbmFfZGlmXzUwLmpwZyIsImlhdCI6MTc0MzE2Mzk0OSwiZXhwIjoxNzc0Njk5OTQ5fQ.fJQi5j-szikXOLnmeEHE-Y36vTpYFkqs9XK6jiDzpfc", "type": "50ml"}]	мл	В летнюю ночь, когда звёзды сияли, как драгоценные камни с витрины, на маскараде собрались нарядные люди. Свет фонарей создавал волшебную атмосферу, а тёплый ветерок шевелил лёгкие ткани костюмов. Среди толпы выделялась девушка в платье цвета ночи, её маска завораживала блеском лунного света. Полная загадок, она танцевала, будто сама была частью неба.	1.1
116	Бутылка грушевого коньяка стала изюминкой вечера	4	2	Коньячная груша	butylka-grushevogo-konyaka-stala-izyuminkoj-vechera-aroma-diffusers	aroma-diffusers	{"top":"корица, гвоздика","heart":"груша, яблоко, яблочный сидр","base":"сахар, бренди"}	Коньячная Груша — это аромат, который сочетает в себе сладость спелой груши и теплые ноты выдержанного бренди. Он начинается с сочных, ярких акцентов груши, которые сразу же поднимают настроение. Затем раскрываются глубокие, насыщенные ноты бренди, выдержанного в дубовых бочках, добавляя аромату изысканности и тепла.\n\nВ аромадиффузоре этот запах раскрывается как глоток изысканного десерта: сначала вы чувствуете свежесть и сладость груши, а затем — теплые, слегка пряные ноты коньяка. Обновленная версия стала более мягкой, что позволяет груше играть главную роль, сохраняя при этом глубину и уют.\n\nИдеально для создания атмосферы комфорта и изысканности. Этот аромат — как теплый осенний вечер, проведенный в уютном кресле с бокалом хорошего напитка. Он наполняет дом теплом и сладким уютом.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/butilka_dif_50.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvYnV0aWxrYV9kaWZfNTAuanBnIiwiaWF0IjoxNzQ0NTMwMDQ0LCJleHAiOjE3NzYwNjYwNDR9.Z5pQXPnsaFviSC1_ogfpB4I1poa8uCpgUQ0dZWMVDFI", "type": "50ml"}]	мл	Пока он поднимался, она вытащила из духовки шарлотку. Та слегка подгорела, как и всегда. \r\n"Только на этот раз это случилось в новой духовке", - иронично подчеркнула хозяйка квартиры.\r\nДверь открылась. Она пошла встречать любимого. \r\n- А я сюрприз приготовила, - сказала она, - наконец отпразднуем переезд. Оказалось, их мысли совпали. Он протянул ей бутылку грушевого коньяка.	4.3
87	Осенью вновь и вновь хотелось любимого кофе	2	1	Кофейня	osenyu-vnov-i-vnov-hotelos-lyubimogo-kofe	candles	{"top":" кофе","heart":"карамель, сахар","base":"ваниль, молоко"}	Свеча с ароматом свежесваренного кофе, ванили, молока и карамели. Идеальна для создания уютной атмосферы в кафе или доме — аромат теплого кофе и сладких десертов.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/osenyu_can_100.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvb3Nlbnl1X2Nhbl8xMDAuanBnIiwiaWF0IjoxNzQzMTY0Mjg4LCJleHAiOjE3NzQ3MDAyODh9.eCdfS5JetwsEeJ_o7fwKCLkqDdn8FXv3_bu4TivH-ZI", "type": "100ml"}]	мл	Осенью постоянно хотелось греться в объятиях друг друга. Когда температура вокруг стремительно падает, сохранять тепло внутри себя им помогали совместные вечера просмотров фильмов под пледом.\r\nПрогулки пары часто заканчивались посиделками в кофейне неподалёку от дома - там особенно хорошо готовили латте, посыпали его корицей.	2.4
89	Отдых под могучим дубом с раскидистыми деревьями	3	1	Дубовый мох и янтарь	otdyh-pod-moguchim-dubom-s-raskidistymi-derevyami	candles	{"top":"шалфей, апельсин, грейпфрут","heart":"лаванда","base":"амбра, бобы тонка, дубовый мох"}	Если у Вас остались вопросы, то обратитесь к нам через любые соцсети или почту.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/otdix_pod_moguchim_can_45.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvb3RkaXhfcG9kX21vZ3VjaGltX2Nhbl80NS5qcGciLCJpYXQiOjE3NDM5NTA4MTgsImV4cCI6MTc3NTQ4NjgxOH0.My-iJiAiURKXwaSxHWqltAV0-voYDI7vw6yW_AeAFVw", "type": "45ml"}, {"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/otdix_pod_moguchim_can_100.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvb3RkaXhfcG9kX21vZ3VjaGltX2Nhbl8xMDAuanBnIiwiaWF0IjoxNzQzOTUwODI0LCJleHAiOjE3NzU0ODY4MjR9.TOjy_RYpqdHzb-Q1H5h0VF4er57LR3QnW2-as0NUla4", "type": "100ml"}, {"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/otdix_pod_moguchim_can_165.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvb3RkaXhfcG9kX21vZ3VjaGltX2Nhbl8xNjUuanBnIiwiaWF0IjoxNzQzOTUwODMwLCJleHAiOjE3NzU0ODY4MzB9.q2pkce6TGU5pYX8OyfqwgoezMtBo4lbqMVRrbteZM5s", "type": "165ml"}, {"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/otdix_pod_moguchim_can_250.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvb3RkaXhfcG9kX21vZ3VjaGltX2Nhbl8yNTAuanBnIiwiaWF0IjoxNzQzOTUwOTY1LCJleHAiOjE3NzU0ODY5NjV9.5J3uTu6vMSxxet0BRDuZMvlqki78WtVVMu7iKohMZA8", "type": "250ml"}]	мл	Наконец она приблизилась к своему любимому месту в лесу - поляне, в центре которой одиноко рос могучий дуб. Нахлынули старые воспоминания. \r\nБудучи маленькой, девушка часто приходила сюда с семьёй. Именно здесь старший брат учил её лазать по деревьям, пока родители стелили плед, раскладывали тарелочки и разные вкусности. Конечно, потом детей ругали за опасные игры. \r\n-Я им много раз объясняла, что с дерева можно больно свалиться, но разве детство уймёшь?.. - Сказав это отцу, завершившему приготовления к пикнику, мама наконец позвала ребятишек. Они не заставили себя долго ждать и с радостными визгами побежали к красному клетчатому пледу, где уже лежали столь желанные сладости. \r\nОт того, что кусочки радостного детства теперь остались лишь в воспоминаниях, по щекам пошли слёзы. Прижавшись спиной к старому, покрытому мхом дубу, девушка почувствовала окутывающую её сладкую дрёму.	3.2
92	В воздухе витал аромат фруктовой тарелки	4	1	Персик манго беллини	v-vozduhe-vital-aromat-fruktovoj-tarelki	candles	{"top":"мандарин, персик","heart":"манго, гвоздика, маракуйя","base":"сандаловое дерево, петитгрейн"}	Персик Манго Беллини — это тропический аромат, который дарит ощущение праздника и летнего настроения. Он начинается с сочных нот мандарина и персика, создавая яркий, фруктовый взрыв. Затем раскрываются теплые аккорды сандалового дерева и петитгрейна, которые добавляют аромату глубины и мягкости, балансируя его сладость.\r\n\r\nВ аромадиффузоре этот запах раскрывается как глоток освежающего коктейля: сначала вы чувствуете свежесть цитрусов, затем — сладость персика и манго, а в финале — теплые, древесные ноты. Натуральные эфирные масла сосны, цитронеллы и петитгрейна делают аромат еще более живым и насыщенным.\r\n\r\nИдеально для создания атмосферы радости, легкости и летнего настроения. Этот аромат — как кусочек тропиков в вашем доме, который поднимает настроение и наполняет пространство солнечной энергией.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/v_vozduhe_can_100.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvdl92b3pkdWhlX2Nhbl8xMDAuanBnIiwiaWF0IjoxNzQzMTY0MzQyLCJleHAiOjE3NzQ3MDAzNDJ9.FS1tr9EtOPwTd06rQu-HfrYsC14sVhzXNMtna0Avv08", "type": "100ml"}]	мл	В воздухе витал экзотический аромат фруктовой тарелки  \r\nПерсик, манго, беллини  \r\n"Думаю, успею", - с этими мыслями она приступила к фруктовой тарелке.\r\nСочные персики было легко нарезать; манго слегка недозрел, поэтому косточка отделялась тяжело. Она разрезала мякоть на квадратики и красиво разложила фрукты на тарелку. \r\nЗа окном битый час шёл дождь.\r\n"Не промокнет ли он?" - последняя мысль, которая прервалась звонком в домофон. В такие моменты мчишься к нему быстрее всех на свете - когда любимый человек наконец приходит домой.	4.2
117	Он подарил ей книгу на старом чердаке	5	2	Библиотека	on-podaril-ej-knigu-na-starom-cherdake-aroma-diffusers	aroma-diffusers	{"top":"древесина тикового дерева","heart":"кожа, кедр","base":"темный мускус, амирис, пачули, сандаловое дерево"}	Аромадиффузор с нотами тикового дерева, кожи и мускуса. Уютный, теплый аромат старинной библиотеки для дома или офиса.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/on_podaril_dif_50.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvb25fcG9kYXJpbF9kaWZfNTAuanBnIiwiaWF0IjoxNzQzOTUwNTk1LCJleHAiOjE3NzU0ODY1OTV9.opQ5ifPl27eacGeVIwqr8WHwQe8a6bZemtG1y5jsr5E", "type": "50ml"}]	мл	Старый чердак. Вдох. \r\nПоследняя игра с братишкой растворилась в пучине времени. В последние годы время текло всё стремительнее, унося дальше и дальше тёплые воспоминания. Всё, что она могла, чтобы в голове любимая картинка всплывала так же чётко, как и пятнадцать лет назад - оставить здесь всё на своих местах. \r\nСтарый диван, который теперь больше смахивал на антиквариат, проскрипел под весом девушки; в следующее мгновение парень, внешне старше лет на пять, сел на соседнее место.\r\n-Знаешь, я разбирал библиотеку родителей после...\r\n-Давай не будем, - отрезала она, - мне ещё тяжело говорить об этом.\r\n-Хорошо, - на несколько мгновений комната погрузилась в тишину, - В любом случае, держи.\r\nОн протянул девушке книгу. На осознание понадобилось несколько секунд. Это сказки. Сборник детских сказок, которые мама читала детям вечерами.	5.1
109	Восторг наступившего лета в нежном букете	2	2	Пион и роза	vostorg-nastupivshego-leta-v-nezhnom-bukete-aroma-diffusers	aroma-diffusers	{"top":"капли росы, нероли, бутон розы","heart":"пион, иланг-иланг, ландыш","base":"мускус, ваниль, бензоин, белый кедр"}	Пион и Роза — это нежный, романтичный аромат, который сочетает в себе мягкость пиона и изысканность розы. Пион придает композиции свежесть и легкую сладость, а роза добавляет глубину и элегантность. Вместе они создают гармоничный, цветочный букет, который наполняет пространство атмосферой нежности и уюта.\n\nВ аромадиффузоре этот запах раскрывается как весенний сад: сначала вы чувствуете яркие, свежие ноты пиона, а затем они плавно переходят в теплые, бархатистые аккорды розы. Идеально для создания расслабляющей и вдохновляющей атмосферы, которая напоминает о красоте природы.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/vostorg_dif_50.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvdm9zdG9yZ19kaWZfNTAuanBnIiwiaWF0IjoxNzQzMTY0MTA1LCJleHAiOjE3NzQ3MDAxMDV9.yMNmgOOX53DYuOqUSPb_fHTU0vcfjNE_hEF4rv7kTsU", "type": "50ml"}]	мл	Наступившее лето каждый день грело солнечными лучами.\r\nОн дарил ей букеты из любимых роз и пионов, она встречала его дома любимой выпечкой. \r\nОдним летним утром он сделал ей предложение - эту дату они праздновали потом ещё не одно десятилетие.	2.3
118	Их совместное прошлое вспоминалось в тишине	5	2	Лаванда	ih-sovmestnoe-proshloe-vspominalos-v-tishine-aroma-diffusers	aroma-diffusers	{"top":"древесина тикового дерева","heart":"кожа, кедр","base":"темный мускус, амирис, пачули, сандаловое дерево"}	Аромадиффузор с нотами лаванды, эвкалипта и цветка апельсина. Подходит для создания спокойной атмосферы в доме — аромат зелени и цветов для расслабления.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/ix_sovmestnoye_dif_50.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvaXhfc292bWVzdG5veWVfZGlmXzUwLmpwZyIsImlhdCI6MTc0Mzk2NzQwNCwiZXhwIjoxNzc1NTAzNDA0fQ.NEQNIt1ZYQl-mubZRdRY8hHUz7JJFOSsGAYamW0_sl0", "type": "50ml"}]	мл	Каждый раз, когда поздними вечерами они с братишкой слишком шумели, мама неизменно грозила:\r\n- Если продолжите, сказки сегодня отменяются.\r\n...И неизменно прощала эти детские забавы. Ведь какой ребёнок, даже если захочет, перестанет шуметь больше, чем на пять минут?\r\nКогда брат с сестрой наконец успокаивались и ложились, мама включала в их комнате ночник (младшая боялась темноты; старший, пусть и храбрился, на самом деле тоже боялся), открывала эту самую книжку на любимой детьми, порвавшейся от времени, изрисованной страничке, и тихо, но выразительно начинала читать вслух.	5.2
97	Каждое слово будто оживляло забытые мечты	5	1	Розовые кристаллы сахара	kazhdoe-slovo-budto-ozhivlyalo-zabytye-mechty	candles	{"top":"малина, клубника, черная смородина","heart":"фрезия, сахар","base":"легкий мускус, ваниль, бобы тонка"}	Свеча с ароматом сахара, ягод и ванили. Вызывает ассоциации с сладостью, лёгкостью и девичьей нежностью.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/kajdoe_slovo_can_100.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMva2FqZG9lX3Nsb3ZvX2Nhbl8xMDAuanBnIiwiaWF0IjoxNzQ0NTI5OTk5LCJleHAiOjE3NzYwNjU5OTl9.H6KyJUgUoaP1DIokWJTaO8F43tA18c3Vg1muTYINPSU", "type": "100ml"}]	мл	-Я очень по ним скучаю. \r\nЭта фраза нарушила тишину, внезапно окутавшую старый чердак.\r\nОна подняла взгляд и увидела слёзы на глазах брата. Он долго их сдерживал, делая вид, что всё в порядке, и её слова наконец сняли эту пелену притворства.\r\n-Помнишь, ты мечтал обеспечить им счастливую жизнь где-нибудь в Германии?\r\n-Я хотел купить родителям домик в частном секторе Мюнхена. Мама всегда грезила об этом.\r\nВесь вечер они вспоминали прошлое, давно покрывшееся пылью. Но время никогда не останавливается, и ближе к ночи они наконец стали собираться по домам. \r\nТеперь брат с сестрой нескоро ещё встретятся. Жизнь раскидала их по разным городам, времени для общения становилось всё меньше, в отличие от взрослых проблем.\r\nНо детство всегда будет в их сердцах, напоминая о беззаботных деньках, когда мир казался полным волшебства и бесконечных возможностей.	5.3
119	Каждое слово будто оживляло забытые мечты	5	2	Розовые кристаллы сахара	kazhdoe-slovo-budto-ozhivlyalo-zabytye-mechty-aroma-diffusers	aroma-diffusers	{"top":"малина, клубника, черная смородина","heart":"фрезия, сахар","base":"легкий мускус, ваниль, бобы тонка"}	Диффузор с ароматом ягод, сахара и ванили. Идеален для спальни или ванной — аромат вызывает ощущение нежности, тепла.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/kajdoe_slovo_dif_50.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMva2FqZG9lX3Nsb3ZvX2RpZl81MC5qcGciLCJpYXQiOjE3NDQ1MzAwMTksImV4cCI6MTc3NjA2NjAxOX0.t6e7SqceagWZlpMRwz_ZeTjT0-FgTghc-Vi6EOieQao", "type": "50ml"}]	мл	-Я очень по ним скучаю. \r\nЭта фраза нарушила тишину, внезапно окутавшую старый чердак.\r\nОна подняла взгляд и увидела слёзы на глазах брата. Он долго их сдерживал, делая вид, что всё в порядке, и её слова наконец сняли эту пелену притворства.\r\n-Помнишь, ты мечтал обеспечить им счастливую жизнь где-нибудь в Германии?\r\n-Я хотел купить родителям домик в частном секторе Мюнхена. Мама всегда грезила об этом.\r\nВесь вечер они вспоминали прошлое, давно покрывшееся пылью. Но время никогда не останавливается, и ближе к ночи они наконец стали собираться по домам. \r\nТеперь брат с сестрой нескоро ещё встретятся. Жизнь раскидала их по разным городам, времени для общения становилось всё меньше, в отличие от взрослых проблем.\r\nНо детство всегда будет в их сердцах, напоминая о беззаботных деньках, когда мир казался полным волшебства и бесконечных возможностей.	5.3
113	От жары спасал только стакан холодного мохито	3	2	Мятный мохито	ot-zhary-spasal-tolko-stakan-holodnogo-mohito-aroma-diffusers	aroma-diffusers	{"top":" лайм, мята","heart":"жасмин, ананас","base":"ром"}	Мятный Мохито — это прохладный, освежающий аромат, который словно переносит вас на тропический пляж с бокалом любимого коктейля. Он начинается с ярких нот свежей мяты, которая бодрит и заряжает энергией. Затем раскрываются сочные акценты ананаса, лайма и легкий шлейф рома, добавляя тропическую сладость и игривость.\n\nВ аромадиффузоре этот запах раскрывается как глоток прохладного мохито: сначала вы чувствуете свежесть мяты, затем — цитрусовую легкость лайма, а в финале — сладковатые тропические ноты. Натуральные эфирные масла эвкалипта и мяты усиливают ощущение свежести и чистоты.\n\nИдеально для создания атмосферы легкости, бодрости и летнего настроения. Этот аромат — как мини-отпуск в вашем доме, который наполняет пространство энергией и радостью.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/card_images/ot_jari_dif_50.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2FyZF9pbWFnZXMvb3RfamFyaV9kaWZfNTAuanBnIiwiaWF0IjoxNzQ0NTMxNDA4LCJleHAiOjE3NzYwNjc0MDh9.rg_a1pTbv9GVu1bKk03lwb_ivvrkWMIXTEe0pP_vIcY", "type": "50ml"}]	мл	Открыв глаза, она вспомнила: задремала у того самого дуба. Похоже, прошёл не один час: жара окутывала лес постепенно, но эта полянка не была покрыта листвой множества деревьев, и лишь тень старого дуба спасала от знойного пекла. Кажется, она брала с собой мохито. Проверив сумку, она обнаружила ещё прохладный напиток. Льда, конечно, уже как не бывало.	3.3
132	Объятия тёплого вечера в тени старого дерева	1	3	 Кашемировая слива	obuyatiya-tyoplogo-vechera-v-teni-starogo-dereva-aroma-sachet	aroma-sachet	{"top":"цитрусовые","heart":"черная вишня, слива","base":"ваниль, фрезия, амбра, легкий мускус, сахар"}	Саше с фруктово-сладкими нотами сливы, вишни, ванили и мускуса. Идеально для дамской сумочки, шкафа или гардеробной.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/categories/category_sachet.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2F0ZWdvcmllcy9jYXRlZ29yeV9zYWNoZXQuanBnIiwiaWF0IjoxNzQzMTY4MjM3LCJleHAiOjE3NzQ3MDQyMzd9.qWIjfuZagB_kiaEN5jg8muwK0EmrA0BhZbRy6cTwuuI", "type": "main"}]	шт	Она заранее знала, что вечер будет именно таким - тёплым и уютным. Под тенью старого дерева, которое было свидетелем их детских споров и дружбы, с годами переросшей в любовь, девушка почувствовала, как летний ветер обнял её, унося прочь все тревоги. Она присела на землю и через мгновение увидела чью-то приближающуюся фигуру; не придав этому значения, перевела взгляд на благоухающие цветы.  Сердце забилось чаще. Показалось?  Он улыбнулся, и на секунду весь мир вокруг них замер. Всё, что они когда-то пережили вместе, все ожидания и печали, стали незначительными по сравнению с этой неожиданной встречей. \r\n– Я думал, что ты не придёшь, – сказал он, садясь рядом. Этот голос был обжигающе знакомым. \r\n– Я не могла бы избежать этой встречи, – ответила она, глядя в его зелёные глаза.	1.3
170	Их совместное прошлое вспоминалось в тишине	5	3	Лаванда	ih-sovmestnoe-proshloe-vspominalos-v-tishine-aroma-sachet	aroma-sachet	{"top":"","base":"","heart":""}	Саше с ароматом лаванды, эвкалипта и апельсина. Идеально для хранения в шкафах, гардеробных и  сумках — оставляет свежий, расслабляющий травянистый шлейф.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/categories/category_sachet.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2F0ZWdvcmllcy9jYXRlZ29yeV9zYWNoZXQuanBnIiwiaWF0IjoxNzQzMTY4MjM3LCJleHAiOjE3NzQ3MDQyMzd9.qWIjfuZagB_kiaEN5jg8muwK0EmrA0BhZbRy6cTwuuI", "type": "main"}]	шт	Каждый раз, когда поздними вечерами они с братишкой слишком шумели, мама неизменно грозила:\n- Если продолжите, сказки сегодня отменяются.\n...И неизменно прощала эти детские забавы. Ведь какой ребёнок, даже если захочет, перестанет шуметь больше, чем на пять минут?\nКогда брат с сестрой наконец успокаивались и ложились, мама включала в их комнате ночник (младшая боялась темноты; старший, пусть и храбрился, на самом деле тоже боялся), открывала эту самую книжку на любимой детьми, порвавшейся от времени, изрисованной страничке, и тихо, но выразительно начинала читать вслух.	5.2
171	Каждое слово будто оживляло забытые мечты	5	3	Розовые кристаллы сахара	kazhdoe-slovo-budto-ozhivlyalo-zabytye-mechty-aroma-sachet	aroma-sachet	{"top":"","base":"","heart":""}	Саше с ягодным и ванильным ароматом. Отлично для хранения рядом с одеждой и аксессуарами — создаёт сладкий аромат.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/categories/category_sachet.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2F0ZWdvcmllcy9jYXRlZ29yeV9zYWNoZXQuanBnIiwiaWF0IjoxNzQzMTY4MjM3LCJleHAiOjE3NzQ3MDQyMzd9.qWIjfuZagB_kiaEN5jg8muwK0EmrA0BhZbRy6cTwuuI", "type": "main"}]	шт	-Я очень по ним скучаю. \r\nЭта фраза нарушила тишину, внезапно окутавшую старый чердак.\r\nОна подняла взгляд и увидела слёзы на глазах брата. Он долго их сдерживал, делая вид, что всё в порядке, и её слова наконец сняли эту пелену притворства.\r\n-Помнишь, ты мечтал обеспечить им счастливую жизнь где-нибудь в Германии?\r\n-Я хотел купить родителям домик в частном секторе Мюнхена. Мама всегда грезила об этом.\r\nВесь вечер они вспоминали прошлое, давно покрывшееся пылью. Но время никогда не останавливается, и ближе к ночи они наконец стали собираться по домам. \r\nТеперь брат с сестрой нескоро ещё встретятся. Жизнь раскидала их по разным городам, времени для общения становилось всё меньше, в отличие от взрослых проблем.\r\nНо детство всегда будет в их сердцах, напоминая о беззаботных деньках, когда мир казался полным волшебства и бесконечных возможностей.	5.3
142	Мгновение под дождём из лепестков цветущей сакуры	2	3	Цветущая японская сакура	mgnovenie-pod-dozhdyom-iz-lepestkov-cvetushej-sakury-aroma-sachet	aroma-sachet	{"top":"озон, вишневый цвет, магнолия","heart":"роза, вишня","base":"бобы тонка, сандаловое дерево"}	Саше с ароматом цветущей сакуры, вишни и розы. Идеально для полки, гардеробной и сумочек — создаёт лёгкий, свежий цветочный акцент, наполняя вещи весенним ароматом.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/categories/category_sachet.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2F0ZWdvcmllcy9jYXRlZ29yeV9zYWNoZXQuanBnIiwiaWF0IjoxNzQzMTY4MjM3LCJleHAiOjE3NzQ3MDQyMzd9.qWIjfuZagB_kiaEN5jg8muwK0EmrA0BhZbRy6cTwuuI", "type": "main"}]	шт	Поздней весной, когда расцветала единственная в городе сакура, влюблённые часто гуляли возле неё. Тёплый ветер разносил розовые лепестки по всей округе, образовывая розовый ковёр поверх привычной взору зелёной травы.	2.2
165	На кухне пеклась малиновая шарлотка	4	3	Чёрная малина и ваниль	na-kuhne-peklas-malinovaya-sharlotka-aroma-sachet	aroma-sachet	{"top":"","base":"","heart":""}	Саше с ароматом ягод и ванили. Подходит для хранения в сумочке, шкафу или гардеробной — вызывает ассоциации с летним парфюмом.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/categories/category_sachet.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2F0ZWdvcmllcy9jYXRlZ29yeV9zYWNoZXQuanBnIiwiaWF0IjoxNzQzMTY4MjM3LCJleHAiOjE3NzQ3MDQyMzd9.qWIjfuZagB_kiaEN5jg8muwK0EmrA0BhZbRy6cTwuuI", "type": "main"}]	шт	Он должен подойти с минуты на минуту.\nДевушка переживала. Съехались они неделю назад, но отпраздновать переезд пока не успели. Новая кухня, как она и мечтала, была очень уютной.\nК его приходу она пекла малиновую шарлотку. Аромат выпечки витал по квартире, окутывая каждый уголок сладкой смесью малины и ванили.	4.1
168	Он подарил ей книгу на старом чердаке	5	3	Библиотека	on-podaril-ej-knigu-na-starom-cherdake-aroma-sachet	aroma-sachet	{"top":"","base":"","heart":""}	Саше с ароматом библиотеки: тиковое дерево, кедр, кожа, мускус, пачули, сандаловое дерево. \nИдеально для шкафа, сумки или ящика — создаёт уютную и старинную атмосферу.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/categories/category_sachet.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2F0ZWdvcmllcy9jYXRlZ29yeV9zYWNoZXQuanBnIiwiaWF0IjoxNzQzMTY4MjM3LCJleHAiOjE3NzQ3MDQyMzd9.qWIjfuZagB_kiaEN5jg8muwK0EmrA0BhZbRy6cTwuuI", "type": "main"}]	шт	Старый чердак. Вдох. \nПоследняя игра с братишкой растворилась в пучине времени. В последние годы время текло всё стремительнее, унося дальше и дальше тёплые воспоминания. Всё, что она могла, чтобы в голове любимая картинка всплывала так же чётко, как и пятнадцать лет назад - оставить здесь всё на своих местах. \nСтарый диван, который теперь больше смахивал на антиквариат, проскрипел под весом девушки; в следующее мгновение парень, внешне старше лет на пять, сел на соседнее место.\n-Знаешь, я разбирал библиотеку родителей после...\n-Давай не будем, - отрезала она, - мне ещё тяжело говорить об этом.\n-Хорошо, - на несколько мгновений комната погрузилась в тишину, - В любом случае, держи.\nОн протянул девушке книгу. На осознание понадобилось несколько секунд. Это сказки. Сборник детских сказок, которые мама читала детям вечерами.	5.1
162	Долгожданная прогулка по лесной тропинке	3	3	Туман и папоротник	dolgozhdannaya-progulka-po-lesnoj-tropinke-aroma-sachet	aroma-sachet	{"top":"","base":"","heart":""}	Если у Вас остались вопросы, то обратитесь к нам через любые соцсети или почту.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/categories/category_sachet.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2F0ZWdvcmllcy9jYXRlZ29yeV9zYWNoZXQuanBnIiwiaWF0IjoxNzQzMTY4MjM3LCJleHAiOjE3NzQ3MDQyMzd9.qWIjfuZagB_kiaEN5jg8muwK0EmrA0BhZbRy6cTwuuI", "type": "main"}]	шт	Это было самое жаркое лето за последнее десятилетие. После долгих откладываний этой прогулки она наконец решила выбраться в ближайший лес.\nЧтобы прийти к любимой полянке не в самое пекло, девушка пошла с утра, - пока солнце не успело войти в зенит.\nНа удивление, в этот раз было гораздо прохладнее, чем обычно - лес оказался окутан туманом, непривычно густым, будто незнакомым ему ранее. Даже папоротник вдоль тропинки был едва различим. К счастью, гостья леса знала эти места с детства, и ей уж точно было не заплутать среди хорошо знакомых деревьев.	3.1
166	В воздухе витал аромат фруктовой тарелки	4	3	Персик манго беллини	v-vozduhe-vital-aromat-fruktovoj-tarelki-aroma-sachet	aroma-sachet	{"top":"","base":"","heart":""}	Если у Вас остались вопросы, то обратитесь к нам через любые соцсети или почту.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/categories/category_sachet.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2F0ZWdvcmllcy9jYXRlZ29yeV9zYWNoZXQuanBnIiwiaWF0IjoxNzQzMTY4MjM3LCJleHAiOjE3NzQ3MDQyMzd9.qWIjfuZagB_kiaEN5jg8muwK0EmrA0BhZbRy6cTwuuI", "type": "main"}]	шт	В воздухе витал экзотический аромат фруктовой тарелки  \nПерсик, манго, беллини  \n"Думаю, успею", - с этими мыслями она приступила к фруктовой тарелке.\nСочные персики было легко нарезать; манго слегка недозрел, поэтому косточка отделялась тяжело. Она разрезала мякоть на квадратики и красиво разложила фрукты на тарелку. \nЗа окном битый час шёл дождь.\n"Не промокнет ли он?" - последняя мысль, которая прервалась звонком в домофон. В такие моменты мчишься к нему быстрее всех на свете - когда любимый человек наконец приходит домой.	4.2
161	Осенью вновь и вновь хотелось любимого кофе	2	3	Кофейня	osenyu-vnov-i-vnov-hotelos-lyubimogo-kofe-aroma-sachet	aroma-sachet	{"top":"","base":"","heart":""}	Саше с ароматом кофе, молока и сладкой карамели. Идеально для сумок, шкафов и гардеробных — оставляет за собой тёплый, уютный кофейный шлейф.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/categories/category_sachet.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2F0ZWdvcmllcy9jYXRlZ29yeV9zYWNoZXQuanBnIiwiaWF0IjoxNzQzMTY4MjM3LCJleHAiOjE3NzQ3MDQyMzd9.qWIjfuZagB_kiaEN5jg8muwK0EmrA0BhZbRy6cTwuuI", "type": "main"}]	шт	Осенью постоянно хотелось греться в объятиях друг друга. Когда температура вокруг стремительно падает, сохранять тепло внутри себя им помогали совместные вечера просмотров фильмов под пледом.\r\nПрогулки пары часто заканчивались посиделками в кофейне неподалёку от дома - там особенно хорошо готовили латте, посыпали его корицей.	2.4
155	Тайна маскарада под звёздным небом	1	3	Абсент чёрная смородина	tajna-maskarada-pod-zvyozdnym-nebom-aroma-sachet	aroma-sachet	{"top":"","base":"","heart":""}	Саше с ароматом пряностей, ягод и мускуса. Идеально для ароматизации одежды — оставляет глубокий шлейф.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/categories/category_sachet.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2F0ZWdvcmllcy9jYXRlZ29yeV9zYWNoZXQuanBnIiwiaWF0IjoxNzQzMTY4MjM3LCJleHAiOjE3NzQ3MDQyMzd9.qWIjfuZagB_kiaEN5jg8muwK0EmrA0BhZbRy6cTwuuI", "type": "main"}]	шт	В летнюю ночь, когда звёзды сияли, как драгоценные камни с витрины, на маскараде собрались нарядные люди. Свет фонарей создавал волшебную атмосферу, а тёплый ветерок шевелил лёгкие ткани костюмов. Среди толпы выделялась девушка в платье цвета ночи, её маска завораживала блеском лунного света. Полная загадок, она танцевала, будто сама была частью неба.	1.1
167	Бутылка грушевого коньяка стала изюминкой вечера	4	3	Коньячная груша	butylka-grushevogo-konyaka-stala-izyuminkoj-vechera-aroma-sachet	aroma-sachet	{"top":"","base":"","heart":""}	Если у Вас остались вопросы, то обратитесь к нам через любые соцсети или почту.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/categories/category_sachet.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2F0ZWdvcmllcy9jYXRlZ29yeV9zYWNoZXQuanBnIiwiaWF0IjoxNzQzMTY4MjM3LCJleHAiOjE3NzQ3MDQyMzd9.qWIjfuZagB_kiaEN5jg8muwK0EmrA0BhZbRy6cTwuuI", "type": "main"}]	шт	Пока он поднимался, она вытащила из духовки шарлотку. Та слегка подгорела, как и всегда. \n"Только на этот раз это случилось в новой духовке", - иронично подчеркнула хозяйка квартиры.\nДверь открылась. Она пошла встречать любимого. \n- А я сюрприз приготовила, - сказала она, - наконец отпразднуем переезд. Оказалось, их мысли совпали. Он протянул ей бутылку грушевого коньяка.	4.3
164	От жары спасал только стакан холодного мохито	3	3	Мятный мохито	ot-zhary-spasal-tolko-stakan-holodnogo-mohito-aroma-sachet	aroma-sachet	{"top":"","base":"","heart":""}	Если у Вас остались вопросы, то обратитесь к нам через любые соцсети или почту.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/categories/category_sachet.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2F0ZWdvcmllcy9jYXRlZ29yeV9zYWNoZXQuanBnIiwiaWF0IjoxNzQzMTY4MjM3LCJleHAiOjE3NzQ3MDQyMzd9.qWIjfuZagB_kiaEN5jg8muwK0EmrA0BhZbRy6cTwuuI", "type": "main"}]	шт	Открыв глаза, она вспомнила: задремала у того самого дуба. Похоже, прошёл не один час: жара окутывала лес постепенно, но эта полянка не была покрыта листвой множества деревьев, и лишь тень старого дуба спасала от знойного пекла.\nКажется, она брала с собой мохито. Проверив сумку, она обнаружила ещё прохладный напиток. Льда, конечно, уже как не бывало.	3.3
156	Воспоминание о запретной любви в вишнёвом саду	1	3	Чёрная вишня мерло	vospominanie-o-zapretnoj-lyubvi-v-vishnyovom-sadu-aroma-sachet	aroma-sachet	{"top":"","base":"","heart":""}	Саше с ароматом чёрной вишни, яблока, черной смородины и красного вина. Идеально для сумок или шкафов — оставляет за собой фруктово-древесный шлейф.	[{"url": "https://bnwhijouenwykeezlhxx.supabase.co/storage/v1/object/sign/photos/categories/category_sachet.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaG90b3MvY2F0ZWdvcmllcy9jYXRlZ29yeV9zYWNoZXQuanBnIiwiaWF0IjoxNzQzMTY4MjM3LCJleHAiOjE3NzQ3MDQyMzd9.qWIjfuZagB_kiaEN5jg8muwK0EmrA0BhZbRy6cTwuuI", "type": "main"}]	шт	Девушка пошла в вишнёвый сад. Воспоминания о запретной любви, крепко скрываемой в её сердце, всплывали на поверхность. Она вспомнила, как встречалась с ним в этих же местах, как вместе они собирали вишню, смеялись и мечтали о будущем. Эта любовь была искренней, но из-за строгих традиций она была обречена.	1.2
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name) FROM stdin;
1	admin
2	customer
\.


--
-- Data for Name: sizes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sizes (size, time_of_exploitation, dimensions, id, category_name) FROM stdin;
165	35	{"x": 70, "y": 85, "z": 60}	52	Ароматические свечи
250	50	{"x": 100, "y": 70, "z": 85}	53	Ароматические свечи
100	2880	{"x": 70, "y": 75, "z": 70}	120	Диффузоры
45	10	{"x": 50, "y": 55, "z": 45}	50	Ароматические свечи
100	20	{"x": 70, "y": 60, "z": 60}	51	Ароматические свечи
50	1800	{"x": 50, "y": 70, "z": 45}	119	Диффузоры
7	2160	{"x": 25, "y": 25, "z": 10}	122	Саше
\.


--
-- Data for Name: smells; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.smells (id, name) FROM stdin;
fd6a320a-bce6-44e1-b3d8-2888abc2bcfc	жасмин
6c23ba2d-1545-45e9-a21b-6fc2c834d335	карамель
26a0b566-fdbd-4796-b77a-8cfbac4cb395	Мускус
f280d707-82c1-46e8-a643-a74fa66f1487	амбра
142a96e9-8493-4d3d-a2ba-7e5ac0324d70	Ель
bdf192d5-9f43-4caa-b32d-3eaef3ec2868	мёд
c20e4f14-b4a8-40fd-bd87-8cf021d01d1c	манго
8a2973af-a1e7-4898-84fd-91e304d0c9e3	Ирис
96eacbff-25e3-4ef0-a4be-446e4173881b	яблоко
6f4993e3-e1d8-4d27-a8bd-bae6337aafdf	Кокос
e0975deb-efb6-4fca-bdf9-3b08ece6239e	лайм
281b1f52-d0c4-43bb-a452-89e7687b5a0b	Цитрус
197fe862-d6ec-44ed-bd07-810c294f2b2e	Бергамот
7b1758a3-5389-4381-a221-eaca054556b3	зелёный чай
200a8f99-09bc-4f13-bfdd-ff7a48b7f774	корица
4430e4b4-bcc9-418e-8ffc-2dea2b09a0fd	пачули
d040eaaf-f25b-4625-9077-cb62afcd3491	Груша
5c5a9233-0310-4abd-88af-1df620172b8c	пион
0f876777-2ad3-434d-800b-a665d59df489	мята
bbe01d4e-a67e-4f23-a270-e9cafc7c3bd4	Роза
2ba25c54-8c77-4d6a-8bc5-d9211b5b113f	ананас
753862ca-42c6-4cb1-93c6-d36620c5bda7	лаванда
0bd8e470-4067-4845-8880-5a3ff0b8651d	кедр
4bf3f299-dba1-4a1b-8419-e0e42533ecfd	специи
cdf89873-28a0-4e58-9cb5-814acf8cb252	Сандал
678d0f3d-2ff4-4f46-9d8d-4e953ba74dfb	привет
89728177-aadd-4e7e-9f04-99b3aef790d0	белини
246b5915-40c3-4c4b-921d-b1c3e7dc3a6f	персик
bc789ef2-f132-4917-a000-efb9be33c45f	ваниль
f69b22e1-4ef9-4eb7-aca4-0e6bca78a1e8	Траляляля
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, phone_number, password, registered_at, role_id) FROM stdin;
1	1234567890	password123	2025-02-16 20:11:21.42763	1
2	0987654321	password321	2025-02-16 20:11:21.42763	2
11	+79998887766	hashed_password_1	2025-02-15 19:06:21.035	1
12	+79995554433	hashed_password_2	2025-02-15 19:06:21.035	2
\.


--
-- Name: cartItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."cartItem_id_seq"', 2063, true);


--
-- Name: cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_id_seq', 180, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 1, false);


--
-- Name: histories_new_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.histories_new_id_seq', 7, true);


--
-- Name: product_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_details_id_seq', 1, true);


--
-- Name: product_sizes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_sizes_id_seq', 154, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 172, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 1, false);


--
-- Name: sizes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sizes_id_seq', 123, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 21, true);


--
-- Name: cartItem cartItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."cartItem"
    ADD CONSTRAINT "cartItem_pkey" PRIMARY KEY (id);


--
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (id);


--
-- Name: cart cart_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_token_key UNIQUE (token);


--
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: histories histories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.histories
    ADD CONSTRAINT histories_pkey PRIMARY KEY (id);


--
-- Name: histories history_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.histories
    ADD CONSTRAINT history_number_key UNIQUE (title);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: product_detail_links product_detail_links_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_detail_links
    ADD CONSTRAINT product_detail_links_pkey PRIMARY KEY (product_id, detail_id);


--
-- Name: product_details product_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_details
    ADD CONSTRAINT product_details_pkey PRIMARY KEY (id);


--
-- Name: product_sizes product_sizes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_sizes
    ADD CONSTRAINT product_sizes_pkey PRIMARY KEY (product_id, size_id, id);


--
-- Name: product_smells product_smells_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_smells
    ADD CONSTRAINT product_smells_pkey PRIMARY KEY (product_id, smell_id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: sizes sizes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sizes
    ADD CONSTRAINT sizes_pkey PRIMARY KEY (id);


--
-- Name: smells smells_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.smells
    ADD CONSTRAINT smells_name_key UNIQUE (name);


--
-- Name: smells smells_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.smells
    ADD CONSTRAINT smells_pkey PRIMARY KEY (id);


--
-- Name: product_smells unique_product_smell; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_smells
    ADD CONSTRAINT unique_product_smell UNIQUE (product_id, smell_id);


--
-- Name: categories unique_slug; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT unique_slug UNIQUE (slug);


--
-- Name: users users_phone_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_number_key UNIQUE (phone_number);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: products_search_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_search_idx ON public.products USING gin (search);


--
-- Name: product_smells trigger_update_compound; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_compound AFTER INSERT OR DELETE OR UPDATE ON public.product_smells FOR EACH ROW EXECUTE FUNCTION public.update_compound();


--
-- Name: cartItem cartItem_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."cartItem"
    ADD CONSTRAINT "cartItem_cart_id_fkey" FOREIGN KEY (cart_id) REFERENCES public.cart(id) ON DELETE CASCADE;


--
-- Name: cartItem cartItem_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."cartItem"
    ADD CONSTRAINT "cartItem_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: cartItem cartItem_size_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."cartItem"
    ADD CONSTRAINT "cartItem_size_id_fkey" FOREIGN KEY (size_id) REFERENCES public.sizes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: products fk_category; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT fk_category FOREIGN KEY (category_slug) REFERENCES public.categories(slug);


--
-- Name: product_detail_links product_detail_links_detail_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_detail_links
    ADD CONSTRAINT product_detail_links_detail_id_fkey FOREIGN KEY (detail_id) REFERENCES public.product_details(id) ON DELETE CASCADE;


--
-- Name: product_detail_links product_detail_links_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_detail_links
    ADD CONSTRAINT product_detail_links_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_sizes product_sizes_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_sizes
    ADD CONSTRAINT product_sizes_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_sizes product_sizes_size_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_sizes
    ADD CONSTRAINT product_sizes_size_id_fkey FOREIGN KEY (size_id) REFERENCES public.sizes(id) ON DELETE CASCADE;


--
-- Name: product_smells product_smells_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_smells
    ADD CONSTRAINT product_smells_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_smells product_smells_smell_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_smells
    ADD CONSTRAINT product_smells_smell_id_fkey FOREIGN KEY (smell_id) REFERENCES public.smells(id) ON DELETE CASCADE;


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: products products_history_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_history_id_fkey FOREIGN KEY (history_id) REFERENCES public.histories(id) ON DELETE CASCADE;


--
-- Name: sizes sizes_category_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sizes
    ADD CONSTRAINT sizes_category_name_fkey FOREIGN KEY (category_name) REFERENCES public.categories(name) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE SET NULL;


--
-- Name: products Allow insert for authenticated users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow insert for authenticated users" ON public.products FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: products Allow read; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow read" ON public.products FOR SELECT USING (true);


--
-- Name: products; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

\unrestrict FImAPx0SB9IQCTvqio8mpFkWFaN8L1JMpvqA1ngjT96H9Ydjh6dLTzTjhGTVU6Z

