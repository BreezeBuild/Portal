"use client";

import { useId, useState } from "react";
import backdrop from "../backdrop.module.css";
import { SquigglyArrow } from "@/components/SquigglyArrow";
import { BentoGrid, BentoGridItem, bentoStyles } from "./BentoGrid";
import styles from "./PricingSection.module.css";

/*
 * Illustrative figures only - sample data for the UI, not a real invoice.
 *
 * The same $0.73 is shown three ways and all three must stay in sync if the
 * numbers are ever edited: COST_SPLIT (proportions), USAGE_BY_VENDOR (who was
 * paid) and USAGE_BY_ACTIVITY (what it was spent on).
 */

const TOTAL = "$0.73";

/* Brand ramp, plus one neutral so four slices stay distinguishable. */
const COST_SPLIT = [
  { name: "AI inference", pct: 57.5, color: "#FB923C" },
  { name: "Kubernetes", pct: 23.3, color: "#F97316" },
  { name: "Build compute", pct: 11.0, color: "#EF4444" },
  { name: "RDS", pct: 8.2, color: "rgba(250,250,250,0.32)" },
];

const USAGE_BY_VENDOR = [
  {
    group: "AI",
    tone: "groupAI" as const,
    lines: [
      {
        name: "LLM inference",
        meta: "Anthropic · Claude Sonnet 5",
        amount: "$0.42",
      },
    ],
  },
  {
    group: "AWS",
    tone: "groupAWS" as const,
    lines: [
      { name: "Build compute", meta: "EC2 · on-demand", amount: "$0.08" },
      {
        name: "RDS / PostgreSQL",
        meta: "RDS · db.t4g.micro",
        amount: "$0.06",
      },
      {
        name: "Kubernetes / runtime",
        meta: "EKS · preview workload",
        amount: "$0.17",
      },
    ],
  },
];

const USAGE_BY_ACTIVITY = [
  { name: "AI generation", amount: "$0.42" },
  { name: "Build + testing", amount: "$0.08" },
  { name: "Preview infrastructure", amount: "$0.17" },
  { name: "Database / AWS", amount: "$0.06" },
];

const CREDIT_COVERS = [
  "LLM inference",
  "Build compute",
  "Kubernetes infrastructure",
  "PostgreSQL / AWS services",
  "Storage and other infrastructure usage",
];

/* --- small inline icons, coloured by BentoGrid's .icon rule --- */

const iconBase = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const ReceiptIcon = () => (
  <svg {...iconBase}>
    <path d="M5 3v18l2.5-1.6L10 21l2-1.6L14 21l2.5-1.6L19 21V3z" />
    <path d="M9 8h6M9 12h6M9 16h3" />
  </svg>
);

const SparkIcon = () => (
  <svg {...iconBase}>
    <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12z" />
  </svg>
);

const LayersIcon = () => (
  <svg {...iconBase}>
    <path d="M12 3 3 7.5l9 4.5 9-4.5z" />
    <path d="M3 12.5 12 17l9-4.5" />
    <path d="M3 17 12 21.5 21 17" />
  </svg>
);

/** Proportional split of the same total - keeps the card full when collapsed. */
function CostSplit() {
  return (
    <div className={styles.split}>
      <div
        className={styles.costBar}
        role="img"
        aria-label="AI inference 57.5 percent, Kubernetes 23.3 percent, build compute 11 percent, RDS 8.2 percent"
      >
        {COST_SPLIT.map((s) => (
          <span
            key={s.name}
            className={styles.costSeg}
            style={{ width: `${s.pct}%`, background: s.color }}
          />
        ))}
      </div>
      <ul className={styles.legend}>
        {COST_SPLIT.map((s) => (
          <li key={s.name} className={styles.legendItem}>
            <span
              className={styles.legendSwatch}
              style={{ background: s.color }}
              aria-hidden="true"
            />
            {s.name}
            <span className={styles.legendPct}>{s.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function UsageLedger() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className={styles.ledger}>
      <div className={styles.ledgerHead}>
        <span className={styles.ledgerTotalLabel}>
          Breeze Credits used{" "}
          <strong className={`${styles.ledgerTotal} ${styles.priceAccent}`}>
            {TOTAL}
          </strong>
        </span>
        <span className={styles.illustrative}>Illustrative</span>
      </div>

      <CostSplit />

      <div className={styles.toggleRow}>
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
        >
          {open ? "Hide breakdown" : "Show breakdown"}
          <span
            className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
            aria-hidden="true"
          >
            &#8595;
          </span>
        </button>

        {/* points back at the toggle, so the interaction gets found */}
        {!open ? (
          <span className={styles.annotate}>
            <SquigglyArrow
              direction="left"
              variant="wavy"
              width={52}
              height={22}
              strokeWidth={1.5}
              className={styles.annotateArrow}
            />
            <span className={styles.annotateText}>
              down to the model and service
            </span>
          </span>
        ) : null}
      </div>

      <div
        id={panelId}
        className={`${styles.expand} ${open ? styles.expandOpen : ""}`}
      >
        <div className={styles.expandInner}>
          {USAGE_BY_VENDOR.map((g) => (
            <div key={g.group} className={`${styles.group} ${styles[g.tone]}`}>
              <div className={styles.groupName}>
                {g.group}
                <span className={styles.groupRule} aria-hidden="true" />
              </div>
              <ul className={styles.lines}>
                {g.lines.map((l) => (
                  <li key={l.name} className={styles.line}>
                    <span className={styles.lineName}>
                      {l.name}
                      <span className={styles.lineMeta}>{l.meta}</span>
                    </span>
                    <span className={styles.leader} aria-hidden="true" />
                    <span className={styles.lineAmount}>{l.amount}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className={styles.totalLine}>
            <span className={styles.totalName}>Total</span>
            <span className={styles.leader} aria-hidden="true" />
            <span className={styles.totalAmount}>{TOTAL}</span>
          </div>

          <p className={styles.ledgerNote}>
            This sample shows how vendor, model, and service costs could be
            broken down. The amounts are illustrative.
          </p>
        </div>
      </div>
    </div>
  );
}

export function PricingSection() {
  return (
    <section className={styles.root} aria-labelledby="pricing-heading">
      <div className={backdrop.shell}>
        <div className={styles.head}>
          <h2 id="pricing-heading" className={styles.heading}>
            Proposed pricing, made clear.
          </h2>
          <p className={styles.intro}>
            This is an illustrative pricing model, not a final offer: a platform
            subscription with AI and infrastructure usage tracked separately as{" "}
            <span className={styles.accent}>Breeze Credits</span>. Final terms may change.
          </p>
        </div>

        <BentoGrid>
          <BentoGridItem
            className={bentoStyles.spanTwo}
            animated
            header={
              <div>
                <span className={styles.label}>Proposed subscription</span>
                <div className={styles.priceRow}>
                  <span className={`${styles.price} ${styles.priceAccent}`}>
                    $20
                  </span>
                  <span className={styles.priceUnit}>/ month</span>
                </div>
              </div>
            }
            title="Illustrative platform fee: $20/month."
            description="The proposed model separates the platform fee from variable usage."
          />

          <BentoGridItem
            animated
            header={
              <div>
                <span className={styles.label}>Breeze Credits</span>
                <div className={styles.creditEq}>
                  <span>1 Breeze Credit</span>
                  <span className={styles.creditEqAccent}>= $1</span>
                </div>
              </div>
            }
            title="Usage would be metered separately."
            description="In this proposed model, one Breeze Credit represents $1 of variable usage."
          />

          <BentoGridItem
            className={`${bentoStyles.spanTwo} ${bentoStyles.rowTwo}`}
            header={<UsageLedger />}
            icon={<ReceiptIcon />}
            title="A traceable usage concept."
            description="The planned ledger would show the vendor, model, and service behind each charge."
          />

          <BentoGridItem
            icon={<SparkIcon />}
            title="AI designed for efficiency"
            description="The planned agents aim to limit unnecessary model calls, compute, and infrastructure usage while helping developers iterate."
          />

          <BentoGridItem
            header={
              <div>
                <span className={styles.label}>Human-readable usage</span>
                <ul className={styles.lines}>
                  {USAGE_BY_ACTIVITY.map((l) => (
                    <li key={l.name} className={styles.line}>
                      <span className={styles.lineName}>{l.name}</span>
                      <span className={styles.leader} aria-hidden="true" />
                      <span className={styles.lineAmount}>{l.amount}</span>
                    </li>
                  ))}
                </ul>
                <div className={styles.totalLine}>
                  <span className={styles.totalName}>Total</span>
                  <span className={styles.leader} aria-hidden="true" />
                  <span
                    className={`${styles.totalAmount} ${styles.priceAccent}`}
                  >
                    {TOTAL}
                  </span>
                </div>
              </div>
            }
            description="The same spend, grouped by what you were doing rather than who was paid."
          />

          <BentoGridItem
            icon={<LayersIcon />}
            header={
              <div>
                <span className={styles.label}>Credits cover</span>
                <ul className={styles.covers}>
                  {CREDIT_COVERS.map((c) => (
                    <li key={c} className={styles.coversItem}>
                      <span className={styles.bullet} aria-hidden="true" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            }
            title="See what you use and what it costs."
          />

          <BentoGridItem
            className={bentoStyles.spanTwo}
            header={
              <div className={styles.philosophy}>
                <span className={styles.philosophyLine}>
                  Build fast.{" "}
                  <span className={styles.priceAccent}>
                    Know what you pay.
                  </span>
                </span>
                <p className={styles.philosophyBody}>
                  This example separates a proposed $20 platform fee from
                  variable AI and infrastructure usage. Final pricing and
                  billing details have not been set.
                </p>
              </div>
            }
          />
        </BentoGrid>
      </div>
    </section>
  );
}
