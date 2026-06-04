const STORAGE_KEY = 'publishing-practice-studio:v1';

export function loadWorkspace(fallback) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return fallback;

    if (saved.length > 2_000_000) {
      localStorage.removeItem(STORAGE_KEY);
      return fallback;
    }

    const workspace = { ...fallback, ...JSON.parse(saved) };

    // blob/data 이미지 URL은 새로고침 뒤 재사용할 수 없거나 너무 커서 저장하지 않습니다.
    return { ...workspace, referenceImage: '' };
  } catch {
    return fallback;
  }
}

export function saveWorkspace(workspace) {
  try {
    const { referenceImage, ...safeWorkspace } = workspace;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeWorkspace));
  } catch {
    // 저장 공간이 부족해도 편집 화면이 멈추지 않도록 자동 저장 실패만 조용히 무시합니다.
  }
}
