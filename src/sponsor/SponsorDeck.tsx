import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    Mail,
    Phone,
    CheckCircle2,
    Check,
    Minus,
    Sparkles,
    Handshake,
    Info,
} from "lucide-react";
import hero from "../assets/image.jpg";

const cx = (...c: Array<string | false | null | undefined>) =>
    c.filter(Boolean).join(" ");

const brand = {
    bg: "bg-gradient-to-br from-emerald-50 via-white to-teal-50",
    card: "bg-white/70 backdrop-blur-md shadow-lg border border-emerald-100",
    btn: {
        solid: "bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white",
        ghost: "hover:bg-emerald-50 text-emerald-700",
        outline: "border border-emerald-300 hover:border-emerald-400 text-emerald-700",
    },
};

const SectionCard: React.FC<
    React.PropsWithChildren<{ className?: string }>
> = ({ className, children }) => (
    <div className={cx("rounded-2xl p-6 md:p-8", brand.card, className)}>
        {children}
    </div>
);

/* ===================== Slide 1 — Hero ===================== */
const SlideIntro: React.FC = () => {
    return (
        <div className="w-full h-full">
            <SectionCard className="relative overflow-hidden">
                {/* blobs doux */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="absolute -right-16 -top-16 size-64 rounded-full bg-emerald-200/40 blur-2xl"
                />
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="absolute -left-10 -bottom-10 size-52 rounded-full bg-teal-200/40 blur-2xl"
                />

                <div className="relative grid lg:grid-cols-2 gap-8 items-center">
                    {/* Texte gauche */}
                    <div>
                        <div className="inline-flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800">
                            <Sparkles className="size-4" />
                            Une aventure étudiante enthousiasmante
                        </div>
                        <h1 className="mt-3 text-3xl md:text-5xl font-extrabold leading-tight">
                            Travel GC — Partenaires de voyage 🤝🌍
                        </h1>
                        <p className="mt-4 text-emerald-900/85 leading-relaxed">
                            Nous sommes un collectif d’étudiant·e·s qui prépare un rail/road-trip
                            <b> Vienne • Bratislava • Budapest</b> du <b>7–17 juillet 2025</b>.
                            On produit des contenus authentiques, on crée des rencontres et on
                            valorise nos partenaires avec une visibilité moderne et bienveillante.
                        </p>

                        {/* petites bulles (cartes) : qui on est / notre but */}
                        <div className="mt-5 grid sm:grid-cols-2 gap-4">
                            <div className="rounded-xl border border-emerald-200/70 p-4 bg-white/70">
                                <div className="text-xs uppercase tracking-wider text-emerald-700/80 font-semibold">
                                    Qui sommes-nous ?
                                </div>
                                <p className="mt-2 text-emerald-900/90">
                                    Une asso dynamique : organisation d’événements, esprit d’équipe,
                                    contenus créatifs et professionnalisme.
                                </p>
                            </div>
                            <div className="rounded-xl border border-emerald-200/70 p-4 bg-white/70">
                                <div className="text-xs uppercase tracking-wider text-emerald-700/80 font-semibold">
                                    Notre but
                                </div>
                                <p className="mt-2 text-emerald-900/90">
                                    Créer un partenariat <i>win-win</i> : visibilité, contenu réutilisable,
                                    et activations qui ont du sens pour votre marque.
                                </p>
                            </div>
                        </div>
                        {/* → pas de badges dates/villes en bas, ni de bouton */}
                    </div>

                    {/* Visuel droite : image.webp placée dans /assets */}
                    <div className="relative">
                        <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-emerald-200/70 bg-white/60">
                            <img
                                src={hero}
                                alt="Travel GC — aperçu du voyage"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </SectionCard>
        </div>
    );
};

/* ===================== Slide 2 — Packs ===================== */

// Prestations (ordre de base)
type Feature = { key: string; label: string };
const baseFeatures: Feature[] = [
    { key: "logo_footer", label: "Logo site (footer)" },
    { key: "logo_slides", label: "Logo sur slides" },
    { key: "logo_header", label: "Logo header (premium)" },
    { key: "posts", label: "Posts dédiés" },
    { key: "stories", label: "Stories dédiées" },
    { key: "link", label: "Lien cliquable" },
    { key: "media", label: "Pack photo/vidéo" },
    { key: "activation", label: "Activation co-brandée" },
    { key: "exclu", label: "Exclusivité catégorie" },
    { key: "event", label: "Événement / capsule" },
];

// Descriptions (pour le bloc sous le tableau)
const featureDescriptions: Record<string, string> = {
    logo_footer: "Votre logo apparaît dans le pied de page du site (toutes les pages).",
    logo_slides: "Logo sur la slide Partenaires et sur nos supports de présentation.",
    logo_header: "Emplacement premium en haut du site avec lien direct vers votre page.",
    posts: "Publications dédiées (feed) présentant votre marque et la collaboration.",
    stories: "Stories dédiées pendant le voyage et aux moments clés.",
    link: "Lien cliquable vers votre site, fiche ou campagne.",
    media: "Pack média (photos/vidéos) réutilisables par vos canaux.",
    activation: "Action terrain/digitale co-brandée (concours, dotation, placement produit…).",
    exclu: "Exclusivité de catégorie (vous êtes l’unique partenaire de votre secteur).",
    event: "Présence à un événement ou capsule dédiée après le voyage.",
};

type Pack = { name: string; price: string; grants: Record<string, boolean> };
const packs: Pack[] = [
    {
        name: "Bronze",
        price: "CHF 1'000",
        grants: {
            logo_footer: true,
            logo_slides: false,
            logo_header: false,
            posts: true,
            stories: false,
            link: true,
            media: true,
            activation: false,
            exclu: false,
            event: false,
        },
    },
    {
        name: "Argent",
        price: "CHF 2'500",
        grants: {
            logo_footer: true,
            logo_slides: true,
            logo_header: false,
            posts: true,
            stories: true,
            link: true,
            media: true,
            activation: false,
            exclu: false,
            event: false,
        },
    },
    {
        name: "Or",
        price: "CHF 5'000",
        grants: {
            logo_footer: true,
            logo_slides: true,
            logo_header: true,
            posts: true,
            stories: true,
            link: true,
            media: true,
            activation: true,
            exclu: false,
            event: false,
        },
    },
    {
        name: "Platine",
        price: "CHF 7'500",
        grants: {
            logo_footer: true,
            logo_slides: true,
            logo_header: true,
            posts: true,
            stories: true,
            link: true,
            media: true,
            activation: true,
            exclu: true,
            event: true,
        },
    },
];

// Tri pour créer la “diagonale” : on classe chaque prestation selon le 1er pack qui l’inclut.
const useDiagonalFeatures = (features: Feature[], packs: Pack[]) => {
    return useMemo(() => {
        const packIndex: Record<string, number> = {};
        features.forEach((f) => {
            let first = packs.length; // défaut: jamais offert
            packs.forEach((p, i) => {
                if (p.grants[f.key]) first = Math.min(first, i);
            });
            packIndex[f.key] = first;
        });
        return [...features].sort((a, b) => {
            const da = packIndex[a.key];
            const db = packIndex[b.key];
            if (da !== db) return da - db; // Bronze d'abord, puis Argent, etc.
            // en cas d’égalité, garder l’ordre naturel
            return features.findIndex((x) => x.key === a.key) - features.findIndex((x) => x.key === b.key);
        });
    }, [features, packs]);
};

const SlideOffers: React.FC = () => {
    const features = useDiagonalFeatures(baseFeatures, packs);
    return (
        <div className="w-full h-full grid gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Handshake className="size-6 text-emerald-700" />
                    <h2 id="packs" className="text-xl sm:text-2xl font-semibold">
                        Packs sponsoring
                    </h2>
                </div>
                <div className="text-sm text-emerald-900/80">Vue diagonale par niveau</div>
            </div>

            <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
                {/* Tableau compact */}
                <SectionCard>
                    <div className="overflow-x-auto text-sm">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th className="text-left py-2 pr-3 font-semibold">Prestations</th>
                                    {packs.map((p) => (
                                        <th
                                            key={p.name}
                                            className="px-3 py-2 text-center font-semibold text-xs"
                                        >
                                            <div>{p.name}</div>
                                            <div className="text-emerald-700 font-bold">{p.price}</div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {features.map((f, idx) => (
                                    <tr key={f.key} className={idx % 2 ? "bg-emerald-50/40" : ""}>
                                        <td className="py-2 pr-3 whitespace-nowrap">{f.label}</td>
                                        {packs.map((p) => (
                                            <td key={p.name + f.key} className="px-3 py-2 text-center">
                                                {p.grants[f.key] ? (
                                                    <Check className="inline size-4 text-emerald-700" />
                                                ) : (
                                                    <Minus className="inline size-4 text-emerald-300" />
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </SectionCard>

                {/* Pourquoi nous sponsoriser à côté du tableau */}
                <SectionCard className="flex items-start">
                    <div className="flex items-start gap-2">
                        <Info className="mt-1 size-5 text-emerald-700" />
                        <div>
                            <h3 className="font-semibold">Pourquoi nous sponsoriser ?</h3>
                            <ul className="mt-2 space-y-2 text-emerald-900/85 text-sm">
                                <li>🎯 Visibilité utile auprès d’étudiant·e·s & jeunes pros.</li>
                                <li>📸 Contenus authentiques réutilisables sur vos canaux.</li>
                                <li>🤝 Flexibilité : packs ou offre sur-mesure selon objectifs.</li>
                            </ul>
                        </div>
                    </div>
                </SectionCard>
            </div>

            {/* Détail des contreparties sous le tableau (même ordre) */}
            <SectionCard>
                <h3 className="font-semibold">Détail des contreparties</h3>
                <div className="mt-3 grid md:grid-cols-2 gap-4 text-sm text-emerald-900/85">
                    {features.map((f) => (
                        <div key={f.key}>
                            <div className="font-medium">{f.label}</div>
                            <div className="opacity-85">{featureDescriptions[f.key]}</div>
                        </div>
                    ))}
                </div>
            </SectionCard>
        </div>
    );
};

/* ===================== Slide 3 — Contact ===================== */

const SlideContact: React.FC = () => {
    const [sent, setSent] = useState(false);
    const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <div className="w-full h-full grid grid-rows-[auto_1fr] gap-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Mail className="size-6 text-emerald-700" />
                    <h2 className="text-xl sm:text-2xl font-semibold">Nous contacter</h2>
                </div>
                <div className="hidden md:flex items-center gap-6 text-sm text-emerald-900/80">
                    <div className="flex items-center gap-2">
                        <Phone className="size-4" /> +41 78 229 84 51 (Sponsoring)
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <SectionCard>
                    <div className="space-y-4">
                        <div>
                            <div className="text-xs uppercase tracking-wider text-emerald-700/80 font-semibold">
                                Référentes
                            </div>
                            <div className="mt-2 grid sm:grid-cols-2 gap-4 text-emerald-900/90">
                                <div className="rounded-lg border border-emerald-200/70 p-4 bg-white/60">
                                    <div className="font-medium">Chaimaa Ouchicha</div>
                                    <div className="text-sm opacity-80">Responsable sponsoring</div>
                                    <a
                                        className="mt-1 block text-sm underline underline-offset-4"
                                        href="mailto:chaimaa.ouchicha@epfl.ch"
                                    >
                                        chaimaa.ouchicha@epfl.ch
                                    </a>
                                    <div className="text-sm mt-1">+41 78 229 84 51</div>
                                </div>

                                <div className="rounded-lg border border-emerald-200/70 p-4 bg-white/60">
                                    <div className="font-medium">Margot Chapalain</div>
                                    <div className="text-sm opacity-80">Présidente</div>
                                    <a
                                        className="mt-1 block text-sm underline underline-offset-4"
                                        href="mailto:margot.chapalain@epfl.ch"
                                    >
                                        margot.chapalain@epfl.ch
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="text-xs uppercase tracking-wider text-emerald-700/80 font-semibold">
                                Adresse générale
                            </div>
                            <a
                                className="mt-2 inline-flex items-center gap-2 text-emerald-800 underline underline-offset-4"
                                href="mailto:contact@travelgc.ch"
                            >
                                <Mail className="size-4" /> contact@travelgc.ch
                            </a>
                        </div>
                    </div>
                </SectionCard>

                <SectionCard>
                    {sent ? (
                        <div className="h-full grid place-items-center text-center">
                            <div>
                                <div className="mx-auto size-12 grid place-items-center rounded-full bg-emerald-100 mb-4">
                                    <CheckCircle2 className="size-6 text-emerald-700" />
                                </div>
                                <h3 className="text-xl font-semibold">Merci !</h3>
                                <p className="mt-2 text-emerald-900/85">Votre message a bien été enregistré.</p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={onSubmit} className="grid gap-3">
                            <div className="grid md:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm font-medium">Nom de l'entreprise</label>
                                    <input
                                        name="company"
                                        required
                                        className="mt-1 w-full rounded-xl border border-emerald-300/70 px-3 py-2 bg-white/80"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Contact</label>
                                    <input
                                        name="contact"
                                        required
                                        className="mt-1 w-full rounded-xl border border-emerald-300/70 px-3 py-2 bg-white/80"
                                    />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm font-medium">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="mt-1 w-full rounded-xl border border-emerald-300/70 px-3 py-2 bg-white/80"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Type de sponsoring</label>
                                    <select
                                        name="sponsoring_type"
                                        className="mt-1 w-full rounded-xl border border-emerald-300/70 px-3 py-2 bg-white/80"
                                    >
                                        <option>Bronze</option>
                                        <option>Argent</option>
                                        <option>Or</option>
                                        <option>Platine</option>
                                        <option>Personnalisé</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Message</label>
                                <textarea
                                    name="message"
                                    rows={4}
                                    className="mt-1 w-full rounded-xl border border-emerald-300/70 px-3 py-2 bg-white/80"
                                    placeholder="Parlez-nous de vos objectifs…"
                                ></textarea>
                            </div>
                            <label className="inline-flex items-center gap-2 text-sm">
                                <input
                                    name="consent"
                                    type="checkbox"
                                    required
                                    className="rounded border-emerald-300"
                                />
                                J'accepte d'être recontacté·e à propos du sponsoring.
                            </label>
                            <button
                                type="submit"
                                className={cx("mt-2 rounded-xl px-4 py-2 text-sm font-medium", brand.btn.solid)}
                            >
                                Envoyer
                            </button>
                        </form>
                    )}
                </SectionCard>
            </div>
        </div>
    );
};

/* ===================== Controller ===================== */

const slides = [
    { key: "intro", node: <SlideIntro /> },
    { key: "offers", node: <SlideOffers /> },
    { key: "contact", node: <SlideContact /> },
];

export default function SponsorDeck() {
    const [idx, setIdx] = useState(0);
    const next = () => setIdx((i) => Math.min(i + 1, slides.length - 1));
    const prev = () => setIdx((i) => Math.max(i - 1, 0));
    const progress = ((idx + 1) / slides.length) * 100;

    useEffect(() => {
        const h = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
        };
        window.addEventListener("keydown", h);
        return () => window.removeEventListener("keydown", h);
    }, []);

    return (
        <div className={cx("min-h-[100dvh] w-full", brand.bg)}>
            <div className="mx-auto max-w-6xl px-4 py-6 md:py-10">
                {/* Header global */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="size-9 rounded-xl bg-emerald-600 grid place-items-center text-white font-bold">
                            TG
                        </div>
                        <div>
                            <div className="font-semibold">Travel GC</div>
                            <div className="text-xs text-emerald-900/70">Sponsor Deck — Aperçu</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={prev} className={cx("rounded-xl p-2", brand.btn.ghost)} aria-label="Précédent">
                            <ChevronLeft className="size-5" />
                        </button>
                        <button onClick={next} className={cx("rounded-xl p-2", brand.btn.solid)} aria-label="Suivant">
                            <ChevronRight className="size-5" />
                        </button>
                    </div>
                </div>

                {/* barre de progression */}
                <div className="mt-4 h-2 bg-emerald-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-emerald-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    />
                </div>

                {/* Slides (pas de position absolute -> pas de coupe) */}
                <div className="mt-6 md:mt-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={slides[idx].key}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.25 }}
                        >
                            {slides[idx].node}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
