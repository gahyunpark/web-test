import { useEffect, useMemo, useState } from 'react';
import AnswerCheckPanel from './components/AnswerCheckPanel.jsx';
import CodeEditor from './components/CodeEditor.jsx';
import PreviewPanel from './components/PreviewPanel.jsx';
import ReferencePanel from './components/ReferencePanel.jsx';
import ReferenceLinksPanel from './components/ReferenceLinksPanel.jsx';
import SnippetPanel from './components/SnippetPanel.jsx';
import { starterCode } from './data/starterCode.js';
import { createPreviewDocument } from './utils/preview.js';
import { loadWorkspace, saveWorkspace } from './utils/storage.js';

const initialWorkspace = {
  code: starterCode,
  activeTab: 'html',
  referenceImage: '',
  viewport: 'desktop',
  customWidth: 1024,
  overlay: false,
  overlayOpacity: 0.45,
  gridSize: 0,
  compareMode: false,
};

export default function App() {
  const [workspace, setWorkspace] = useState(() => loadWorkspace(initialWorkspace));

  const previewDocument = useMemo(() => createPreviewDocument(workspace.code), [workspace.code]);

  // 작업 내용은 별도 저장 버튼 없이 계속 localStorage에 보관됩니다.
  useEffect(() => {
    saveWorkspace(workspace);
  }, [workspace]);

  function updateWorkspace(patch) {
    setWorkspace((current) => {
      if (
        Object.prototype.hasOwnProperty.call(patch, 'referenceImage') &&
        current.referenceImage?.startsWith('blob:') &&
        current.referenceImage !== patch.referenceImage
      ) {
        URL.revokeObjectURL(current.referenceImage);
      }

      return { ...current, ...patch };
    });
  }

  function updateCode(type, value) {
    setWorkspace((current) => ({
      ...current,
      code: {
        ...current.code,
        [type]: value,
      },
    }));
  }

  function insertSnippet(snippet) {
    setWorkspace((current) => ({
      ...current,
      activeTab: snippet.target,
      code: {
        ...current.code,
        [snippet.target]: `${current.code[snippet.target]}\n\n${snippet.code}`,
      },
    }));
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p>Personal Workspace</p>
          <h1>Web Publishing Practice Studio</h1>
        </div>
        <span className="autosave">localStorage autosave</span>
      </header>

      <main className="workspace-grid">
        <ReferencePanel
          image={workspace.referenceImage}
          onImageChange={(referenceImage) => updateWorkspace({ referenceImage })}
          onImageClear={() => updateWorkspace({ referenceImage: '', overlay: false })}
        />

        <div className="center-stack">
          <CodeEditor
            activeTab={workspace.activeTab}
            values={workspace.code}
            onTabChange={(activeTab) => updateWorkspace({ activeTab })}
            onCodeChange={updateCode}
          />
          <SnippetPanel onInsert={insertSnippet} />
        </div>

        <div className="right-stack">
          <PreviewPanel
            srcDoc={previewDocument}
            referenceImage={workspace.referenceImage}
            viewport={workspace.viewport}
            customWidth={workspace.customWidth}
            overlay={workspace.overlay}
            overlayOpacity={workspace.overlayOpacity}
            gridSize={workspace.gridSize}
            compareMode={workspace.compareMode}
            onViewportChange={(viewport) => updateWorkspace({ viewport })}
            onCustomWidthChange={(customWidth) => updateWorkspace({ customWidth })}
            onOverlayChange={(overlay) => updateWorkspace({ overlay })}
            onOverlayOpacityChange={(overlayOpacity) => updateWorkspace({ overlayOpacity })}
            onGridSizeChange={(gridSize) => updateWorkspace({ gridSize })}
            onCompareModeChange={(compareMode) => updateWorkspace({ compareMode })}
          />
          <ReferenceLinksPanel referenceImage={workspace.referenceImage} />
          <AnswerCheckPanel
            code={workspace.code}
            referenceImage={workspace.referenceImage}
          />
        </div>
      </main>
    </div>
  );
}
