const FIELD =
  "mt-2 w-full rounded-xl bg-page text-primary outline-none placeholder:text-tertiary focus:outline-2 focus:outline-brand";

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  placeholder: string;
  multiline?: boolean;
};

export function TextField({
  id,
  label,
  value,
  onChange,
  maxLength,
  placeholder,
  multiline = false,
}: Props) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-[14px] font-bold text-secondary">
          {label}
        </label>
        <span className="text-[12px] text-tertiary tabular-nums">
          {value.length}/{maxLength}
        </span>
      </div>

      {multiline ? (
        <textarea
          id={id}
          name={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          maxLength={maxLength}
          placeholder={placeholder}
          className={`${FIELD} h-35 resize-none p-4 text-[14px] leading-[20px]`}
        />
      ) : (
        <input
          id={id}
          name={id}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          maxLength={maxLength}
          placeholder={placeholder}
          className={`${FIELD} h-13 px-4 text-[15px]`}
        />
      )}
    </div>
  );
}
