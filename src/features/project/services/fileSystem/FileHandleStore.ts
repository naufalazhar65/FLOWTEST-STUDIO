let currentHandle: FileSystemFileHandle | null = null;

export function setCurrentFileHandle(
  handle: FileSystemFileHandle | null,
) {
  currentHandle = handle;
}

export function getCurrentFileHandle() {
  return currentHandle;
}