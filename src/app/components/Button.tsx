
interface ButtonProps {
    content: string
    disabled: boolean
    onClick?: ()=>void
}


export function Button ({content,disabled = false,onClick}:ButtonProps) {

    const FILL_BASE = "w-full h-full px-5 rounded-2xl text-[17px] font-bold"
    const FILL_DISABLED = "bg-muted text-disabled"
    const FILL_ENABLED = "bg-brand text-white active:text-brand active:bg-brand-subtle"

    return (
        <button
        disabled={disabled}
        onClick={onClick}
        className={`${FILL_BASE} ${disabled ? FILL_DISABLED : FILL_ENABLED}`}
        >
            {content}
        </button>
    )
}