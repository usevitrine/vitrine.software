// The app's scrollbar (its lib/overlayScroll.ts), for the site: the browser's own takes room when it appears, so a
// thin thumb floats over the content instead - shown while scrolling and when the pointer comes near (wider under
// it, so it's easy to grab), dragged to scroll; gone when idle or when there's nothing to scroll. With a mouse only:
// touch screens keep their own (it floats there already). overlayScroll('page') for the page itself (a thumb along
// the right of the window, under the header), overlayScroll(el, 'x') for a code block that scrolls sideways.
const fine = () => matchMedia('(hover: hover) and (pointer: fine)').matches;

export function overlayScroll(target: HTMLElement | 'page', axis: 'x' | 'y' = 'y') {
  if (!fine()) return;
  const page = target === 'page';
  const el = page ? document.documentElement : target;
  const host = page ? document.body : el.parentElement;
  if (!host) return;
  if (page) el.classList.add('oscroll-on');
  else {
    el.classList.add('oscroll-host');
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
  }
  const thumb = document.createElement('div');
  thumb.className = `oscroll ${axis}${page ? ' page' : ''}`;
  thumb.setAttribute('aria-hidden', 'true'); // (the page scrolls with the wheel, keys and touch as ever)
  host.appendChild(thumb);

  const view = () => (axis === 'x' ? el.clientWidth : page ? innerHeight : el.clientHeight);
  const full = () => (axis === 'x' ? el.scrollWidth : el.scrollHeight);
  const at = () => (axis === 'x' ? el.scrollLeft : page ? scrollY : el.scrollTop);
  // (instantly: the page scrolls smoothly for its links, and each step of a drag cut the last one's glide short)
  const go = (v: number) => (page ? window : el).scrollTo(axis === 'x' ? { left: v, behavior: 'instant' } : { top: v, behavior: 'instant' });
  // The page's thumb runs from under the header to the bottom of the window.
  const head = () => (page ? (document.querySelector<HTMLElement>('header.top')?.offsetHeight ?? 0) : 0);
  const track = () => (page ? innerHeight - head() - 4 : view() - 4);

  let hideTimer = 0;
  let dragging: { p: number; at: number } | null = null;
  let near = false;

  function place() {
    const max = full() - view();
    if (max <= 1) {
      thumb.classList.remove('on');
      thumb.style.display = 'none';
      return;
    }
    thumb.style.display = '';
    const len = track();
    const size = Math.max(32, (len * view()) / full());
    const off = (at() / max) * (len - size) + 2;
    if (axis === 'x') {
      thumb.style.width = `${size}px`;
      thumb.style.left = `${el.offsetLeft + off}px`;
      thumb.style.top = `${el.offsetTop + el.clientHeight - 9}px`;
    } else if (page) {
      thumb.style.height = `${size}px`;
      thumb.style.top = `${head() + off}px`;
      thumb.style.right = '3px';
    } else {
      thumb.style.height = `${size}px`;
      thumb.style.top = `${el.offsetTop + off}px`;
      thumb.style.right = `${host!.clientWidth - (el.offsetLeft + el.clientWidth) + 3}px`;
    }
  }
  function show() {
    place();
    if (thumb.style.display === 'none') return;
    thumb.classList.add('on');
    clearTimeout(hideTimer);
    if (!dragging && !near) hideTimer = window.setTimeout(() => thumb.classList.remove('on'), 900);
  }

  // The pointer near the edge the thumb runs along: it shows (and stays while it's there).
  const onMove = (e: PointerEvent) => {
    const r = page ? new DOMRect(0, head(), innerWidth, innerHeight - head()) : el.getBoundingClientRect();
    const was = near;
    near =
      axis === 'x'
        ? e.clientY > r.bottom - 20 && e.clientY <= r.bottom + 2 && e.clientX >= r.left && e.clientX <= r.right
        : e.clientX > r.right - 24 && e.clientX <= r.right + 2 && e.clientY >= r.top && e.clientY <= r.bottom;
    if (near || was) show();
  };
  const onLeave = () => {
    near = false;
    show();
  };
  const coord = (e: PointerEvent) => (axis === 'x' ? e.clientX : e.clientY);
  const onDown = (e: PointerEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    dragging = { p: coord(e), at: at() };
    thumb.setPointerCapture(e.pointerId);
    thumb.classList.add('drag');
  };
  const onDrag = (e: PointerEvent) => {
    if (!dragging) return;
    const room = track() - (axis === 'x' ? thumb.offsetWidth : thumb.offsetHeight);
    if (room <= 0) return;
    go(dragging.at + ((coord(e) - dragging.p) / room) * (full() - view()));
  };
  const onUp = () => {
    dragging = null;
    thumb.classList.remove('drag');
    show();
  };

  (page ? window : el).addEventListener('scroll', show, { passive: true });
  (page ? window : el).addEventListener('pointermove', onMove as EventListener, { passive: true });
  if (page) document.documentElement.addEventListener('pointerleave', onLeave);
  else el.addEventListener('pointerleave', onLeave);
  thumb.addEventListener('pointerdown', onDown);
  thumb.addEventListener('pointermove', onDrag);
  thumb.addEventListener('pointerup', onUp);
  thumb.addEventListener('pointercancel', onUp);
  thumb.addEventListener('pointerenter', () => ((near = true), show()));
  thumb.addEventListener('pointerleave', () => ((near = false), show()));
  // The content or the window changing size moves it (nothing to scroll: gone).
  const ro = new ResizeObserver(() => place());
  ro.observe(page ? document.body : el);
  addEventListener('resize', place, { passive: true });
  place();
}
