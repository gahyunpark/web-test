import CodeMirror from '@uiw/react-codemirror';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';

const extensions = {
  html: [html()],
  css: [css()],
  js: [javascript()],
};

export default function CodeEditor({ activeTab, values, onTabChange, onCodeChange }) {
  return (
    <section className="panel editor-panel" aria-label="Code editor">
      <div className="panel-header compact">
        <div>
          <p className="panel-kicker">Editor</p>
          <h2>HTML / CSS / JS</h2>
        </div>
        <div className="segmented" role="tablist" aria-label="Code tabs">
          {['html', 'css', 'js'].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? 'active' : ''}
              type="button"
              onClick={() => onTabChange(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <CodeMirror
        value={values[activeTab]}
        height="100%"
        extensions={extensions[activeTab]}
        basicSetup={{
          foldGutter: true,
          highlightActiveLine: true,
          lineNumbers: true,
        }}
        onChange={(value) => onCodeChange(activeTab, value)}
        theme="light"
      />
    </section>
  );
}
