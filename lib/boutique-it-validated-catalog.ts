/**
 * Catalogue vitrine Boutique IT (prix indicatifs FCFA, visuels locaux /public/products).
 * Partagé entre la page publique, le SEO (layout) et l’admin stock par référence.
 */

export type Product = {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  description: string;
  image: string;
  badge?: "🆕 Nouveau" | "⭐ Populaire" | "💥 Promo";
  status: "Disponible" | "Promo";
  /** Quantité physique si renseignée en admin ; null = non communiqué */
  stockQuantity?: number | null;
};

export type SortOption = "default" | "price-asc" | "price-desc";

export const boutiqueItValidatedCatalog: Product[] = [
  { id: 9_990, name: "HP EliteBook 840 G5 (i5, 16Go RAM, 512Go SSD)", price: 219_000, category: "Ordinateurs", description: "Ordinateur portable reconditionné professionnel", image: "/slide-1.jpg", status: "Disponible" },
  { id: 9_991, name: "Dell Latitude 7420 (i7, 16Go RAM, 512Go SSD)", price: 269_000, category: "Ordinateurs", description: "Portable pro performant pour bureautique et production", image: "/slide-1.jpg", status: "Disponible" },
  { id: 9_992, name: "Lenovo ThinkPad T14 (Ryzen 5 Pro, 16Go, 512Go SSD)", price: 239_000, category: "Ordinateurs", description: "Portable business robuste", image: "/slide-1.jpg", status: "Disponible" },
  { id: 9_993, name: "HP ProBook 450 G5 (i5, 16Go RAM, 512Go SSD)", price: 199_000, category: "Ordinateurs", description: "Portable polyvalent pour entreprise", image: "/slide-1.jpg", status: "Disponible" },
  { id: 9_994, name: "Batterie Dell Latitude", price: 35_000, category: "Chargeurs & batteries", description: "Batterie de remplacement compatible Dell Latitude", image: "/service-assistance.jpg", status: "Disponible" },
  { id: 9_995, name: "Batterie HP ProBook / EliteBook", price: 35_000, category: "Chargeurs & batteries", description: "Batterie de remplacement compatible HP", image: "/service-assistance.jpg", status: "Disponible" },
  { id: 9_996, name: "Batterie Lenovo ThinkPad", price: 38_000, category: "Chargeurs & batteries", description: "Batterie de remplacement compatible Lenovo ThinkPad", image: "/service-assistance.jpg", status: "Disponible" },
  { id: 9_997, name: "Clé Wi-Fi USB", price: 8_000, category: "Réseau & Wi‑Fi", description: "Adaptateur Wi-Fi USB pour PC", image: "/service-visuels.jpg", status: "Disponible" },
  { id: 9_998, name: "RAM DDR4 8Go", price: 25_000, category: "Composants", description: "Barrette mémoire DDR4 8Go", image: "/slide-support.png", status: "Disponible" },
  { id: 9_999, name: "RAM DDR4 16Go", price: 45_000, category: "Composants", description: "Barrette mémoire DDR4 16Go", image: "/slide-support.png", status: "Disponible" },
  { id: 10_000, name: "Moniteur Samsung M5 27 pouces Full HD", price: 165_000, category: "Écrans & bureaux", description: "Écran 27 pouces Full HD pour bureau et multimédia", image: "/slide-4.jpg", status: "Disponible" },
  { id: 10_001, name: "Souris filaire", price: 5_000, category: "Périphériques & audio", description: "Souris USB filaire", image: "/service-assistance.jpg", status: "Disponible" },
  { id: 10_002, name: "Souris sans fil", price: 8_000, category: "Périphériques & audio", description: "Souris sans fil ergonomique", image: "/service-assistance.jpg", status: "Disponible" },
  { id: 10_003, name: "Clavier standard", price: 10_000, category: "Périphériques & audio", description: "Clavier AZERTY standard", image: "/service-assistance.jpg", status: "Disponible" },
  { id: 10_004, name: "Clavier Deltaco WK95R sans fil AZERTY", price: 15_000, category: "Périphériques & audio", description: "Clavier sans fil AZERTY rétroéclairé", image: "/service-assistance.jpg", status: "Disponible" },
  { id: 10_005, name: "Clavier + souris combo sans fil", price: 35_000, category: "Périphériques & audio", description: "Pack clavier AZERTY + souris", image: "/service-assistance.jpg", status: "Disponible" },
  { id: 10_006, name: "Casque audio bureau", price: 12_000, category: "Périphériques & audio", description: "Casque pour bureau et appels", image: "/service-assistance.jpg", status: "Disponible" },
  { id: 10_007, name: "Webcam HD", price: 18_000, category: "Périphériques & audio", description: "Webcam HD pour visioconférence", image: "/service-assistance.jpg", status: "Disponible" },
  { id: 10_008, name: "Clé USB 16Gb", price: 5_000, category: "Stockage & USB", description: "Clé USB 16Gb", image: "/slide-support.png", status: "Disponible" },
  { id: 10_009, name: "Clé USB 32Gb", price: 11_000, category: "Stockage & USB", description: "Clé USB 32Gb dual connectique", image: "/slide-support.png", status: "Disponible" },
  { id: 10_010, name: "Clé USB 64Gb", price: 15_000, category: "Stockage & USB", description: "Clé USB 64Gb Type-C et USB-A", image: "/slide-support.png", status: "Disponible" },
  { id: 10_011, name: "Clé USB 128Gb", price: 20_000, category: "Stockage & USB", description: "Clé USB 128Gb Type-C et USB-A", image: "/slide-support.png", status: "Disponible" },
  { id: 10_012, name: "Clé USB 256Gb", price: 18_000, category: "Stockage & USB", description: "Clé USB 256Gb 3.2", image: "/slide-support.png", status: "Disponible" },
  { id: 10_013, name: "Disque externe 1 To", price: 45_000, category: "Stockage & USB", description: "Disque dur externe 1 To USB 3.0", image: "/slide-support.png", status: "Disponible" },
  { id: 10_014, name: "Disque externe 2 To", price: 58_000, category: "Stockage & USB", description: "Disque dur externe 2 To USB 3.0", image: "/slide-support.png", status: "Disponible" },
  { id: 10_015, name: "Disque externe 4 To", price: 75_000, category: "Stockage & USB", description: "Disque dur externe 4 To", image: "/slide-support.png", status: "Disponible" },
  { id: 10_016, name: "Disque externe 5 To", price: 88_000, category: "Stockage & USB", description: "Disque dur externe 5 To", image: "/slide-support.png", status: "Disponible" },
  { id: 10_017, name: "SSD 256 Go", price: 40_000, category: "Stockage & USB", description: "SSD interne 256 Go", image: "/slide-support.png", status: "Disponible" },
  { id: 10_018, name: "SSD 512 Go", price: 55_000, category: "Stockage & USB", description: "SSD interne 512 Go", image: "/slide-support.png", status: "Disponible" },
  { id: 10_019, name: "SSD externe 1 To", price: 70_000, category: "Stockage & USB", description: "SSD externe portable 1 To USB-C", image: "/slide-support.png", status: "Disponible" },
  { id: 10_020, name: "Chargeur Apple Macbook Magsafe 1 60W/85W", price: 20_000, category: "Chargeurs & batteries", description: "Adaptateur secteur Apple MacBook Magsafe 1 (60W/85W)", image: "/products/chargeur-apple-macbook-magsafe.png", status: "Disponible" },
  { id: 10_021, name: "Chargeur Microsoft Surface Pro 2/1, Surface 2/RT, Windows 8 Tablet 1536 (12V 3.6A)", price: 30_000, category: "Chargeurs & batteries", description: "Chargeur compatible Surface Pro 2, Surface Pro 1, Surface 2, Surface RT et tablette 1536", image: "/products/chargeur-microsoft-surface.png", status: "Disponible" },
  { id: 10_022, name: "Chargeur HP 19.5V (Petit bout bleu)", price: 20_000, category: "Chargeurs & batteries", description: "Chargeur HP 19.5V avec connecteur petit embout bleu", image: "/products/chargeur-hp-19-5v-petit-bout-bleu.png", status: "Disponible" },
  { id: 10_023, name: "Chargeur Dell 19.5V (Gros bout)", price: 20_000, category: "Chargeurs & batteries", description: "Chargeur Dell 19.5V avec connecteur gros embout", image: "/products/chargeur-dell-19-5v-gros-bout.png", status: "Disponible" },
  { id: 10_024, name: "Chargeur Dell 19.5V (Petit bout)", price: 20_000, category: "Chargeurs & batteries", description: "Chargeur Dell 19.5V avec connecteur petit embout", image: "/products/chargeur-dell-19-5v-petit-bout.png", status: "Disponible" },
  { id: 10_025, name: "Hub USB-C 4 en 1", price: 5_000, category: "Hubs & connectique", description: "Adaptateur USB-C multiport 4 en 1", image: "/service-sites.jpg", status: "Disponible" },
  { id: 10_026, name: "Hub USB-C 5 en 1", price: 20_000, category: "Hubs & connectique", description: "Hub USB-C 5 en 1", image: "/service-sites.jpg", status: "Disponible" },
  { id: 10_027, name: "Hub USB-C 6 en 1", price: 22_000, category: "Hubs & connectique", description: "Hub USB-C 6 en 1", image: "/service-sites.jpg", status: "Disponible" },
  { id: 10_028, name: "Hub USB-C 8 en 1", price: 13_000, category: "Hubs & connectique", description: "Hub USB-C 8 en 1", image: "/service-sites.jpg", status: "Disponible" },
  { id: 10_029, name: "Câble HDMI", price: 6_000, category: "Hubs & connectique", description: "Câble HDMI haute qualité", image: "/service-sites.jpg", status: "Disponible" },
  { id: 10_030, name: "Câble DisplayPort vers HDMI (1.8m)", price: 7_000, category: "Hubs & connectique", description: "Câble DisplayPort vers HDMI", image: "/service-sites.jpg", status: "Disponible" },
  { id: 10_031, name: "Multiprise parafoudre", price: 15_000, originalPrice: 20_000, category: "Énergie & protection", description: "Multiprise avec protection surtension", image: "/service-sites.jpg", status: "Disponible" },
  { id: 10_032, name: "Onduleur 650VA", price: 55_000, originalPrice: 65_000, category: "Énergie & protection", description: "Onduleur 650VA", image: "/service-sites.jpg", status: "Disponible" },
  { id: 10_033, name: "Routeur Wi-Fi", price: 35_000, category: "Réseau & Wi‑Fi", description: "Routeur Wi-Fi", image: "/service-visuels.jpg", status: "Disponible" },
  { id: 10_034, name: "Switch 8 ports", price: 25_000, category: "Réseau & Wi‑Fi", description: "Switch Ethernet 8 ports", image: "/service-visuels.jpg", status: "Disponible" },
  { id: 10_035, name: "Répéteur Wi-Fi", price: 20_000, category: "Réseau & Wi‑Fi", description: "Répéteur Wi-Fi", image: "/service-visuels.jpg", status: "Disponible" },
  { id: 10_036, name: "Câble réseau RJ45 (5m)", price: 4_000, category: "Réseau & Wi‑Fi", description: "Câble RJ45 5 mètres", image: "/service-visuels.jpg", status: "Disponible" },
  { id: 10_037, name: "Imprimante jet d’encre", price: 85_000, originalPrice: 95_000, category: "Impression & consommables", description: "Imprimante jet d’encre", image: "/slide-3.jpg", status: "Disponible" },
  { id: 10_038, name: "Imprimante laser mono", price: 150_000, originalPrice: 165_000, category: "Impression & consommables", description: "Imprimante laser monochrome", image: "/slide-3.jpg", status: "Disponible" },
  { id: 10_039, name: "Powerbank UGREEN 20000mAh 100W", price: 45_000, category: "Énergie & protection", description: "Batterie externe 20000mAh 100W USB-C", image: "/service-assistance.jpg", status: "Disponible" },
  { id: 10_040, name: "Powerbank UGREEN Nexode 20000mAh 130W", price: 55_000, category: "Énergie & protection", description: "Batterie externe 20000mAh 130W avec écran", image: "/service-assistance.jpg", status: "Disponible" },
  { id: 10_041, name: "Casque Anker Soundcore Space One", price: 70_000, category: "Périphériques & audio", description: "Casque Bluetooth réduction de bruit active", image: "/service-visuels.jpg", status: "Disponible" },
  { id: 10_042, name: "Casque Ugreen Hitune Max 5C", price: 32_000, category: "Périphériques & audio", description: "Casque sans fil pliable avec réduction de bruit", image: "/service-visuels.jpg", status: "Disponible" },
  { id: 10_043, name: "Casque Marshall Monitor III ANC", price: 199_000, category: "Périphériques & audio", description: "Casque premium ANC sans fil", image: "/service-visuels.jpg", status: "Disponible" },
  { id: 10_044, name: "HP 652 Cartouche d'encre Noir", price: 16_000, category: "Impression & consommables", description: "Cartouche originale HP 652 noir", image: "/slide-3.jpg", status: "Disponible" },
  { id: 10_045, name: "HP 652 Cartouche d'encre Tri-Color", price: 15_000, category: "Impression & consommables", description: "Cartouche originale HP 652 couleur", image: "/slide-3.jpg", status: "Disponible" },
  { id: 10_046, name: "HP 305 Multipack Noir + Tricolore", price: 22_000, category: "Impression & consommables", description: "Lot de cartouches HP 305", image: "/slide-3.jpg", status: "Disponible" },
  { id: 10_047, name: "HP 305XL Multipack haut rendement", price: 43_000, category: "Impression & consommables", description: "Cartouches HP 305XL noir et tricolore", image: "/slide-3.jpg", status: "Disponible" },
  { id: 10_048, name: "HP 903 Cartouche d'encre Noire", price: 21_000, category: "Impression & consommables", description: "Cartouche HP 903 noire", image: "/slide-3.jpg", status: "Disponible" },
  { id: 10_049, name: "HP 903 Cartouche d'encre Cyan", price: 16_000, category: "Impression & consommables", description: "Cartouche HP 903 cyan", image: "/slide-3.jpg", status: "Disponible" },
  { id: 10_050, name: "HP 903 Cartouche d'encre Magenta", price: 16_000, category: "Impression & consommables", description: "Cartouche HP 903 magenta", image: "/slide-3.jpg", status: "Disponible" },
  { id: 10_051, name: "HP 903 Cartouche d'encre Jaune", price: 16_000, category: "Impression & consommables", description: "Cartouche HP 903 jaune", image: "/slide-3.jpg", status: "Disponible" },
  /* Chargeurs gaming / pro — grille tarifaire de référence marché (ex. kotech.ci, catégorie chargeurs PC) */
  { id: 10_100, name: "Asus adaptateur 100W USB Type-C (chargeur portable / gamer)", price: 41_900, category: "Chargeurs & batteries", description: "100-240V, sortie USB-C jusqu'à 100W, prise UE. Modèle type A20-100P1A.", image: "/products/chargeur-microsoft-surface.png", status: "Disponible" },
  { id: 10_101, name: "Asus chargeur gaming 180W 20V 9A — embout 6,0 x 3,7 mm", price: 41_900, category: "Chargeurs & batteries", description: "Alimentation compatible séries Asus ROG / TUF selon fiche technique (barrel 6,0×3,7).", image: "/products/chargeur-hp-19-5v-petit-bout-bleu.png", status: "Disponible" },
  { id: 10_102, name: "Asus chargeur gaming 230W 19,5V 11,8A — embout 5,5 x 2,5 mm", price: 44_900, category: "Chargeurs & batteries", description: "Haute puissance pour stations gaming Asus, connecteur 5,5×2,5 mm.", image: "/products/chargeur-dell-19-5v-gros-bout.png", status: "Disponible" },
  { id: 10_103, name: "Asus chargeur gaming 180W 19,5V 9,23A — embout 5,5 x 2,5 mm", price: 39_900, category: "Chargeurs & batteries", description: "180W barrel 5,5×2,5 — vérifier compatibilité machine avant achat.", image: "/products/chargeur-dell-19-5v-petit-bout.png", status: "Disponible" },
  { id: 10_104, name: "Asus chargeur gaming 200W 20V 10A — embout 6,0 x 3,7 mm", price: 44_900, category: "Chargeurs & batteries", description: "200W pour portables gaming exigeants, connecteur 6,0×3,7 mm.", image: "/products/chargeur-hp-19-5v-petit-bout-bleu.png", status: "Disponible" },
  { id: 10_105, name: "Asus chargeur gaming 240W 20V 12A — embout 6,0 x 3,7 mm", price: 47_900, category: "Chargeurs & batteries", description: "240W — idéal gros GPU mobile, embout 6,0×3,7 mm.", image: "/products/chargeur-dell-19-5v-gros-bout.png", status: "Disponible" },
  { id: 10_106, name: "Asus chargeur gaming 280W 20V 14A — embout 6,0 x 3,7 mm", price: 49_900, category: "Chargeurs & batteries", description: "280W — alimentation haut de gamme pour stations portables.", image: "/products/chargeur-dell-19-5v-gros-bout.png", status: "Disponible" },
  { id: 10_107, name: "Asus chargeur portable 19V 3,42A — 90W barrel 5,5 x 2,5 mm", price: 7_900, category: "Chargeurs & batteries", description: "Chargeur classique Asus 19V / 3,42A, connecteur 5,5×2,5 mm.", image: "/products/chargeur-dell-19-5v-petit-bout.png", status: "Disponible" },
  { id: 10_108, name: "Asus chargeur portable 19,5V 1,75A — série VivoBook / ZenBook", price: 10_900, category: "Chargeurs & batteries", description: "Format compact 19,5V 1,75A — vérifier référence portable.", image: "/products/chargeur-hp-19-5v-petit-bout-bleu.png", status: "Disponible" },
  { id: 10_109, name: "Chargeur allume-cigare 2 en 1 Fast Charge iPhone / USB — 40W", price: 7_900, category: "Chargeurs & batteries", description: "Double sortie rapide pour véhicule, charge smartphones et accessoires.", image: "/products/cat-hub-cable.jpg", status: "Disponible" },
  { id: 10_110, name: "Chargeur allume-cigare 2 en 1 Fast Charge USB-C — 40W", price: 7_900, category: "Chargeurs & batteries", description: "PD + QC3.0, entrée 12-24V véhicule, câble intégré selon version.", image: "/products/chargeur-microsoft-surface.png", status: "Disponible" },
  { id: 10_111, name: "Asus chargeur gamer 120W 19V 6,32A — barrel 5,5 x 2,5 mm", price: 29_900, category: "Chargeurs & batteries", description: "120W noir, prise Europe, neuf — compatibilité à confirmer selon modèle.", image: "/products/chargeur-dell-19-5v-gros-bout.png", status: "Disponible" },
  { id: 10_112, name: "Asus chargeur gamer 120W 19V 6,32A (variante 5,5 x 2,5)", price: 29_900, category: "Chargeurs & batteries", description: "Même puissance / connectique courante Asus gaming entrée de gamme.", image: "/products/chargeur-dell-19-5v-petit-bout.png", status: "Disponible" },
  { id: 10_113, name: "Lenovo adaptateur gaming 170W 20V 8,5A — connecteur rectangulaire (bout USB)", price: 39_900, category: "Chargeurs & batteries", description: "Bloc compact Lenovo 170W — vérifier la forme du connecteur machine.", image: "/products/chargeur-microsoft-surface.png", status: "Disponible" },
  { id: 10_114, name: "MSI chargeur gaming 240W 20V 12A — embout 4,5 x 3,0 mm", price: 43_900, category: "Chargeurs & batteries", description: "Alimentation MSI / Chicony-Delta type gaming 240W, petite fiche centrée.", image: "/products/chargeur-hp-19-5v-petit-bout-bleu.png", status: "Disponible" },
  { id: 10_115, name: "MSI chargeur gaming 180W 20V 9A — embout 4,5 x 3,0 mm", price: 39_900, category: "Chargeurs & batteries", description: "180W pour séries MSI Creator / Stealth selon compatibilité embout.", image: "/products/chargeur-dell-19-5v-petit-bout.png", status: "Disponible" },
  { id: 10_116, name: "MSI chargeur gaming 120W 20V 6A — embout 4,5 x 3,0 mm", price: 34_900, category: "Chargeurs & batteries", description: "120W — entrée 100-240V, connecteur 4,5×3,0 mm avec broche centrale.", image: "/products/chargeur-dell-19-5v-gros-bout.png", status: "Disponible" },
  { id: 10_117, name: "MSI chargeur gaming 150W 20V 7,5A — embout 4,5 x 3,0 mm", price: 34_900, category: "Chargeurs & batteries", description: "150W léger pour config portable milieu de gamme MSI.", image: "/products/chargeur-hp-19-5v-petit-bout-bleu.png", status: "Disponible" },
  { id: 10_118, name: "MSI chargeur gaming 230W 19,5V 11,8A — barrel 5,5 x 2,5 mm", price: 49_900, category: "Chargeurs & batteries", description: "230W type ADP-230CB / références équivalentes — gros portable gaming.", image: "/products/chargeur-dell-19-5v-gros-bout.png", status: "Disponible" },
  { id: 10_119, name: "MSI chargeur gaming 240W 20V 12A — embout USB (type barrel USB)", price: 54_900, category: "Chargeurs & batteries", description: "240W embout USB style MSI récent (Stealth / Vector) — confirmer référence PC.", image: "/products/chargeur-microsoft-surface.png", status: "Disponible" },
  { id: 10_120, name: "MSI chargeur gaming 280W 20V 14A — connecteur USB", price: 57_000, category: "Chargeurs & batteries", description: "Alimentation très haute puissance pour laptops MSI flagship.", image: "/products/chargeur-microsoft-surface.png", status: "Disponible" },
  { id: 10_121, name: "MSI chargeur gaming 19,5V 7,7A — barrel (vérifier compatibilité)", price: 43_900, category: "Chargeurs & batteries", description: "Bloc MSI ~150W selon série — toujours valider voltage / ampérage / embout.", image: "/products/chargeur-dell-19-5v-petit-bout.png", status: "Disponible" },
  /* Référence marché (prix indicatifs) : PC & ordinateurs — https://kotech.ci/categorie-produit/pc-ordinateurs/ */
  { id: 10_200, name: "Dell Latitude 5490 — Intel Core i7 8e gen — 8 Go RAM — SSD 256 Go — 14\"", price: 199_900, category: "Ordinateurs", description: "Portable professionnel seconde vie, écran Full HD. Garantie selon stock.", image: "/products/cat-laptop.jpg", status: "Disponible" },
  { id: 10_201, name: "Dell Precision Tower 7810 — 2× Xeon E5-2620 v3 — 8 Go — HDD 1 To", price: 199_900, originalPrice: 450_000, category: "Ordinateurs", description: "Station de travail reconditionnée pour CAO / rendu / labo.", image: "/products/cat-laptop.jpg", status: "Disponible" },
  { id: 10_202, name: "Disque serveur HPE 2,4 To SAS 10K SFF", price: 249_900, category: "Composants", description: "Disque entreprise SAS 2,5\" pour serveur HP / baie compatible.", image: "/products/cat-storage.jpg", status: "Disponible" },
  { id: 10_203, name: "Support VESA mini PC HP / Lenovo (100×100 mm)", price: 14_900, category: "Écrans & bureaux", description: "Support mural ou arrière écran pour mini UC, visserie incluse.", image: "/products/cat-monitor.jpg", status: "Disponible" },
  { id: 10_204, name: "PC gamer tour — AMD Ryzen 5 1600 — RTX 3050 6 Go — 16 Go — SSD 512 Go + HDD 1 To", price: 599_000, category: "Ordinateurs", description: "Config bureau gaming entrée de gamme, Windows à installer selon option.", image: "/products/cat-laptop.jpg", status: "Disponible" },
  { id: 10_205, name: "PC gamer tour — Intel Core i5-12400 — RTX 3050 6 Go — 16 Go — M.2 512 Go + HDD 1 To", price: 899_900, category: "Ordinateurs", description: "Tour MSI PRO H610, alimentation 650W, boîtier gaming.", image: "/products/cat-laptop.jpg", status: "Disponible" },
  { id: 10_206, name: "PC gamer tour — Intel Core i5-12500 — RTX 3050 6 Go — 16 Go — M.2 512 Go + HDD 1 To", price: 899_900, category: "Ordinateurs", description: "Variante boîtier blanc, refroidissement RGB.", image: "/products/cat-laptop.jpg", status: "Disponible" },
  { id: 10_207, name: "Portable gamer Asus TUF A17 — Ryzen 7 — 16 Go — SSD 512 Go — 17,3\" — RTX 4050 6 Go", price: 999_900, originalPrice: 1_550_000, category: "Ordinateurs", description: "Écran 144 Hz Full HD, Windows 11 Famille. Neuf / import selon arrivage.", image: "/products/cat-laptop.jpg", status: "Disponible" },
  { id: 10_208, name: "PC gamer tour — Intel Core i7 — RTX 3050 6 Go — 16 Go DDR4", price: 890_000, category: "Ordinateurs", description: "Config milieu de gamme, préciser fiche CPU exacte avant commande.", image: "/products/cat-laptop.jpg", status: "Disponible" },
  { id: 10_209, name: "PC gamer tour — Intel Core i9-14900K — RTX 5060 Ti 16 Go — 64 Go DDR5 — SSD 2 To", price: 2_500_000, category: "Ordinateurs", description: "Station gaming haut de gamme, watercooling 360, alimentation 850W.", image: "/products/cat-laptop.jpg", status: "Disponible" },
  { id: 10_210, name: "Portable gamer Asus ROG Strix 17 — Ryzen 9 7845HX — 32 Go — SSD 1 To — RTX 4060 8 Go", price: 1_500_000, category: "Ordinateurs", description: "Écran QHD 240 Hz, Wi-Fi 6E, Windows 11 Famille.", image: "/products/cat-laptop.jpg", status: "Disponible" },
  { id: 10_211, name: "HP Desktop 290 G9 — Core i5 — 8 Go — SSD 512 Go + écran HP 22\"", price: 360_000, category: "Ordinateurs", description: "Pack bureau complet avec écran Full HD, lecteur DVD mince.", image: "/products/cat-laptop.jpg", status: "Disponible" },
  { id: 10_212, name: "HP Desktop 290 G9 — Core i5 — 8 Go — HDD 1 To + écran HP 22\"", price: 430_900, category: "Ordinateurs", description: "Pack bureautique disque classique, slot M.2 libre selon version.", image: "/products/cat-laptop.jpg", status: "Disponible" },
  { id: 10_213, name: "HP Desktop 290 G9 — Core i7 — 8 Go — SSD 512 Go + écran HP 22\"", price: 460_000, category: "Ordinateurs", description: "Pack pro polyvalent, clavier et souris HP fournis.", image: "/products/cat-laptop.jpg", status: "Disponible" },
  { id: 10_214, name: "HP EliteBook 830 G5 — Core i5-8350U — 8 Go — SSD 256 Go — tactile", price: 179_900, originalPrice: 230_000, category: "Ordinateurs", description: "Ultraportable pro reconditionné, excellent état selon arrivage.", image: "/products/cat-laptop.jpg", status: "Disponible" },
  { id: 10_215, name: "HP EliteDesk 800 G3 mini — Core i5-6500 — 8 Go — SSD 512 Go", price: 164_900, originalPrice: 320_000, category: "Ordinateurs", description: "Mini PC silencieux pour bureau, télétravail, point de vente.", image: "/products/cat-laptop.jpg", status: "Disponible" },
  { id: 10_216, name: "HP Pro Desktop 290 G9 — Core i5-12500 — 8 Go — 1 To — écran 21,45\" — Win 10", price: 419_900, category: "Ordinateurs", description: "Tour récente 12e gen, Wi-Fi intégré, clavier/souris HP.", image: "/products/cat-laptop.jpg", status: "Disponible" },
  { id: 10_217, name: "Intel NUC — Celeron — 8 Go RAM — SSD 256 Go — Windows 10", price: 119_900, originalPrice: 200_000, category: "Ordinateurs", description: "Mini PC compact, double HDMI, support VESA inclus.", image: "/products/cat-laptop.jpg", status: "Disponible" },
  { id: 10_218, name: "Lenovo ThinkCentre M710q — Core i5-6700 — 4 Go — SSD 512 Go", price: 124_900, category: "Ordinateurs", description: "Tiny PC pro, DisplayPort + VGA, Ethernet.", image: "/products/cat-laptop.jpg", status: "Disponible" },
  { id: 10_219, name: "Lenovo ThinkCentre M710q — Core i7-6700 — 8 Go — SSD 512 Go", price: 164_900, category: "Ordinateurs", description: "Tiny PC pro renforcé, idéal open space.", image: "/products/cat-laptop.jpg", status: "Disponible" },
  { id: 10_220, name: "HP EliteDesk 800 G3 mini — Core i5-6500 — 8 Go — SSD 512 Go", price: 139_900, category: "Ordinateurs", description: "Mini PC reconditionné, faible encombrement.", image: "/products/cat-laptop.jpg", status: "Disponible" },
  { id: 10_221, name: "Lenovo ThinkCentre M800 — Core i3-6100 — 4 Go — SSD 256 Go + écran ThinkVision P24h QHD", price: 119_000, category: "Ordinateurs", description: "Pack bureau + écran 23,8\" IPS QHD, clavier et souris.", image: "/products/cat-laptop.jpg", status: "Disponible" },
  { id: 10_222, name: "Multiprise PDU rack 19\" — 8 prises IEC — serveur & réseau", price: 15_900, category: "Énergie & protection", description: "Distribution électrique baie serveur, câblage IEC.", image: "/products/cat-hub-cable.jpg", status: "Disponible" },
  /* Accessoires PC — chargeurs / batteries / petits adaptateurs — https://kotech.ci/categorie-produit/accessoires-pc/ */
  { id: 10_230, name: "Adaptateur USB-C / USB-A 3 en 1 — hub compact", price: 2_900, originalPrice: 10_000, category: "Hubs & connectique", description: "1× USB 3.0 + 2× USB 2.0, format voyage.", image: "/products/cat-hub-cable.jpg", status: "Disponible" },
  { id: 10_231, name: "Adaptateur USB 4 en 1 — USB 3.0 + USB-C", price: 2_900, originalPrice: 10_000, category: "Hubs & connectique", description: "Quatre ports dont Type-C, noir.", image: "/products/cat-hub-cable.jpg", status: "Disponible" },
  { id: 10_232, name: "Clé Wi-Fi USB Linksys double bande AC600", price: 14_900, category: "Réseau & Wi‑Fi", description: "Adaptateur Wi-Fi externe pour PC fixe ou portable.", image: "/products/cat-network.jpg", status: "Disponible" },
  { id: 10_233, name: "Carte adaptateur PCIe 3.0 x1 vers SSD NVMe M.2", price: 8_900, category: "Composants", description: "Ajoute un slot NVMe M.2 (vérifier support BIOS NVMe).", image: "/products/cat-ram.jpg", status: "Disponible" },
  { id: 10_234, name: "Adaptateur USB 3.0 vers SATA 2,5\" (disque / SSD)", price: 4_900, originalPrice: 7_900, category: "Hubs & connectique", description: "Branchement plug-and-play disques SATA 2,5 pouces.", image: "/products/cat-storage.jpg", status: "Disponible" },
  { id: 10_235, name: "Adaptateur USB-C vers VGA", price: 3_900, category: "Hubs & connectique", description: "Vidéo jusqu'à 1920×1200, format compact.", image: "/products/cat-hub-cable.jpg", status: "Disponible" },
  { id: 10_236, name: "Antenne Wi-Fi omnidirectionnelle 9 dBi — base magnétique", price: 9_900, category: "Réseau & Wi‑Fi", description: "Améliore la réception sur routeur ou carte compatible.", image: "/products/cat-network.jpg", status: "Disponible" },
  { id: 10_237, name: "Tapis de souris gamer ASRock RGB 350×250 mm", price: 9_900, category: "Périphériques & audio", description: "Surface lisse, bord RGB.", image: "/products/cat-keyboard-mouse.jpg", status: "Disponible" },
  { id: 10_238, name: "Batterie portable Asus série X101", price: 31_900, category: "Chargeurs & batteries", description: "Li-Ion compatible série X101 — vérifier référence exacte.", image: "/products/cat-battery.jpg", status: "Disponible" },
  { id: 10_239, name: "Batterie portable Asus série X200", price: 44_900, category: "Chargeurs & batteries", description: "Li-Ion 5200 mAh type X200CA.", image: "/products/cat-battery.jpg", status: "Disponible" },
  { id: 10_240, name: "Batterie portable HP Ki04 / K104", price: 23_900, category: "Chargeurs & batteries", description: "4 cellules 14,8 V, compatible Pavilion selon références.", image: "/products/cat-battery.jpg", status: "Disponible" },
  { id: 10_241, name: "Batterie Dell Latitude E7470 / E7270 (J60J5)", price: 34_900, category: "Chargeurs & batteries", description: "Batterie type J60J5 pour ultrabook Dell.", image: "/products/cat-battery.jpg", status: "Disponible" },
  { id: 10_242, name: "Batterie Dell Mini 10", price: 19_900, category: "Chargeurs & batteries", description: "Li-Ion 4400 mAh pour netbook série Mini 10.", image: "/products/cat-battery.jpg", status: "Disponible" },
  { id: 10_243, name: "Batterie Dell 357F9", price: 44_900, category: "Chargeurs & batteries", description: "Batterie Li-Ion 11,1 V pour Inspiron compatible.", image: "/products/cat-battery.jpg", status: "Disponible" },
  { id: 10_244, name: "Batterie Dell Latitude E5400", price: 19_900, category: "Chargeurs & batteries", description: "Batterie 6 cellules série E5400.", image: "/products/cat-battery.jpg", status: "Disponible" },
  /* Composants PC — https://kotech.ci/categorie-produit/composants-pc/ */
  { id: 10_250, name: "Alimentation HP 280 G4 MT (reconditionnée)", price: 39_900, category: "Composants", description: "Bloc format tour HP, pièce seconde vie testée.", image: "/products/cat-powerbank.jpg", status: "Disponible" },
  { id: 10_251, name: "Alimentation Aerocool LUX 550W — 80 PLUS Bronze", price: 49_900, originalPrice: 54_900, category: "Composants", description: "550W, ventilateur 120 mm, câbles plats.", image: "/products/cat-powerbank.jpg", status: "Disponible" },
  { id: 10_252, name: "Injecteur PoE Gigabit 48V 0,5A", price: 9_900, category: "Composants", description: "Alimentation PoE 802.3af pour AP ou caméra.", image: "/products/cat-powerbank.jpg", status: "Disponible" },
  { id: 10_253, name: "Alimentation gamer WJ Coolman DN650 — 650W 80+", price: 52_900, category: "Composants", description: "ATX12V v2.31, ventilateur 120 mm thermorégulé.", image: "/products/cat-powerbank.jpg", status: "Disponible" },
  { id: 10_254, name: "Alimentation gamer WJCOOLMAN 700W", price: 60_900, category: "Composants", description: "Grosse plage 12V pour carte graphique, protections OVP/UVP.", image: "/products/cat-powerbank.jpg", status: "Disponible" },
  { id: 10_255, name: "Alimentation WJCOOLMAN DQ1000 — 1000W 80+ Gold ATX 3.0 PCIe Gen5", price: 120_000, category: "Composants", description: "Câble 12VHPWR inclus, haut de gamme RTX 40/50.", image: "/products/cat-powerbank.jpg", status: "Disponible" },
  { id: 10_256, name: "Alimentation HP ProDesk 180W (reconditionnée)", price: 49_900, category: "Composants", description: "Format SFF HP, pièce testée.", image: "/products/cat-powerbank.jpg", status: "Disponible" },
  { id: 10_257, name: "Alimentation HP Compaq 6000/8000 — 320W", price: 29_900, category: "Composants", description: "Remplacement tour HP Elite / Compaq.", image: "/products/cat-powerbank.jpg", status: "Disponible" },
  { id: 10_258, name: "Alimentation Thermalright TR-1000 — 1000W 80+ Gold", price: 150_000, category: "Composants", description: "ATX 3.1, modulaire, ventilateur 120 mm.", image: "/products/cat-powerbank.jpg", status: "Disponible" },
  { id: 10_259, name: "Alimentation Thermalright TGFX-850 — 850W SFX 80+ Gold", price: 115_000, category: "Composants", description: "Format SFX pour boîtiers compacts gaming.", image: "/products/cat-powerbank.jpg", status: "Disponible" },
  { id: 10_260, name: "Alimentation Thermalright SG850W — ATX 3.1 PCIe 5.1 — 850W Gold", price: 100_000, category: "Composants", description: "Entièrement modulaire, silencieuse.", image: "/products/cat-powerbank.jpg", status: "Disponible" },
  { id: 10_261, name: "Alimentation Thermalright TR-TG1650 — 1650W 80+ Gold", price: 249_900, category: "Composants", description: "Très haute puissance, workstation / multi-GPU.", image: "/products/cat-powerbank.jpg", status: "Disponible" },
  { id: 10_262, name: "Écran gamer AOC U34G3XM — 34\" ultrawide QHD 144 Hz", price: 439_900, originalPrice: 600_000, category: "Écrans & bureaux", description: "VA 21:9, FreeSync Premium, HDMI + DisplayPort.", image: "/products/cat-monitor.jpg", status: "Disponible" },
  { id: 10_263, name: "Écran gamer AOC 27\" incurvé Full HD 250 Hz 0,5 ms", price: 229_900, originalPrice: 320_000, category: "Écrans & bureaux", description: "Courbure 1500R, FreeSync, HDMI + DisplayPort.", image: "/products/cat-monitor.jpg", status: "Disponible" },
  { id: 10_264, name: "Disque dur externe WD Backup Plus USB 3.0 — 8 To", price: 169_900, originalPrice: 230_900, category: "Stockage & USB", description: "Stockage de bureau, sauvegardes volumineuses.", image: "/products/cat-storage.jpg", status: "Disponible" },
  { id: 10_265, name: "Disque dur externe WD Backup Plus portable USB 3.0 — 2 To", price: 49_900, originalPrice: 100_900, category: "Stockage & USB", description: "2,5\" nomade, léger.", image: "/products/cat-storage.jpg", status: "Disponible" },
  { id: 10_266, name: "Disque dur externe WD Backup Plus portable USB 3.0 — 5 To", price: 79_900, originalPrice: 120_900, category: "Stockage & USB", description: "Grosse capacité nomade.", image: "/products/cat-storage.jpg", status: "Disponible" },
  { id: 10_267, name: "Barrette RAM bureau DDR4 8 Go 2666 MHz", price: 40_000, category: "Composants", description: "Mémoire desktop 1,2 V.", image: "/products/cat-ram.jpg", status: "Disponible" },
  { id: 10_268, name: "Barrette RAM bureau DDR4 8 Go 3200 MHz", price: 40_000, category: "Composants", description: "Mémoire desktop 1,2 V.", image: "/products/cat-ram.jpg", status: "Disponible" },
  { id: 10_269, name: "Barrette RAM portable DDR4 16 Go 3200 MHz", price: 70_000, category: "Composants", description: "SODIMM laptop.", image: "/products/cat-ram.jpg", status: "Disponible" },
  { id: 10_270, name: "Barrette RAM portable DDR4 32 Go 3200 MHz", price: 120_000, category: "Composants", description: "SODIMM haute capacité.", image: "/products/cat-ram.jpg", status: "Disponible" },
  { id: 10_271, name: "Barrette RAM bureau DDR4 16 Go 2666 MHz", price: 70_000, category: "Composants", description: "DIMM dual channel ready.", image: "/products/cat-ram.jpg", status: "Disponible" },
  { id: 10_272, name: "Barrette RAM portable DDR4 16 Go 3200 MHz (SODIMM)", price: 65_000, category: "Composants", description: "Mémoire portable performante.", image: "/products/cat-ram.jpg", status: "Disponible" },
  { id: 10_273, name: "Barrette RAM portable DDR4 4 Go 3200 MHz", price: 22_000, category: "Composants", description: "Upgrade entrée de gamme.", image: "/products/cat-ram.jpg", status: "Disponible" },
  /* Réseaux — https://kotech.ci/categorie-produit/reseaux/ */
  { id: 10_280, name: "Adaptateur Ethernet USB 3.0 vers RJ45 Gigabit", price: 5_900, category: "Réseau & Wi‑Fi", description: "LAN filaire 10/100/1000 sur port USB.", image: "/products/cat-network.jpg", status: "Disponible" },
  { id: 10_281, name: "Carte Wi-Fi Asus PCIe AC1900 double bande", price: 54_900, category: "Réseau & Wi‑Fi", description: "Wi-Fi AC1900, base magnétique antennes externes.", image: "/products/cat-network.jpg", status: "Disponible" },
  { id: 10_282, name: "Câble Ethernet RJ45 — 3 m", price: 2_900, category: "Réseau & Wi‑Fi", description: "Patch cord catégorie selon stock.", image: "/products/cat-network.jpg", status: "Disponible" },
  { id: 10_283, name: "Câble Ethernet Cat6E RJ45 — 15 m — blanc", price: 6_900, category: "Réseau & Wi‑Fi", description: "Liaison longue distance switch / box.", image: "/products/cat-network.jpg", status: "Disponible" },
  { id: 10_284, name: "Câble réseau FTP Cat5E blindé serti — 3 m — gris", price: 1_900, category: "Réseau & Wi‑Fi", description: "RJ45 blindé, 1 Gb/s.", image: "/products/cat-network.jpg", status: "Disponible" },
  { id: 10_285, name: "Câble réseau FTP Cat5 blindé serti — 50 m — gris", price: 24_900, category: "Réseau & Wi‑Fi", description: "Liaison baie / baie ou horizontal.", image: "/products/cat-network.jpg", status: "Disponible" },
  { id: 10_286, name: "Câble réseau FTP Cat6 blindé serti — 20 m — gris", price: 13_900, category: "Réseau & Wi‑Fi", description: "Meilleure tenue aux interférences sur longueur.", image: "/products/cat-network.jpg", status: "Disponible" },
  { id: 10_287, name: "Carte PCIe Wi-Fi N 300 Mbps", price: 18_900, category: "Réseau & Wi‑Fi", description: "Wi-Fi N, faible encombrement, low-profile inclus.", image: "/products/cat-network.jpg", status: "Disponible" },
  { id: 10_288, name: "Clé Wi-Fi USB N 600 Mbps", price: 4_900, category: "Réseau & Wi‑Fi", description: "Dongle Wi-Fi 2,4 GHz rapide.", image: "/products/cat-network.jpg", status: "Disponible" },
  { id: 10_289, name: "Connecteurs RJ45 blindés — lot 100 pièces", price: 4_650, category: "Réseau & Wi‑Fi", description: "Pour sertissage câbles Cat5e/Cat6.", image: "/products/cat-network.jpg", status: "Disponible" },
  { id: 10_290, name: "Répéteur Wi-Fi D-Link DAP-1325 N300", price: 19_900, category: "Réseau & Wi‑Fi", description: "Étend la couverture box, 1 port LAN.", image: "/products/cat-network.jpg", status: "Disponible" },
  { id: 10_291, name: "Modem-routeur D-Link DSL-124 Wireless N", price: 19_900, category: "Réseau & Wi‑Fi", description: "ADSL + Wi-Fi N, 4 ports LAN.", image: "/products/cat-network.jpg", status: "Disponible" },
  { id: 10_292, name: "Modem-routeur D-Link DSL-2750U N300 ADSL2+", price: 19_900, category: "Réseau & Wi‑Fi", description: "Wi-Fi N300, USB 2.0, double antenne.", image: "/products/cat-network.jpg", status: "Disponible" },
  { id: 10_293, name: "Switch D-Link DES-1050G — 48 ports Fast Ethernet + 2 Gigabit", price: 69_900, category: "Réseau & Wi‑Fi", description: "Switch rackable / bureau selon version.", image: "/products/cat-network.jpg", status: "Disponible" },
  { id: 10_294, name: "Switch D-Link DES-1024D — 24 ports 10/100", price: 33_900, category: "Réseau & Wi‑Fi", description: "Boîtier métal, non manageable.", image: "/products/cat-network.jpg", status: "Disponible" },
  { id: 10_295, name: "Système Wi-Fi mesh TP-Link Deco M5 — pack 3", price: 154_900, category: "Réseau & Wi‑Fi", description: "Couverture maison complète, double bande AC1300.", image: "/products/cat-network.jpg", status: "Disponible" },
  { id: 10_296, name: "Kit tournevis de précision 122 en 1", price: 6_900, originalPrice: 15_000, category: "Réseau & Wi‑Fi", description: "Utile maintenance PC et petits appareils.", image: "/products/cat-network.jpg", status: "Disponible" },
  { id: 10_297, name: "Kit réseau — pince à sertir + testeur + RJ45 + dénudeur", price: 15_000, category: "Réseau & Wi‑Fi", description: "Pack câblage 9 en 1 pour technicien.", image: "/products/cat-network.jpg", status: "Disponible" },
  { id: 10_298, name: "Routeur Linksys Wi-Fi N300 (E900)", price: 28_000, category: "Réseau & Wi‑Fi", description: "4 ports Fast Ethernet, idéal petit foyer.", image: "/products/cat-network.jpg", status: "Disponible" },
  { id: 10_299, name: "Lot 100 connecteurs RJ45 transparents", price: 3_900, category: "Réseau & Wi‑Fi", description: "Connecteurs 8P8C pour réseau.", image: "/products/cat-network.jpg", status: "Disponible" },
  { id: 10_300, name: "Routeur Mercusys MR50G AC1900 dual band Gigabit", price: 39_900, category: "Réseau & Wi‑Fi", description: "MU-MIMO, 6 antennes, ports Gigabit.", image: "/products/cat-network.jpg", status: "Disponible" },
  { id: 10_301, name: "Routeur / hotspot MikroTik RB951Ui-2HnD", price: 49_900, originalPrice: 79_900, category: "Réseau & Wi‑Fi", description: "RouterOS niveau 4, 5× Gigabit, Wi-Fi N.", image: "/products/cat-network.jpg", status: "Disponible" },
  { id: 10_302, name: "Pince à sertir professionnelle + 100 connecteurs RJ45", price: 9_900, category: "Réseau & Wi‑Fi", description: "Kit pro sertissage RJ45/RJ11.", image: "/products/cat-network.jpg", status: "Disponible" },
  /* Accueil vitrine — références type marché (ex. kotech.ci) */
  { id: 10_310, name: "MSI MAG 241C — écran gamer 23,6\" incurvé 180 Hz 1 ms", price: 169_900, category: "Écrans & bureaux", description: "Full HD, 1500R, anti-scintillement, sans cadre.", image: "/products/cat-monitor.jpg", status: "Disponible" },
  { id: 10_311, name: "Samsung Odyssey G6 — 32\" QHD VA 240 Hz (S32BG650EM)", price: 319_000, originalPrice: 399_900, category: "Écrans & bureaux", description: "Écran incurvé gaming, HDMI 2.1, HDR.", image: "/products/cat-monitor.jpg", status: "Disponible" },
  { id: 10_312, name: "MSI PRO MP341CQW — 34\" ultrawide WQHD incurvé 100 Hz", price: 349_900, originalPrice: 450_000, category: "Écrans & bureaux", description: "3440×1440 VA, FreeSync, HDMI/DP, blanc.", image: "/products/cat-monitor.jpg", status: "Disponible" },
  { id: 10_313, name: "Lenovo L24e-40 — 23,8\" FHD 100 Hz", price: 104_900, originalPrice: 150_900, category: "Écrans & bureaux", description: "IPS/VA selon version, FreeSync, HDMI.", image: "/products/cat-monitor.jpg", status: "Disponible" },
  { id: 10_314, name: "Lenovo L27e-40 — 27\" FHD 100 Hz", price: 124_900, originalPrice: 179_000, category: "Écrans & bureaux", description: "Bureautique et loisirs, antireflet.", image: "/products/cat-monitor.jpg", status: "Disponible" },
  { id: 10_315, name: "LG UltraGear 24GS50F-B — 24\" FHD 180 Hz", price: 159_900, originalPrice: 250_000, category: "Écrans & bureaux", description: "HDR10, FreeSync, 1 ms MBR.", image: "/products/cat-monitor.jpg", status: "Disponible" },
  { id: 10_316, name: "LG UltraWide 29WQ600-W — 29\" 2560×1080 IPS", price: 209_900, originalPrice: 350_000, category: "Écrans & bureaux", description: "HDR10, USB-C / HDMI / DP, VESA 100×100.", image: "/products/cat-monitor.jpg", status: "Disponible" },
  { id: 10_317, name: "Samsung Odyssey G5 — 27\" QHD incurvé 165 Hz", price: 254_000, originalPrice: 399_900, category: "Écrans & bureaux", description: "1000R, FreeSync, HDMI + DisplayPort.", image: "/products/cat-monitor.jpg", status: "Disponible" },
  { id: 10_318, name: "LG UltraGear 49GR85DC-B — 49\" DQHD 240 Hz", price: 899_000, originalPrice: 1_219_900, category: "Écrans & bureaux", description: "5120×1440 VA, DisplayHDR 1000, hub USB.", image: "/products/cat-monitor.jpg", status: "Disponible" },
  { id: 10_320, name: "SSD Crucial E100 — 1 To M.2 NVMe PCIe 4.0", price: 105_000, category: "Stockage & USB", description: "Lecture jusqu'à ~5000 Mo/s selon plateforme.", image: "/products/cat-storage.jpg", status: "Disponible" },
  { id: 10_321, name: "SSD WD Blue SN550 — 500 Go NVMe M.2", price: 55_000, category: "Stockage & USB", description: "2280, usage bureautique / entrée de gamme.", image: "/products/cat-storage.jpg", status: "Disponible" },
  { id: 10_322, name: "SSD Verbatim Vi3000 — 1 To M.2 NVMe PCIe 3.0", price: 100_000, category: "Stockage & USB", description: "Jusqu'à ~3100 Mo/s lecture, TBW 750.", image: "/products/cat-storage.jpg", status: "Disponible" },
  { id: 10_323, name: "SSD Kingston NV3 — 4 To M.2 PCIe 4.0", price: 390_000, category: "Stockage & USB", description: "Haute capacité, Gen4×4.", image: "/products/cat-storage.jpg", status: "Disponible" },
  { id: 10_324, name: "SSD Crucial T700 — 1 To M.2 NVMe PCIe 5.0", price: 170_000, category: "Stockage & USB", description: "Performances extrêmes, compatible DirectStorage.", image: "/products/cat-storage.jpg", status: "Disponible" },
  { id: 10_325, name: "SSD DATO DP342 — 512 Go M.2 2242 PCIe Gen3×4", price: 70_000, category: "Stockage & USB", description: "Format compact pour ultraportables.", image: "/products/cat-storage.jpg", status: "Disponible" },
  { id: 10_326, name: "SSD DATO DP342 — 1 To M.2 2242 PCIe Gen3×4", price: 100_000, category: "Stockage & USB", description: "2242 mm, lecture jusqu'à ~2500 Mo/s.", image: "/products/cat-storage.jpg", status: "Disponible" },
  { id: 10_327, name: "SSD Lexar NM790 — 2 To M.2 PCIe Gen4", price: 200_000, category: "Stockage & USB", description: "Jusqu'à ~7400 Mo/s lecture, compatible PS5.", image: "/products/cat-storage.jpg", status: "Disponible" },
  { id: 10_328, name: "SSD Lexar NQ790 — 2 To M.2 PCIe Gen4", price: 195_000, category: "Stockage & USB", description: "Jusqu'à ~7000 Mo/s lecture.", image: "/products/cat-storage.jpg", status: "Disponible" },
  { id: 10_329, name: "SSD interne Emtec — 1 To M.2 2280 SATA", price: 80_000, category: "Stockage & USB", description: "Upgrade laptop ou desktop compatible SATA M.2.", image: "/products/cat-storage.jpg", status: "Disponible" }
];

export function decorateProduct(product: Product): Product {
  const text = `${product.name} ${product.description}`.toLowerCase();
  const isPromo = typeof product.originalPrice === "number" && product.originalPrice > product.price;
  const isPopular =
    text.includes("elitebook") ||
    text.includes("latitude") ||
    text.includes("thinkpad") ||
    text.includes("ssd") ||
    text.includes("cartouche") ||
    text.includes("odyssey") ||
    text.includes("ultragear") ||
    text.includes("nvme");

  const badge: Product["badge"] | undefined = isPromo ? "💥 Promo" : isPopular ? "⭐ Populaire" : undefined;
  return {
    ...product,
    badge,
    status: badge === "💥 Promo" ? "Promo" : product.status
  };
}

export function getCatalogImage(product: Product) {
  if (
    product.image.startsWith("http://") ||
    product.image.startsWith("https://") ||
    product.image.startsWith("/uploads/")
  ) {
    return product.image;
  }
  const text = `${product.name} ${product.description}`.toLowerCase();
  const category = product.category.toLowerCase();
  if (text.includes("latitude 5490") || text.includes("elitebook 830")) return "/products/cat-laptop.jpg";
  if (text.includes("precision") && text.includes("7810")) return "/products/cat-laptop.jpg";
  if (text.includes("hp 290") || text.includes("pro 290") || text.includes("elitedesk") || text.includes("thinkcentre") || text.includes("intel nuc")) {
    return "/products/cat-laptop.jpg";
  }
  if (text.includes("asus tuf") || text.includes("rog strix") || (text.includes("gamer") && text.includes("portable"))) return "/products/cat-laptop.jpg";
  if (text.includes("pc gamer") || (text.includes("gamer") && text.includes("rtx") && text.includes("core"))) return "/products/cat-laptop.jpg";
  if (text.includes("thinkvision") || text.includes("support vesa") || text.includes("mini uc")) return "/products/cat-monitor.jpg";
  if (text.includes("odyssey") || (text.includes("samsung") && (text.includes("gamer") || text.includes("g6") || text.includes("g5")))) return "/products/cat-monitor.jpg";
  if (text.includes("ultragear") || (text.includes("lg") && text.includes("ultrawide"))) return "/products/cat-monitor.jpg";
  if (text.includes("lenovo") && (text.includes("l24e") || text.includes("l27e"))) return "/products/cat-monitor.jpg";
  if (text.includes("msi") && (text.includes("mag") || text.includes("mp341"))) return "/products/cat-monitor.jpg";
  if (
    text.includes("crucial e100") ||
    text.includes("t700") ||
    text.includes("nv3") ||
    text.includes("sn550") ||
    text.includes("vi3000") ||
    text.includes("nm790") ||
    text.includes("nq790") ||
    text.includes("dp342") ||
    (text.includes("emtec") && text.includes("m.2"))
  ) {
    return "/products/cat-storage.jpg";
  }
  if (text.includes("disque serveur") || text.includes("sas 10k") || text.includes("2.4tb")) return "/products/cat-storage.jpg";
  if (text.includes("pdu") || (text.includes("rack") && text.includes("19"))) return "/products/cat-hub-cable.jpg";
  if (text.includes("tapis souris") || text.includes("tapis gamer")) return "/products/cat-keyboard-mouse.jpg";
  if (text.includes("antenne wifi") || text.includes("omnidirectionnel")) return "/products/cat-network.jpg";
  if (text.includes("batterie asus") || text.includes("batterie dell") || text.includes("batterie hp") || text.includes("ki04")) {
    return "/products/cat-battery.jpg";
  }
  if (text.includes("aoc") || text.includes("ecran gamer") || text.includes("écran gamer")) return "/products/cat-monitor.jpg";
  if (text.includes("backup") || text.includes("westerne") || (text.includes("disque dur externe") && text.includes("usb 3.0"))) return "/products/cat-storage.jpg";
  if (text.includes("thermalright") || text.includes("wjcoolman") || (text.includes("aerocool") && text.includes("lux"))) return "/products/cat-powerbank.jpg";
  if (text.includes("alimentation") && (text.includes("watt") || text.includes("650w") || text.includes("700w") || text.includes("1000w") || text.includes("850w"))) {
    return "/products/cat-powerbank.jpg";
  }
  if (text.includes("pcie") && text.includes("nvme")) return "/products/cat-ram.jpg";
  if (text.includes("adaptateur") && (text.includes("sata") || text.includes("usb 3.0"))) return "/products/cat-storage.jpg";
  if (text.includes("adaptateur") && text.includes("vga")) return "/products/cat-hub-cable.jpg";
  if (text.includes("adaptateur") && (text.includes("3 en 1") || text.includes("4 en 1"))) return "/products/cat-hub-cable.jpg";
  if (text.includes("linksys") && text.includes("ac600")) return "/products/cat-network.jpg";
  if (text.includes("asus") && text.includes("pcie") && text.includes("wifi")) return "/products/cat-network.jpg";
  if (text.includes("magsafe") || text.includes("surface pro")) return product.image;
  if (text.includes("msi") && text.includes("usb")) return "/products/chargeur-microsoft-surface.png";
  if (text.includes("msi")) return "/products/chargeur-dell-19-5v-gros-bout.png";
  if (text.includes("lenovo") && text.includes("170")) return "/products/chargeur-microsoft-surface.png";
  if (text.includes("asus") && text.includes("100w")) return "/products/chargeur-microsoft-surface.png";
  if (text.includes("asus") && (text.includes("gaming") || text.includes("gamer") || text.includes("230") || text.includes("280"))) {
    return "/products/chargeur-dell-19-5v-gros-bout.png";
  }
  if (text.includes("asus") && text.includes("19v")) return "/products/chargeur-dell-19-5v-petit-bout.png";
  if (text.includes("allume-cigare") || text.includes("fast charge") || text.includes("véhicule")) return "/products/cat-hub-cable.jpg";
  if (text.includes("chargeur hp 19.5v")) return "/products/chargeur-hp-19-5v-petit-bout-bleu.png";
  if (text.includes("chargeur dell 19.5v (gros")) return "/products/chargeur-dell-19-5v-gros-bout.png";
  if (text.includes("chargeur dell 19.5v (petit")) return "/products/chargeur-dell-19-5v-petit-bout.png";
  if (text.includes("cartouche") || text.includes("imprimante")) return "/products/cat-printer.jpg";
  if (text.includes("casque")) return "/products/cat-headphones.jpg";
  if (text.includes("powerbank")) return "/products/cat-powerbank.jpg";
  if (text.includes("hub") || text.includes("displayport") || text.includes("hdmi")) return "/products/cat-hub-cable.jpg";
  if (text.includes("usb")) return "/products/cat-usb.jpg";
  if (text.includes("ssd") || text.includes("disque") || text.includes("stockage")) return "/products/cat-storage.jpg";
  if (text.includes("routeur") || text.includes("répéteur") || text.includes("rj45") || text.includes("switch") || text.includes("wi-fi")) return "/products/cat-network.jpg";
  if (text.includes("ram") || text.includes("ddr4")) return "/products/cat-ram.jpg";
  if (text.includes("batterie")) return "/products/cat-battery.jpg";
  if (text.includes("hp elitebook") || text.includes("latitude") || text.includes("thinkpad") || text.includes("probook")) return "/products/cat-laptop.jpg";
  if (text.includes("clavier") || text.includes("souris") || text.includes("webcam")) return "/products/cat-keyboard-mouse.jpg";
  if (text.includes("moniteur") || text.includes("monitor")) return "/products/cat-monitor.jpg";
  if (category.includes("pc") || category.includes("portable") || category.includes("ordinateur")) return "/products/cat-laptop.jpg";
  if (category.includes("stockage")) return "/products/cat-storage.jpg";
  if (category.includes("réseau") || category.includes("wifi")) return "/products/cat-network.jpg";
  if (category.includes("impression")) return "/products/cat-printer.jpg";
  if (category.includes("composant")) return "/products/cat-ram.jpg";
  if (category.includes("alimentation") || category.includes("onduleur")) return "/products/cat-powerbank.jpg";
  if (category.includes("périph") || category.includes("audio")) return "/products/cat-headphones.jpg";
  if (category.includes("écran")) return "/products/cat-monitor.jpg";
  if (category.includes("hub") || category.includes("connectique")) return "/products/cat-hub-cable.jpg";
  return product.image;
}

export function applyBusinessBadges(products: Product[]): Product[] {
  const newestIds = new Set(
    [...products]
      .sort((a, b) => b.id - a.id)
      .slice(0, 10)
      .map((p) => p.id)
  );

  return products.map((product) => {
    if (product.badge === "💥 Promo") return product;
    if (newestIds.has(product.id)) {
      return { ...product, badge: "🆕 Nouveau", status: "Disponible" };
    }
    return product;
  });
}

/** @deprecated alias — préférer boutiqueItValidatedCatalog */
export const validatedCatalog = boutiqueItValidatedCatalog;
