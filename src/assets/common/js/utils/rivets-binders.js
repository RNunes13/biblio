rivets.binders['lazyload-image'] = function binder(el, data) {
  const srcLoaded = el.getAttribute('src') === el.getAttribute('data-src');
  const dataProcessed = el.getAttribute('data-was-processed') === 'true';

  if (!srcLoaded && dataProcessed) {
    el.setAttribute('data-was-processed', 'false');
    el.classList.remove('is--loading');
    Biblio.lazyload.update([el]);
  }
}