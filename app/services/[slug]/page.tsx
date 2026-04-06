import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { SERVICE_FALLBACK_IMAGES, DEFAULT_SERVICE_IMAGE } from "@/lib/constants/images";
import type { Metadata } from "next";

interface Provider {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  description: string | null;
  website: string | null;
  image_url: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  image_url?: string | null;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const supabase = createClient();
  const { data } = await supabase
    .from("service_categories")
    .select("name, description")
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();

  if (!data) return { title: "Category Not Found — Catch Columbus" };

  return {
    title: `${data.name} — Services — Catch Columbus`,
    description:
      data.description ?? `Browse ${data.name} services in Columbus, Ohio.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let canSubmit = false;
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    canSubmit = profile?.role === "business_user" || profile?.role === "admin";
  }

  // Get category
  const { data: category } = await supabase
    .from("service_categories")
    .select("id, name, slug, icon, description, image_url")
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single<Category>();

  if (!category) notFound();

  // Get providers in this category
  const { data: providers } = await supabase
    .from("service_providers")
    .select(
      "id, name, slug, phone, email, address, description, website, image_url"
    )
    .eq("category_id", category.id)
    .eq("is_active", true)
    .order("name", { ascending: true });

  const providerList: Provider[] = (providers ?? []) as Provider[];
  const heroImg =
    category.image_url ||
    SERVICE_FALLBACK_IMAGES[category.slug] ||
    DEFAULT_SERVICE_IMAGE;

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #020C1B 0%, #0D1B3E 50%, #0A0E27 100%)",
      }}
    >
      {/* Ambient blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-blue-500/20 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-400/15 blur-[130px]" />
      </div>

      {/* Hero Banner */}
      <div className="relative z-10 w-full h-64 md:h-80 overflow-hidden">
        <Image
          src={heroImg}
          alt={category.name}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020C1B] via-[#020C1B]/60 to-transparent" />

        {/* Back button */}
        <div className="absolute top-5 left-5 z-20">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium bg-black/20 hover:bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full transition-all"
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            All Services
          </Link>
        </div>

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              {category.icon && (
                <span className="text-3xl">{category.icon}</span>
              )}
              <h1
                className="text-4xl md:text-5xl font-black text-white tracking-tight"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {category.name}
              </h1>
            </div>
            {category.description && (
              <p className="text-white/60 text-base md:text-lg max-w-2xl">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Providers List */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 pb-24">
        <div className="flex items-center justify-between mb-8">
          <p className="text-white/40 font-semibold text-sm tracking-widest uppercase">
            {providerList.length}{" "}
            {providerList.length === 1 ? "Listing" : "Listings"}
          </p>
          {canSubmit && (
            <Link
              href="/services/submit"
              className="inline-flex items-center gap-2 bg-accent hover:bg-yellow-400 text-[#020C1B] font-bold text-sm px-5 py-2.5 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-amber-500/20"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              List Your Business
            </Link>
          )}
        </div>

        {providerList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <div className="text-5xl opacity-30">🏢</div>
            <p className="text-white/50 font-semibold text-lg">
              No providers listed yet.
            </p>
            {canSubmit ? (
              <p className="text-white/30 text-sm">
                Are you a business in this category?{" "}
                <Link
                  href="/services/submit"
                  className="text-accent hover:underline"
                >
                  Submit your listing
                </Link>
              </p>
            ) : (
              <p className="text-white/30 text-sm">
                Check back soon — listings are being added.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {providerList.map((provider) => {
              const provImg =
                provider.image_url || SERVICE_FALLBACK_IMAGES[category.slug] || DEFAULT_SERVICE_IMAGE;

              return (
                <Link
                  key={provider.id}
                  href={`/services/${category.slug}/${provider.slug}`}
                  className="group block"
                >
                  <div className="bg-white/8 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-white/25 hover:bg-white/12 hover:shadow-2xl hover:shadow-black/30 transition-all duration-500">
                    {/* Image */}
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={provImg}
                        alt={provider.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>

                    {/* Body */}
                    <div className="p-5">
                      <h3
                        className="text-lg font-black text-white mb-2 leading-snug group-hover:text-accent transition-colors duration-300"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                      >
                        {provider.name}
                      </h3>

                      {provider.description && (
                        <p className="text-white/50 text-sm line-clamp-2 mb-4 leading-relaxed">
                          {provider.description}
                        </p>
                      )}

                      <div className="flex flex-col gap-1.5 text-xs text-white/40 font-medium">
                        {provider.address && (
                          <div className="flex items-center gap-2">
                            <svg
                              width="12"
                              height="12"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                            >
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span className="truncate">{provider.address}</span>
                          </div>
                        )}
                        {provider.phone && (
                          <div className="flex items-center gap-2">
                            <svg
                              width="12"
                              height="12"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                            >
                              <path d="M22 16.92v3a2 2 0 01-2.18 2A19.86 19.86 0 013.09 5.18 2 2 0 015.11 3h3a2 2 0 012 1.72c.13.81.36 1.6.68 2.34a2 2 0 01-.45 2.11L8.09 11.5a16 16 0 006.41 6.41l2.33-2.33a2 2 0 012.11-.45c.74.32 1.53.55 2.34.68a2 2 0 011.72 2z" />
                            </svg>
                            <span>{provider.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
