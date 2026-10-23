/**
* Custom Dropdown Component
* ---------------------------------------
* This is a **controlled component**.
*
* - `value` must come from the parent (string or null)
* - `onChange` is NOT an event handler.
*   It receives the **selected value directly**:
*
*     onChange: (value: string) => void
*
*  ---------------------------------------
*   Example usage:
*
*     const [subject, setSubject] = useState("");
*       <Dropdown
*          label="Project type"
*            options={[
*               { value: "branding", label: "Branding" },
*               { value: "web", label: "Web Design" },
*               { value: "full", label: "Full Brand + Web" },
*           ]}
*           value={subject}
*           onChange={(value) => setSubject(value)}
*       />
*
* Accessibility:
* - Handles keyboard arrows, Enter, Escape.
* - Focus returns to the button after selection.
*
* This component renders a custom dropdown (not a native <select>),
* so its open panel is fully stylable and lives in the DOM.
*/

import React, {
    useState,
    useRef,
    useEffect,
    useId,
    KeyboardEvent,
    MouseEvent,
    ReactNode,   
} from "react"

import './dropdown-select.scss'

type Option = {
    value: string
    label: string
}

type DropdownProps = {
    label?: string              // Optional visible label
    options: Option[]
    value: string | null        // currently selected value
    onChange: (value: string) => void
    placeholder?: string
    classNameWrapper?: string 
    classNameButton?: string
    name?: string
    id?: string
    customIcon?: ReactNode
}

const Dropdown: React.FC<DropdownProps> = ({
    label,
    options,
    value,
    onChange,
    placeholder = "Select an option",
    classNameWrapper,
    classNameButton,
    name,
    id,
    customIcon,
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState<number | null>(null)

    const buttonRef = useRef<HTMLButtonElement | null>(null)
    const listRef = useRef<HTMLUListElement | null>(null)
    const wrapperRef = useRef<HTMLDivElement | null>(null)

    const selectedOption = options.find((opt) => opt.value === value) || null

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | globalThis.MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
                setActiveIndex(null)
            }
        }

        if (isOpen) { document.addEventListener("mousedown", handleClickOutside) }

        return () => { document.removeEventListener("mousedown", handleClickOutside) }

    }, [isOpen])

    // When opening, set active index to currently selected (or first item)
    useEffect(() => {
        if (isOpen) {
            const initialIndex = selectedOption
                ? options.findIndex((opt) => opt.value === selectedOption.value)
                : 0
            setActiveIndex(initialIndex >= 0 ? initialIndex : 0)
        }
    }, [isOpen, options, selectedOption])

    // Move focus into the list when it opens, so its arrow/Enter/Escape handling works
    useEffect(() => {
        if (isOpen) { listRef.current?.focus() }
    }, [isOpen])

    const toggleOpen = () => { setIsOpen((prev) => !prev) }

    const handleButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault()
            setIsOpen(true)
        }
    }

    const handleListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
        if (event.key === "Escape") {
            event.preventDefault()
            setIsOpen(false)
            buttonRef.current?.focus()
            return
        }

        // Tabbing away closes the list
        if (event.key === "Tab") {
            setIsOpen(false)
            return
        }

        if (event.key === "ArrowDown") {
            event.preventDefault()
            setActiveIndex((prev) => {
                if (prev === null) return 0
                return prev === options.length - 1 ? 0 : prev + 1
            })
        }

        if (event.key === "ArrowUp") {
            event.preventDefault()
            setActiveIndex((prev) => {
                if (prev === null) return options.length - 1
                return prev === 0 ? options.length - 1 : prev - 1
            })
        }

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            if (activeIndex !== null) {
                const opt = options[activeIndex]
                onChange(opt.value)
                setIsOpen(false)
                buttonRef.current?.focus()
            }
        }
    }

    const handleOptionClick = (index: number) => {
        const opt = options[index]
        onChange(opt.value)
        setIsOpen(false)
        buttonRef.current?.focus()
    }

    // Unique per instance, so several dropdowns on one page don't share IDs
    const uid = useId()
    const listboxId = `${uid}-listbox`
    const labelId = label ? `${uid}-label` : undefined
    const valueId = `${uid}-value`
    const optionId = (index: number) => `${uid}-option-${index}`

    return (
        <div
            className={`dropdown ${classNameWrapper || ""}`}
            ref={wrapperRef}
        >
            {label && (
                <label id={labelId} className="dropdown__label">
                    {label}
                </label>
            )}

            <button
                type="button"
                className={`dropdown__button ${classNameButton || ""}`}
                ref={buttonRef}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={listboxId}
                aria-labelledby={labelId ? `${labelId} ${valueId}` : undefined}
                onClick={toggleOpen}
                onKeyDown={handleButtonKeyDown}
                name={name}
                id={id}
            >
                <span className="dropdown__button-text" id={valueId}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <span className="dropdown__icon">
                    {customIcon ? customIcon : "▾"}
                </span>
            </button>
            <ul
                id={listboxId}
                className={`dropdown__list ${isOpen ? "dropdown__list--open" : ""}`}
                role="listbox"
                aria-labelledby={labelId}
                ref={listRef}
                tabIndex={-1}
                aria-activedescendant={isOpen && activeIndex !== null ? optionId(activeIndex) : undefined}
                onKeyDown={handleListKeyDown}
            >
                {options.map((opt, index) => {
                    const isActive = index === activeIndex
                    const isSelected = opt.value === value

                    return (
                        <li
                            key={opt.value}
                            id={optionId(index)}
                            role="option"
                            aria-selected={isSelected}
                            className={`dropdown__option 
                                ${ isActive ? "dropdown__option--active" : ""} 
                                ${isSelected ? "dropdown__option--selected" : ""}
                            `}
                            onMouseDown={(e) => e.preventDefault()} // avoid losing focus before click
                            onClick={() => handleOptionClick(index)}
                        >
                            {opt.label}
                        </li>
                    )
                })}
            </ul>
            
        </div>
    )
}

export default Dropdown