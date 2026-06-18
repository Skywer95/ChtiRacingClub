import { useState, useEffect, useRef, useCallback } from "react";
import {
  Menu, X, ChevronRight, ArrowRight, Shield, ShieldCheck, Wrench, Gauge,
  Cog, Activity, Users, MapPin, Phone, Mail, Calendar, Trophy, Image as ImageIcon,
  FileText, Download, Plus, Trash2, Pencil, Save, RotateCcw, Eye, Heart,
  Quote, Facebook, Instagram, Youtube, Lock, Sun, Moon, Palette, Handshake,
  Sparkles, Megaphone, Play, Check, Settings, LayoutGrid
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

/* ============================================================
   STORAGE SERVICE  — couche isolée. Remplacer par Supabase/Firebase ici.
   ============================================================ */
const supabase = createClient(
  "https://awmrfsyhdwjmysbooitr.supabase.co",
  "sb_publishable_SOf_pu2jKn2EKZ_Uyqjamw_QcwbIfjE"
);

const STORE_KEY = "crc:data:v1";
const storageService = {
  async load() {
    try {
      const { data, error } = await supabase
        .from("site_data").select("value").eq("key", STORE_KEY).maybeSingle();
      if (error) { console.error("Supabase load:", error.message); return null; }
      return data ? data.value : null;
    } catch (e) { console.error(e); return null; }
  },
  async save(data) {
    try {
      const { error } = await supabase.from("site_data")
        .upsert({ key: STORE_KEY, value: data, updated_at: new Date().toISOString() });
      if (error) { console.error("Supabase save:", error.message); return false; }
      return true;
    } catch (e) { console.error(e); return false; }
  },
  async clear() {
    try { await supabase.from("site_data").delete().eq("key", STORE_KEY); } catch {}
  }
};

/* ============================================================
   DONNÉES PAR DÉFAUT  — tout le contenu du site vit ici.
   ============================================================ */
const img = (seed, w = 1200, h = 800) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

const DEFAULT_DATA = {
  general: {
    name: "CH'TI RACING CLUB",
    logoText1: "CH'TI",
    logoText2: "RACING CLUB",
    email: "contact@chtiracingclub.fr",
    phone: "06 12 34 56 78",
    address: "Hauts-de-France, France",
    socials: { facebook: "#", instagram: "#", youtube: "#", tiktok: "#" },
    mode: "light",     // light | night
    theme: "blue",     // blue | red | green | gold
    custom: {}         // overrides couleurs admin
  },
  hero: {
    eyebrow: "01 — Accueil",
    slogan: "La passion du rallye, portée par une équipe locale.",
    media: { type: "image", src: img("rally-hero", 1600, 900), fit: "cover", poster: "" },
    stats: [
      { icon: "shield", title: "Association loi 1901", text: "Créée en décembre 2025" },
      { icon: "trophy", title: "1ère saison", text: "Première saison en 2026" },
      { icon: "activity", title: "Notre objectif", text: "Participer à plusieurs rallyes" },
      { icon: "users", title: "Esprit d'équipe", text: "Passion · Entraide · Performance" }
    ]
  },
  association: {
    eyebrow: "02 — Association",
    title: "Notre association",
    subtitle: "Ensemble, vivons notre passion.",
    paragraphs: [
      "Le Ch'ti Racing Club est une association loi 1901, créée en décembre 2025 par des passionnés de sport automobile.",
      "Notre objectif : participer à plusieurs rallyes, représenter fièrement notre région et progresser ensemble, avec l'aide de nos partenaires.",
      "La passion, l'entraide et la rigueur sont au cœur de notre projet."
    ],
    media: { type: "image", src: img("rally-road", 1200, 1400), fit: "cover", poster: "" },
    values: [
      { icon: "heart", title: "Passion", text: "Une passion commune qui nous anime" },
      { icon: "shieldcheck", title: "Rigueur", text: "Préparation sérieuse et organisée" },
      { icon: "users", title: "Partage", text: "Un esprit d'équipe fort et solidaire" },
      { icon: "mappin", title: "Proximité", text: "Une association locale, proche de vous" }
    ]
  },
  crews: {
    eyebrow: "03 — Équipages",
    title: "Nos équipages",
    subtitle: "Deux équipages, un même objectif : progresser à chaque rallye.",
    footer: "Deux équipages complémentaires pour porter haut les couleurs du Ch'ti Racing Club.",
    items: [
      { id: "c1", pilot: "Steven Rose", copilot: "Bryan Rose", car: "Citroën Saxo",
        experience: "Plusieurs saisons", goal: "Gagner en régularité et viser les tops 10.",
        quote: "La régularité fera la performance." },
      { id: "c2", pilot: "Antoine Leroy", copilot: "Hugo Marchand", car: "Peugeot 106",
        experience: "Première saison", goal: "Finir chaque rallye et continuer à apprendre.",
        quote: "Chaque kilomètre est une expérience." }
    ]
  },
  cars: {
    eyebrow: "04 — Voitures",
    title: "Nos voitures",
    subtitle: "Préparées avec soin, pensées pour durer toute la saison.",
    features: [
      { icon: "wrench", title: "Préparation rigoureuse", text: "Matériel entretenu et optimisé" },
      { icon: "shield", title: "Sécurité prioritaire", text: "Équipements aux normes" },
      { icon: "gauge", title: "Performance maîtrisée", text: "Progrès et fiabilité" },
      { icon: "cog", title: "Entretien suivi", text: "Contrôles avant chaque épreuve" }
    ],
    items: [
      { id: "v1", name: "Citroën Saxo VTS",
        media: { type: "image", src: img("saxo", 1200, 800), fit: "cover", poster: "" },
        specs: { Année: "1999", Moteur: "1.6 16V", Puissance: "110 ch", Transmission: "5 rapports", Catégorie: "Groupe A", Traction: "Avant" } },
      { id: "v2", name: "Peugeot 106",
        media: { type: "image", src: img("106", 1200, 800), fit: "cover", poster: "" },
        specs: { Année: "2000", Moteur: "1.6 16V", Puissance: "115 ch", Transmission: "5 rapports", Catégorie: "Groupe A", Traction: "Avant" } }
    ]
  },
  season: {
    eyebrow: "05 — Saison 2026",
    title: "Saison 2026",
    subtitle: "Calendrier prévisionnel",
    events: [
      { id: "s1", date: "15 mars 2026", rally: "Rallye de la Lys", place: "Hauts-de-France", status: "inscrit", result: "" },
      { id: "s2", date: "12 avril 2026", rally: "Rallye des Plaines", place: "Hauts-de-France", status: "inscrit", result: "" },
      { id: "s3", date: "24 mai 2026", rally: "Rallye du Boulonnais", place: "Côte d'Opale", status: "avenir", result: "" },
      { id: "s4", date: "14 juin 2026", rally: "Rallye de la Côte d'Opale", place: "Côte d'Opale", status: "avenir", result: "" }
    ]
  },
  news: {
    eyebrow: "06 — Actualités",
    title: "Actualités",
    subtitle: "Journal de bord de la saison.",
    items: [
      { id: "n1", category: "Préparation", date: "00 mars 2026", title: "Dernière séance de mise au point",
        excerpt: "Tests sur route humide, réglages suspension et dernière check-list avant le Rallye de la Lys.",
        media: { type: "image", src: img("prep", 800, 500), fit: "cover", poster: "" } },
      { id: "n2", category: "Inscription", date: "16 avril 2026", title: "Engagés au Rallye de la Lys !",
        excerpt: "Notre premier rallye de la saison 2026. Hâte d'y être !",
        media: { type: "image", src: img("inscription", 800, 500), fit: "cover", poster: "" } },
      { id: "n3", category: "Résultat", date: "10 mars 2026", title: "Rallye de la Lys : 1ère participation",
        excerpt: "Une belle découverte et un apprentissage riche d'enseignements.",
        media: { type: "image", src: img("resultat", 800, 500), fit: "cover", poster: "" } },
      { id: "n4", category: "Partenaires", date: "26 fév. 2026", title: "Bienvenue à nos nouveaux sponsors !",
        excerpt: "Merci pour votre confiance et votre soutien dans cette aventure.",
        media: { type: "image", src: img("sponsors", 800, 500), fit: "cover", poster: "" } }
    ]
  },
  gallery: {
    eyebrow: "07 — Galerie",
    title: "Galerie",
    subtitle: "Revivez nos meilleurs moments.",
    items: [
      { id: "g1", cat: "rallye", media: { type: "image", src: img("g1", 900, 600), fit: "cover", poster: "" } },
      { id: "g2", cat: "assistance", media: { type: "image", src: img("g2", 600, 800), fit: "cover", poster: "" } },
      { id: "g3", cat: "paddock", media: { type: "image", src: img("g3", 900, 600), fit: "cover", poster: "" } },
      { id: "g4", cat: "preparation", media: { type: "image", src: img("g4", 800, 800), fit: "cover", poster: "" } },
      { id: "g5", cat: "rallye", media: { type: "image", src: img("g5", 600, 900), fit: "cover", poster: "" } },
      { id: "g6", cat: "rallye", media: { type: "image", src: img("g6", 900, 600), fit: "cover", poster: "" } }
    ]
  },
  partners: {
    eyebrow: "08 — Partenaires",
    title: "Nos partenaires",
    subtitle: "Ils nous soutiennent et rendent cette aventure possible.",
    footer: "Un grand merci pour leur confiance et leur soutien !",
    items: [
      { id: "p1", name: "Nord Motors", category: "Automobile", url: "#" },
      { id: "p2", name: "Atelier 59", category: "Mécanique", url: "#" },
      { id: "p3", name: "Carrosserie Pro", category: "Carrosserie", url: "#" },
      { id: "p4", name: "Delta", category: "Équipement", url: "#" },
      { id: "p5", name: "Racing Parts", category: "Pièces", url: "#" },
      { id: "p6", name: "Publi Nord", category: "Communication", url: "#" },
      { id: "p7", name: "BatiNord", category: "BTP", url: "#" },
      { id: "p8", name: "Hexagone", category: "Services", url: "#" },
      { id: "p9", name: "Méca Passion", category: "Mécanique", url: "#" },
      { id: "p10", name: "Sign&Com", category: "Covering", url: "#" }
    ]
  },
  why: {
    eyebrow: "09 — Pourquoi nous soutenir ?",
    title: "Pourquoi nous soutenir ?",
    subtitle: "Un projet humain et sportif, ancré dans la région.",
    args: [
      { icon: "mappin", title: "Visibilité locale", text: "Présence forte dans les Hauts-de-France" },
      { icon: "megaphone", title: "Communication digitale", text: "Relais sur nos réseaux sociaux" },
      { icon: "heart", title: "Projet humain", text: "Une équipe passionnée et engagée" },
      { icon: "sparkles", title: "Présence sur les supports", text: "Logos sur voitures et combinaisons" },
      { icon: "activity", title: "Association dynamique", text: "Un club local qui avance" }
    ]
  },
  documents: {
    eyebrow: "10 — Documents",
    title: "Documents",
    subtitle: "Téléchargez nos documents officiels.",
    items: [
      { id: "d1", name: "Book sponsoring", desc: "Présentation complète de la saison 2026", url: "#" },
      { id: "d2", name: "Dossier de présentation", desc: "L'association, l'équipe, le projet", url: "#" },
      { id: "d3", name: "Fiche contact", desc: "Informations et coordonnées", url: "#" },
      { id: "d4", name: "RIB association", desc: "Relevé d'identité bancaire", url: "#" },
      { id: "d5", name: "Dossier presse", desc: "Communiqués, photos, presse", url: "#" }
    ]
  },
  contact: {
    eyebrow: "11 — Contact",
    title: "Nous contacter",
    subtitle: "Une question, un projet ? N'hésitez pas à nous écrire."
  }
};

/* ============================================================
   THÈMES / MODES  — variables CSS
   ============================================================ */
const THEMES = {
  blue: { primary: "#1d4ed8", secondary: "#2563eb", accent: "#0ea5e9", grad: "linear-gradient(120deg,#2563eb 0%,#0ea5e9 100%)" },
  red:  { primary: "#dc2626", secondary: "#b91c1c", accent: "#f97316", grad: "linear-gradient(120deg,#dc2626 0%,#f97316 100%)" },
  gold: { primary: "#1a1a1a", secondary: "#b8860b", accent: "#d4af37", grad: "linear-gradient(120deg,#1a1a1a 0%,#d4af37 100%)" }
};
const THEME_LABELS = { blue: "Bleu sport", red: "Rouge sport", gold: "Or / Noir" };
const MODES = {
  light: { bg: "#f4f7fb", section: "#ffffff", card: "#ffffff", text: "#0f1b2d", muted: "#5b6b82", border: "#e4eaf2", soft: "#eef3fa", heroOverlay: "rgba(8,18,38,0.45)" },
  night: { bg: "#0d1626", section: "#101d33", card: "#15233e", text: "#e8eef9", muted: "#9fb0cc", border: "#243450", soft: "#16253f", heroOverlay: "rgba(4,9,20,0.6)" }
};
function buildVars(general) {
  const t = THEMES[general.theme] || THEMES.blue;
  const m = MODES[general.mode] || MODES.light;
  const c = general.custom || {};
  const primary = c.primary || t.primary;
  return {
    "--primary": primary,
    "--secondary": c.secondary || t.secondary,
    "--accent": c.accent || t.accent,
    "--grad": general.gradient ? t.grad : primary,
    "--bg": c.bg || m.bg,
    "--section": c.section || m.section,
    "--card": c.card || m.card,
    "--text": c.text || m.text,
    "--muted": c.muted || m.muted,
    "--border": c.border || m.border,
    "--soft": c.soft || m.soft,
    "--hero-overlay": m.heroOverlay
  };
}

/* ============================================================
   CSS
   ============================================================ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400;0,600;0,700;0,800;1,600;1,700;1,800;1,900&family=Inter:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
.crc{font-family:'Inter',system-ui,sans-serif;color:var(--text);background:var(--bg);line-height:1.6;transition:background .3s,color .3s;-webkit-font-smoothing:antialiased}
.crc img{display:block;max-width:100%}
.crc h1,.crc h2,.crc h3,.crc h4{font-family:'Archivo',sans-serif;line-height:1.1;letter-spacing:-.01em}
.wrap{max-width:1200px;margin:0 auto;padding:0 24px}
.section{padding:84px 0;background:var(--section)}
.section.alt{background:var(--bg)}
.eyebrow{font-family:'Archivo';font-style:italic;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:.12em;color:var(--primary);display:flex;align-items:center;gap:10px;margin-bottom:14px}
.eyebrow::before{content:"";width:26px;height:2px;background:var(--primary);display:inline-block}
.h2{font-style:italic;font-weight:800;font-size:clamp(28px,4vw,44px);text-transform:uppercase}
.h2 .b{color:var(--primary)}
.lead{color:var(--muted);font-size:18px;margin-top:8px;max-width:640px}
.btn{display:inline-flex;align-items:center;gap:8px;font-weight:700;font-size:15px;padding:13px 22px;border-radius:12px;border:none;cursor:pointer;text-decoration:none;transition:transform .15s,box-shadow .2s,background .2s;font-family:'Inter'}
.btn:hover{transform:translateY(-2px)}
.btn-primary{background:var(--grad);color:#fff;box-shadow:0 8px 22px -8px var(--primary)}
.btn-ghost{background:transparent;color:var(--text);border:1.5px solid var(--border)}
.btn-ghost:hover{border-color:var(--primary);color:var(--primary)}
.btn-white{background:#fff;color:#0f1b2d}
.btn-sm{padding:9px 16px;font-size:14px;border-radius:10px}

/* NAV */
.nav{position:sticky;top:0;z-index:50;background:color-mix(in srgb,var(--section) 88%,transparent);backdrop-filter:blur(12px);border-bottom:1px solid var(--border)}
.nav-in{display:flex;align-items:center;justify-content:space-between;height:70px}
.logo{font-family:'Archivo';font-style:italic;font-weight:900;font-size:20px;line-height:.95;text-transform:uppercase;cursor:pointer}
.logo .l1{color:var(--text)}.logo .l2{color:var(--primary);display:block;font-size:13px;letter-spacing:.05em}
.nav-links{display:flex;gap:6px;align-items:center}
.nav-links a{font-size:13.5px;font-weight:600;color:var(--text);text-decoration:none;padding:8px 11px;border-radius:8px;text-transform:uppercase;letter-spacing:.02em;transition:.15s}
.nav-links a:hover{color:var(--primary);background:var(--soft)}
.nav-right{display:flex;align-items:center;gap:10px}
.picker-wrap{position:relative}
.picker-back{position:fixed;inset:0;z-index:60}
.picker{position:absolute;top:46px;right:0;z-index:61;width:210px;background:var(--section);border:1px solid var(--border);border-radius:14px;box-shadow:0 24px 60px -24px rgba(15,27,45,.5);padding:14px}
.picker-lab{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin:4px 2px 8px}
.picker-row{display:flex;gap:8px;margin-bottom:6px}
.chip2{flex:1;display:flex;align-items:center;justify-content:center;gap:5px;padding:8px;border-radius:9px;border:1.5px solid var(--border);background:var(--card);color:var(--text);font-size:12.5px;font-weight:700;cursor:pointer}
.chip2.on{border-color:var(--primary);color:var(--primary)}
.picker-themes{display:flex;flex-direction:column;gap:6px}
.swatch{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:9px;border:1.5px solid var(--border);background:var(--card);color:var(--text);font-size:13px;font-weight:600;cursor:pointer;text-align:left}
.swatch.on{border-color:var(--primary);color:var(--primary)}
.swatch .dot{width:16px;height:16px;border-radius:50%;flex:none;box-shadow:inset 0 0 0 1px rgba(0,0,0,.1)}
.grad-toggle{margin-top:8px;width:100%}
.icon-btn{width:38px;height:38px;display:grid;place-items:center;border-radius:10px;border:1px solid var(--border);background:var(--section);color:var(--text);cursor:pointer;transition:.15s}
.icon-btn:hover{border-color:var(--primary);color:var(--primary)}
.burger{display:none}

/* HERO */
.hero{position:relative;min-height:88vh;display:flex;align-items:center;overflow:hidden}
.hero-media{position:absolute;inset:0;z-index:0}
.hero-media .media{position:absolute;inset:0;width:100%;height:100%}
.hero-media::after{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(105deg,var(--hero-overlay),transparent 70%)}
.hero-media img,.hero-media video{width:100%;height:100%;object-fit:cover}
.hero-in{position:relative;z-index:2;color:#fff;max-width:640px;padding:60px 0}
.hero-eyebrow{color:#fff;opacity:.85}
.hero-eyebrow::before{background:#fff}
.hero h1{font-style:italic;font-weight:900;font-size:clamp(44px,8vw,86px);text-transform:uppercase;text-shadow:0 4px 30px rgba(0,0,0,.4)}
.hero h1 .blue{color:var(--accent)}
.hero p.tag{font-size:clamp(18px,2.4vw,24px);font-weight:500;margin:18px 0 30px;max-width:480px;text-shadow:0 2px 12px rgba(0,0,0,.4)}
.hero-btns{display:flex;gap:14px;flex-wrap:wrap}
.speedlines{position:absolute;right:-40px;bottom:60px;z-index:1;opacity:.5}
.speedlines i{display:block;height:3px;background:var(--accent);border-radius:3px;margin:9px 0;margin-left:auto}

/* stats bar */
.stats{position:relative;z-index:3;margin-top:-46px}
.stats-card{background:var(--card);border:1px solid var(--border);border-radius:18px;box-shadow:0 24px 60px -30px rgba(15,27,45,.4);display:grid;grid-template-columns:repeat(4,1fr);overflow:hidden}
.stat{display:flex;gap:14px;align-items:flex-start;padding:24px}
.stat+.stat{border-left:1px solid var(--border)}
.stat .ic{color:var(--primary);flex:none;margin-top:2px}
.stat h4{font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:.03em}
.stat p{font-size:13px;color:var(--muted);margin-top:2px}

/* generic grid + card */
.grid{display:grid;gap:22px}
.g2{grid-template-columns:1fr 1fr}.g3{grid-template-columns:repeat(3,1fr)}.g4{grid-template-columns:repeat(4,1fr)}
.card{background:var(--card);border:1px solid var(--border);border-radius:18px;box-shadow:0 14px 40px -28px rgba(15,27,45,.35);overflow:hidden;transition:transform .25s,box-shadow .25s}
.card.hov:hover{transform:translateY(-5px);box-shadow:0 26px 50px -28px rgba(15,27,45,.45)}
.feat{display:flex;gap:14px;align-items:flex-start}
.feat .ic{width:46px;height:46px;border-radius:12px;background:var(--soft);color:var(--primary);display:grid;place-items:center;flex:none}
.feat h4{font-size:15px;font-weight:800;text-transform:uppercase;letter-spacing:.02em}
.feat p{font-size:14px;color:var(--muted)}

/* media box */
.media{position:relative;background:var(--soft);overflow:hidden}
.media img,.media video{width:100%;height:100%}
.media .ph{position:absolute;inset:0;display:grid;place-items:center;color:var(--muted);font-size:13px;background:var(--soft)}
.media .play{position:absolute;inset:0;display:grid;place-items:center;background:rgba(0,0,0,.3);cursor:pointer}
.media .play span{width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,.92);display:grid;place-items:center;color:var(--primary)}

/* association */
.assoc{display:grid;grid-template-columns:1.1fr .9fr;gap:48px;align-items:center}
.assoc p{margin-bottom:14px;color:var(--muted)}
.assoc p strong{color:var(--text)}
.assoc .media{border-radius:20px;height:440px}

/* crews */
.crew{padding:26px}
.crew-top{display:flex;gap:16px;align-items:center;margin-bottom:18px}
.avatar{width:62px;height:62px;border-radius:50%;background:var(--soft);display:grid;place-items:center;color:var(--primary);flex:none}
.crew-tag{font-family:'Archivo';font-style:italic;font-weight:700;font-size:12px;text-transform:uppercase;color:var(--primary);letter-spacing:.1em}
.crew h3{font-size:20px;font-style:italic;font-weight:800}
.crew-row{display:flex;justify-content:space-between;padding:10px 0;border-top:1px solid var(--border);font-size:14px}
.crew-row span:first-child{color:var(--muted);font-weight:600}
.crew-quote{margin-top:16px;padding:14px 16px;background:var(--soft);border-radius:12px;border-left:3px solid var(--primary);font-style:italic;color:var(--primary);font-weight:600;display:flex;gap:8px}

/* cars */
.car{display:block}
.car .media{width:100%;aspect-ratio:16/9;height:auto}
.car-info{padding:30px;display:grid;grid-template-columns:repeat(3,1fr);gap:0 32px}
.car-info h3{grid-column:1/-1}
.car-info h3{font-size:26px;font-style:italic;font-weight:800;text-transform:uppercase;margin-bottom:16px}
.spec{display:flex;justify-content:space-between;padding:11px 0;border-bottom:1px solid var(--border);font-size:14.5px}
.spec span:first-child{color:var(--muted);font-weight:600}
.spec span:last-child{font-weight:700}

/* season table */
.table{width:100%;border-collapse:collapse;background:var(--card);border-radius:16px;overflow:hidden;border:1px solid var(--border)}
.table th{text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);padding:16px 20px;background:var(--soft);font-weight:700}
.table td{padding:16px 20px;border-top:1px solid var(--border);font-size:14.5px;font-weight:500}
.badge{display:inline-block;font-size:11.5px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;padding:5px 11px;border-radius:999px}
.badge.inscrit{background:#dcfce7;color:#15803d}
.badge.avenir{background:#dbeafe;color:#1d4ed8}
.badge.termine{background:#f1f5f9;color:#475569}

/* news */
.news-card .media{height:160px}
.news-body{padding:18px}
.news-cat{position:absolute;top:12px;left:12px;z-index:2;background:var(--primary);color:#fff;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;padding:5px 10px;border-radius:8px}
.news-date{font-size:12px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.04em}
.news-card h3{font-size:17px;font-style:italic;font-weight:800;margin:6px 0 8px}
.news-card p{font-size:14px;color:var(--muted);margin-bottom:12px}
.link{color:var(--primary);font-weight:700;font-size:14px;display:inline-flex;gap:6px;align-items:center;cursor:pointer;text-decoration:none}

/* gallery */
.filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:26px}
.filter{padding:8px 16px;border-radius:999px;border:1px solid var(--border);background:var(--card);font-size:13.5px;font-weight:700;cursor:pointer;color:var(--text);transition:.15s}
.filter.on{background:var(--primary);color:#fff;border-color:var(--primary)}
.masonry{columns:3;column-gap:16px}
.masonry .g-item{break-inside:avoid;margin-bottom:16px;border-radius:14px;overflow:hidden;cursor:pointer;position:relative}
.masonry .g-item .media{width:100%}
.masonry .g-item img,.masonry .g-item video{width:100%;height:auto}

/* partners */
.plogos{display:grid;grid-template-columns:repeat(5,1fr);gap:18px}
.plogo{position:relative;aspect-ratio:3/2;border:1px solid var(--border);border-radius:16px;background:var(--card);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center;padding:18px 16px;transition:transform .25s,box-shadow .25s,border-color .25s;text-decoration:none;color:var(--text);overflow:hidden}
.plogo-bar{position:absolute;top:0;left:0;right:0;height:4px;transform:scaleX(0);transform-origin:left;transition:transform .3s}
.plogo:hover{transform:translateY(-5px);box-shadow:0 22px 46px -26px rgba(15,27,45,.5)}
.plogo:hover .plogo-bar{transform:scaleX(1)}
.plogo b{font-family:'Archivo';font-style:italic;font-weight:800;font-size:17px;text-transform:uppercase;transition:.2s}
.plogo:hover b{color:var(--primary)}
.plogo small{color:var(--muted);font-size:11px;margin-top:2px;text-transform:uppercase;letter-spacing:.05em}
.plogo-plate{flex:1;display:flex;align-items:center;justify-content:center;background:#fff;border-radius:12px;padding:12px 16px;width:100%;min-height:0;overflow:hidden;box-shadow:0 4px 14px -8px rgba(0,0,0,.25);transition:transform .25s}
.plogo img{width:100%;height:100%;object-fit:contain}
.plogo:hover .plogo-plate{transform:scale(1.04)}
.plogo-link{font-size:9px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;opacity:.65;transition:.2s;line-height:1.2}
.plogo:hover .plogo-link{color:var(--primary);opacity:1}
.posters{display:grid;grid-template-columns:repeat(5,1fr);gap:16px}
.poster{aspect-ratio:3/4;border-radius:14px;overflow:hidden;cursor:pointer;border:1px solid var(--border);box-shadow:0 14px 40px -28px rgba(15,27,45,.35);transition:transform .25s,box-shadow .25s}
.poster:hover{transform:translateY(-4px);box-shadow:0 24px 48px -28px rgba(15,27,45,.45)}
.poster img{width:100%;height:100%;object-fit:cover}

/* documents */
.doc{padding:24px;text-align:center;display:flex;flex-direction:column;align-items:center}
.doc .ic{width:54px;height:54px;border-radius:14px;background:var(--soft);color:var(--primary);display:grid;place-items:center;margin-bottom:14px}
.doc h4{font-size:15px;font-weight:800;text-transform:uppercase;margin-bottom:6px}
.doc p{font-size:13px;color:var(--muted);margin-bottom:16px;flex:1}

/* contact */
.contact{display:grid;grid-template-columns:1fr 1fr;gap:48px}
.field{margin-bottom:14px}
.field label{display:block;font-size:13px;font-weight:700;margin-bottom:6px}
.field input,.field textarea,.field select{width:100%;padding:12px 14px;border:1px solid var(--border);border-radius:10px;background:var(--section);color:var(--text);font-family:'Inter';font-size:14.5px}
.field input:focus,.field textarea:focus{outline:2px solid var(--primary);border-color:transparent}
.cinfo .row{display:flex;gap:12px;align-items:center;margin-bottom:16px;font-size:15px}
.cinfo .row .ic{width:42px;height:42px;border-radius:11px;background:var(--soft);color:var(--primary);display:grid;place-items:center;flex:none}
.socials{display:flex;gap:10px;margin-top:6px}
.socials a{width:42px;height:42px;border-radius:11px;background:var(--soft);color:var(--primary);display:grid;place-items:center;transition:.15s}
.socials a:hover{background:var(--primary);color:#fff}

/* footer */
.foot{background:var(--card);border-top:1px solid var(--border);padding:40px 0;text-align:center;color:var(--muted);font-size:14px}
.foot .logo{justify-content:center;margin-bottom:10px}
.admin-link{font-size:12px;color:var(--muted);opacity:.5;display:inline-flex;gap:5px;align-items:center;cursor:pointer;margin-top:14px}
.admin-link:hover{opacity:1;color:var(--primary)}

/* lightbox */
.lb{position:fixed;inset:0;z-index:200;background:rgba(5,10,22,.92);display:grid;place-items:center;padding:30px}
.lb-in{max-width:92vw;max-height:88vh}
.lb-in img,.lb-in video{max-width:92vw;max-height:88vh;border-radius:12px;object-fit:contain}
.lb-close{position:absolute;top:22px;right:22px;color:#fff;background:rgba(255,255,255,.12);border:none;width:46px;height:46px;border-radius:12px;cursor:pointer;display:grid;place-items:center}

/* ADMIN */
.adm{position:fixed;inset:0;z-index:300;background:var(--bg);display:grid;grid-template-columns:240px 1fr}
.adm-side{background:var(--card);border-right:1px solid var(--border);padding:20px 14px;overflow-y:auto}
.adm-side .logo{padding:0 8px 18px}
.adm-nav button{width:100%;text-align:left;display:flex;gap:10px;align-items:center;padding:10px 12px;border-radius:10px;border:none;background:transparent;color:var(--text);font-size:14px;font-weight:600;cursor:pointer;font-family:'Inter'}
.adm-nav button.on{background:var(--primary);color:#fff}
.adm-nav button:not(.on):hover{background:var(--soft)}
.adm-main{overflow-y:auto;padding:30px 36px}
.adm-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;position:sticky;top:-30px;background:var(--bg);padding:16px 0;z-index:5;border-bottom:1px solid var(--border)}
.adm-head h2{font-style:italic;font-weight:800;text-transform:uppercase;font-size:24px}
.adm-actions{display:flex;gap:10px}
.adm-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:20px;margin-bottom:18px}
.adm-card h3{font-size:15px;font-weight:800;text-transform:uppercase;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center}
.adm-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.color-row{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.color-row input[type=color]{width:46px;height:40px;border:1px solid var(--border);border-radius:8px;background:none;cursor:pointer;padding:2px}
.color-row label{flex:1;font-size:14px;font-weight:600}
.chips{display:flex;gap:10px;flex-wrap:wrap}
.chip{padding:9px 16px;border-radius:10px;border:2px solid var(--border);background:var(--section);cursor:pointer;font-weight:700;font-size:13px;color:var(--text)}
.chip.on{border-color:var(--primary);color:var(--primary)}
.toast{position:fixed;bottom:26px;left:50%;transform:translateX(-50%);background:var(--primary);color:#fff;padding:12px 22px;border-radius:12px;font-weight:700;z-index:400;box-shadow:0 14px 30px -10px var(--primary)}
.del{background:#fee2e2;color:#dc2626;border:none;width:34px;height:34px;border-radius:9px;cursor:pointer;display:grid;place-items:center}
.mini{font-size:12px;color:var(--muted)}
.media-prev{height:200px;border-radius:10px;overflow:hidden;border:1px solid var(--border);background:var(--card);margin-top:4px}
.media-prev .media{height:100%;width:100%}
.media-prev.empty{display:grid;place-items:center;color:var(--muted);font-size:13px;background:var(--section);border-style:dashed}
.login-screen{position:fixed;inset:0;z-index:300;background:var(--bg);display:grid;place-items:center;padding:24px}
.login-box{width:100%;max-width:360px;background:var(--card);border:1px solid var(--border);border-radius:18px;padding:32px;text-align:center;box-shadow:0 30px 70px -30px rgba(15,27,45,.5)}
.login-ic{width:58px;height:58px;border-radius:14px;background:var(--soft);color:var(--primary);display:grid;place-items:center;margin:0 auto 16px}
.login-box h2{font-style:italic;font-weight:800;text-transform:uppercase;font-size:22px;margin-bottom:6px}
.filedrop{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;text-align:center;padding:16px;margin-bottom:12px;border:2px dashed var(--border);border-radius:12px;background:var(--section);color:var(--muted);font-size:13.5px;font-weight:600;cursor:pointer;transition:.15s}
.filedrop:hover,.filedrop.over{border-color:var(--primary);color:var(--primary);background:var(--soft)}

@media(max-width:900px){
  .nav-links{display:none}
  .nav-links.open{display:flex;position:absolute;top:70px;left:0;right:0;flex-direction:column;background:var(--section);border-bottom:1px solid var(--border);padding:14px 24px;gap:2px}
  .nav-links.open a{padding:12px}
  .burger{display:grid}
  .stats-card{grid-template-columns:1fr 1fr}
  .stat:nth-child(odd){border-left:none}
  .stat:nth-child(n+3){border-top:1px solid var(--border)}
  .g4{grid-template-columns:1fr 1fr}.g3{grid-template-columns:1fr 1fr}
  .assoc,.car,.contact{grid-template-columns:1fr}
  .car .media{aspect-ratio:16/10}
  .car-info{grid-template-columns:1fr}
  .plogos{grid-template-columns:repeat(3,1fr)}
  .posters{grid-template-columns:repeat(3,1fr)}
  .masonry{columns:2}
  .adm{grid-template-columns:1fr}
  .adm-side{position:fixed;inset:0;width:240px;z-index:10;transform:translateX(-100%);transition:.25s}
  .adm-side.open{transform:none}
  .adm-grid{grid-template-columns:1fr}
}
@media(max-width:560px){
  .stats-card{grid-template-columns:1fr}.stat+.stat{border-left:none;border-top:1px solid var(--border)}
  .g4,.g3,.g2{grid-template-columns:1fr}
  .plogos{grid-template-columns:repeat(2,1fr)}
  .posters{grid-template-columns:repeat(2,1fr)}
  .masonry{columns:1}
  .wrap{padding:0 18px}
}
`;

/* ============================================================
   HELPERS
   ============================================================ */
const ICONS = { shield:Shield, shieldcheck:ShieldCheck, wrench:Wrench, gauge:Gauge, cog:Cog,
  activity:Activity, users:Users, mappin:MapPin, trophy:Trophy, heart:Heart,
  megaphone:Megaphone, sparkles:Sparkles, handshake:Handshake };
const Ic = ({ name, size = 22 }) => { const C = ICONS[name] || Shield; return <C size={size} />; };

function ytId(url) {
  const m = (url || "").match(/(?:youtu\.be\/|v=|vimeo\.com\/)([\w-]+)/);
  return m ? m[1] : null;
}

/* Media component — image / video / youtube, fit cover|contain, poster, lazy, fallback */
/* Diaporama hero : vidéos/images qui s'enchaînent en boucle */
function HeroSlides({ slides }) {
  const [i, setI] = useState(0);
  const next = useCallback(() => setI(p => (p + 1) % slides.length), [slides.length]);
  const cur = slides[i];
  const single = slides.length === 1;
  useEffect(() => {
    if (!cur || single) return;
    const isVid = cur.type === "video" && !ytId(cur.src);
    if (!isVid) { const t = setTimeout(next, ytId(cur.src) ? 14000 : 6000); return () => clearTimeout(t); }
  }, [i, cur, next, single]);
  if (!cur) return null;
  const fit = cur.fit || "cover";
  const id = ytId(cur.src);
  let el;
  if (cur.type === "video" && !id) {
    el = <video key={i} src={cur.src} poster={cur.poster} autoPlay muted playsInline loop={single}
      onEnded={single ? undefined : next} style={{ width:"100%", height:"100%", objectFit:fit }} />;
  } else if (id) {
    el = <iframe key={i} title="hero" src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=${single?1:0}&playlist=${id}`}
      style={{ width:"100%", height:"100%", border:0, pointerEvents:"none" }} allow="autoplay" />;
  } else {
    el = <img key={i} src={cur.src} alt="" style={{ width:"100%", height:"100%", objectFit:fit }} />;
  }
  return <div className="media" style={{ position:"absolute", inset:0 }}>{el}</div>;
}

function Media({ media, fit, onClick, bg }) {
  const [err, setErr] = useState(false);
  if (!media || !media.src) return <div className="media"><div className="ph">Média non chargé</div></div>;
  const objectFit = fit || media.fit || "cover";
  const t = media.type || "image";
  if (t === "youtube" || ytId(media.src)) {
    const id = ytId(media.src);
    if (bg) return <div className="media" style={{ pointerEvents:"none" }}>
      <iframe title="video" src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&controls=0&playlist=${id}`} style={{ width:"100%", height:"100%", border:0 }} allow="autoplay" />
    </div>;
    return <div className="media" style={{ aspectRatio: "16/9" }}>
      <iframe title="video" src={`https://www.youtube.com/embed/${id}`} style={{ width:"100%", height:"100%", border:0 }} allowFullScreen />
    </div>;
  }
  if (t === "video") {
    if (bg) return <div className="media">
      <video src={media.src} poster={media.poster} autoPlay muted loop playsInline
        style={{ objectFit, width:"100%", height:"100%" }} />
    </div>;
    if (onClick) return (
      <div className="media" onClick={onClick}>
        {media.poster ? <img src={media.poster} style={{ objectFit, width:"100%", height:"100%" }} alt="" />
          : <video src={media.src} style={{ objectFit, width:"100%", height:"100%" }} muted />}
        <div className="play"><span><Play size={26} /></span></div>
      </div>);
    return <div className="media"><video src={media.src} poster={media.poster} controls style={{ objectFit, width:"100%", height:"100%" }} /></div>;
  }
  return <div className="media" onClick={onClick} style={onClick ? { cursor:"pointer" } : {}}>
    {err ? <div className="ph">Image indisponible</div>
      : <img src={media.src} loading="lazy" onError={() => setErr(true)} style={{ objectFit, width:"100%", height:"100%" }} alt="" />}
  </div>;
}

const NAV_ITEMS = [["accueil","Accueil"],["association","Association"],["crews","Équipe"],
  ["cars","Voitures"],["season","Saison 2026"],["news","Actualités"],
  ["partners","Partenaires"],["contact","Contact"]];

/* ============================================================
   PUBLIC SITE
   ============================================================ */
/* Logo partenaire : fond teinté auto selon la couleur dominante du logo */
function PartnerLogo({ p }) {
  const [tint, setTint] = useState(null);
  const onLoad = (e) => {
    try {
      const im = e.target, n = 32, c = document.createElement("canvas");
      c.width = n; c.height = n;
      const ctx = c.getContext("2d");
      ctx.drawImage(im, 0, 0, n, n);
      const d = ctx.getImageData(0, 0, n, n).data;
      let r = 0, g = 0, b = 0, cnt = 0;
      for (let i = 0; i < d.length; i += 4) {
        const a = d[i+3]; if (a < 130) continue;
        const rr = d[i], gg = d[i+1], bb = d[i+2];
        const mx = Math.max(rr,gg,bb), mn = Math.min(rr,gg,bb);
        if (mx > 244 && mn > 244) continue;       // ignore le blanc
        if (mx < 18) continue;                      // ignore le noir pur
        if (mx - mn < 18 && mx > 150) continue;     // ignore les gris clairs
        r += rr; g += gg; b += bb; cnt++;
      }
      if (cnt > 4) setTint(`rgb(${r/cnt|0},${g/cnt|0},${b/cnt|0})`);
    } catch {}
  };
  const style = tint ? {
    background: `color-mix(in srgb, ${tint} 14%, var(--card))`,
    borderColor: `color-mix(in srgb, ${tint} 30%, var(--border))`
  } : {};
  return <a className="plogo" href={p.url} target="_blank" rel="noreferrer" style={style}>
    {tint && <span className="plogo-bar" style={{ background: tint }}/>}
    {p.logo ? <span className="plogo-plate"><img src={p.logo} alt={p.name} loading="lazy" crossOrigin="anonymous" onLoad={onLoad}/></span>
      : <><b>{p.name}</b>{p.category && <small>{p.category}</small>}</>}
    {p.url && p.url !== "#" && <span className="plogo-link">Cliquer pour accéder au site</span>}
  </a>;
}

function Site({ data, openAdmin, view, setView }) {
  const [menu, setMenu] = useState(false);
  const [pick, setPick] = useState(false);
  const vTheme = THEMES[view.theme] ? view.theme : (THEMES[data.general.theme] ? data.general.theme : "blue");
  const vMode = (view.mode || data.general.mode) === "night" ? "night" : "light";
  const vGrad = view.gradient !== undefined ? view.gradient : !!data.general.gradient;
  const [lb, setLb] = useState(null);
  const [filter, setFilter] = useState("tout");
  const go = (id) => { setMenu(false); document.getElementById(id)?.scrollIntoView({ behavior:"smooth" }); };
  const g = data.general;
  const gItems = data.gallery.items.filter(i => filter === "tout" ||
    (filter === "videos" ? i.media.type !== "image" : i.cat === filter));

  return (
    <>
      {/* NAV */}
      <nav className="nav"><div className="wrap nav-in">
        <div className="logo" onClick={() => go("accueil")}>
          <span className="l1">{g.logoText1}</span><span className="l2">{g.logoText2}</span>
        </div>
        <div className={"nav-links" + (menu ? " open" : "")}>
          {NAV_ITEMS.map(([id, l]) => <a key={id} onClick={() => go(id)}>{l}</a>)}
          <a onClick={() => go("contact")} className="btn btn-primary btn-sm" style={{ color:"#fff", textTransform:"uppercase" }}>Devenir sponsor</a>
        </div>
        <div className="nav-right">
          <div className="picker-wrap">
            <button className="icon-btn" onClick={() => setPick(p => !p)} title="Apparence"><Palette size={18}/></button>
            {pick && <>
              <div className="picker-back" onClick={() => setPick(false)}/>
              <div className="picker">
                <div className="picker-lab">Mode</div>
                <div className="picker-row">
                  <button className={"chip2"+(vMode==="light"?" on":"")} onClick={()=>setView(v=>({...v,mode:"light"}))}><Sun size={14}/> Clair</button>
                  <button className={"chip2"+(vMode==="night"?" on":"")} onClick={()=>setView(v=>({...v,mode:"night"}))}><Moon size={14}/> Nuit</button>
                </div>
                <div className="picker-lab">Couleurs</div>
                <div className="picker-themes">
                  {["blue","red","gold"].map(k=><button key={k} className={"swatch"+(vTheme===k?" on":"")} onClick={()=>setView(v=>({...v,theme:k}))}>
                    <span className="dot" style={{background:THEMES[k].primary}}/>{THEME_LABELS[k]}</button>)}
                </div>
                <button className={"swatch grad-toggle"+(vGrad?" on":"")} onClick={()=>setView(v=>({...v,gradient:!vGrad}))}>
                  <span className="dot" style={{background:(THEMES[vTheme]||THEMES.blue).grad}}/>Dégradé {vGrad ? "activé" : "désactivé"}
                </button>
              </div>
            </>}
          </div>
          <button className="icon-btn burger" onClick={() => setMenu(m => !m)}>{menu ? <X size={20}/> : <Menu size={20}/>}</button>
        </div>
      </div></nav>

      {/* HERO */}
      <header id="accueil" className="hero">
        <div className="hero-media">{(() => {
          const slides = (data.hero.slides || []).filter(s => s && s.src);
          return slides.length ? <HeroSlides slides={slides} /> : <Media media={data.hero.media} fit="cover" bg />;
        })()}</div>
        <div className="speedlines">{[120,90,150,70].map((w,i)=><i key={i} style={{ width:w }} />)}</div>
        <div className="wrap hero-in">
          <div className="eyebrow hero-eyebrow">{data.hero.eyebrow}</div>
          <h1>{g.logoText1}<br/><span className="blue">{g.logoText2}</span></h1>
          <p className="tag">{data.hero.slogan}</p>
          <div className="hero-btns">
            <a className="btn btn-primary" onClick={() => go("association")}>Découvrir l'association <ChevronRight size={18}/></a>
            <a className="btn btn-white" onClick={() => go("season")}>Saison 2026</a>
            <a className="btn btn-ghost" style={{ color:"#fff", borderColor:"rgba(255,255,255,.5)" }} onClick={() => go("contact")}>Devenir partenaire</a>
          </div>
        </div>
      </header>

      {/* STATS */}
      <div className="wrap stats"><div className="stats-card">
        {data.hero.stats.map((s,i) => <div className="stat" key={i}>
          <span className="ic"><Ic name={s.icon} size={24}/></span>
          <div><h4>{s.title}</h4><p>{s.text}</p></div>
        </div>)}
      </div></div>

      {/* ASSOCIATION */}
      <section id="association" className="section"><div className="wrap assoc">
        <div>
          <div className="eyebrow">{data.association.eyebrow}</div>
          <h2 className="h2">{data.association.title}</h2>
          <p className="lead" style={{ marginBottom:24 }}>{data.association.subtitle}</p>
          {data.association.paragraphs.map((p,i)=><p key={i}>{p}</p>)}
          <div style={{ display:"flex", gap:24, flexWrap:"wrap", marginTop:24 }}>
            {data.association.values.map((v,i)=><div className="feat" key={i} style={{ width:220 }}>
              <span className="ic"><Ic name={v.icon}/></span>
              <div><h4>{v.title}</h4><p>{v.text}</p></div>
            </div>)}
          </div>
          <a className="btn btn-primary" style={{ marginTop:28 }} onClick={() => go("contact")}>Devenir partenaire <ArrowRight size={18}/></a>
        </div>
        <Media media={data.association.media} fit="cover" bg />
      </div></section>

      {/* CREWS */}
      <section id="crews" className="section alt"><div className="wrap">
        <div className="eyebrow">{data.crews.eyebrow}</div>
        <h2 className="h2">{data.crews.title}</h2>
        <p className="lead" style={{ marginBottom:36 }}>{data.crews.subtitle}</p>
        <div className="grid g2">
          {data.crews.items.map((c,i)=><div className="card hov crew" key={c.id}>
            <div className="crew-top">
              <div className="avatar"><Users size={28}/></div>
              <div><div className="crew-tag">Équipage {i+1}</div><h3>{c.pilot}</h3><h3 style={{ color:"var(--muted)" }}>{c.copilot}</h3></div>
            </div>
            <div className="crew-row"><span>Voiture</span><span>{c.car}</span></div>
            <div className="crew-row"><span>Expérience</span><span>{c.experience}</span></div>
            <div className="crew-row"><span>Objectif 2026</span><span style={{ maxWidth:200, textAlign:"right" }}>{c.goal}</span></div>
            <div className="crew-quote"><Quote size={16}/>{c.quote}</div>
          </div>)}
        </div>
        <p className="mini" style={{ textAlign:"center", marginTop:26 }}>{data.crews.footer}</p>
      </div></section>

      {/* CARS — texte au-dessus, voitures en dessous */}
      <section id="cars" className="section"><div className="wrap">
        <div className="eyebrow">{data.cars.eyebrow}</div>
        <h2 className="h2">{data.cars.title}</h2>
        <p className="lead">{data.cars.subtitle}</p>
        <div className="grid g4" style={{ margin:"30px 0 44px" }}>
          {data.cars.features.map((f,i)=><div className="feat" key={i}>
            <span className="ic"><Ic name={f.icon}/></span>
            <div><h4>{f.title}</h4><p>{f.text}</p></div>
          </div>)}
        </div>
        <div className="grid" style={{ gridTemplateColumns:"1fr" }}>
          {data.cars.items.map(v=><div className="card car" key={v.id}>
            <Media media={v.media} fit="cover" />
            <div className="car-info">
              <h3>{v.name}</h3>
              {Object.entries(v.specs).map(([k,val])=><div className="spec" key={k}><span>{k}</span><span>{val}</span></div>)}
            </div>
          </div>)}
        </div>
      </div></section>

      {/* SEASON */}
      <section id="season" className="section alt"><div className="wrap">
        <div className="eyebrow">{data.season.eyebrow}</div>
        <h2 className="h2">Saison <span className="b">2026</span></h2>
        <p className="lead" style={{ marginBottom:32 }}>{data.season.subtitle}</p>
        <table className="table"><thead><tr>
          <th>Date</th><th>Rallye</th><th>Lieu</th><th>Statut</th><th>Résultat</th>
        </tr></thead><tbody>
          {data.season.events.map(e=><tr key={e.id}>
            <td style={{ fontWeight:700 }}>{e.date}</td><td>{e.rally}</td><td style={{ color:"var(--muted)" }}>{e.place}</td>
            <td><span className={"badge "+e.status}>{e.status==="avenir"?"À venir":e.status==="inscrit"?"Inscrit":"Terminé"}</span></td>
            <td style={{ color:"var(--muted)" }}>{e.result || "—"}</td>
          </tr>)}
        </tbody></table>
      </div></section>

      {/* NEWS */}
      <section id="news" className="section"><div className="wrap">
        <div className="eyebrow">{data.news.eyebrow}</div>
        <h2 className="h2">{data.news.title}</h2>
        <p className="lead" style={{ marginBottom:36 }}>{data.news.subtitle}</p>
        <div className="grid g4">
          {data.news.items.map(n=><div className="card hov news-card" key={n.id}>
            <div style={{ position:"relative" }}><span className="news-cat">{n.category}</span><Media media={n.media} fit="cover"/></div>
            <div className="news-body">
              <div className="news-date">{n.date}</div>
              <h3>{n.title}</h3><p>{n.excerpt}</p>
              <a className="link">Lire la suite <ArrowRight size={15}/></a>
            </div>
          </div>)}
        </div>
      </div></section>

      {/* GALLERY */}
      <section id="gallery" className="section alt"><div className="wrap">
        <div className="eyebrow">{data.gallery.eyebrow}</div>
        <h2 className="h2">{data.gallery.title}</h2>
        <p className="lead" style={{ marginBottom:26 }}>{data.gallery.subtitle}</p>
        <div className="filters">
          {[["tout","Tout"],["rallye","Rallye"],["paddock","Paddock"],["assistance","Assistance"],["preparation","Préparation"],["videos","Vidéos"]]
            .map(([k,l])=><button key={k} className={"filter"+(filter===k?" on":"")} onClick={()=>setFilter(k)}>{l}</button>)}
        </div>
        <div className="masonry">
          {gItems.map(it=><div className="g-item" key={it.id} onClick={()=>setLb(it.media)}>
            <Media media={it.media} fit="cover" onClick={()=>setLb(it.media)} />
          </div>)}
        </div>
      </div></section>

      {/* PARTNERS */}
      <section id="partners" className="section"><div className="wrap">
        <div className="eyebrow">{data.partners.eyebrow}</div>
        <h2 className="h2">{data.partners.title}</h2>
        <p className="lead" style={{ marginBottom:32 }}>{data.partners.subtitle}</p>
        <div className="plogos">
          {data.partners.items.filter(p=>p.logo||p.name).map(p=><PartnerLogo key={p.id} p={p}/>)}
        </div>
        <p className="mini" style={{ textAlign:"center", margin:"22px 0 24px" }}>{data.partners.footer}</p>
        {(data.partners.posters||[]).length>0 &&
          <div className="posters">
            {(data.partners.posters||[]).map(p=><div className="poster" key={p.id} onClick={()=>setLb({type:"image",src:p.src})}>
              <img src={p.src} loading="lazy" alt="Affiche sponsor"/>
            </div>)}
          </div>}
        <div style={{ textAlign:"center", marginTop:32 }}><a className="btn btn-primary" onClick={()=>go("contact")}>Devenir partenaire <Handshake size={18}/></a></div>
      </div></section>

      {/* WHY */}
      <section className="section alt"><div className="wrap">
        <div className="eyebrow">{data.why.eyebrow}</div>
        <h2 className="h2">{data.why.title}</h2>
        <p className="lead" style={{ marginBottom:36 }}>{data.why.subtitle}</p>
        <div className="grid g3">
          {data.why.args.map((a,i)=><div className="card hov feat" key={i} style={{ padding:22 }}>
            <span className="ic"><Ic name={a.icon}/></span>
            <div><h4>{a.title}</h4><p>{a.text}</p></div>
          </div>)}
        </div>
        <div style={{ textAlign:"center", marginTop:34 }}><a className="btn btn-primary" onClick={()=>go("contact")}>Nous contacter <ArrowRight size={18}/></a></div>
      </div></section>

      {/* DOCUMENTS */}
      <section id="documents" className="section"><div className="wrap">
        <div className="eyebrow">{data.documents.eyebrow}</div>
        <h2 className="h2">{data.documents.title}</h2>
        <p className="lead" style={{ marginBottom:32 }}>{data.documents.subtitle}</p>
        <div className="grid g3">
          {data.documents.items.map(d=><div className="card doc" key={d.id}>
            <span className="ic"><FileText size={26}/></span>
            <h4>{d.name}</h4><p>{d.desc}</p>
            <a className="btn btn-ghost btn-sm" href={d.url}><Download size={16}/> Télécharger</a>
          </div>)}
        </div>
      </div></section>

      {/* CONTACT */}
      <section id="contact" className="section alt"><div className="wrap contact">
        <div>
          <div className="eyebrow">{data.contact.eyebrow}</div>
          <h2 className="h2">{data.contact.title}</h2>
          <p className="lead" style={{ marginBottom:26 }}>{data.contact.subtitle}</p>
          <div className="field"><label>Nom / entreprise</label><input placeholder="Votre nom"/></div>
          <div className="adm-grid">
            <div className="field"><label>Email</label><input type="email" placeholder="email@exemple.fr"/></div>
            <div className="field"><label>Téléphone</label><input placeholder="06 ..."/></div>
          </div>
          <div className="field"><label>Sujet</label><input placeholder="Partenariat, presse, info..."/></div>
          <div className="field"><label>Message</label><textarea rows={4} placeholder="Votre message"/></div>
          <button className="btn btn-primary" onClick={()=>alert("Formulaire de démonstration — à connecter au backend.")}>Envoyer le message <ArrowRight size={18}/></button>
        </div>
        <div className="cinfo">
          <h3 style={{ fontStyle:"italic", fontWeight:800, textTransform:"uppercase", marginBottom:20 }}>Coordonnées</h3>
          <div className="row"><span className="ic"><Trophy size={20}/></span><div><b>{g.name}</b><br/><span className="mini">Association loi 1901</span></div></div>
          <div className="row"><span className="ic"><Phone size={20}/></span>{g.phone}</div>
          <div className="row"><span className="ic"><Mail size={20}/></span>{g.email}</div>
          <div className="row"><span className="ic"><MapPin size={20}/></span>{g.address}</div>
          <h4 style={{ marginTop:24, marginBottom:10, textTransform:"uppercase", fontWeight:800, fontSize:14 }}>Suivez-nous</h4>
          <div className="socials">
            <a href={g.socials.facebook}><Facebook size={20}/></a>
            <a href={g.socials.instagram}><Instagram size={20}/></a>
            <a href={g.socials.youtube}><Youtube size={20}/></a>
          </div>
          <div style={{ marginTop:24, borderRadius:16, overflow:"hidden", border:"1px solid var(--border)", aspectRatio:"16/9", position:"relative" }}>
            <iframe title="map" style={{ width:"100%", height:"100%", border:0, filter:"grayscale(.2)" }}
              src="https://www.openstreetmap.org/export/embed.html?bbox=1.6,49.9,4.2,51.1&layer=mapnik&marker=50.5,2.9" />
          </div>
        </div>
      </div></section>

      {/* FOOTER */}
      <footer className="foot"><div className="wrap">
        <div className="logo"><span className="l1">{g.logoText1}</span> <span className="l2" style={{ display:"inline" }}>{g.logoText2}</span></div>
        <p>{data.hero.slogan}</p>
        <p className="mini" style={{ marginTop:8 }}>© 2026 {g.name} — Association loi 1901</p>
        <div className="admin-link" onClick={openAdmin}><Lock size={12}/> Espace admin</div>
      </div></footer>

      {lb && <div className="lb" onClick={()=>setLb(null)}>
        <button className="lb-close" onClick={()=>setLb(null)}><X size={22}/></button>
        <div className="lb-in" onClick={e=>e.stopPropagation()}>
          {lb.type==="image" ? <img src={lb.src} alt=""/> :
           ytId(lb.src) ? <iframe title="v" width="900" height="506" src={`https://www.youtube.com/embed/${ytId(lb.src)}`} allowFullScreen style={{maxWidth:"92vw"}}/> :
           <video src={lb.src} controls autoPlay/>}
        </div>
      </div>}
    </>
  );
}

/* ============================================================
   ADMIN
   ============================================================ */
const ADM_SECTIONS = [
  ["general","Général",Settings],["hero","Accueil",LayoutGrid],["association","Association",Users],
  ["crews","Équipages",Users],["cars","Voitures",Gauge],["season","Saison",Calendar],
  ["news","Actualités",Megaphone],["gallery","Galerie",ImageIcon],["partners","Partenaires",Handshake],
  ["documents","Documents",FileText],["appearance","Apparence",Palette]
];

function Field({ label, value, onChange, type="text", textarea }) {
  return <div className="field"><label>{label}</label>
    {textarea ? <textarea rows={3} value={value} onChange={e=>onChange(e.target.value)} />
      : <input type={type} value={value} onChange={e=>onChange(e.target.value)} />}
  </div>;
}
const STORAGE_BUCKET = "media";
const ADMIN_PW = "25092007";
async function uploadFile(file) {
  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw error;
  return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}
function FileDrop({ accept, label, onUploaded }) {
  const ref = useRef();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [over, setOver] = useState(false);
  const handle = async (file) => {
    if (!file) return;
    setBusy(true); setErr("");
    try { const url = await uploadFile(file); onUploaded(url, file); }
    catch (e) { setErr(e.message || "Échec de l'envoi"); }
    setBusy(false);
  };
  return <div className={"filedrop"+(over?" over":"")}
    onClick={()=>ref.current.click()}
    onDragOver={e=>{e.preventDefault();setOver(true);}}
    onDragLeave={()=>setOver(false)}
    onDrop={e=>{e.preventDefault();setOver(false);handle(e.dataTransfer.files[0]);}}>
    <input ref={ref} type="file" accept={accept} style={{display:"none"}} onChange={e=>handle(e.target.files[0])}/>
    <Download size={18}/> {busy ? "Envoi en cours…" : (label || "Glisser un fichier ici, ou cliquer pour parcourir")}
    {err && <div className="mini" style={{color:"#dc2626",marginTop:6}}>{err}</div>}
  </div>;
}
function MediaEditor({ media, onChange }) {
  const m = media || { type:"image", src:"", fit:"cover", poster:"" };
  const set = (k,v) => onChange({ ...m, [k]:v });
  return <div className="adm-card" style={{ background:"var(--soft)" }}>
    <div className="adm-grid">
      <div className="field"><label>Type de média</label>
        <select value={m.type} onChange={e=>set("type",e.target.value)}>
          <option value="image">Image</option><option value="video">Vidéo (MP4/WEBM)</option><option value="youtube">Lien YouTube/Vimeo</option>
        </select></div>
      <div className="field"><label>Cadrage</label>
        <select value={m.fit} onChange={e=>set("fit",e.target.value)}><option value="cover">Remplir (cover)</option><option value="contain">Entier (contain)</option></select></div>
    </div>
    {m.type!=="youtube" && <FileDrop
      accept={m.type==="video"?"video/*":"image/*"}
      label={m.type==="video"?"Glisser une vidéo (MP4/WEBM)":"Glisser une image (JPG/PNG/WEBP)"}
      onUploaded={(url,file)=>onChange({...m, src:url, type: file.type.startsWith("video")?"video":"image"})}/>}
    <Field label={m.type==="youtube"?"Lien YouTube/Vimeo":"URL du média (ou collez un lien)"} value={m.src} onChange={v=>set("src",v)} />
    {m.type==="video" && <><FileDrop accept="image/*" label="Glisser une image de couverture (poster)" onUploaded={url=>set("poster",url)}/>
      <Field label="URL du poster" value={m.poster} onChange={v=>set("poster",v)} /></>}
    {m.src
      ? <div className="media-prev"><Media media={m} fit={m.fit}/></div>
      : <div className="media-prev empty">Aucun média — glissez un fichier ci-dessus</div>}
  </div>;
}
function ListEditor({ title, items, onChange, render, blank }) {
  const upd = (id,patch) => onChange(items.map(it=>it.id===id?{...it,...patch}:it));
  const del = (id) => onChange(items.filter(it=>it.id!==id));
  const add = () => onChange([...items,{...blank,id:"x"+Date.now()}]);
  return <>
    {items.map(it=><div className="adm-card" key={it.id}>
      <h3>{title} <button className="del" onClick={()=>del(it.id)}><Trash2 size={16}/></button></h3>
      {render(it,(patch)=>upd(it.id,patch))}
    </div>)}
    <button className="btn btn-ghost btn-sm" onClick={add}><Plus size={16}/> Ajouter</button>
  </>;
}

function AdminLogin({ onOk, onCancel }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const submit = () => { if (pw === ADMIN_PW) onOk(); else { setErr(true); setPw(""); } };
  return <div className="login-screen">
    <div className="login-box">
      <div className="login-ic"><Lock size={26}/></div>
      <h2>Espace administrateur</h2>
      <p className="mini" style={{marginBottom:18}}>Entrez le mot de passe pour gérer le site.</p>
      <input type="password" autoFocus value={pw} placeholder="Mot de passe"
        onChange={e=>{setPw(e.target.value);setErr(false);}}
        onKeyDown={e=>e.key==="Enter"&&submit()}
        style={{width:"100%",padding:"13px 14px",border:"1px solid var(--border)",borderRadius:10,background:"var(--section)",color:"var(--text)",fontSize:15,marginBottom:err?6:14}}/>
      {err && <p className="mini" style={{color:"#dc2626",marginBottom:14}}>Mot de passe incorrect.</p>}
      <button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}} onClick={submit}>Se connecter</button>
      <button className="btn btn-ghost btn-sm" style={{width:"100%",justifyContent:"center",marginTop:10}} onClick={onCancel}>Retour au site</button>
    </div>
  </div>;
}

function Admin({ data, setData, close }) {
  const [sec, setSec] = useState("general");
  const [side, setSide] = useState(false);
  const [toast, setToast] = useState("");
  const patch = (key, val) => setData(d => ({ ...d, [key]: { ...d[key], ...val } }));
  const g = data.general;
  const note = (t) => { setToast(t); setTimeout(()=>setToast(""),1800); };
  const save = async () => { await storageService.save(data); note("Modifications enregistrées"); };
  const reset = async () => { await storageService.clear(); setData(structuredClone(DEFAULT_DATA)); note("Contenu réinitialisé"); };

  return <div className="adm">
    <aside className={"adm-side"+(side?" open":"")}>
      <div className="logo"><span className="l1">{g.logoText1}</span><span className="l2">Admin</span></div>
      <div className="adm-nav">
        {ADM_SECTIONS.map(([k,l,I])=><button key={k} className={sec===k?"on":""} onClick={()=>{setSec(k);setSide(false);}}><I size={17}/>{l}</button>)}
      </div>
    </aside>
    <main className="adm-main">
      <div className="adm-head">
        <div style={{ display:"flex", gap:12, alignItems:"center" }}>
          <button className="icon-btn burger" onClick={()=>setSide(s=>!s)}><Menu size={18}/></button>
          <h2>{ADM_SECTIONS.find(s=>s[0]===sec)[1]}</h2>
        </div>
        <div className="adm-actions">
          <button className="btn btn-ghost btn-sm" onClick={reset}><RotateCcw size={16}/> Réinitialiser</button>
          <button className="btn btn-ghost btn-sm" onClick={close}><Eye size={16}/> Voir le site</button>
          <button className="btn btn-primary btn-sm" onClick={save}><Save size={16}/> Enregistrer</button>
        </div>
      </div>

      {sec==="general" && <>
        <div className="adm-card"><h3>Identité</h3><div className="adm-grid">
          <Field label="Nom (ligne 1)" value={g.logoText1} onChange={v=>patch("general",{logoText1:v})}/>
          <Field label="Nom (ligne 2)" value={g.logoText2} onChange={v=>patch("general",{logoText2:v})}/>
        </div></div>
        <div className="adm-card"><h3>Coordonnées</h3><div className="adm-grid">
          <Field label="Email" value={g.email} onChange={v=>patch("general",{email:v})}/>
          <Field label="Téléphone" value={g.phone} onChange={v=>patch("general",{phone:v})}/>
        </div><Field label="Adresse / zone" value={g.address} onChange={v=>patch("general",{address:v})}/></div>
        <div className="adm-card"><h3>Réseaux sociaux</h3><div className="adm-grid">
          {["facebook","instagram","youtube","tiktok"].map(k=>
            <Field key={k} label={k} value={g.socials[k]} onChange={v=>patch("general",{socials:{...g.socials,[k]:v}})}/>)}
        </div></div>
      </>}

      {sec==="hero" && <>
        <div className="adm-card"><h3>Textes</h3>
          <Field label="Eyebrow" value={data.hero.eyebrow} onChange={v=>patch("hero",{eyebrow:v})}/>
          <Field label="Slogan" value={data.hero.slogan} onChange={v=>patch("hero",{slogan:v})} textarea/>
        </div>
        <div className="adm-card"><h3>Média de fond (si aucun diaporama ci-dessous)</h3>
          <MediaEditor media={data.hero.media} onChange={m=>patch("hero",{media:m})}/></div>
        <div className="adm-card">
          <h3>Diaporama de fond (s'enchaînent en boucle)</h3>
          <p className="mini" style={{marginBottom:14}}>Ajoute plusieurs vidéos/images : elles défilent automatiquement. Les vidéos s'enchaînent à la fin, les images durent 6 s. Si vide, c'est le média de fond ci-dessus qui est utilisé.</p>
          <ListEditor title="Média" items={data.hero.slides||[]} onChange={v=>patch("hero",{slides:v})}
            blank={{type:"video",src:"",fit:"cover",poster:""}}
            render={(it,u)=><MediaEditor media={it} onChange={m=>u(m)}/>}/>
        </div>
        <ListEditor title="Stat" items={data.hero.stats.map((s,i)=>({...s,id:s.id||"st"+i}))}
          onChange={v=>patch("hero",{stats:v})} blank={{icon:"shield",title:"",text:""}}
          render={(it,u)=><div className="adm-grid">
            <Field label="Icône" value={it.icon} onChange={v=>u({icon:v})}/>
            <Field label="Titre" value={it.title} onChange={v=>u({title:v})}/>
            <Field label="Texte" value={it.text} onChange={v=>u({text:v})}/>
          </div>}/>
      </>}

      {sec==="association" && <>
        <div className="adm-card"><h3>Textes</h3>
          <Field label="Titre" value={data.association.title} onChange={v=>patch("association",{title:v})}/>
          <Field label="Sous-titre" value={data.association.subtitle} onChange={v=>patch("association",{subtitle:v})}/>
          {data.association.paragraphs.map((p,i)=><Field key={i} label={`Paragraphe ${i+1}`} value={p} textarea
            onChange={v=>{const a=[...data.association.paragraphs];a[i]=v;patch("association",{paragraphs:a});}}/>)}
        </div>
        <div className="adm-card"><h3>Média</h3><MediaEditor media={data.association.media} onChange={m=>patch("association",{media:m})}/></div>
      </>}

      {sec==="crews" && <>
        <div className="adm-card"><h3>Textes</h3>
          <Field label="Titre" value={data.crews.title} onChange={v=>patch("crews",{title:v})}/>
          <Field label="Sous-titre" value={data.crews.subtitle} onChange={v=>patch("crews",{subtitle:v})}/>
        </div>
        <ListEditor title="Équipage" items={data.crews.items} onChange={v=>patch("crews",{items:v})}
          blank={{pilot:"",copilot:"",car:"",experience:"",goal:"",quote:""}}
          render={(it,u)=><><div className="adm-grid">
            <Field label="Pilote" value={it.pilot} onChange={v=>u({pilot:v})}/>
            <Field label="Copilote" value={it.copilot} onChange={v=>u({copilot:v})}/>
            <Field label="Voiture" value={it.car} onChange={v=>u({car:v})}/>
            <Field label="Expérience" value={it.experience} onChange={v=>u({experience:v})}/>
          </div>
          <Field label="Objectif" value={it.goal} onChange={v=>u({goal:v})}/>
          <Field label="Citation" value={it.quote} onChange={v=>u({quote:v})}/></>}/>
      </>}

      {sec==="cars" && <>
        <div className="adm-card"><h3>Textes & atouts</h3>
          <Field label="Titre" value={data.cars.title} onChange={v=>patch("cars",{title:v})}/>
          <Field label="Sous-titre" value={data.cars.subtitle} onChange={v=>patch("cars",{subtitle:v})}/>
        </div>
        <ListEditor title="Voiture" items={data.cars.items} onChange={v=>patch("cars",{items:v})}
          blank={{name:"",media:{type:"image",src:"",fit:"cover"},specs:{Année:"",Moteur:"",Puissance:"",Transmission:"",Catégorie:"",Traction:""}}}
          render={(it,u)=><>
            <Field label="Nom" value={it.name} onChange={v=>u({name:v})}/>
            <MediaEditor media={it.media} onChange={m=>u({media:m})}/>
            <div className="adm-grid">{Object.keys(it.specs).map(k=>
              <Field key={k} label={k} value={it.specs[k]} onChange={v=>u({specs:{...it.specs,[k]:v}})}/>)}
            </div></>}/>
      </>}

      {sec==="season" && <ListEditor title="Rallye" items={data.season.events} onChange={v=>patch("season",{events:v})}
        blank={{date:"",rally:"",place:"",status:"avenir",result:""}}
        render={(it,u)=><><div className="adm-grid">
          <Field label="Date" value={it.date} onChange={v=>u({date:v})}/>
          <Field label="Rallye" value={it.rally} onChange={v=>u({rally:v})}/>
          <Field label="Lieu" value={it.place} onChange={v=>u({place:v})}/>
          <div className="field"><label>Statut</label><select value={it.status} onChange={e=>u({status:e.target.value})}>
            <option value="avenir">À venir</option><option value="inscrit">Inscrit</option><option value="termine">Terminé</option></select></div>
        </div><Field label="Résultat" value={it.result} onChange={v=>u({result:v})}/></>}/>}

      {sec==="news" && <ListEditor title="Actualité" items={data.news.items} onChange={v=>patch("news",{items:v})}
        blank={{category:"Club",date:"",title:"",excerpt:"",media:{type:"image",src:"",fit:"cover"}}}
        render={(it,u)=><><div className="adm-grid">
          <div className="field"><label>Catégorie</label><select value={it.category} onChange={e=>u({category:e.target.value})}>
            {["Préparation","Inscription","Résultat","Partenaires","Club"].map(c=><option key={c}>{c}</option>)}</select></div>
          <Field label="Date" value={it.date} onChange={v=>u({date:v})}/>
        </div>
        <Field label="Titre" value={it.title} onChange={v=>u({title:v})}/>
        <Field label="Résumé" value={it.excerpt} onChange={v=>u({excerpt:v})} textarea/>
        <MediaEditor media={it.media} onChange={m=>u({media:m})}/></>}/>}

      {sec==="gallery" && <ListEditor title="Média" items={data.gallery.items} onChange={v=>patch("gallery",{items:v})}
        blank={{cat:"rallye",media:{type:"image",src:"",fit:"cover"}}}
        render={(it,u)=><>
          <div className="field"><label>Catégorie</label><select value={it.cat} onChange={e=>u({cat:e.target.value})}>
            {["rallye","paddock","assistance","preparation"].map(c=><option key={c}>{c}</option>)}</select></div>
          <MediaEditor media={it.media} onChange={m=>u({media:m})}/></>}/>}

      {sec==="partners" && <ListEditor title="Partenaire" items={data.partners.items} onChange={v=>patch("partners",{items:v})}
        blank={{name:"",category:"",url:"#",logo:""}}
        render={(it,u)=><><div className="adm-grid">
          <Field label="Nom" value={it.name} onChange={v=>u({name:v})}/>
          <Field label="Catégorie" value={it.category} onChange={v=>u({category:v})}/>
          <Field label="Lien (site du partenaire)" value={it.url} onChange={v=>u({url:v})}/>
        </div>
        <FileDrop accept="image/*" label="Glisser le logo (PNG transparent conseillé)" onUploaded={url=>u({logo:url})}/>
        {it.logo && <div style={{height:80,display:"grid",placeItems:"center",border:"1px solid var(--border)",borderRadius:10,background:"var(--card)",marginBottom:8}}>
          <img src={it.logo} alt="" style={{maxHeight:64,maxWidth:"90%",objectFit:"contain"}}/></div>}
        {it.logo && <button className="btn btn-ghost btn-sm" onClick={()=>u({logo:""})}><Trash2 size={14}/> Retirer le logo</button>}
        </>}/>}

      {sec==="partners" && <div className="adm-card" style={{marginTop:8}}>
        <h3>Affiches « Merci sponsor » (format portrait)</h3>
        <p className="mini" style={{marginBottom:14}}>S'affichent en grille sous les partenaires. Conseillé : images verticales (ex. 1080×1440). Clic = agrandissement sur le site.</p>
        <ListEditor title="Affiche" items={data.partners.posters||[]} onChange={v=>patch("partners",{posters:v})}
          blank={{src:""}}
          render={(it,u)=><>
            <FileDrop accept="image/*" label="Glisser une affiche (portrait)" onUploaded={url=>u({src:url})}/>
            {it.src && <div style={{width:120,aspectRatio:"3/4",borderRadius:10,overflow:"hidden",border:"1px solid var(--border)"}}>
              <img src={it.src} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>}
          </>}/>
      </div>}

      {sec==="documents" && <ListEditor title="Document" items={data.documents.items} onChange={v=>patch("documents",{items:v})}
        blank={{name:"",desc:"",url:"#"}}
        render={(it,u)=><><div className="adm-grid">
          <Field label="Nom" value={it.name} onChange={v=>u({name:v})}/>
          <Field label="Lien fichier" value={it.url} onChange={v=>u({url:v})}/>
        </div>
        <FileDrop label="Glisser un fichier (PDF, etc.)" onUploaded={url=>u({url})}/>
        <Field label="Description" value={it.desc} onChange={v=>u({desc:v})}/></>}/>}

      {sec==="appearance" && <>
        <div className="adm-card"><h3>Mode</h3><div className="chips">
          {[["light","Clair",Sun],["night","Nuit",Moon]].map(([k,l,I])=>
            <button key={k} className={"chip"+(g.mode===k?" on":"")} onClick={()=>patch("general",{mode:k})}><I size={15} style={{verticalAlign:"-2px",marginRight:6}}/>{l}</button>)}
        </div></div>
        <div className="adm-card"><h3>Thème de couleurs</h3><div className="chips">
          {[["blue","Bleu sport"],["red","Rouge sport"],["gold","Noir / Or"]].map(([k,l])=>
            <button key={k} className={"chip"+(g.theme===k?" on":"")} onClick={()=>patch("general",{theme:k,custom:{}})}>
              <span style={{display:"inline-block",width:12,height:12,borderRadius:3,background:THEMES[k].primary,marginRight:7,verticalAlign:"-1px"}}/>{l}</button>)}
        </div>
        <div className="chips" style={{marginTop:12}}>
          <button className={"chip"+(g.gradient?" on":"")} onClick={()=>patch("general",{gradient:!g.gradient})}>
            <span style={{display:"inline-block",width:12,height:12,borderRadius:3,background:(THEMES[g.theme]||THEMES.blue).grad,marginRight:7,verticalAlign:"-1px"}}/>Dégradé {g.gradient?"activé":"désactivé"}</button>
        </div>
        <p className="mini" style={{marginTop:10}}>Choisir un thème réinitialise les couleurs personnalisées ci-dessous.</p></div>
        <div className="adm-card"><h3>Couleurs personnalisées</h3>
          {[["primary","Principale"],["secondary","Secondaire"],["accent","Accent"],["bg","Fond"],["card","Cartes"],["text","Texte"]].map(([k,l])=>{
            const cur = buildVars(g)["--"+k];
            return <div className="color-row" key={k}>
              <input type="color" value={cur} onChange={e=>patch("general",{custom:{...g.custom,[k]:e.target.value}})}/>
              <label>{l}</label><span className="mini">{cur}</span>
            </div>;})}
          <button className="btn btn-ghost btn-sm" onClick={()=>patch("general",{custom:{}})}><RotateCcw size={15}/> Couleurs par défaut du thème</button>
        </div>
      </>}
    </main>
    {toast && <div className="toast"><Check size={16} style={{verticalAlign:"-3px",marginRight:6}}/>{toast}</div>}
  </div>;
}

/* ============================================================
   ROOT
   ============================================================ */
export default function App() {
  const [data, setData] = useState(() => structuredClone(DEFAULT_DATA));
  const [admin, setAdmin] = useState(false);
  const [authed, setAuthed] = useState(() => { try { return sessionStorage.getItem("crc:admin") === "1"; } catch { return false; } });
  const [view, setView] = useState(() => {
    try {
      const v = JSON.parse(localStorage.getItem("crc:view")) || {};
      if (v.theme && !THEMES[v.theme]) delete v.theme;
      return v;
    } catch { return {}; }
  });

  useEffect(() => { storageService.load().then(d => { if (d) setData(d); }); }, []);
  useEffect(() => { if (window.location.hash === "#admin") setAdmin(true); }, []);
  useEffect(() => { try { localStorage.setItem("crc:view", JSON.stringify(view)); } catch {} }, [view]);

  const effective = admin ? data.general : {
    ...data.general,
    theme: view.theme || data.general.theme,
    mode: view.mode || data.general.mode,
    gradient: view.gradient !== undefined ? view.gradient : data.general.gradient,
    custom: view.theme ? {} : data.general.custom
  };
  const vars = buildVars(effective);
  return <div className="crc" style={vars}>
    <style>{CSS}</style>
    {admin
      ? (authed
          ? <Admin data={data} setData={setData} close={() => setAdmin(false)} />
          : <AdminLogin onOk={() => { setAuthed(true); try { sessionStorage.setItem("crc:admin","1"); } catch {} }} onCancel={() => setAdmin(false)} />)
      : <Site data={data} openAdmin={() => setAdmin(true)} view={view} setView={setView} />}
  </div>;
}
