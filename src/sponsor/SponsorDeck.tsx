import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    Mail,
    Phone,
    CheckCircle2,
    Check,
    Minus,
    Sparkles,
    Handshake,
} from "lucide-react";
import hero from "../assets/image.jpg"; // ← image importée depuis src/assets
import img1 from "../assets/visit_megyeri.jpg";
import img2 from "../assets/visit_m4.jpg";

const FORM_ENDPOINT = "https://formspree.io/f/xeorerdy";

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

const SectionCard: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
    className,
    children,
}) => (
    <div className={cx("rounded-2xl p-6 md:p-8", brand.card, className)}>{children}</div>
);

/* ===================== Section 1 — Intro (réécrite) ===================== */
const SectionIntro: React.FC = () => (
    <SectionCard className="relative overflow-hidden">
        {/* blobs doux */}
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="absolute -right-16 -top-16 size-64 rounded-full bg-emerald-200/40 blur-2xl"
        />
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="absolute -left-10 -bottom-10 size-52 rounded-full bg-teal-200/40 blur-2xl"
        />

        <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            {/* Texte gauche */}
            <div>
                <div className="inline-flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800">
                    <Sparkles className="size-4" />
                    Voyage d’étude du Génie civil EPFL
                </div>
                <h1 className="mt-3 text-3xl md:text-5xl font-extrabold leading-tight">
                    Travel GC - Sponsor
                </h1>
                <div className="mt-1 text-2xl md:text-3xl select-none" aria-hidden="true">
                    🤝🌍
                </div>
                <p className="mt-4 text-emerald-900/85 leading-relaxed">
                    Nous organisons le voyage d’étude des étudiant·e·s de <b>3e année Bachelor en Génie Civil</b> à l’EPFL.
                    Du <b>7 au 15 juillet 2025</b>, notre destination sera <b>Budapest</b> : une ville riche en
                    architecture, en histoire et en ouvrages d’ingénierie.
                </p>

                {/* petites bulles */}
                <div className="mt-5 grid sm:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-emerald-200/70 p-4 bg-white/70">
                        <div className="text-xs uppercase tracking-wider text-emerald-700/80 font-semibold">
                            Qui sommes-nous ?
                        </div>
                        <p className="mt-2 text-emerald-900/90">
                            Une association dynamique regroupant les étudiant·e·s de la section Génie Civil à l’EPFL,
                            avec l’envie de découvrir notre domaine sous un angle culturel, technique et humain.
                        </p>
                    </div>
                    <div className="rounded-xl border border-emerald-200/70 p-4 bg-white/70">
                        <div className="text-xs uppercase tracking-wider text-emerald-700/80 font-semibold">
                            Notre but
                        </div>
                        <p className="mt-2 text-emerald-900/90">
                            Rendre ce voyage accessible à tou·te·s, en associant la <b>découverte technique</b> à
                            l’<b>expérience collective</b>. Nous aimons partager cette aventure avec nos partenaires.
                        </p>
                    </div>
                </div>
            </div>

            {/* Visuel droite */}
            <div className="relative">
                <div className="aspect-[1/1] w-full overflow-hidden rounded-2xl border border-emerald-200/70 bg-white/60">
                    <img src={hero} alt="Travel GC aperçu du voyage" className="h-full w-full object-cover" />
                </div>
            </div>
        </div>
    </SectionCard>
);

/* ===================== Section 1.5 — Visites GC (Budapest) ===================== */
type Visit = {
    key: string;
    title: string;
    blurb: string;
    leads: string[];
    notes?: string;
};

const visits = [
    {
        key: "m4",
        title: "Ligne M4 du métro de Budapest",
        blurb:
            "Cette visite illustre nos cours de géotechnique et de structures souterraines : parois moulées, creusement en top-down, intégration urbaine et contraintes de sol. C’est l’occasion de découvrir comment théorie et pratique se rejoignent dans un projet d’infrastructure majeur.",
        img: img2,
    },
    {
        key: "megyeri",
        title: "Pont Megyeri au dessus du Danube",
        blurb:
            "Ce pont haubané spectaculaire relie les rives nord de Budapest. Il incarne les principes étudiés dans nos cours de statique et de conception des structures : efforts dans les câbles, stabilité dynamique, et esthétique des grandes portées. Sa visite permettrait de comprendre la coordination entre ingénierie et architecture sur un ouvrage d’envergure nationale.",
        img: img1,
    },
] as const;


const SectionVisits: React.FC = () => (
    <div className="grid gap-6">
        <div className="flex items-center gap-2">
            <Sparkles className="size-6 text-emerald-700" />
            <h2 className="text-xl sm:text-2xl font-semibold">Nos visites génie civil</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            {visits.map((v) => (
                <SectionCard key={v.key}>
                    <div className="space-y-3 text-sm md:text-[15px] leading-relaxed">
                        <div className="text-base font-semibold md:text-lg">{v.title}</div>
                        <p className="text-emerald-900/85">{v.blurb}</p>
                        <div className="overflow-hidden rounded-xl border border-emerald-200/70">
                            <img
                                src={v.img}
                                alt={v.title}
                                className="w-full h-48 md:h-56 object-cover"
                            />
                        </div>
                    </div>
                </SectionCard>
            ))}
        </div>
    </div>
);

/* ===================== Données (ex Slide 2) ===================== */

type Feature = { key: string; label: string };
const baseFeatures: Feature[] = [
    { key: "credits", label: "Crédits" },
    { key: "flyers", label: "Flyers" },
    { key: "logo_i", label: "Logo type I" },
    { key: "salle", label: "Salle de vie" },
    { key: "presentation", label: "Présentation (Instagram)" },
    { key: "logo_ii", label: "Logo type II" },
    { key: "distribution", label: "Distribution" },
    { key: "drapeau", label: "Drapeau événement" },
    { key: "pull", label: "Pull (logo)" },
    { key: "titre_pp", label: "Titre de partenaire principal" },
    { key: "conference", label: "Conférence (EPFL)" },
];

const featureDescriptions: Record<string, string> = {
    credits:
        "En tant que sponsor, votre entreprise sera honorée dans toutes nos annonces et remerciements publics.",
    flyers: "Vos flyers seront soigneusement présentés dans notre salle de vie.",
    logo_i:
        "Votre logo figure sur nos affiches d’événements, renforçant votre visibilité sur le campus.",
    distribution: "Si vous avez des produits, nous les distribuons lors de nos événements.",
    pull: "Votre logo apparaît sur notre pull de section.",
    logo_ii:
        "Votre logo figure sur toutes nos annonces d’événements (affiches & réseaux) et sur le drapeau de l’AEGC.",
    salle:
        "Affichage promotionnel dans notre salle de vie (stages, offres, infos entreprise).",
    presentation:
        "Publication dédiée à votre entreprise sur notre compte Instagram (@travel__gc).",
    drapeau: "Bannière/roll-up mise en avant lors de nos événements.",
    titre_pp:
        "Mention partenaire principal du Travel GC + remerciements spéciaux pendant les événements.",
    conference:
        "Organisation d’une conférence à l’EPFL pour présenter votre entreprise et échanger avec les étudiant·e·s.",
};

type Pack = { name: string; price: string; grants: Record<string, boolean> };
const packs: Pack[] = [
    {
        name: "Bronze",
        price: "CHF 1'000",
        grants: {
            credits: true,
            flyers: true,
            logo_i: true,
            salle: true,
            presentation: true,

            logo_ii: false,
            distribution: false,
            drapeau: false,
            pull: false,
            titre_pp: false,
            conference: false,
        },
    },
    {
        name: "Argent",
        price: "CHF 2'500",
        grants: {
            credits: true,
            flyers: true,
            logo_i: true,
            salle: true,
            presentation: true,

            logo_ii: true,
            distribution: true,
            drapeau: true,
            pull: false,
            titre_pp: false,
            conference: false,
        },
    },
    {
        name: "Or",
        price: "CHF 5'000",
        grants: {
            credits: true,
            flyers: true,
            logo_i: true,
            salle: true,
            presentation: true,

            logo_ii: true,
            distribution: true,
            drapeau: true,
            pull: true,
            titre_pp: false,
            conference: false,
        },
    },
    {
        name: "Platine",
        price: "CHF 7'500",
        grants: {
            credits: true,
            flyers: true,
            logo_i: true,
            salle: true,
            presentation: true,

            logo_ii: true,
            distribution: true,
            drapeau: true,
            pull: true,
            titre_pp: true,
            conference: true,
        },
    },
];

const useDiagonalFeatures = (features: Feature[], packs: Pack[]) =>
    useMemo(() => {
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
            return (
                features.findIndex((x) => x.key === a.key) -
                features.findIndex((x) => x.key === b.key)
            );
        });
    }, [features, packs]);

/* ===================== Section 2 — Packs (ex Slide 2) ===================== */
const SectionOffers: React.FC = () => {
    const features = useDiagonalFeatures(baseFeatures, packs);
    return (
        <div className="grid gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Handshake className="size-6 text-emerald-700" />
                    <h2 id="packs" className="text-xl sm:text-2xl font-semibold">
                        Packs sponsoring
                    </h2>
                </div>
            </div>

            <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
                {/* Tableau */}
                <SectionCard>
                    <div className="overflow-x-auto text-sm">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th className="text-left py-2 pr-3 font-semibold">Prestations</th>
                                    {packs.map((p) => (
                                        <th key={p.name} className="px-3 py-2 text-center font-semibold text-xs">
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
                                                    <Minus className="inline size-4 text-emerald-300" />)
                                                }
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* petite note sous le tableau */}
                    <div className="mt-2 text-xs italic text-emerald-900/70">
                        * Pour plus de précision, voir <span className="font-medium">« Détail des contreparties »</span> ci-dessous.
                    </div>
                </SectionCard>

                {/* Pourquoi nous sponsoriser — version PDF */}
                <SectionCard className="space-y-4">
                    <div className="rounded-2xl bg-rose-600 text-white text-center font-semibold px-4 py-2">
                        Pourquoi nous sponsoriser ?
                    </div>
                    <div className="rounded-2xl bg-teal-800/90 text-white px-4 py-4">
                        <div className="text-center">
                            Le Travel GC a <b>besoin de vous</b> pour rendre ce voyage
                            accessible au plus grand nombre d’entre nous !
                        </div>
                    </div>
                    <div>
                        <div className="font-semibold text-lg">Une opportunité pour…</div>
                        <ul className="mt-3 space-y-2 text-emerald-900/90">
                            <li>• Se faire connaître auprès des <b>450 étudiant·e·s</b> de la section Génie Civil.</li>
                            <li>
                                • Bénéficier de visibilité sur le campus (affiches dans notre salle de vie) et lors de nos
                                événements (week-end ski GC, stand à Balélec, etc.).
                            </li>
                            <li>• Une visibilité garantie avec votre <b>logo sur nos pulls</b> de section.</li>
                        </ul>
                    </div>
                </SectionCard>
            </div>

            {/* Détail des contreparties (même ordre que le tableau) */}
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

/* ===================== Section 3 — Contact (ex Slide 3) ===================== */
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
                const msg = data?.errors?.[0]?.message || "Impossible d'envoyer le formulaire.";
                setError(msg);
            }
        } catch (_) {
            setError("Désolé, l’envoi a échoué. Réessayez plus tard.");
        }
    };

    return (
        <div className="grid grid-rows-[auto_1fr] gap-6">
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
                                    <a className="mt-1 block text-sm underline underline-offset-4" href="mailto:chaimaa.ouchicha@epfl.ch">
                                        chaimaa.ouchicha@epfl.ch
                                    </a>
                                    <div className="text-sm mt-1">+41 78 229 84 51</div>
                                </div>

                                <div className="rounded-lg border border-emerald-200/70 p-4 bg-white/60">
                                    <div className="font-medium">Margot Chapalain</div>
                                    <div className="text-sm opacity-80">Présidente</div>
                                    <a className="mt-1 block text-sm underline underline-offset-4" href="mailto:margot.chapalain@epfl.ch">
                                        margot.chapalain@epfl.ch
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="text-xs uppercase tracking-wider text-emerald-700/80 font-semibold">
                                Adresse générale
                            </div>
                            <a className="mt-2 inline-flex items-center gap-2 text-emerald-800 underline underline-offset-4" href="mailto:contact@travelgc.ch">
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
                        <form onSubmit={onSubmit} className="grid gap-3" noValidate>
                            {/* Honeypot anti-spam */}
                            <input name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />

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
                                />
                            </div>

                            <label className="inline-flex items-center gap-2 text-sm">
                                <input name="consent" type="checkbox" required className="rounded border-emerald-300" />
                                J'accepte d'être recontacté·e à propos du sponsoring.
                            </label>

                            {/* message d’erreur discret (si besoin) */}
                            {error && <div className="text-sm text-red-600">{error}</div>}

                            <button type="submit" className={cx("mt-2 rounded-xl px-4 py-2 text-sm font-medium", brand.btn.solid)}>
                                Envoyer
                            </button>
                        </form>
                    )}
                </SectionCard>
            </div>
        </div>
    );
};

/* ===================== Page unique ===================== */
export default function SponsorPage() {
    return (
        <div className={cx("min-h-[100dvh] w-full", brand.bg)}>
            <div className="mx-auto max-w-6xl px-4 py-6 md:py-10">
                {/* Header global (conservé, mais sans flèches ni progression) */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="size-9 rounded-xl bg-emerald-600 grid place-items-center text-white font-bold">TG</div>
                        <div>
                            <div className="font-semibold">Travel GC</div>
                            <div className="text-xs text-emerald-900/70">Partenaires du voyage</div>
                        </div>
                    </div>
                    {/* CTA rapide vers contact */}
                    <a href="#contact" className={cx("rounded-xl px-3 py-2 text-sm font-medium", brand.btn.solid)}>
                        Nous contacter
                    </a>
                </div>

                {/* Contenu empilé */}
                <div className="mt-6 md:mt-8 grid gap-8 md:gap-10">
                    <SectionIntro />
                    <SectionVisits />
                    <SectionOffers />
                    <div id="contact">
                        <SectionContact />
                    </div>
                </div>
            </div>
        </div>
    );
}
