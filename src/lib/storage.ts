import { createClient } from "@supabase/supabase-js"

export function getStorageClient() {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL
  let serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error("Supabase Storage config missing: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.")
  }

  // Clean the keys to remove accidental quotes or whitespace from environment variables
  url = url.replace(/^["']|["']$/g, '').trim()
  serviceKey = serviceKey.replace(/^["']|["']$/g, '').trim()

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

export const PRODUCTS_BUCKET = "products"
