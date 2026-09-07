-- Extend the existing product catalog without removing any live product data.
ALTER TABLE public."Product"
  ADD COLUMN "categoryId" TEXT,
  ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "isAvailable" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "stockQuantity" INTEGER;

ALTER TABLE public."Product"
  ADD CONSTRAINT "Product_price_nonnegative" CHECK (price >= 0),
  ADD CONSTRAINT "Product_stockQuantity_nonnegative" CHECK ("stockQuantity" IS NULL OR "stockQuantity" >= 0);

CREATE TABLE public."Category" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

ALTER TABLE public."Product"
  ADD CONSTRAINT "Product_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES public."Category"(id)
  ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE public."ProductImage" (
  id TEXT PRIMARY KEY,
  "productId" TEXT NOT NULL REFERENCES public."Product"(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProductImage_productId_position_key" UNIQUE ("productId", position)
);

-- Preserve every existing cover image as the first image in the new gallery.
INSERT INTO public."ProductImage" (id, "productId", url, alt, position)
SELECT 'legacy-' || id, id, "imageUrl", name, 0
FROM public."Product"
WHERE "imageUrl" IS NOT NULL AND "imageUrl" <> '';

CREATE TABLE public."Profile" (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  "fullName" TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public."Order" (
  id TEXT PRIMARY KEY,
  "customerId" UUID REFERENCES public."Profile"(id) ON DELETE SET NULL,
  "customerName" TEXT NOT NULL,
  "customerPhone" TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING_WHATSAPP' CHECK (status IN ('PENDING_WHATSAPP', 'CONTACTED', 'COMPLETED', 'CANCELLED')),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public."OrderItem" (
  id TEXT PRIMARY KEY,
  "orderId" TEXT NOT NULL REFERENCES public."Order"(id) ON DELETE CASCADE,
  "productId" TEXT REFERENCES public."Product"(id) ON DELETE SET NULL,
  "productName" TEXT NOT NULL,
  "unitPrice" DOUBLE PRECISION NOT NULL CHECK ("unitPrice" >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0)
);

CREATE TABLE public."StoreSettings" (
  id TEXT PRIMARY KEY DEFAULT 'default' CHECK (id = 'default'),
  "storeName" TEXT NOT NULL DEFAULT 'روضة للإكسسوارات',
  "whatsappNumber" TEXT NOT NULL DEFAULT '',
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO public."StoreSettings" (id) VALUES ('default') ON CONFLICT (id) DO NOTHING;

CREATE INDEX "Product_isActive_createdAt_idx" ON public."Product" ("isActive", "createdAt" DESC);
CREATE INDEX "Product_categoryId_idx" ON public."Product" ("categoryId");
CREATE INDEX "ProductImage_productId_idx" ON public."ProductImage" ("productId");
CREATE INDEX "Order_customerId_idx" ON public."Order" ("customerId");
CREATE INDEX "Order_status_createdAt_idx" ON public."Order" (status, "createdAt" DESC);
CREATE INDEX "OrderItem_orderId_idx" ON public."OrderItem" ("orderId");
CREATE INDEX "OrderItem_productId_idx" ON public."OrderItem" ("productId");

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public."Profile" (id, "fullName")
  VALUES (NEW.id, NULLIF(NEW.raw_user_meta_data ->> 'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public."Profile"
    WHERE id = (SELECT auth.uid()) AND role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

CREATE TRIGGER set_product_updated_at BEFORE UPDATE ON public."Product" FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
CREATE TRIGGER set_category_updated_at BEFORE UPDATE ON public."Category" FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
CREATE TRIGGER set_profile_updated_at BEFORE UPDATE ON public."Profile" FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
CREATE TRIGGER set_order_updated_at BEFORE UPDATE ON public."Order" FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
CREATE TRIGGER set_store_settings_updated_at BEFORE UPDATE ON public."StoreSettings" FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Supabase Data API remains closed to browser clients. Next.js reads public
-- catalog data through Prisma, while all mutations are authorized server-side.
DROP POLICY IF EXISTS "allow_all_access" ON public."Product";
ALTER TABLE public."Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ProductImage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."StoreSettings" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "active products are publicly readable" ON public."Product" FOR SELECT TO anon, authenticated USING ("isActive" = true);
CREATE POLICY "admins manage products" ON public."Product" FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "categories are publicly readable" ON public."Category" FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage categories" ON public."Category" FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "images of active products are publicly readable" ON public."ProductImage" FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public."Product" p WHERE p.id = "productId" AND p."isActive" = true));
CREATE POLICY "admins manage images" ON public."ProductImage" FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "users read own profile" ON public."Profile" FOR SELECT TO authenticated USING (id = (SELECT auth.uid()));
CREATE POLICY "users read own orders" ON public."Order" FOR SELECT TO authenticated USING ("customerId" = (SELECT auth.uid()));

REVOKE ALL ON TABLE public."Product", public."Category", public."ProductImage", public."Profile", public."Order", public."OrderItem", public."StoreSettings" FROM anon, authenticated;

-- Remove unsafe anonymous writes to the product image bucket. Public delivery
-- remains enabled; uploads are performed only by an authenticated Next.js admin route.
DROP POLICY IF EXISTS "Give access to a file to user 1ifhysk_0" ON storage.objects;
DROP POLICY IF EXISTS "Enable read access for all users" ON storage.objects;
CREATE POLICY "public can read product images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'products');
