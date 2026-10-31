import { useEffect, useState, type ReactNode } from 'react';
import {
  ArrowDown01Icon, ArrowLeft01Icon, ArrowRight01Icon, CodeIcon, Delete02Icon, File01Icon, Flowchart01Icon, Menu01Icon, Message01Icon,
  MinusSignIcon, MoreHorizontalIcon, PencilEdit01Icon, PlusSignIcon, Presentation01Icon, Search01Icon, SquareArrowUpRightIcon, UnfoldMoreIcon,
} from '@hugeicons/core-free-icons';
import { Pointer, SceneFrame, Screens, useScene, useStage, useTargets } from '../case-study/scene';
import { OsRail, icon } from '../studio-case/StudioUI';
import './studio-shapes.css';

// The landing page's hero: one idea in every shape Design Studio gives it. It is the Feedback Inbox sample that ships with the open-source
// Studio (itspatmorgan/design-studio, src/prototypes/parker/feedback-inbox), opened in the Studio's prototype view: its artifacts in the
// section nav, the selected one beside it. A pointer walks the nav: the inbox itself, the same screen in lo-fi (discovery/lofi-inbox.tsx,
// grayscale with handwritten type), the review flow (discovery/feedback-flow.mermaid), the engineering handoff canvas
// (eng-handoff.excalidraw, at the 46% the Studio opens it at) and the project context document (discovery/project-context.md).
// Copy, sample data and layout are the product's (store.ts, AppShell.tsx, feedback-inbox.tsx, overview.tsx and feedback-detail.tsx).
// Liberties: type is the site's Geist rather than the Product system's Space Grotesk, as on every demo; the canvas
// shows its first two sections, as the Studio's viewport does.

type Status = 'new' | 'triaged' | 'planned' | 'resolved';
type Priority = 'high' | 'medium' | 'low';
type Item = { title: string; who: string; via: string; priority: Priority; status: Status; date: string };
const items: Item[] = [
  { title: 'Export to CSV is missing columns', who: 'Maya Chen', via: 'Email', priority: 'high', status: 'new', date: 'Sep 28' },
  { title: 'Dark mode makes the status badges hard to read', who: 'Luis Ortega', via: 'Chat', priority: 'medium', status: 'triaged', date: 'Sep 27' },
  { title: 'Let me bulk-assign items to a teammate', who: 'Priya Nair', via: 'Interview', priority: 'high', status: 'planned', date: 'Sep 25' },
  { title: 'Search should look inside the description', who: 'Tom Becker', via: 'Survey', priority: 'medium', status: 'new', date: 'Sep 26' },
  { title: 'Notification emails link to the wrong page', who: 'Aiko Tanaka', via: 'Email', priority: 'low', status: 'resolved', date: 'Sep 20' },
  { title: 'I cannot tell which items are mine', who: 'Dana Whitfield', via: 'Chat', priority: 'medium', status: 'triaged', date: 'Sep 24' },
  { title: 'Keyboard shortcut for creating a new item', who: 'Omar Haddad', via: 'Survey', priority: 'low', status: 'new', date: 'Sep 23' },
  { title: 'Import from a spreadsheet drops line breaks', who: 'Sofia Rossi', via: 'Email', priority: 'high', status: 'planned', date: 'Sep 22' },
];
const label = (s: string) => s[0].toUpperCase() + s.slice(1);
const Badge = ({ kind, value }: { kind: 'status' | 'priority'; value: string }) => <span className={`ss-badge is-${kind} is-${value}`}>{label(value)}</span>;

/** Echo, the sample product: its top bar (AppShell) and a page. */
function Echo({ on, children }: { on: 'overview' | 'inbox'; children: ReactNode }) {
  return <div className="ss-echo">
    <header className="ss-echo-top"><div>
      <b><i>{icon(Message01Icon, 14)}</i>Echo</b>
      <span className={on === 'overview' ? 'is-on' : ''}>Overview</span>
      <span className={on === 'inbox' ? 'is-on' : ''}>Feedback inbox</span>
      <em>Reset sample data</em><span className="ss-echo-pm">PM</span>
    </div></header>
    <main className="ss-echo-page">{children}</main>
  </div>;
}

/** The feedback inbox (FeedbackInboxScreen), unfiltered or showing open issues, optionally with the New feedback panel open. */
function Inbox({ open = false, panel }: { open?: boolean; panel?: 'new' | 'error' }) {
  const rows = open ? items.filter(f => f.status !== 'resolved') : items;
  return <Echo on="inbox">
    <div className="ss-head">
      <div><h1>Feedback inbox</h1><p>Everything customers have told us, newest first.</p></div>
      <span className="ss-btn is-primary">{icon(PlusSignIcon, 15)}New feedback</span>
    </div>
    <div className="ss-bar">
      <div className="ss-tabs">{['All', 'New', 'Triaged', 'Planned', 'Resolved'].map(t => <span key={t} className={!open && t === 'All' ? 'is-on' : ''}>{t}</span>)}</div>
      <div className="ss-input">{icon(Search01Icon, 15)}Search feedback</div>
    </div>
    {open && <div className="ss-showing">Showing <span className="ss-badge is-secondary">Open issues</span><span className="ss-ghost">✕ Clear</span></div>}
    <div className="ss-table">
      <div className="ss-row is-head"><span>Feedback</span><span>From</span><span>Priority</span><span>Status</span><span>Received</span><span /></div>
      {rows.map(f => <div className="ss-row" key={f.title}>
        <span className="ss-strong">{f.title}</span><span className="ss-weak">{f.who}<small> · {f.via}</small></span>
        <span><Badge kind="priority" value={f.priority} /></span><span><Badge kind="status" value={f.status} /></span>
        <span className="ss-weak">{f.date}</span><span className="ss-dots">{icon(MoreHorizontalIcon, 16)}</span>
      </div>)}
    </div>
    {panel && <>
      <div className="ss-scrim" />
      <aside className="ss-sheet">
        <h2>New feedback</h2>
        <p>Capture what you heard. You can triage it from the feedback inbox.</p>
        <label>Title</label><div className={`ss-input ${panel === 'error' ? 'is-invalid' : ''}`}>What did they say, in a line?</div>
        {panel === 'error' && <small className="ss-error">Give it a title.</small>}
        <label>Customer</label><div className="ss-input">Name</div>
        <div className="ss-pair"><div><label>Source</label><div className="ss-input">Email{icon(ArrowDown01Icon, 14)}</div></div><div><label>Priority</label><div className="ss-input">Medium{icon(ArrowDown01Icon, 14)}</div></div></div>
        <label>Details</label><div className="ss-input is-area">Their words, as close as you can.</div>
        <div className="ss-actions"><span className="ss-btn">Cancel</span><span className="ss-btn is-primary">Add feedback</span></div>
      </aside>
    </>}
  </Echo>;
}

/** The overview (overview.tsx): four numbers, two breakdowns and the newest feedback, computed from the sample data. */
function Overview() {
  const bars = (rows: [string, number][]) => <ul className="ss-bars">{rows.map(([l, n]) => <li key={l}><span>{l}</span><i><b style={{ width: `${(n / 3) * 100}%` }} /></i><span>{n}</span></li>)}</ul>;
  return <Echo on="overview">
    <div className="ss-head"><div><h1>Overview</h1><p>Where the feedback stands. Click a number to see the feedback behind it.</p></div></div>
    <div className="ss-metrics">
      {([['Open issues', 7, 'Not resolved yet'], ['New', 3, 'Waiting to be triaged'], ['High priority', 3, 'Open and high priority'], ['Resolved', 1, 'Closed out']] as const).map(([l, n, h]) =>
        <div key={l} className="ss-card"><span className="ss-weak">{l}</span><b>{n}</b><small>{h}</small></div>)}
    </div>
    <div className="ss-split">
      <div className="ss-card"><h3>By status</h3>{bars([['New', 3], ['Triaged', 2], ['Planned', 2], ['Resolved', 1]])}</div>
      <div className="ss-card"><h3>By source</h3>{bars([['Email', 3], ['Chat', 2], ['Interview', 1], ['Survey', 2]])}</div>
    </div>
    <div className="ss-card"><h3>Newest</h3>
      <ul className="ss-newest">{[0, 1, 3, 2, 5].map(i => <li key={i}><span className="ss-strong">{items[i].title}</span><Badge kind="priority" value={items[i].priority} /><Badge kind="status" value={items[i].status} /><small>{items[i].date}</small></li>)}</ul>
    </div>
  </Echo>;
}

/** One piece of feedback (feedback-detail.tsx), opened directly, so it shows the newest item. */
function Detail() {
  return <Echo on="inbox">
    <span className="ss-back">{icon(ArrowLeft01Icon, 15)}Feedback inbox</span>
    <div className="ss-head">
      <div><div className="ss-badges"><Badge kind="status" value="new" /><Badge kind="priority" value="high" /></div><h1>Export to CSV is missing columns</h1><p>Maya Chen · Team plan · via Email · Sep 28</p></div>
      <div className="ss-badges"><span className="ss-btn">{icon(PencilEdit01Icon, 15)}Edit</span><span className="ss-btn">{icon(Delete02Icon, 15)}Delete</span></div>
    </div>
    <div className="ss-detail">
      <div>
        <h3>What they said</h3>
        <p>When I export the table, the owner and last-updated columns are not included. I rebuild them by hand every week for my report.</p>
        <div className="ss-badges"><span className="ss-badge is-secondary">export</span><span className="ss-badge is-secondary">tables</span></div>
        <hr />
        <h3>Notes</h3><p className="ss-weak">No notes yet.</p>
        <label>Add a note</label><div className="ss-input is-area">What did you find out, or decide?</div>
      </div>
      <div className="ss-card"><h3>Triage</h3><label>Status</label><div className="ss-input">New{icon(ArrowDown01Icon, 14)}</div><label>Priority</label><div className="ss-input">High{icon(ArrowDown01Icon, 14)}</div></div>
    </div>
  </Echo>;
}

/** The review flow (feedback-flow.mermaid) as the Studio draws it with Mermaid, laid out left to right. */
function Flow() {
  return <div className="ss-pane ss-flow">
    <svg viewBox="268 0 1012 720" role="presentation">
      <defs><marker id="ss-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0 10 5 0 10z" /></marker></defs>
      <g className="ss-edges">
        <path d="M488 369H540" markerEnd="url(#ss-arrow)" />
        <path d="M689 336C720 316 740 300 760 297" /><path d="M790 290H830" markerEnd="url(#ss-arrow)" />
        <path d="M720 369C735 369 745 369 757 369" /><path d="M795 371C810 374 825 378 840 382" markerEnd="url(#ss-arrow)" />
        <path d="M841 410C800 418 750 410 699 393" markerEnd="url(#ss-arrow)" />
        <path d="M1027 290H1079" markerEnd="url(#ss-arrow)" />
      </g>
      <g className="ss-nodes">
        <rect x="300" y="341" width="187" height="56" /><text x="393.5" y="369">Record feedback</text>
        <path d="M631 280 720 369 631 458 542 369z" /><text x="631" y="369">Review feedback</text>
        <rect x="832" y="262" width="194" height="56" /><text x="929" y="290">Address feedback</text>
        <rect x="1081" y="262" width="166" height="56" /><text x="1164" y="290">Mark resolved</text>
        <rect x="842" y="374" width="175" height="56" /><text x="929.5" y="402">Keep for review</text>
      </g>
      <g className="ss-edge-labels"><text x="775" y="290">Act now</text><text x="775" y="369">Later</text></g>
    </svg>
  </div>;
}

/** A screen embedded on the canvas: its title bar, then the screen itself at 1024 px, scaled into the frame. */
function Embed({ x, y, title, children }: { x: number; y: number; title: string; children: ReactNode }) {
  return <div className="ss-embed" style={{ left: x, top: y }}>
    <div className="ss-embed-bar"><b>{title}</b>{icon(SquareArrowUpRightIcon, 18)}</div>
    <div className="ss-embed-screen"><div style={{ width: 1024, transform: `scale(${456 / 1024})`, transformOrigin: '0 0' }}>{children}</div></div>
  </div>;
}
const Note = ({ x, y, children }: { x: number; y: number; children: ReactNode }) => <p className="ss-note" style={{ left: x, top: y }}>{children}</p>;
const Arrow = ({ x, y, text }: { x: number; y: number; text: string }) => <div className="ss-arrow" style={{ left: x, top: y }}><i /><span>{text}</span></div>;

/** The engineering handoff canvas (eng-handoff.excalidraw), in its own coordinates, at the 46% the Studio opens it at. */
function Canvas() {
  return <div className="ss-pane ss-canvas">
    <span className="ss-canvas-menu">{icon(Menu01Icon, 18)}</span>
    <div className="ss-board" style={{ transform: 'translate(28px, 86px) scale(.46)' }}>
      <h2 className="ss-board-title" style={{ left: 50, top: -8 }}>Feedback Inbox: Handoff</h2>
      <p className="ss-board-sub" style={{ left: 50, top: 70 }}>The main flow, then each create, read, update, and delete state.</p>
      <div className="ss-frame" style={{ left: 50, top: 181, width: 1974, height: 538 }}><span>Flow</span></div>
      <Embed x={110} y={241} title="Overview"><Overview /></Embed>
      <Arrow x={576} y={399} text="click a number" />
      <Embed x={808} y={241} title="Open Issues"><Inbox open /></Embed>
      <Arrow x={1274} y={399} text="click a row" />
      <Embed x={1506} y={241} title="Feedback Detail"><Detail /></Embed>
      <Note x={110} y={583}>Land on the Overview. The key numbers are at the top: open issues, new, high priority, resolved.</Note>
      <Note x={808} y={583}>Click a number. The feedback inbox opens already filtered, with a bar that says what’s showing, and Clear.</Note>
      <Note x={1506} y={583}>Click a row to open it. Status and priority save as soon as they change.</Note>
      <div className="ss-frame" style={{ left: 50, top: 823, width: 1276, height: 530 }}><span>Create</span></div>
      <Embed x={110} y={883} title="New Feedback"><Inbox panel="new" /></Embed>
      <Arrow x={576} y={1042} text="Add, no title" />
      <Embed x={808} y={883} title="Validation Error"><Inbox panel="error" /></Embed>
      <Note x={110} y={1225}>+ New feedback opens a panel. Title is required.</Note>
      <Note x={808} y={1225}>Add with no title shows the error and stays open. With a title, the new item appears at the top.</Note>
    </div>
    <span className="ss-zoom">{icon(MinusSignIcon, 16)}<b>46%</b>{icon(PlusSignIcon, 16)}</span>
  </div>;
}

/** The project context (discovery/project-context.md) as the Studio renders a Markdown document (DocLayout). Its table of contents
 *  shows only on screens 1280 px and wider, so at this size it is hidden, as in the product. */
export function Doc() {
  return <div className="ss-pane ss-doc">
    <article>
      <h1>Project Context</h1>
      <p className="ss-doc-lead">The problem, working assumptions, and explorations behind the feedback tracker.</p>
      <h2>The problem</h2>
      <p>Customer feedback is scattered across email, chat, interviews, surveys, and support tickets. The team needs one place to capture it, review recurring problems, and track what happens next.</p>
      <h2>Who it's for</h2>
      <ul><li><b>Luis, support lead:</b> capture feedback quickly.</li><li><b>Priya, product manager:</b> triage new items and track planned work.</li><li><b>Maya, product designer:</b> find patterns worth exploring.</li></ul>
      <h2>Working assumptions</h2>
      <ul><li>Items move through <b>New, Triaged, Planned, and Resolved</b>.</li><li>Status and priority help the team decide what to address.</li><li>Notes stay with the feedback item so its history stays together.</li></ul>
      <h2>Open questions</h2>
      <ul><li>Where should filtering live?</li><li>When should customers hear back?</li><li>How long should resolved feedback remain visible?</li></ul>
    </article>
  </div>;
}

export type Key = 'inbox' | 'lofi' | 'flow' | 'handoff' | 'context';
/** The prototype's section nav (the Studio's artifact tree), States folded, as the prototype opens. */
export function Nav({ on }: { on: Key }) {
  const li = (i: typeof CodeIcon, t: string, key?: Key, child = true) => <li key={t} data-target={key} className={`${child ? 'is-child' : ''} ${key && key === on ? 'is-on' : ''}`}>{icon(i, 15)}{t}</li>;
  const group = (t: string, open = true) => <li className="is-group">{icon(open ? ArrowDown01Icon : ArrowRight01Icon, 14)}{t}</li>;
  return <aside className="sc-side ss-side">
    <h4>Feedback Inbox <span>{icon(MoreHorizontalIcon, 16)}</span></h4>
    <p className="ss-side-system">System · Product ↗</p>
    <h5>Artifacts <span>{icon(Search01Icon, 15)}{icon(UnfoldMoreIcon, 15)}</span></h5>
    <ul>
      {li(File01Icon, 'About This Prototype', undefined, false)}
      {li(Presentation01Icon, 'Eng Handoff', 'handoff', false)}
      {group('App')}
      {li(CodeIcon, 'Overview')}
      {li(CodeIcon, 'Feedback Inbox', 'inbox')}
      {li(CodeIcon, 'Feedback Detail')}
      {group('States', false)}
      {group('Discovery')}
      {li(CodeIcon, 'Lo-fi Inbox', 'lofi')}
      {li(Presentation01Icon, 'Breadboard')}
      {li(Flowchart01Icon, 'Feedback Flow', 'flow')}
      {li(File01Icon, 'Project Context', 'context')}
    </ul>
  </aside>;
}

// Each artifact holds, then the pointer moves to the next one in the nav (its own step), then the click opens it.
const stops: Key[] = ['inbox', 'lofi', 'flow', 'handoff', 'context'];
const timings = [2800, 900, 2600, 900, 2600, 900, 3200, 900, 3000];
const lines = [
  'A working prototype, built by your agent with your design system',
  'The same screen in lo-fi, to settle the layout first',
  'A diagram of the flow, written in Mermaid',
  'A canvas that walks engineering through every state',
  'A Markdown document for the brief and open questions',
];
const captions = timings.map((_, i) => lines[Math.ceil(i / 2)]);

/** One prototype in every shape: a working screen, its wireframe, a diagram, a canvas and a document. */
export default function StudioShapes() {
  const scene = useScene(timings, captions);
  const stage = useStage({ wide: 1120, height: 760 });
  const step = scene.reduced ? 0 : scene.step;
  const shown = stops[Math.floor((step + 1) / 2)];
  const aim = step > 0 ? stops[Math.ceil(step / 2)] : null;
  const t = useTargets(step);
  // The click: a short press as the pointer lands on its target, then the artifact opens.
  const [pressing, setPressing] = useState(false);
  useEffect(() => {
    if (step === 0 || step % 2 === 1) return;
    setPressing(true);
    const timer = window.setTimeout(() => setPressing(false), 160);
    return () => window.clearTimeout(timer);
  }, [step, scene.take]);
  const view = shown === 'inbox' || shown === 'lofi'
    ? <div className={`ss-pane ss-app ${shown === 'lofi' ? 'is-lofi' : ''}`}><Inbox /></div>
    : shown === 'flow' ? <Flow /> : shown === 'handoff' ? <Canvas /> : <Doc />;
  return <SceneFrame scene={scene} stage={stage} title="one prototype in every shape" focus={null}
    label="Design Studio's prototype view with the Feedback Inbox sample: its artifacts listed in a sidebar, and beside it, in turn, the working inbox screen, the same screen in lo-fi, a diagram of the review flow, a handoff canvas with every screen and state, and a Markdown document with the project context">
    <div ref={t.ref} style={{ position: 'relative', height: stage.box.height }} aria-hidden="true">
      <div className="sc-os ss-os">
        <OsRail on="prototypes" />
        <Nav on={shown} />
        {/* The lo-fi screen is the same component restyled, so it changes in place rather than loading as a new page. */}
        <div className="ss-panes"><Screens id={shown === 'lofi' ? 'inbox' : shown}>{view}</Screens></div>
      </div>
      <Pointer at={aim ? t.at(aim) : null} visible={!!aim} pressing={pressing} reduced={scene.reduced} />
    </div>
  </SceneFrame>;
}
