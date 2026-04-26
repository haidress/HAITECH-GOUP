"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { OrderRequestButton } from "@/components/OrderRequestButton";
import {
  boutiqueItDeliveryPoints,
  boutiqueItFaqSteps,
  boutiqueItTrustPoints,
  whatsappHref
} from "@/lib/offers-catalog";

import type { Product, SortOption } from "@/lib/boutique-it-validated-catalog";
import {
  applyBusinessBadges,
  boutiqueItValidatedCatalog,
  decorateProduct,
  getCatalogImage
} from "@/lib/boutique-it-validated-catalog";

const BOUTIQUE_LONGTAIL_FAQ = [
  {
    q: "Quel est le meilleur ordinateur bureautique pour entreprise ?",
    a: "Nos modèles professionnels (EliteBook, Latitude, ThinkPad) sont recommandés pour fiabilité, autonomie et maintenance."
  },
  {
    q: "Proposez-vous des packs informatiques prêts à l'emploi ?",
    a: "Oui, nous proposons des packs Bureau, Étudiant et Télétravail pour accélérer la mise en service."
  },
  {
    q: "Puis-je commander un produit non affiché sur la vitrine ?",
    a: "Oui. Une partie du catalogue est traitée sur demande via WhatsApp, avec proposition personnalisée."
  },
  {
    q: "Avez-vous un service d'installation et configuration ?",
    a: "Oui, nous proposons l'installation, la configuration initiale et l'accompagnement selon le produit."
  },
  {
    q: "Livrez-vous les équipements informatiques ?",
    a: "Oui, la livraison est organisée selon la zone et la disponibilité, avec confirmation du délai avant validation."
  },
  {
    q: "Comment obtenir un devis rapide pour plusieurs postes ?",
    a: "Utilisez le bouton WhatsApp avec votre besoin (nombre de postes, budget, urgence) pour recevoir une proposition rapide."
  }
] as const;

const STRATEGIC_CATEGORIES = [
  "Ordinateurs (Core)",
  "Packs prêts à l'emploi",
  "Accessoires essentiels",
  "Stockage & upgrade",
  "Énergie & connectivité",
  "Réseau & maintenance"
] as const;

type StrategicCategory = (typeof STRATEGIC_CATEGORIES)[number];

function normalizeProductName(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function classifyStrategicCategory(product: Product): StrategicCategory | "Catalogue secondaire" {
  const text = normalizeProductName(`${product.name} ${product.description} ${product.category}`);
  if (text.includes("pack") || text.includes("combo")) return "Packs prêts à l'emploi";
  if (
    text.includes("elitebook") ||
    text.includes("latitude") ||
    text.includes("thinkpad") ||
    text.includes("probook") ||
    text.includes("ordinateur") ||
    text.includes("desktop") ||
    text.includes("thinkcentre") ||
    text.includes("elitedesk") ||
    text.includes("nuc")
  ) {
    return "Ordinateurs (Core)";
  }
  if (
    text.includes("souris") ||
    text.includes("clavier") ||
    text.includes("webcam") ||
    text.includes("casque") ||
    text.includes("headset")
  ) {
    return "Accessoires essentiels";
  }
  if (
    text.includes("ssd") ||
    text.includes("ram") ||
    text.includes("ddr") ||
    text.includes("disque externe") ||
    text.includes("stockage")
  ) {
    return "Stockage & upgrade";
  }
  if (
    text.includes("onduleur") ||
    text.includes("multiprise") ||
    text.includes("routeur") ||
    text.includes("repeteur") ||
    text.includes("modem") ||
    text.includes("powerbank")
  ) {
    return "Énergie & connectivité";
  }
  if (
    text.includes("switch") ||
    text.includes("rj45") ||
    text.includes("cable reseau") ||
    text.includes("ethernet") ||
    text.includes("kit reseau") ||
    text.includes("sertir") ||
    text.includes("connecteur")
  ) {
    return "Réseau & maintenance";
  }
  return "Catalogue secondaire";
}

function normalizeStrategicPricing(product: Product): Product {
  const name = normalizeProductName(product.name);
  if (name.includes("cle usb 256")) {
    return { ...product, price: Math.max(product.price, 24_000) };
  }
  if (name.includes("hub usb c 4 en 1")) return { ...product, price: 9_000 };
  if (name.includes("hub usb c 5 en 1")) return { ...product, price: 14_000 };
  if (name.includes("hub usb c 6 en 1")) return { ...product, price: 18_000 };
  if (name.includes("hub usb c 8 en 1")) return { ...product, price: 25_000 };
  return product;
}

function buildStrategicVisibleCatalog(products: Product[]) {
  const limits: Record<StrategicCategory, number> = {
    "Ordinateurs (Core)": 10,
    "Packs prêts à l'emploi": 6,
    "Accessoires essentiels": 10,
    "Stockage & upgrade": 14,
    "Énergie & connectivité": 12,
    "Réseau & maintenance": 12
  };
  const buckets = new Map<StrategicCategory, Product[]>();
  for (const key of STRATEGIC_CATEGORIES) buckets.set(key, []);

  const seenKeys = new Set<string>();
  for (const rawProduct of products) {
    const product = normalizeStrategicPricing(rawProduct);
    const strategicCategory = classifyStrategicCategory(product);
    if (strategicCategory === "Catalogue secondaire") continue;
    const key = normalizeProductName(product.name)
      .replace(/\b(19 5v|20v|8h|4h|go|gb|to)\b/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (seenKeys.has(key)) continue;
    const bucket = buckets.get(strategicCategory)!;
    if (bucket.length >= limits[strategicCategory]) continue;
    bucket.push(product);
    seenKeys.add(key);
  }

  return STRATEGIC_CATEGORIES.flatMap((category) => (buckets.get(category) ?? []).map((product) => ({ product, category })));
}

function formatPrice(v: number) {
  return `${v.toLocaleString("fr-FR")} FCFA`;
}

function isRemoteImageSrc(src: string) {
  return /^https?:\/\//i.test(src);
}

function mergeReferenceStock(products: Product[], stockMap: Record<string, number>): Product[] {
  return products.map((p) => {
    const raw = stockMap[String(p.id)];
    if (raw === undefined) return { ...p, stockQuantity: null };
    return { ...p, stockQuantity: raw };
  });
}

function whatsappProductLink(productName: string) {
  return whatsappHref(`Bonjour, je suis intéressé par le produit ${productName}`);
}

function whatsappFullCatalogLink(selectedCategory: string, searchQuery: string) {
  const categoryContext = selectedCategory === "Tous" ? "toutes les catégories" : selectedCategory;
  const queryContext = searchQuery.trim() ? ` avec le besoin suivant: "${searchQuery.trim()}"` : "";
  return whatsappHref(
    `Bonjour, je souhaite voir le catalogue complet IT pour ${categoryContext}${queryContext}. Merci de me proposer les options disponibles.`
  );
}

function productMatchesStrategicCategory(p: Product, categoryLabel: string) {
  if (categoryLabel === "Tous") return true;
  return classifyStrategicCategory(p) === categoryLabel;
}

function getUpsellSuggestions(product: Product, allProducts: Product[]) {
  const text = `${product.name} ${product.description}`.toLowerCase();
  if (text.includes("ordinateur") || text.includes("elitebook") || text.includes("latitude") || text.includes("thinkpad")) {
    return allProducts
      .filter((p) => p.id !== product.id && (p.name.toLowerCase().includes("souris") || p.name.toLowerCase().includes("sac") || p.name.toLowerCase().includes("hub")))
      .slice(0, 2)
      .map((p) => ({ name: p.name, amount: p.price }));
  }
  if (text.includes("imprimante")) {
    return allProducts
      .filter((p) => p.id !== product.id && p.name.toLowerCase().includes("cartouche"))
      .slice(0, 2)
      .map((p) => ({ name: p.name, amount: p.price }));
  }
  if (text.includes("chargeur")) {
    return allProducts
      .filter((p) => p.id !== product.id && (p.name.toLowerCase().includes("multiprise") || p.name.toLowerCase().includes("onduleur")))
      .slice(0, 2)
      .map((p) => ({ name: p.name, amount: p.price }));
  }
  return allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 2)
    .map((p) => ({ name: p.name, amount: p.price }));
}

export function BoutiqueItPageClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("Tous");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [toastMessage, setToastMessage] = useState("");

  const categoryButtons = useMemo(() => ["Tous", ...STRATEGIC_CATEGORIES], []);

  useEffect(() => {
    try {
      const compareRaw = window.localStorage.getItem("boutique_compare_ids");
      const wishlistRaw = window.localStorage.getItem("boutique_wishlist_ids");
      setCompareIds(compareRaw ? (JSON.parse(compareRaw) as number[]) : []);
      setWishlistIds(wishlistRaw ? (JSON.parse(wishlistRaw) as number[]) : []);
    } catch {
      setCompareIds([]);
      setWishlistIds([]);
    }
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timeout = window.setTimeout(() => setToastMessage(""), 2200);
    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!cancelled) setIsLoading(true);
      const stockRes = await fetch("/api/boutique/reference-stock").catch(() => null);
      let stockMap: Record<string, number> = {};
      if (stockRes?.ok) {
        const stockJson = (await stockRes.json().catch(() => null)) as { success?: boolean; data?: Record<string, number> } | null;
        if (stockJson?.success && stockJson.data && typeof stockJson.data === "object") stockMap = stockJson.data;
      }

      try {
        const r = await fetch("/api/catalog/products?category=Boutique%20IT");
        const d = await r.json();
        const mapped = (d.data ?? [])
          .filter((item: { categorie?: string }) => item.categorie === "Boutique IT")
          .map(
            (item: {
              id: number;
              nom: string;
              prix_base: number;
              prix_initial?: number | string | null;
              categorie: string;
              description: string | null;
              image_url?: string | null;
            }) => ({
              id: item.id,
              name: item.nom,
              price: Number(item.prix_base),
              originalPrice: item.prix_initial == null ? undefined : Number(item.prix_initial),
              category: item.categorie,
              description: item.description ?? "",
              image: item.image_url?.trim() ? item.image_url.trim() : "/slide-transformation.png",
              status: "Disponible" as const
            })
          );

        const mergedByName = new Map<string, Product>();
        for (const product of boutiqueItValidatedCatalog) {
          mergedByName.set(product.name.trim().toLowerCase(), decorateProduct({ ...product, image: getCatalogImage(product) }));
        }
        for (const product of mapped) {
          const key = product.name.trim().toLowerCase();
          const fromStatic = mergedByName.get(key);
          const merged: Product = fromStatic
            ? {
                ...fromStatic,
                id: product.id,
                name: product.name,
                price: product.price,
                originalPrice: product.originalPrice,
                description: product.description || fromStatic.description,
                image: product.image,
                status: product.status
              }
            : product;
          mergedByName.set(key, decorateProduct({ ...merged, image: getCatalogImage(merged) }));
        }
        const list = applyBusinessBadges(Array.from(mergedByName.values()));
        if (!cancelled) setProducts(mergeReferenceStock(list, stockMap));
      } catch {
        const list = applyBusinessBadges(
          boutiqueItValidatedCatalog.map((product) => decorateProduct({ ...product, image: getCatalogImage(product) }))
        );
        if (!cancelled) setProducts(mergeReferenceStock(list, stockMap));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem("boutique_compare_ids", JSON.stringify(compareIds));
  }, [compareIds]);

  useEffect(() => {
    window.localStorage.setItem("boutique_wishlist_ids", JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const curatedVisibleCatalog = useMemo(() => buildStrategicVisibleCatalog(products), [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const normalize = (s: string) =>
      s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    const qn = normalize(q);
    return curatedVisibleCatalog.map((entry) => entry.product).filter((p) => {
      const matchCategory = productMatchesStrategicCategory(p, category);
      const hay = normalize(`${p.name} ${p.description} ${p.category}`);
      const matchQuery = !q || hay.includes(qn);
      return matchCategory && matchQuery;
    });
  }, [query, category, curatedVisibleCatalog]);

  const displayedProducts = useMemo(() => {
    const list = [...filtered];
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [filtered, sortBy]);

  const hiddenProductsCount = Math.max(0, products.length - curatedVisibleCatalog.length);

  const topProducts = useMemo(() => {
    return [...curatedVisibleCatalog.map((entry) => entry.product)]
      .sort((a, b) => {
        const score = (p: Product) => (p.badge === "💥 Promo" ? 3 : p.badge === "⭐ Populaire" ? 2 : p.badge === "🆕 Nouveau" ? 1 : 0);
        return score(b) - score(a);
      })
      .slice(0, 6);
  }, [curatedVisibleCatalog]);

  const recommendedProducts = useMemo(() => {
    const pool = curatedVisibleCatalog.map((entry) => entry.product).filter((p) => (category === "Tous" ? true : productMatchesStrategicCategory(p, category)));
    return pool
      .sort((a, b) => {
        const score = (p: Product) => (p.badge === "⭐ Populaire" ? 2 : p.badge === "💥 Promo" ? 1 : 0);
        return score(b) - score(a) || a.price - b.price;
      })
      .slice(0, 4);
  }, [curatedVisibleCatalog, category]);

  const compareProducts = useMemo(() => products.filter((p) => compareIds.includes(p.id)).slice(0, 4), [products, compareIds]);
  const wishlistProducts = useMemo(() => products.filter((p) => wishlistIds.includes(p.id)), [products, wishlistIds]);

  function toggleCompare(id: number) {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        setToastMessage("Produit retire du comparateur.");
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= 4) {
        setToastMessage("Comparateur limite a 4 produits.");
        return prev;
      }
      setToastMessage("Produit ajoute au comparateur.");
      return [...prev, id];
    });
  }

  function toggleWishlist(id: number) {
    setWishlistIds((prev) => {
      if (prev.includes(id)) {
        setToastMessage("Produit retire des favoris.");
        return prev.filter((x) => x !== id);
      }
      setToastMessage("Produit ajoute aux favoris.");
      return [...prev, id];
    });
  }

  return (
    <main lang="fr" className="bg-white">
      <section
        className="relative overflow-hidden py-16 text-white md:py-24"
        style={{
          backgroundImage:
            "linear-gradient(rgba(10,42,94,0.75), rgba(10,42,94,0.75)), url('/slide-transformation.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "scroll"
        }}
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="max-w-3xl">
            <h1 className="font-heading text-3xl font-extrabold leading-tight md:text-5xl">
              Boutique IT Abidjan — solutions complètes, fiables et prêtes à l&apos;emploi
            </h1>
            <p className="mt-4 text-sm text-slate-100 md:text-lg">
              Spécialiste bureautique pro : PC, packs bureau, télétravail, upgrades et réseau avec accompagnement SAV.
            </p>
            <p className="mt-3 inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold text-slate-100">
              Positionnement : Expert IT + solutions complètes + fiable
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#produits" className="rounded-full bg-haitechGold px-6 py-3 font-semibold text-haitechBlue">
                Commander maintenant
              </a>
              <a
                href={whatsappProductLink("matériel informatique")}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white px-6 py-3 font-semibold"
              >
                Besoin d&apos;aide sur WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="surface-card p-5">
          <h2 className="font-heading text-xl font-bold text-haitechBlue md:text-2xl">Sélection stratégique optimisée</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-semibold text-haitechBlue">1) Bureautique / pro (coeur)</p>
              <p>Demande forte, budget 150k-300k FCFA, priorité fiabilité + autonomie + SAV.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-semibold text-haitechBlue">2) Accessoires rapides</p>
              <p>Rotation rapide sur les essentiels: souris, clavier, webcam, casques, stockage.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-semibold text-haitechBlue">3) Gaming en secondaire</p>
              <p>Références premium disponibles sur demande pour éviter le stock dormant.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <label className="sr-only" htmlFor="boutique-it-search">
                Rechercher un produit
              </label>
              <input
                id="boutique-it-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un produit (nom, marque, référence…)"
                className="min-h-[44px] min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="min-h-[44px] w-full shrink-0 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 sm:w-56"
              >
                <option value="default">Tri : pertinence</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
            </div>
            <div className="border-t border-slate-100 pt-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Rayons</p>
              <div className="flex max-h-[220px] flex-wrap gap-2 overflow-y-auto pr-1 sm:max-h-none sm:overflow-visible">
                {categoryButtons.map((btn) => (
                  <button
                    key={btn}
                    type="button"
                    onClick={() => setCategory(btn)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      category === btn ? "bg-haitechBlue text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {btn}
                  </button>
                ))}
              </div>
              <a
                href={whatsappFullCatalogLink(category, query)}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary mt-3 inline-flex min-h-[44px] items-center"
              >
                Voir le catalogue complet sur WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="produits" className="mx-auto max-w-7xl px-4 pb-14">
        <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Produits disponibles</h2>
        <p className="mt-2 text-sm text-slate-600">
          Catalogue visible optimisé (environ 40-60 références). {hiddenProductsCount > 0 ? `${hiddenProductsCount} références supplémentaires disponibles sur demande WhatsApp.` : ""}
        </p>
        {!isLoading && displayedProducts.length === 0 ? (
          <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Aucun produit ne correspond à votre recherche ou au rayon sélectionné. Essayez un autre mot-clé ou
            « Tous ».
          </p>
        ) : null}
        {isLoading ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={`skeleton-${idx}`} className="surface-card overflow-hidden p-4">
                <div className="h-40 animate-pulse rounded-xl bg-slate-200" />
                <div className="mt-4 h-4 w-4/5 animate-pulse rounded bg-slate-200" />
                <div className="mt-2 h-3 w-full animate-pulse rounded bg-slate-200" />
                <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-slate-200" />
                <div className="mt-4 h-9 animate-pulse rounded-full bg-slate-200" />
              </div>
            ))}
          </div>
        ) : null}
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {displayedProducts.map((product) => (
            <article
              key={product.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-haitechBlue/20"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  unoptimized={isRemoteImageSrc(product.image)}
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 1280px) 50vw, 25vw"
                />
                <div
                  className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white ${
                    product.stockQuantity === 0 ? "bg-red-600" : "bg-haitechBlue"
                  }`}
                >
                  {product.stockQuantity === 0 ? "Rupture" : product.status}
                </div>
                {product.badge ? (
                  <div className="absolute right-3 top-3 rounded-full bg-haitechGold px-3 py-1 text-xs font-semibold text-haitechBlue">
                    {product.badge}
                  </div>
                ) : null}
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100">
                  <a
                    href={whatsappProductLink(product.name)}
                    target="_blank"
                    rel="noreferrer"
                    className="m-4 rounded-full bg-haitechGold px-4 py-2 text-sm font-semibold text-haitechBlue"
                  >
                    Commander sur WhatsApp
                  </a>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-heading text-lg font-bold text-haitechBlue">{product.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{product.description}</p>
                {product.stockQuantity != null ? (
                  <p
                    className={`mt-2 text-xs font-semibold ${
                      product.stockQuantity === 0
                        ? "text-red-600"
                        : product.stockQuantity <= 3
                          ? "text-amber-700"
                          : "text-emerald-700"
                    }`}
                  >
                    {product.stockQuantity === 0
                      ? "Stock : rupture — sur commande"
                      : `Stock : ${product.stockQuantity} unité(s)`}
                  </p>
                ) : null}
                <p className="mt-3 font-semibold text-haitechBlue">{formatPrice(product.price)}</p>
                {typeof product.originalPrice === "number" && product.originalPrice > product.price ? (
                  <p className="mt-1 text-xs text-slate-500 line-through">{formatPrice(product.originalPrice)}</p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold">
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">Installation offerte</span>
                  <span className="rounded-full bg-blue-50 px-2 py-1 text-blue-700">Garantie 3 mois</span>
                  <span className="rounded-full bg-amber-50 px-2 py-1 text-amber-700">Configuration incluse</span>
                </div>
                <div className="mt-4">
                  <OrderRequestButton
                    sourceType="boutique_it"
                    productName={product.name}
                    amount={product.price}
                    suggestions={getUpsellSuggestions(product, products)}
                    compact
                  />
                </div>
                <div className="mt-3 flex gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => toggleCompare(product.id)}
                    className="rounded-full border border-slate-300 px-3 py-1 font-semibold text-slate-700"
                  >
                    {compareIds.includes(product.id) ? "Retirer comparateur" : "Comparer"}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    className="rounded-full border border-slate-300 px-3 py-1 font-semibold text-slate-700"
                  >
                    {wishlistIds.includes(product.id) ? "Retirer favoris" : "Favoris"}
                  </button>
                </div>
                <p className="mt-2 text-xs text-slate-500">Cross-sell conseillé au moment de la commande WhatsApp.</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {compareProducts.length >= 2 ? (
        <section className="mx-auto max-w-7xl px-4 pb-14">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Comparateur produits</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left">
                  <th className="px-4 py-3">Critère</th>
                  {compareProducts.map((p) => (
                    <th key={`head-${p.id}`} className="px-4 py-3">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3 font-semibold text-slate-600">Prix</td>
                  {compareProducts.map((p) => (
                    <td key={`price-${p.id}`} className="px-4 py-3">{formatPrice(p.price)}</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-semibold text-slate-600">Catégorie</td>
                  {compareProducts.map((p) => (
                    <td key={`cat-${p.id}`} className="px-4 py-3">{p.category}</td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-600">Statut</td>
                  {compareProducts.map((p) => (
                    <td key={`st-${p.id}`} className="px-4 py-3">{p.status}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {wishlistProducts.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 pb-14">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Mes favoris</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {wishlistProducts.map((p) => (
              <article key={`wish-${p.id}`} className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">{p.category}</p>
                <p className="mt-2 font-semibold text-haitechBlue">{p.name}</p>
                <p className="mt-1 text-sm font-semibold text-slate-700">{formatPrice(p.price)}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-4 pb-14">
        <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">
          Produits recommandés {category !== "Tous" ? `- ${category}` : ""}
        </h2>
        <p className="mt-2 text-sm text-slate-600">Sélection basée sur la catégorie consultée et les articles populaires.</p>
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {recommendedProducts.map((product) => (
            <article key={`rec-${product.id}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="relative h-40">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  unoptimized={isRemoteImageSrc(product.image)}
                  className="object-cover"
                  sizes="(max-width: 1280px) 50vw, 25vw"
                />
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold text-slate-500">{product.category}</p>
                <h3 className="mt-1 font-heading text-base font-bold text-haitechBlue">{product.name}</h3>
                <p className="mt-2 text-sm font-semibold text-slate-700">{formatPrice(product.price)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">TOP Produits</h2>
          <p className="mt-2 text-sm text-slate-600">🔥 Produits les plus demandés | ⭐ Meilleures ventes | 💥 Promotions</p>
          <div className="mt-6 flex snap-x gap-4 overflow-x-auto pb-2">
            {topProducts.map((p) => (
              <article key={p.id} className="min-w-[280px] snap-start rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="relative h-40 w-full overflow-hidden rounded-xl">
                  <Image src={p.image} alt={p.name} fill unoptimized={isRemoteImageSrc(p.image)} className="object-cover" sizes="280px" />
                </div>
                <p className="mt-3 text-xs font-semibold text-haitechBlue">{p.badge}</p>
                <h3 className="mt-1 font-heading text-lg font-bold text-haitechBlue">{p.name}</h3>
                <p className="mt-1 text-sm font-semibold text-slate-700">{formatPrice(p.price)}</p>
                {typeof p.originalPrice === "number" && p.originalPrice > p.price ? (
                  <p className="mt-1 text-xs text-slate-500 line-through">{formatPrice(p.originalPrice)}</p>
                ) : null}
                <div className="mt-3">
                  <OrderRequestButton
                    sourceType="boutique_it"
                    productName={p.name}
                    amount={p.price}
                    suggestions={getUpsellSuggestions(p, products)}
                    compact
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">6 catégories stratégiques</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Parcours simplifié pour accélérer la décision client. Le reste du catalogue est traité sur demande WhatsApp.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Ordinateurs (Core)", icon: "💻", blurb: "6 à 10 modèles prioritaires orientés fiabilité pro." },
            { label: "Packs prêts à l'emploi", icon: "📦", blurb: "Solutions bureau, étudiant, télétravail." },
            { label: "Accessoires essentiels", icon: "🔌", blurb: "Rotation rapide : souris, clavier, webcam, casque." },
            { label: "Stockage & upgrade", icon: "💾", blurb: "SSD, RAM, disque externe pour booster les performances." },
            { label: "Énergie & connectivité", icon: "⚡", blurb: "Onduleur, routeur, répéteur, multiprise." },
            { label: "Réseau & maintenance", icon: "🛠️", blurb: "RJ45, switch, kit réseau et accompagnement terrain." }
          ].map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={() => {
                setCategory(c.label);
                document.getElementById("produits")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="text-2xl">{c.icon}</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">{c.label}</p>
              <p className="mt-1 text-xs text-slate-500">{c.blurb}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Packs prêts à l&apos;emploi (Abidjan)</h2>
          <p className="mt-2 text-sm text-slate-600">Les solutions complètes qui convertissent le plus vite en rendez-vous et en vente.</p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Pack Bureau",
                tagline: "PC + écran + souris + clavier",
                fromPriceFcfa: 250_000,
                items: ["Configuration initiale incluse", "Garantie 3 mois", "Installation offerte sur Abidjan"]
              },
              {
                title: "Pack Étudiant",
                tagline: "PC + sac + souris",
                fromPriceFcfa: 180_000,
                items: ["Pack budget optimisé", "Outils bureautiques prêts", "Mise en route offerte"]
              },
              {
                title: "Pack Télétravail",
                tagline: "PC + webcam + casque",
                fromPriceFcfa: 220_000,
                items: ["Prêt visioconférence", "Performance stable", "Support WhatsApp prioritaire"]
              }
            ].map((b) => (
              <article key={b.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-heading text-lg font-bold text-haitechBlue">{b.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{b.tagline}</p>
                <p className="mt-3 font-semibold text-haitechBlue">À partir de {formatPrice(b.fromPriceFcfa)}</p>
                <ul className="mt-3 space-y-1 text-sm text-slate-700">
                  {b.items.map((it) => (
                    <li key={it}>• {it}</li>
                  ))}
                </ul>
                <div className="mt-4">
                  <OrderRequestButton
                    sourceType="boutique_it"
                    productName={`Bundle: ${b.title}`}
                    amount={b.fromPriceFcfa}
                    suggestions={[]}
                    compact
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Pourquoi acheter chez nous</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {boutiqueItTrustPoints.map((point) => (
              <div key={point} className="rounded-xl border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-700">
                ✔ {point}
              </div>
            ))}
          </div>
          <h3 className="mt-10 font-heading text-lg font-bold text-haitechBlue">Livraison & SAV</h3>
          <ul className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
            {boutiqueItDeliveryPoints.map((line) => (
              <li key={line} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="rounded-2xl bg-haitechBlue p-8 text-white">
          <h2 className="font-heading text-3xl font-bold">💥 Promo du moment : -10% sur certains accessoires</h2>
          <a
            href={whatsappProductLink("offre spéciale Boutique IT")}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-block rounded-full bg-haitechGold px-6 py-3 font-semibold text-haitechBlue"
          >
            Commander maintenant
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Comment commander ?</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {boutiqueItFaqSteps.map((step) => (
            <div key={step.title} className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-bold text-haitechBlue">{step.title}</p>
              <p className="mt-2 text-sm text-slate-600">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq-boutique-it" className="mx-auto max-w-7xl px-4 pb-14">
        <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">FAQ Boutique IT</h2>
        <p className="mt-2 text-sm text-slate-600">Réponses aux questions les plus fréquentes avant commande.</p>
        <div className="mt-6 space-y-3">
          {BOUTIQUE_LONGTAIL_FAQ.map((item) => (
            <article key={item.q} className="surface-card p-4">
              <h3 className="text-base font-semibold text-haitechBlue">{item.q}</h3>
              <p className="mt-2 text-sm text-slate-700">{item.a}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="rounded-2xl bg-haitechBlue p-8 text-white">
          <h2 className="font-heading text-3xl font-bold">Besoin d’un équipement spécifique ?</h2>
          <a
            href={whatsappProductLink("équipement spécifique")}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-block rounded-full bg-haitechGold px-6 py-3 font-semibold text-haitechBlue"
          >
            Contactez-nous sur WhatsApp
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14">
        <h2 className="font-heading text-2xl font-bold text-haitechBlue md:text-3xl">Ressources utiles</h2>
        <p className="mt-2 text-sm text-slate-600">
          Explorez nos services complémentaires pour préparer votre projet IT de bout en bout.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <Link href="/technology" className="btn-secondary">
            Services IT & maintenance
          </Link>
          <Link href="/academy" className="btn-secondary">
            Formations informatiques
          </Link>
          <Link href="/blog" className="btn-secondary">
            Conseils & guides IT
          </Link>
          <Link href="/contact" className="btn-secondary">
            Demander un devis personnalisé
          </Link>
        </div>
      </section>

      <a
        href={whatsappProductLink("produit informatique")}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-40 rounded-full bg-emerald-500 px-4 py-3 text-sm font-bold text-white shadow-xl"
      >
        WhatsApp
      </a>
      {toastMessage ? (
        <div className="fixed bottom-5 left-4 right-20 z-40 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg sm:left-auto sm:right-5 sm:w-auto">
          {toastMessage}
        </div>
      ) : null}
    </main>
  );
}
