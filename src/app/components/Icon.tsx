type Icon = 'Bell'|'ChevronLeft'|'Close'


const IconSrc: Record<Icon, string> = {
    Bell: "/Icon/Bell.svg",
    ChevronLeft: "/Icon/ChevronLeft.svg",
    Close: "/Icon/Close.svg"
    
    
} 

const sizeClass = {
    s: 'w-[16px] h-[16px]',
    m: 'w-[18px] h-[18px]',
    l: 'w-[20px] h-[20px]',
    xl: 'w-[22px] h-[22px]',
    plus: 'w-[24px] h-[24px]'

} as const

type Size = keyof typeof sizeClass

type Props = {
    icon:Icon,
    size:Size
}




export function Icon ({size,icon}:Props) {
    return (
            <img src={IconSrc[icon]} className={sizeClass[size]} />
    )
}