export function removeLoadingScreen() {
  const loader = document.getElementById('app-loading');
  if (!loader) return;

  loader.classList.add('opacity-0', 'transition-opacity', 'duration-300');

  setTimeout(() => {
    loader.remove();
  }, 300);
}

export function showErrorScreen(errors: string[]) {
  const loader = document.getElementById('app-loading');

  if (loader) {
    loader.innerHTML = `
      <div class="p-6 text-center">
        <h1 class="text-xl font-semibold mb-2">Unsupported Browser</h1>
        <p class="mb-3">Required features are missing:</p>
        <ul class="list-disc text-left inline-block text-red-600">
          ${errors.map(e => `<li>${e}</li>`).join('')}
        </ul>
      </div>
    `;
  }
}
