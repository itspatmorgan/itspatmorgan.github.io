import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Role } from "@/data/experience";

type CareerMomentsProps = {
  roles: Role[];
};

function getMoment(role: Role) {
  return role.moment ?? {
    label: role.role,
    headline: role.summary ?? role.descriptions[0],
    proof: role.descriptions.slice(0, 3),
    assetNote: "Future slot: add a strong image or short silent video loop for this role.",
    image: role.logo,
    imageDark: role.logo,
  };
}

function formatDateRange(dateRange: string) {
  return dateRange.replace(/^(\d{4})–(20\d{2})$/, (_, start: string, end: string) => {
    return `${start}–${end.slice(2)}`;
  });
}

export default function CareerMoments({ roles }: CareerMomentsProps) {
  const [activeSlug, setActiveSlug] = useState(roles[0]?.slug ?? "");
  const activeRole = useMemo(
    () => roles.find((role) => role.slug === activeSlug) ?? roles[0],
    [activeSlug, roles]
  );

  if (!activeRole) return null;

  const activeMoment = getMoment(activeRole);
  const activeIndex = roles.findIndex((role) => role.slug === activeRole.slug);
  const activeHasWorkLink = activeIndex >= 0 && activeIndex < 3;

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="grid h-full lg:grid-cols-[minmax(260px,0.92fr)_minmax(0,2fr)]">
        <div className="border-b border-border lg:border-b-0 lg:border-r lg:self-start">
          <div className="border-b border-border p-5 sm:p-6">
            <p className="text-lg font-semibold tracking-tight">
              From strategy and code to AI-native product systems
            </p>
          </div>

          <div className="divide-y divide-border">
            {roles.map((role, index) => {
              const isActive = role.slug === activeRole.slug;
              const hasWorkLink = index < 3;
              const ListItem = hasWorkLink ? "a" : "button";

              return (
                <ListItem
                  key={role.slug}
                  {...(hasWorkLink ? { href: `/work#${role.slug}` } : { type: "button" })}
                  aria-current={isActive ? "true" : undefined}
                  onMouseEnter={() => setActiveSlug(role.slug)}
                  onFocus={() => setActiveSlug(role.slug)}
                  onTouchStart={() => setActiveSlug(role.slug)}
                  onClick={() => {
                    if (!hasWorkLink) setActiveSlug(role.slug);
                  }}
                  className={`group grid w-full gap-2 px-5 py-4 text-left outline-none transition-colors sm:grid-cols-[1fr_auto] sm:items-start sm:px-6 ${
                    isActive
                      ? "bg-muted/55 text-foreground"
                      : "text-foreground hover:bg-muted/35 focus-visible:bg-muted/35"
                  }`}
                >
                  <span className="min-w-0">
                    <span className="mb-1 flex items-center gap-2 text-sm font-medium leading-snug">
                      <span>{role.company}</span>
                      {hasWorkLink && (
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
                      )}
                    </span>
                    <span className="block text-xs leading-relaxed text-muted-foreground">
                      {role.role}
                    </span>
                  </span>
                  <span className="block font-mono text-xs text-muted-foreground sm:text-right">
                    {formatDateRange(role.dateRange)}
                  </span>
                </ListItem>
              );
            })}
          </div>
        </div>

        <div className="group block min-h-[420px] lg:relative lg:min-h-0">
          <div className="grid h-full min-h-[420px] grid-rows-[minmax(0,1fr)_auto] bg-card lg:absolute lg:inset-0 lg:min-h-0">
            <div className="texture-bg relative overflow-hidden">
              {activeMoment.video ? (
                <video
                  key={activeMoment.video}
                  src={activeMoment.video}
                  poster={activeMoment.image}
                  className="h-full w-full scale-[1.08] object-contain transition-transform duration-500 group-hover:scale-[1.1] lg:scale-[1.18] lg:group-hover:scale-[1.2]"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : activeMoment.image ? (
                <>
                  <img
                    key={activeMoment.image}
                    src={activeMoment.image}
                    alt=""
                    className="h-full w-full scale-[1.08] object-contain transition-transform duration-500 group-hover:scale-[1.1] dark:hidden lg:scale-[1.18] lg:group-hover:scale-[1.2]"
                    loading="lazy"
                  />
                  {activeMoment.imageDark && (
                    <img
                      key={activeMoment.imageDark}
                      src={activeMoment.imageDark}
                      alt=""
                      className="hidden h-full w-full scale-[1.08] object-contain transition-transform duration-500 group-hover:scale-[1.1] dark:block lg:scale-[1.18] lg:group-hover:scale-[1.2]"
                      loading="lazy"
                    />
                  )}
                </>
              ) : null}
            </div>

            <div className="border-t border-border bg-card p-5 sm:p-6">
              <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="max-w-2xl">
                  <h3 className="text-lg font-medium leading-snug tracking-tight sm:text-xl">
                    {activeMoment.headline}
                  </h3>
                  <div className="mt-5 grid gap-2">
                    {activeMoment.proof.slice(0, 2).map((item) => (
                      <div key={item} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                        <span className="mt-2 block h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60" aria-hidden="true" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {activeHasWorkLink && (
                  <a
                    href={`/work#${activeRole.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground"
                  >
                    View work <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
