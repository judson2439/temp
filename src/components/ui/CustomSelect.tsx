import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface CustomSelectProps {
  name: string;
  value: string;
  onChange: (e: { target: { name: string; value: string } }) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  icon?: React.ElementType;
  label?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  name,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  error,
  disabled = false,
  icon: Icon,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((prev) => {
            const next = prev + 1;
            return next >= options.length ? 0 : next;
          });
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) => {
            const next = prev - 1;
            return next < 0 ? options.length - 1 : next;
          });
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0 && !options[highlightedIndex]?.disabled) {
            handleSelect(options[highlightedIndex].value);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, highlightedIndex, options]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && listRef.current && highlightedIndex >= 0) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement;
      if (item) {
        item.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleSelect = (selectedValue: string) => {
    onChange({ target: { name, value: selectedValue } });
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        const currentIndex = options.findIndex((opt) => opt.value === value);
        setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
      }
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">
          {label}
        </label>
      )}
      
      {/* Select Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        className={`
          w-full flex items-center gap-3 px-4 py-3.5 
          bg-white dark:bg-slate-800 
          border-2 rounded-xl
          transition-all duration-200
          text-left
          ${isOpen 
            ? 'border-[#27AE60] ring-4 ring-[#27AE60]/10' 
            : error 
              ? 'border-red-400' 
              : value 
                ? 'border-[#27AE60]/50 hover:border-[#27AE60]/70' 
                : 'border-slate-200 dark:border-slate-700 hover:border-[#27AE60]/50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-900' : 'cursor-pointer'}
        `}
      >
        {/* Left Icon */}
        {Icon && (
          <span className="text-[#27AE60] flex-shrink-0">
            <Icon className="w-5 h-5" />
          </span>
        )}
        
        {/* Selected Value or Placeholder */}
        <span className={`flex-1 font-medium truncate ${
          selectedOption ? 'text-foreground' : 'text-muted-foreground'
        }`}>
          {selectedOption?.label || placeholder}
        </span>
        
        {/* Dropdown Arrow */}
        <span className={`text-[#27AE60] flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-5 h-5" />
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border-2 border-[#27AE60] rounded-xl shadow-xl shadow-[#27AE60]/10 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
          {/* Header showing current selection */}
          {placeholder && (
            <div className="px-4 py-3 bg-[#27AE60] text-white font-medium flex items-center gap-3">
              {Icon && <Icon className="w-5 h-5" />}
              <span>{selectedOption?.label || placeholder}</span>
            </div>
          )}
          
          {/* Options List */}
          <ul 
            ref={listRef}
            className="max-h-60 overflow-y-auto py-1"
            role="listbox"
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                onClick={() => !option.disabled && handleSelect(option.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`
                  px-4 py-3 flex items-center gap-3 cursor-pointer
                  transition-colors duration-100
                  ${option.disabled 
                    ? 'opacity-50 cursor-not-allowed' 
                    : highlightedIndex === index
                      ? 'bg-[#e8f8ef] dark:bg-[#27AE60]/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }
                  ${option.value === value ? 'bg-[#e8f8ef] dark:bg-[#27AE60]/20' : ''}
                `}
              >
                {/* Checkmark for selected item */}
                <span className={`w-5 h-5 flex items-center justify-center flex-shrink-0 ${
                  option.value === value ? 'text-[#27AE60]' : 'text-transparent'
                }`}>
                  <Check className="w-4 h-4" />
                </span>
                
                {/* Option Label */}
                <span className={`font-medium ${
                  option.value === value 
                    ? 'text-[#27AE60] dark:text-[#2ECC71]' 
                    : 'text-foreground'
                }`}>
                  {option.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{error}</p>
      )}
    </div>
  );
};

export default CustomSelect;
