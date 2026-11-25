import {
  BrowserTabMock,
  DeckTitle,
  FlourSack,
  NotFoundPanel,
  ReadmeBanner,
  SiteHero,
  SocialCard,
  Tote,
} from '@/components/brand/artifacts';
import { Button, type ButtonVariant } from '@/components/brand/button';
import { Icon } from '@/components/brand/icons';
import { InspectionTag } from '@/components/brand/inspection-tag';
import { OUTCOME_TEXT_CLASS, PolicyBadge } from '@/components/brand/policy-badge';
import { StageRail } from '@/components/brand/stage-rail';
import { Block, Kicker, ManualSection, Panel } from '@/components/manual/section';
import { BRAND, type PolicyOutcome } from '@/lib/brand-data';
import { cx } from '@/lib/cx';

/* §10 and §11: components and applications. */

const STAGES = BRAND.components.stages.map((s) => s.toUpperCase());

/* ─── §10 Components ──────────────────────────────────────────────────── */

const CHECK_CLASS: Record<string, string> = {
  pass: 'text-success',
  warn: 'text-hold',
  fail: 'text-destructive',
  error: 'text-destructive',
};

const LOG_CLASS: Record<string, string> = {
  run: 'text-foreground',
  stage: 'text-muted-foreground',
  trace: 'text-muted-foreground',
  pass: 'text-success',
  hold: 'text-hold',
  deny: 'text-destructive',
};

function ButtonRow({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <div data-theme={theme} className="border border-foreground bg-background p-6">
      <Kicker className="text-muted-foreground">{theme} mode</Kicker>
      <div className="mt-6 flex flex-wrap items-start gap-x-5 gap-y-6">
        {BRAND.components.buttons.map((button) => (
          <div key={button.variant}>
            <Button variant={button.variant as ButtonVariant}>{button.label}</Button>
            <Kicker className="mt-3">{button.variant}</Kicker>
            <Kicker className="text-muted-foreground">{button.spec}</Kicker>
          </div>
        ))}
      </div>
    </div>
  );
}

/** An item at a gate: its tag, the stage rail, the checks and the outcome. */
function WorkflowCard() {
  const card = BRAND.components.workflowCard;
  const outcome = card.outcome as PolicyOutcome;
  return (
    <article className="border border-foreground bg-card">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-foreground px-5 py-3">
        <p className="kicker flex items-center gap-2">
          <Icon name="workspace" size={16} />
          {card.workspace} <span className="text-muted-foreground">/</span> {card.workflow}
        </p>
        <InspectionTag
          lot={card.lot}
          stage={{ index: card.stage, total: STAGES.length, name: STAGES[card.stage - 1] }}
          policy={outcome}
          run={card.run}
        />
      </header>

      <div className="px-5 pb-6 pt-5">
        <Kicker className="text-muted-foreground">Item</Kicker>
        <h4 className="display mt-1 text-[1.75rem]">{card.item}</h4>
        <StageRail stages={STAGES} current={card.stage} className="mt-6" />
      </div>

      <div className="overflow-x-auto border-t border-foreground">
        <table className="w-full min-w-[34rem] border-collapse text-left">
          <caption className="sr-only">Checks at the {STAGES[card.stage - 1]} stage</caption>
          <thead>
            <tr>
              {['Check', 'Status', 'Value', 'Evidence'].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="kicker border-b border-border px-5 py-2 text-muted-foreground"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="data">
            {card.checks.map((check) => (
              <tr key={check.name} className="border-b border-border last:border-b-0">
                <td className="px-5 py-2">{check.name}</td>
                <td className={cx('px-5 py-2 font-medium', CHECK_CLASS[check.status])}>
                  {check.status}
                </td>
                <td className="px-5 py-2">{check.value}</td>
                <td className="px-5 py-2 text-muted-foreground">{check.evidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-foreground px-5 py-4">
        <div className="flex items-center gap-3">
          <PolicyBadge outcome={outcome} />
          <p className="text-[15px]">
            <span className={cx('font-semibold', OUTCOME_TEXT_CLASS[outcome])}>
              Held at Qualify.
            </span>{' '}
            {card.reason}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary">Read the trace</Button>
          <Button>Run the check again</Button>
        </div>
      </footer>
    </article>
  );
}

function RunLog() {
  return (
    <div data-theme="dark" className="border border-foreground bg-background">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <Kicker>Run log / aeo-tracking</Kicker>
        <Kicker className="text-muted-foreground">Runner / local</Kicker>
      </div>
      <ol className="data overflow-x-auto px-5 py-4">
        {BRAND.components.runLog.map((line) => (
          <li key={`${line.time}-${line.level}`} className="flex gap-4 whitespace-nowrap">
            <span className="text-muted-foreground">{line.time}</span>
            <span className={cx('w-12 shrink-0 font-medium uppercase', LOG_CLASS[line.level])}>
              {line.level}
            </span>
            <span>{line.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

const INPUT_CLASS =
  'mt-2 h-11 w-full border border-foreground bg-card px-3 text-[15px] placeholder:text-muted-foreground';

function Inputs() {
  return (
    <form className="grid gap-x-6 gap-y-6 border border-foreground bg-card p-6 sm:grid-cols-2">
      <label className="block">
        <Kicker as="span">Workflow name</Kicker>
        <input
          type="text"
          name="workflow"
          defaultValue="AEO tracking"
          className={cx(INPUT_CLASS, 'bg-background')}
        />
      </label>
      <label className="block">
        <Kicker as="span">Runner</Kicker>
        <select name="runner" defaultValue="local" className={cx(INPUT_CLASS, 'bg-background')}>
          <option value="local">Local</option>
          <option value="cloud">Cloud</option>
        </select>
      </label>
      <label className="block">
        <Kicker as="span">Lot number</Kicker>
        <input
          type="text"
          name="lot"
          defaultValue="412"
          aria-invalid="true"
          aria-describedby="lot-error"
          className={cx(INPUT_CLASS, 'border-destructive bg-background')}
        />
        <span id="lot-error" className="mt-2 block text-[14px] text-destructive">
          Held. A lot number has 4 digits.
        </span>
      </label>
      <div>
        <Kicker>On a stale check</Kicker>
        <div className="mt-2 flex h-11 items-center gap-6">
          <label className="flex items-center gap-2 text-[15px]">
            <input
              type="radio"
              name="stale"
              defaultChecked
              className="size-4 appearance-none border border-foreground bg-background checked:border-[5px]"
            />
            Hold
          </label>
          <label className="flex items-center gap-2 text-[15px]">
            <input
              type="checkbox"
              name="shadow"
              defaultChecked
              className="size-4 appearance-none border border-foreground bg-background checked:bg-foreground"
            />
            Shadow before live
          </label>
        </div>
      </div>
    </form>
  );
}

export function ComponentsSection() {
  const { components } = BRAND;
  return (
    <ManualSection id="components" title="Borders do the work." lead={components.rules.join(' ')}>
      <Block label="Buttons" note="Primary / signal / secondary / ghost">
        <div className="grid gap-4 lg:grid-cols-2">
          <ButtonRow theme="light" />
          <ButtonRow theme="dark" />
        </div>
      </Block>

      <Block label="Inspection tag" note="The signature component">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="flex flex-col items-start gap-4 md:col-span-8">
            <InspectionTag
              lot="0412"
              stage={{ index: 3, total: 5, name: 'QUALIFY' }}
              policy="pass"
              run="2026-11-23"
            />
            <InspectionTag
              lot="0413"
              stage={{ index: 3, total: 5, name: 'QUALIFY' }}
              policy="hold"
              run="2026-11-23"
            />
            <InspectionTag
              lot="0414"
              stage={{ index: 2, total: 5, name: 'ENRICH' }}
              policy="deny"
              run="2026-11-23"
            />
            <InspectionTag lot="0412" stage={{ index: 5, total: 5, name: 'SEND' }} tone="ink" />
            <InspectionTag lot="0412" policy="hold" tone="slab" />
          </div>
          <div className="md:col-span-4">
            <p className="text-[17px] leading-[1.5]">{components.inspectionTag.spec}</p>
            <p className="data mt-4 text-muted-foreground">{components.inspectionTag.example}</p>
          </div>
        </div>
      </Block>

      <Block label="Policy outcomes" note="Pass / Hold / Deny">
        <dl className="grid gap-px border border-foreground bg-foreground md:grid-cols-3">
          {components.outcomes.map((outcome) => (
            <div key={outcome.outcome} className="bg-card p-6">
              <dt>
                <PolicyBadge outcome={outcome.outcome as PolicyOutcome} />
              </dt>
              <dd className="mt-4 text-[15px] leading-[1.55]">{outcome.meaning}</dd>
            </div>
          ))}
        </dl>
      </Block>

      <Block label="Stage rail" note="A reeding gauge with stage labels">
        <div className="border border-foreground bg-card p-6">
          <StageRail stages={STAGES} current={3} />
        </div>
      </Block>

      <Block label="Workflow card" note="An item at a gate">
        <WorkflowCard />
      </Block>

      <Block label="Run log and inputs" note="Mono / square">
        <div className="grid gap-4 lg:grid-cols-2 [&>*]:min-w-0">
          <RunLog />
          <Inputs />
        </div>
      </Block>
    </ManualSection>
  );
}

/* ─── §11 Applications ────────────────────────────────────────────────── */

function ExportLink({ href, label = 'Open at exact size' }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      className="kicker mt-3 inline-block px-[18px] underline decoration-1 underline-offset-4"
    >
      {label}: {href}
    </a>
  );
}

export function ApplicationsSection() {
  const [site, og, deck, readme, favicon, sack, notFound] = BRAND.applications;
  return (
    <ManualSection
      id="applications"
      title="The brand, in service."
      lead="Seven applications, each built from the components above. The wordmark leads. The Ear Tag rides on the social card. The mascot shows up only where the surface is large: the sack, the tote and the 404 page."
    >
      <div className="grid gap-y-14">
        <Panel figure="Fig. 11.1" caption={`${site.name} / ${site.spec}`}>
          {/* A picture of the site, so it is inert: no focus stops, no second h1. */}
          <div inert>
            <SiteHero cta={{ label: 'Start a workflow', href: '/brand' }} />
          </div>
        </Panel>

        <div className="grid gap-x-2 gap-y-14 lg:grid-cols-2">
          <div>
            <Panel figure="Fig. 11.2" caption={`${og.name} / ${og.spec}`}>
              <SocialCard />
            </Panel>
            <ExportLink href="/brand/og" />
          </div>
          <div>
            <Panel figure="Fig. 11.3" caption={`${deck.name} / ${deck.spec}`}>
              <DeckTitle />
            </Panel>
            <ExportLink href="/brand/deck-title" />
          </div>
        </div>

        <div>
          <Panel figure="Fig. 11.4" caption={`${readme.name} / ${readme.spec}`}>
            <ReadmeBanner />
          </Panel>
          <ExportLink href="/brand/readme-banner" />
        </div>

        <div className="grid gap-x-2 gap-y-14 lg:grid-cols-2">
          <Panel
            figure="Fig. 11.5"
            caption={`${favicon.name} / ${favicon.spec}`}
            bodyClassName="bg-background p-5 md:p-8"
          >
            <BrowserTabMock />
          </Panel>
          <Panel
            figure="Fig. 11.6"
            caption={`${sack.name} / ${sack.spec}`}
            theme="light"
            bodyClassName="flex h-full min-h-[20rem] flex-wrap items-end justify-center gap-8 bg-elevated p-8"
          >
            <FlourSack />
            <Tote />
          </Panel>
        </div>

        <div>
          <Panel figure="Fig. 11.7" caption={`${notFound.name} / ${notFound.spec}`}>
            {/* A picture of the page, so it is inert. */}
            <div inert>
              <NotFoundPanel />
            </div>
          </Panel>
          <ExportLink href="/404" label="Open the real page" />
        </div>
      </div>
    </ManualSection>
  );
}
