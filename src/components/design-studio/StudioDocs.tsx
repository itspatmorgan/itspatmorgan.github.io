import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { SceneFrame, Screens, useScene, useStage } from '../case-study/scene';
import { OsRail } from '../studio-case/StudioUI';
import { Doc, Nav } from './StudioShapes';
import './studio-shapes.css';

// One document, two ways in: the Feedback Inbox's project context (discovery/project-context.md) as the Studio renders it, and the
// same file in the Studio's source editor ("Edit source" in the file's menu: its path, Save and Done, then the Markdown with line
// numbers). People read and edit the page; agents read and write the same file. Lines are the file's own; the editor shows its first 28.
const source: string[] = [
  '---', 'studioId: 9jmjq17bwtce5tq6', 'title: Project Context',
  'description: The problem, working assumptions, and explorations behind the feedback tracker.', 'toc: true', '---', '',
  '## The problem', '',
  'Customer feedback is scattered across email, chat, interviews, surveys, and support tickets. The team needs one place to capture it, review recurring problems, and track what happens next.',
  '', "## Who it's for", '',
  '- **Luis, support lead:** capture feedback quickly.', '- **Priya, product manager:** triage new items and track planned work.', '- **Maya, product designer:** find patterns worth exploring.',
  '', '## Working assumptions', '',
  '- Items move through **New, Triaged, Planned, and Resolved**.', '- Status and priority help the team decide what to address.', '- Notes stay with the feedback item so its history stays together.',
  '', '## Open questions', '',
  '- Where should filtering live?', '- When should customers hear back?', '- How long should resolved feedback remain visible?',
];

/** One line of Markdown, colored as the editor colors it: headings, bold markers and front matter keys. */
function Line({ text, front }: { text: string; front: boolean }) {
  if (text.startsWith('## ')) return <span className="md-h">{text}</span>;
  if (front && text.includes(': ')) { const at = text.indexOf(': '); return <><span className="md-key">{text.slice(0, at + 1)}</span>{text.slice(at + 1)}</>; }
  if (front) return <span className="md-mark">{text}</span>;
  const parts: ReactNode[] = [];
  text.split(/(\*\*[^*]+\*\*)/).forEach((part, i) => {
    if (part.startsWith('**')) parts.push(<span key={i}><span className="md-mark">**</span><b>{part.slice(2, -2)}</b><span className="md-mark">**</span></span>);
    else parts.push(part.startsWith('- ') ? <span key={i}><span className="md-mark">-</span>{part.slice(1)}</span> : part);
  });
  return <>{parts}</>;
}

function Editor() {
  return <div className="ss-pane ss-editor">
    <header><code>src/prototypes/parker/feedback-inbox/discovery/project-context.md</code><span className="ss-ed-btn is-disabled">Save</span><span className="ss-ed-btn">Done</span></header>
    <ol>{source.map((text, i) => <li key={i} className={i === 0 ? 'is-current' : ''}><span><Line text={text} front={i <= 5} /></span></li>)}</ol>
  </div>;
}

const timings = [4200, 4200];
const captions = ['The document as your team reads it', 'The same file as Markdown, for you and your agent'];
const views = ['Document', 'Markdown'];

/** The project context, read as a page, then as the Markdown file behind it. */
export default function StudioDocs() {
  const scene = useScene(timings, captions);
  const stage = useStage({ wide: 1120, height: 760 });
  const reduced = useReducedMotion();
  const step = scene.reduced ? 0 : scene.step;
  const bar = <div className="sc-era" role="group" aria-label="How to show the document">
    {views.map((v, i) => <button type="button" key={v} aria-pressed={step === i} onClick={() => scene.choose(i)}>
      {step === i && <motion.i className="sc-era-thumb" layoutId="ss-doc-thumb" transition={reduced ? { duration: 0 } : { type: 'spring', duration: .5, bounce: .12 }} />}
      <span><b>{v}</b></span>
    </button>)}
  </div>;
  return <SceneFrame scene={scene} stage={stage} bar={bar} title="the document and its Markdown"
    label="The Feedback Inbox's project context in Design Studio, first as a rendered page with the problem, who it's for, working assumptions and open questions, then as the Markdown file behind it in the Studio's source editor">
    <div style={{ position: 'relative', height: stage.box.height }} aria-hidden="true">
      <div className="sc-os ss-os">
        <OsRail on="prototypes" />
        <Nav on="context" />
        <div className="ss-panes"><Screens id={views[step]}>{step === 0 ? <Doc /> : <Editor />}</Screens></div>
      </div>
    </div>
  </SceneFrame>;
}
