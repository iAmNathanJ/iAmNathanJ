const CACHE = new WeakMap();

function cacheElement(root, selector, element) {
  if (!CACHE.has(root)) {
    CACHE.set(root, {});
  }
  CACHE.get(root)[selector] = element;
}

function fresh(selector, root = document) {
  const element = document.querySelector(selector, root);
  cacheElement(root, selector, element);
  return element;
}

function $(selector, root = document) {
  try {
    return CACHE.get(root)[selector];
  } catch (e) {
    return fresh(selector, root);
  }
}

export const html = $('html');
export const body = $('body');
export const navLinks = $('nav a');
export const header = $('header');
export const contact = $('#contact');
export const contactForm = $('#contact-form');
