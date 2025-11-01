import React, { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
    Mail,
    Phone,
    CheckCircle2,
    Check,
    Minus,
    Sparkles,
    Handshake,
    Medal,
    Trophy,
    Gem,
} from "lucide-react";

import hero from "../assets/image.jpg";
import img1 from "../assets/visit_megyeri.webp";
import img2 from "../assets/visit_kiskore.jpg"; // ← remplacé: était ../assets/visit_m4.jpg

/* ===================== Constantes ===================== */
const FORM_ENDPOINT = "https://formspree.io/f/xeorerdy";

const cx = (...c: Array<string | false | null | undefined>) =>
    c.filter(Boolean).join(" ");

const brand = {
    bg: "bg-gradient-to-br from-emerald-50 via-white to-teal-50",
    card: "bg-white/70 backdrop-blur-md shadow-lg border border-emerald-100",
    btn: {
        solid:
            "bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white transition-colors",
        ghost: "hover:bg-emerald-50 text-emerald-700",
        outline: "border border-emerald-300 hover:border-emerald-400 text-emerald-700",
    },
};

const Container: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
    className,
    children,
}) => (
    <div className={cx("mx-auto w-full max-w-6xl px-4", className)}>{children}</div>
);

const SectionCard: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
    className,
    children,
}) => (
    <div className={cx("rounded-2xl p-6 md:p-8", brand.card, className)}>{children}</div>
);

/* ===================== Header ===================== */
/* ===================== Header ===================== */
const Header: React.FC = () => {
    return (
        <header className="sticky top-0 z-40 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50 border-b border-emerald-100">
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:absolute focus:m-3 focus:rounded-lg focus:bg-emerald-700 focus:px-3 focus:py-2 focus:text-white"
            >
                Aller au contenu
            </a>
            <Container className="py-3 md:py-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Logo monogramme → GC */}
                        <div
                            className="size-9 shrink-0 rounded-xl bg-emerald-600 grid place-items-center text-white font-extrabold tracking-tight"
                            aria-label="Travel GC"
                            title="Travel GC"
                        >
                            GC
                        </div>
                        <div className="min-w-0">
                            <div className="font-semibold truncate">Travel GC</div>
                            <div className="text-xs text-emerald-900/70 truncate">
                                Partenaires du voyage
                            </div>
                        </div>
                    </div>

                    <nav className="hidden md:flex items-center gap-1">
                        <a
                            href="#visites"
                            className={cx("rounded-xl px-3 py-2 text-sm font-medium", brand.btn.ghost)}
                        >
                            Visites GC
                        </a>
                        <a
                            href="#packs"
                            className={cx("rounded-xl px-3 py-2 text-sm font-medium", brand.btn.ghost)}
                        >
                            Packs
                        </a>
                        <a
                            href="#contact"
                            className={cx("rounded-xl px-3 py-2 text-sm font-medium", brand.btn.solid)}
                        >
                            Nous contacter
                        </a>
                    </nav>

                    {/* CTA mobile */}
                    <a
                        href="#contact"
                        className={cx("md:hidden rounded-xl px-3 py-2 text-sm font-medium", brand.btn.solid)}
                    >
                        Contact
                    </a>
                </div>
            </Container>
        </header>
    );
};

/* ===================== Section 1 — Intro ===================== */
const SectionIntro: React.FC = () => {
    const reduceMotion = useReducedMotion();

    return (
        <SectionCard className="relative overflow-hidden">
            {/* blobs doux */}
            <motion.div
                initial={reduceMotion ? false : { scale: 0.85, opacity: 0 }}
                whileInView={reduceMotion ? {} : { scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-emerald-200/40 blur-2xl"
            />
            <motion.div
                initial={reduceMotion ? false : { scale: 0.85, opacity: 0 }}
                whileInView={reduceMotion ? {} : { scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                aria-hidden="true"
                className="pointer-events-none absolute -left-10 -bottom-10 size-52 rounded-full bg-teal-200/40 blur-2xl"
            />

            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
                {/* Texte gauche */}
                <div>
                    <div className="inline-flex items-center gap-2 text-xs md:text-sm font-medium px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800">
                        <Sparkles className="size-4" />
                        Voyage d’étude du Génie civil EPFL
                    </div>
                    <h1 className="mt-3 text-3xl md:text-5xl font-extrabold leading-tight">
                        Sponsoring Travel GC EPFL
                    </h1>
                    <div
                        className="mt-1 text-2xl md:text-3xl select-none"
                        aria-hidden="true"
                    >
                        🤝🌍
                    </div>
                    <p className="mt-4 text-emerald-900/85 leading-relaxed text-[15px] md:text-base">
                        Nous organisons le voyage d’étude des étudiant·e·s de{" "}
                        <b>3e année Bachelor en Génie Civil</b> à l’EPFL. Du{" "}
                        <b>5 au 13 juillet 2025</b>, notre destination sera <b>Budapest</b> :
                        une ville riche en architecture, en histoire et en ouvrages
                        d’ingénierie.
                    </p>

                    {/* petites bulles */}
                    <div className="mt-5 grid sm:grid-cols-2 gap-4">
                        <div className="rounded-xl border border-emerald-200/70 p-4 bg-white/70">
                            <div className="text-[11px] md:text-xs uppercase tracking-wider text-emerald-700/80 font-semibold">
                                Qui sommes-nous ?
                            </div>
                            <p className="mt-2 text-emerald-900/90 text-[15px] md:text-base leading-relaxed">
                                Une association dynamique regroupant les étudiant·e·s de la
                                section Génie Civil à l’EPFL, avec l’envie de découvrir notre
                                domaine sous un angle culturel, technique et humain.
                            </p>
                        </div>
                        <div className="rounded-xl border border-emerald-200/70 p-4 bg-white/70">
                            <div className="text-[11px] md:text-xs uppercase tracking-wider text-emerald-700/80 font-semibold">
                                Notre but
                            </div>
                            <p className="mt-2 text-emerald-900/90 text-[15px] md:text-base leading-relaxed">
                                Rendre ce voyage accessible à tou·te·s, en associant la{" "}
                                <b>découverte technique</b> à l’<b>expérience collective</b>. Nous
                                aimerions partager cette aventure avec vous comme partenaires.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Visuel droite */}
                <div className="relative">
                    <div className="aspect-[4/3] sm:aspect-[1/1] w-full overflow-hidden rounded-2xl border border-emerald-200/70 bg-white/60">
                        <img
                            src={hero}
                            alt="Aperçu du voyage Travel GC"
                            className="h-full w-full object-cover"
                            loading="lazy"
                            decoding="async"
                            sizes="(min-width:1024px) 560px, (min-width:640px) 60vw, 100vw"
                        />
                    </div>
                </div>
            </div>
        </SectionCard>
    );
};

/* ===================== Section 1.5 — Visites GC ===================== */
type Visit = {
    key: string;
    title: string;
    blurb: string;
    img: string;
};

const visits: Visit[] = [
    {
        key: "kiskore",
        title: "Barrage hydroélectrique de Kisköre (Tisza)",
        blurb:
            "Hydraulic & energy engineering : barrage à basse chute, turbines Kaplan, dissipation d’énergie et régulation des crues. Focus géotechnique sur la fondation, drainage et contrôle des pressions interstitielles.",
        img: img2,
    },
    {
        key: "megyeri",
        title: "Pont Megyeri au-dessus du Danube",
        blurb:
            "Grand pont haubané : efforts dans les câbles, stabilité dynamique, esthétique des grandes portées et coordination ingénierie/architecture.",
        img: img1,
    },
];

const SectionVisits: React.FC = () => (
    <section id="visites" className="scroll-mt-24">
        <div className="grid gap-6">
            <div className="flex items-center gap-2">
                <Sparkles className="size-6 text-emerald-700" />
                <h2 className="text-xl sm:text-2xl font-semibold">Nos visites génie civil</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {visits.map((v) => (
                    <SectionCard key={v.key}>
                        <div className="space-y-3 text-[15px] md:text-base leading-relaxed">
                            <div className="text-base font-semibold md:text-lg">{v.title}</div>
                            <p className="text-emerald-900/85">{v.blurb}</p>
                            <div className="overflow-hidden rounded-xl border border-emerald-200/70">
                                <img
                                    src={v.img}
                                    alt={v.title}
                                    className="w-full h-48 md:h-56 object-cover"
                                    loading="lazy"
                                    decoding="async"
                                    sizes="(min-width:768px) 50vw, 100vw"
                                />
                            </div>
                        </div>
                    </SectionCard>
                ))}
            </div>
        </div>
    </section>
);

/* ===================== Packs sponsoring — données & UI ===================== */

/* ===================== Packs sponsoring — données & UI complètes ===================== */

type Feature = { key: string; label: string };

const baseFeatures: Feature[] = [
    { key: "credits", label: "Mention officielle" },
    { key: "flyers", label: "Flyers" },
    { key: "logo_i", label: "Logo affiches" },
    { key: "salle", label: "Affiche salle GC" },
    { key: "presentation_instagram", label: "Post Instagram" },
    { key: "logo_ii", label: "Logo officiel" },
    { key: "distribution", label: "Produits offerts" },
    { key: "drapeau", label: "Bannière" },
    { key: "pull", label: "Logo maillot" },
    { key: "presentation_cours", label: "Présentation cours" },  // Or
    { key: "conference_epfl", label: "Conférence EPFL" },     // Platine
    { key: "titre_pp", label: "Partenaire principal" },
];

const featureDescriptions: Record<string, string> = {
    credits: "Remerciements officiels dans nos communications.",
    flyers: "Présence de vos supports dans notre salle de vie.",
    logo_i: "Logo sur nos affiches d’événements (format standard).",
    salle: "Affichage dans la salle de vie de la section GC.",
    presentation_instagram: "Publication dédiée sur @travel__gc.",
    logo_ii: "Logo sur l’ensemble de nos supports officiels.",
    distribution: "Produits/échantillons offerts lors d’événements.",
    drapeau: "Bannière/roll-up mis en avant sur site.",
    pull: "Logo sur les maillots de foot officiels.",
    presentation_cours: "Intervention ~45' pendant un cours (Q&A inclus).",
    conference_epfl: "Conférence ouverte à l’ensemble du campus EPFL.",
    titre_pp: "Statut de partenaire principal du voyage.",
};

type Pack = { name: string; price: string; grants: Record<string, boolean> };

/* Progression validée
   Bronze = crédits, flyers, logo I
   Argent = Bronze + salle, insta, logo II
   Or     = Argent + distribution, maillot, bannière, présentation cours
   Platine= Or + partenaire principal, conférence EPFL
*/
const packs: Pack[] = [
    {
        name: "Bronze",
        price: "CHF 1'000",
        grants: {
            credits: true, flyers: true, logo_i: true,
            salle: false, presentation_instagram: false, logo_ii: false,
            distribution: false, drapeau: false, pull: false, presentation_cours: false,
            conference_epfl: false, titre_pp: false,
        },
    },
    {
        name: "Argent",
        price: "CHF 2'500",
        grants: {
            credits: true, flyers: true, logo_i: true,
            salle: true, presentation_instagram: true, logo_ii: true,
            distribution: false, drapeau: false, pull: false, presentation_cours: false,
            conference_epfl: false, titre_pp: false,
        },
    },
    {
        name: "Or",
        price: "CHF 5'000",
        grants: {
            credits: true, flyers: true, logo_i: true,
            salle: true, presentation_instagram: true, logo_ii: true,
            distribution: true, drapeau: true, pull: true, presentation_cours: true,
            conference_epfl: false, titre_pp: false,
        },
    },
    {
        name: "Platine",
        price: "CHF 7'500",
        grants: {
            credits: true, flyers: true, logo_i: true,
            salle: true, presentation_instagram: true, logo_ii: true,
            distribution: true, drapeau: true, pull: true, presentation_cours: true,
            conference_epfl: true, titre_pp: true,
        },
    },
];

/* ——— Icônes par pack ——— */
type IconComp = React.ComponentType<React.SVGProps<SVGSVGElement>>;
const packMeta: Record<string, { Icon: IconComp; bubble: string; ring: string }> = {
    Bronze: { Icon: Medal, bubble: "bg-amber-100 text-amber-700", ring: "ring-amber-200" },
    Argent: { Icon: Medal, bubble: "bg-zinc-100 text-zinc-700", ring: "ring-zinc-200" },
    Or: { Icon: Trophy, bubble: "bg-yellow-100 text-yellow-700", ring: "ring-yellow-200" },
    Platine: { Icon: Gem, bubble: "bg-sky-100 text-sky-700", ring: "ring-sky-200" },
};

const PackIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
    const meta = packMeta[name] ?? packMeta.Bronze;
    const { Icon, bubble, ring } = meta;
    return (
        <div className={cx("size-9 md:size-10 grid place-items-center rounded-xl ring-1", bubble, ring, className)} aria-hidden="true">
            <Icon className="size-5 md:size-6" />
        </div>
    );
};

/* ——— Tri diagonal pour lisibilité ——— */
const useDiagonalFeatures = (features: Feature[], packs: Pack[]) =>
    React.useMemo(() => {
        const firstIdx: Record<string, number> = {};
        features.forEach((f) => {
            let i0 = packs.length;
            packs.forEach((p, i) => {
                if (p.grants[f.key]) i0 = Math.min(i0, i);
            });
            firstIdx[f.key] = i0;
        });
        return [...features].sort((a, b) => {
            if (firstIdx[a.key] !== firstIdx[b.key]) return firstIdx[a.key] - firstIdx[b.key];
            return features.findIndex((x) => x.key === a.key) - features.findIndex((x) => x.key === b.key);
        });
    }, [features, packs]);

/* ===================== Section — Packs ===================== */
const SectionOffers: React.FC = () => {
    const features = useDiagonalFeatures(baseFeatures, packs);

    return (
        <section id="packs" className="scroll-mt-24">
            <div className="grid gap-6">
                {/* Titre */}
                <div className="flex items-center gap-2">
                    <Handshake className="size-6 text-emerald-700" />
                    <h2 className="text-xl sm:text-2xl font-semibold">Packs sponsoring</h2>
                </div>

                {/* ===== Cartes (mobile-first) ===== */}
                <div className="grid gap-4 md:hidden">
                    {packs.map((p, packIndex) => (
                        <SectionCard key={p.name} className="divide-y divide-emerald-100">
                            <div className="flex items-center justify-between pb-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <PackIcon name={p.name} />
                                    <div className="text-lg font-semibold truncate">{p.name}</div>
                                </div>
                                <div className="text-emerald-700 font-bold">{p.price}</div>
                            </div>

                            <ul className="pt-3 grid gap-2 text-[15px] text-emerald-900/90">
                                {features.map((f) => {
                                    const available = p.grants[f.key];
                                    const prevAvailable = packIndex > 0 ? packs[packIndex - 1].grants[f.key] : false;

                                    const textClass = !available
                                        ? "text-emerald-400/60"
                                        : !prevAvailable
                                            ? "font-semibold text-emerald-900" // nouveau dans ce pack
                                            : "text-emerald-800";              // déjà inclus avant

                                    const iconClass = !available ? "text-emerald-300" : "text-emerald-700";

                                    return (
                                        <li key={f.key} className="flex items-center justify-between">
                                            <span className={cx("pr-3", textClass)}>{f.label}</span>
                                            {available ? (
                                                <Check className={cx("size-4 shrink-0", iconClass)} />
                                            ) : (
                                                <Minus className={cx("size-4 shrink-0", iconClass)} />
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </SectionCard>
                    ))}
                </div>

                {/* ===== Tableau (desktop/tablette) ===== */}
                <div className="hidden md:grid lg:grid-cols-[2fr_1fr] gap-6">
                    {/* Tableau comparatif */}
                    <SectionCard>
                        <div className="overflow-x-auto text-sm">
                            <table className="min-w-full">
                                <thead>
                                    <tr>
                                        <th className="text-left py-2 pr-3 font-medium whitespace-nowrap">
                                            Prestations
                                        </th>
                                        {packs.map((p) => (
                                            <th
                                                key={p.name}
                                                className="px-3 py-3 text-center font-semibold text-xs whitespace-nowrap align-top"
                                            >
                                                <div className="flex flex-col items-center gap-1">
                                                    <PackIcon name={p.name} />
                                                    <div className="mt-1">{p.name}</div>
                                                    <div className="text-emerald-700 font-bold">{p.price}</div>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {features.map((f, rowIdx) => (
                                        <tr
                                            key={f.key}
                                            className={rowIdx % 2 ? "bg-emerald-50/40" : ""}
                                        >
                                            {/* colonne de gauche — pas en gras */}
                                            <td className="py-2 pr-3 whitespace-nowrap text-emerald-900/90">
                                                {f.label}
                                            </td>

                                            {/* cellules packs : icônes seules */}
                                            {packs.map((p, packIndex) => {
                                                const available = p.grants[f.key];
                                                const prevAvailable =
                                                    packIndex > 0 ? packs[packIndex - 1].grants[f.key] : false;

                                                const colorClass = !available
                                                    ? "text-emerald-300"
                                                    : !prevAvailable
                                                        ? "text-emerald-900" // nouveau → plus foncé
                                                        : "text-emerald-700"; // déjà inclus → normal

                                                const strokeWidth = !available ? 1.6 : !prevAvailable ? 2.6 : 2.0;

                                                return (
                                                    <td key={p.name + f.key} className="px-3 py-2 text-center">
                                                        {available ? (
                                                            <Check
                                                                className={cx("inline size-5", colorClass)}
                                                                strokeWidth={strokeWidth}
                                                                aria-label={`${f.label} — inclus${!prevAvailable ? " (nouveau)" : ""}`}
                                                            />
                                                        ) : (
                                                            <Minus
                                                                className={cx("inline size-5", colorClass)}
                                                                strokeWidth={strokeWidth}
                                                                aria-label={`${f.label} — non inclus`}
                                                            />
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Légende + note */}
                        <div className="mt-2 text-xs italic text-emerald-900/70">
                            * Pour les descriptions détaillées, voir la section <span className="font-medium">« Détail des prestations »</span> ci-dessous.
                        </div>
                        <div className="mt-2 text-xs italic text-emerald-900/70">
                            * Un seul packs diamant disponible
                        </div>
                    </SectionCard>

                    {/* Pourquoi nous sponsoriser — inchangé */}
                    <SectionCard className="space-y-4">
                        <div className="rounded-2xl bg-rose-600 text-white text-center font-semibold px-4 py-2">
                            Pourquoi nous sponsoriser ?
                        </div>
                        <div className="rounded-2xl bg-teal-800/90 text-white px-4 py-4">
                            <div className="text-center">
                                Le Travel GC a <b>besoin de vous</b> pour rendre ce voyage accessible au plus grand nombre !
                            </div>
                        </div>
                        <div>
                            <div className="font-semibold text-lg">Une opportunité pour…</div>
                            <ul className="mt-3 space-y-2 text-emerald-900/90 text-[15px]">
                                <li>• Se faire connaître auprès des <b>350 étudiant·e·s</b> de la section Génie Civil.</li>
                                <li>• Gagner en visibilité sur le campus (affiches, salle de vie) & événements.</li>
                                <li>• Valoriser votre marque sur nos <b>maillots</b> et supports officiels.</li>
                            </ul>
                        </div>
                    </SectionCard>
                </div>
                {/* Détail des contreparties */}
                <SectionCard>
                    <h3 className="font-semibold">Détail des prestations</h3>
                    <div className="mt-3 grid md:grid-cols-2 gap-4 text-[15px] md:text-base text-emerald-900/85">
                        {baseFeatures.map((f) => (
                            <div key={f.key}>
                                <div className="font-medium">{f.label}</div>
                                <div className="opacity-85">{featureDescriptions[f.key]}</div>
                            </div>
                        ))}
                    </div>
                </SectionCard>
            </div>
        </section>
    );
};

/* ===================== Section 3 — Contact ===================== */
const SectionContact: React.FC = () => {
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setError(null);

        const form = e.currentTarget;
        const fd = new FormData(form);

        // métadonnées utiles
        fd.append("_subject", "Nouveau sponsoring — Travel GC");
        fd.append("page_url", window.location.href);

        try {
            const res = await fetch(FORM_ENDPOINT, {
                method: "POST",
                headers: { Accept: "application/json" },
                body: fd,
            });

            if (res.ok) {
                setSent(true);
                form.reset();
            } else {
                const data = await res.json().catch(() => null);
                const msg =
                    data?.errors?.[0]?.message || "Impossible d'envoyer le formulaire.";
                setError(msg);
            }
        } catch {
            setError("Désolé, l’envoi a échoué. Réessayez plus tard.");
        }
    };

    return (
        <section id="contact" className="scroll-mt-24">
            <div className="grid grid-rows-[auto_1fr] gap-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Mail className="size-6 text-emerald-700" />
                        <h2 className="text-xl sm:text-2xl font-semibold">Nous contacter</h2>
                    </div>
                    <div className="hidden md:flex items-center gap-6 text-sm text-emerald-900/80">
                        <div className="flex items-center gap-2">
                            <Phone className="size-4" />{" "}
                            <a href="tel:+41782298451" className="hover:underline">
                                +41 78 123 45 67
                            </a>{" "}
                            (Sponsoring)
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    <SectionCard>
                        <div className="space-y-4">
                            <div>
                                <div className="text-[11px] md:text-xs uppercase tracking-wider text-emerald-700/80 font-semibold">
                                    Référentes
                                </div>
                                <div className="mt-2 grid sm:grid-cols-2 gap-4 text-emerald-900/90">
                                    <div className="rounded-lg border border-emerald-200/70 p-4 bg-white/60">
                                        <div className="font-medium">Luca Tufo</div>
                                        <div className="text-sm opacity-80">Responsable sponsoring</div>
                                        <a
                                            className="mt-1 block text-sm underline underline-offset-4 break-all"
                                            href="mailto:luca.tufo@epfl.ch"
                                        >
                                            luca.tufo@epfl.ch
                                        </a>
                                        <div className="text-sm mt-1">
                                            <a href="tel:+41791234567" className="hover:underline">
                                                +41 79 123 45 67
                                            </a>
                                        </div>
                                    </div>

                                    <div className="rounded-lg border border-emerald-200/70 p-4 bg-white/60">
                                        <div className="font-medium">Charlotte Maître</div>
                                        <div className="text-sm opacity-80">Présidente</div>
                                        <a
                                            className="mt-1 block text-sm underline underline-offset-4 break-all"
                                            href="mailto:charlotte.maitre@epfl.ch"
                                        >
                                            charlotte.maitre@epfl.ch
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="text-[11px] md:text-xs uppercase tracking-wider text-emerald-700/80 font-semibold">
                                    Adresse générale
                                </div>
                                <a
                                    className="mt-2 inline-flex items-center gap-2 text-emerald-800 underline underline-offset-4 break-all"
                                    href="mailto:travelgc@epfl.ch"
                                >
                                    <Mail className="size-4" /> travelgc@epfl.ch
                                </a>
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard>
                        <div aria-live="polite" aria-atomic="true">
                            {sent ? (
                                <div className="h-full grid place-items-center text-center">
                                    <div>
                                        <div className="mx-auto size-12 grid place-items-center rounded-full bg-emerald-100 mb-4">
                                            <CheckCircle2 className="size-6 text-emerald-700" />
                                        </div>
                                        <h3 className="text-xl font-semibold">Merci !</h3>
                                        <p className="mt-2 text-emerald-900/85">
                                            Votre message a bien été enregistré.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={onSubmit} className="grid gap-3" noValidate>
                                    {/* Honeypot anti-spam */}
                                    <input
                                        name="_gotcha"
                                        className="hidden"
                                        tabIndex={-1}
                                        autoComplete="off"
                                    />

                                    <div className="grid md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-sm font-medium" htmlFor="company">
                                                Nom de l'entreprise
                                            </label>
                                            <input
                                                id="company"
                                                name="company"
                                                required
                                                className="mt-1 w-full rounded-xl border border-emerald-300/70 px-3 py-2 bg-white/80"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium" htmlFor="contact">
                                                Contact
                                            </label>
                                            <input
                                                id="contact"
                                                name="contact"
                                                required
                                                className="mt-1 w-full rounded-xl border border-emerald-300/70 px-3 py-2 bg-white/80"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-sm font-medium" htmlFor="email">
                                                Email
                                            </label>
                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                className="mt-1 w-full rounded-xl border border-emerald-300/70 px-3 py-2 bg-white/80"
                                                inputMode="email"
                                                autoComplete="email"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium" htmlFor="sponsoring_type">
                                                Type de sponsoring
                                            </label>
                                            <select
                                                id="sponsoring_type"
                                                name="sponsoring_type"
                                                className="mt-1 w-full rounded-xl border border-emerald-300/70 px-3 py-2 bg-white/80"
                                                defaultValue="Bronze"
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
                                        <label className="text-sm font-medium" htmlFor="message">
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={4}
                                            className="mt-1 w-full rounded-xl border border-emerald-300/70 px-3 py-2 bg-white/80"
                                            placeholder="Parlez-nous de vos objectifs…"
                                        />
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

                                    {/* message d’erreur discret (si besoin) */}
                                    {error && <div className="text-sm text-red-600">{error}</div>}

                                    <button
                                        type="submit"
                                        className={cx(
                                            "mt-2 rounded-xl px-4 py-2 text-sm font-medium",
                                            brand.btn.solid
                                        )}
                                    >
                                        Envoyer
                                    </button>
                                </form>
                            )}
                        </div>
                    </SectionCard>
                </div>
            </div>
        </section>
    );
};

/* ===================== Page ===================== */
export default function SponsorPage() {
    // Défilement doux (CSS requis côté app : html{scroll-behavior:smooth})
    return (
        <div className={cx("min-h-[100dvh] w-full", brand.bg)}>
            <Header />
            <main id="main">
                <Container className="py-6 md:py-10">
                    <div className="grid gap-8 md:gap-10">
                        <SectionIntro />
                        <SectionVisits />
                        <SectionOffers />
                        <SectionContact />
                    </div>
                </Container>
            </main>
            <footer className="mt-10 border-t border-emerald-100/70">
                <Container className="py-6 text-center text-sm text-emerald-900/70">
                    © {new Date().getFullYear()} Travel GC — Suivez-nous sur{" "}
                    <a
                        className="underline underline-offset-4 hover:text-emerald-700"
                        href="https://instagram.com/@travel__gc"
                        target="_blank"
                        rel="noreferrer"
                    >
                        @travel__gc
                    </a>
                </Container>
            </footer>
        </div>
    );
}
