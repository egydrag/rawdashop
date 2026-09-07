-- Prisma migration metadata is not exposed to browser roles, so RLS is not
-- needed on this internal bookkeeping table.
REVOKE ALL ON TABLE public."_prisma_migrations" FROM anon, authenticated;
ALTER TABLE public."_prisma_migrations" DISABLE ROW LEVEL SECURITY;
