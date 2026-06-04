import { ClipboardPlus } from 'lucide-react';
import { snippets } from '../data/snippets.js';

export default function SnippetPanel({ onInsert }) {
  return (
    <section className="snippet-panel" aria-label="Snippets">
      <div className="subpanel-header">
        <h3>Snippets</h3>
      </div>
      <div className="snippet-list">
        {snippets.map((snippet) => (
          <button key={snippet.id} type="button" onClick={() => onInsert(snippet)}>
            <ClipboardPlus size={15} />
            <span>{snippet.title}</span>
            <small>{snippet.target}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
