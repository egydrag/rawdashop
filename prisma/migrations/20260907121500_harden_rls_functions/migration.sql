CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.handle_new_user()
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

CREATE OR REPLACE FUNCTION private.is_admin()
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

REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO authenticated;
REVOKE ALL ON FUNCTION private.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.is_admin() TO authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE private.handle_new_user();

DROP POLICY IF EXISTS "admins manage products" ON public."Product";
DROP POLICY IF EXISTS "admins manage categories" ON public."Category";
DROP POLICY IF EXISTS "admins manage images" ON public."ProductImage";
CREATE POLICY "admins manage products" ON public."Product" FOR ALL TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin());
CREATE POLICY "admins manage categories" ON public."Category" FOR ALL TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin());
CREATE POLICY "admins manage images" ON public."ProductImage" FOR ALL TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin());
CREATE POLICY "admins manage order items" ON public."OrderItem" FOR ALL TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin());
CREATE POLICY "admins manage settings" ON public."StoreSettings" FOR ALL TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin());

REVOKE ALL ON TABLE public."_prisma_migrations" FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon, authenticated;
DROP FUNCTION public.handle_new_user();
DROP FUNCTION public.is_admin();
