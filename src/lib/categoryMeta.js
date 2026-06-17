const CATEGORY_PRESETS = {
  'ขั้นสูง': {
    icon: 'bx-trophy',
    accent: 'text-primary',
  },
  'ขั้นต้น': {
    icon: 'bx-leaf',
    accent: 'text-emerald-400',
  },
  'ปานกลาง': {
    icon: 'bx-layer',
    accent: 'text-sky-400',
  },
};

const FALLBACK_PRESETS = [
  { icon: 'bx-flask', accent: 'text-gold' },
  { icon: 'bx-book-bookmark', accent: 'text-violet-400' },
  { icon: 'bx-cube', accent: 'text-rose-400' },
  { icon: 'bx-diamond', accent: 'text-amber-400' },
];

export const getCategoryMeta = (category, index = 0) => {
  if (CATEGORY_PRESETS[category]) return CATEGORY_PRESETS[category];
  return FALLBACK_PRESETS[index % FALLBACK_PRESETS.length];
};
