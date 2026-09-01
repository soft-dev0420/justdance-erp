export function Toggle({
  checked,
  onChange,
  size = 'md',
  disabled = false,
}: {
  checked: boolean;
  onChange?: (value: boolean) => void;
  size?: 'sm' | 'md';
  disabled?: boolean;
}) {
  const isMd = size === 'md';
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange?.(!checked)}
      className={`relative shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-1 ${
        isMd ? 'h-6 w-10' : 'h-5 w-8'
      } ${checked ? 'bg-accent-500' : 'bg-gray-200'} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
    >
      <span
        className={`absolute left-0.5 top-0.5 block rounded-full bg-white shadow transition-transform duration-200 ${isMd ? 'h-5 w-5' : 'h-4 w-4'} ${
          checked ? (isMd ? 'translate-x-4' : 'translate-x-3') : ''
        }`}
      />
    </button>
  );
}
