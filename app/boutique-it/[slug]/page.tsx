import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { defaultSiteMetadata } from "@/lib/site-default-metadata";
import { getPublishedBoutiqueProductBySlug, computeActivePrice } from "@/lib/repositories/boutique-repository";
import { absUrl, getSiteBaseUrl } from "@/lib/site-url";

type PageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getPublishedBoutiqueProductBySlug(params.slug);
  if (!product) return defaultSiteMetadata;
  const title = product.seo_title ?? `${product.name} | Boutique IT HAITECH GROUP`;
  const fallbackDescription = product.short_description ?? "Produit IT disponible chez HAITECH GROUP.";
  const description = (product.seo_description ?? fallbackDescription).slice(0, 158);
  const canonical = product.canonical_url ?? `${getSiteBaseUrl()}/boutique-it/${product.slug}`;
  const imageUrl = product.image_url ? absUrl(product.image_url) : absUrl("/slide-transformation.png");
  return {
    ...defaultSiteMetadata,
    title,
    description,
    alternates: { canonical },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1
      }
    },
    openGraph: {
      ...defaultSiteMetadata.openGraph,
      title,
      description,
      url: canonical,
      type: "website",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: product.name }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl]
    }
  };
}

export default async function BoutiqueProductPage({ params }: PageProps) {
  const product = await getPublishedBoutiqueProductBySlug(params.slug);
  if (!product) notFound();

  const activePrice = computeActivePrice(product);
  const inPromo = product.promo_price != null && activePrice < Number(product.base_price);
  const stockState = product.stock <= 0 ? "Rupture" : product.stock <= product.low_stock_threshold ? "Faible stock" : "En stock";
  const stockClass = product.stock <= 0 ? "text-red-600" : product.stock <= product.low_stock_threshold ? "text-amber-600" : "text-emerald-600";
  const canonical = product.canonical_url ?? `${getSiteBaseUrl()}/boutique-it/${product.slug}`;
  const imageUrl = product.image_url ? absUrl(product.image_url) : absUrl("/slide-transformation.png");
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: product.name,
        image: [imageUrl],
        description: product.short_description ?? "Produit IT disponible chez HAITECH GROUP.",
        sku: String(product.id),
        category: product.category,
        brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
        offers: {
          "@type": "Offer",
          priceCurrency: "XOF",
          price: Number(activePrice),
          availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
          url: canonical,
          itemCondition:
            product.product_condition === "neuf" ? "https://schema.org/NewCondition" : "https://schema.org/RefurbishedCondition",
          seller: { "@type": "Organization", name: "HAITECH GROUP" }
        }
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: getSiteBaseUrl() },
          { "@type": "ListItem", position: 2, name: "Boutique IT", item: `${getSiteBaseUrl()}/boutique-it` },
          { "@type": "ListItem", position: 3, name: product.name, item: canonical }
        ]
      }
    ]
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/boutique-it" className="text-sm font-semibold text-haitechBlue hover:underline">
        ← Retour Boutique IT
      </Link>
      <div className="mt-5 grid gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {product.image_url ? (
            <Image src={product.image_url} alt={product.name} width={1200} height={900} className="h-full w-full object-cover" />
          ) : (
            <div className="h-80 bg-slate-100" />
          )}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{product.category}</p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-haitechBlue">{product.name}</h1>
          <p className={`mt-3 text-sm font-semibold ${stockClass}`}>{stockState}</p>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-haitechBlue">{Number(activePrice).toLocaleString("fr-FR")} FCFA</p>
            {inPromo ? <p className="text-sm text-slate-500 line-through">{Number(product.base_price).toLocaleString("fr-FR")} FCFA</p> : null}
          </div>
          <p className="mt-4 text-slate-700">{product.short_description ?? "Sans description courte."}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {product.product_condition === "neuf" ? "Neuf" : "Reconditionné"}
            </span>
            {product.brand ? <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{product.brand}</span> : null}
            {product.warranty_months ? (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">Garantie {product.warranty_months} mois</span>
            ) : null}
          </div>
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">Pret a commander ?</p>
            <p className="mt-1 text-xs text-slate-600">Recevez votre proposition et delai de livraison en quelques minutes.</p>
            <Link href="/contact" className="mt-3 inline-block rounded-full bg-haitechBlue px-6 py-3 text-sm font-semibold text-white">
              Commander ce produit
            </Link>
          </div>
        </div>
      </div>
      {product.long_description ? <div className="prose prose-slate mt-10 max-w-none whitespace-pre-line">{product.long_description}</div> : null}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur md:hidden">
        <Link href="/contact" className="block rounded-full bg-haitechBlue px-6 py-3 text-center text-sm font-semibold text-white">
          Commander maintenant
        </Link>
      </div>
    </section>
  );
}
