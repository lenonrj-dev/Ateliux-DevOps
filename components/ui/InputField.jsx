"use client";

export default function InputField({
  label,
  description,
  error,
  required,
  rightSlot,
  as = "input",
  children,
  className = "",
  ...props
}) {
  const Comp = as;
  return (
    <label className="block space-y-1.5 text-sm">
      {label && (
        <div className="flex items-center justify-between text-gray-200">
          <span className="font-medium">
            {label}
            {required ? <span className="text-rose-300 ml-1">*</span> : null}
          </span>
          {rightSlot}
        </div>
      )}
      {description && <p className="text-xs text-gray-400">{description}</p>}
      <Comp
        className={`w-full rounded-lg border border-white/10 bg-[#0c1118] px-3 py-2.5 text-gray-100 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-cyan-500/40 disabled:opacity-60 ${className}`}
        {...props}
      >
        {children}
      </Comp>
      {error && <p className="text-xs text-rose-300">{error}</p>}
    </label>
  );
}
