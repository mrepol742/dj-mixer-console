export async function createBlobFromURL(url: string): Promise<Blob | undefined> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network error');
    const blob = await response.blob();
    return blob;
  } catch (err) {
    console.error('Failed to create Blob:', err);
  }
  return undefined;
}
