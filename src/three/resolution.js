export function sceneDpr(mobile, nativeDpr = 1) {
  const native = Number.isFinite(nativeDpr) && nativeDpr > 0 ? nativeDpr : 1;
  return mobile ? Math.min(2, Math.max(1.5, native)) : Math.min(1.7, Math.max(1, native));
}
