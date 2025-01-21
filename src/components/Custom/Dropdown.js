import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { debounce } from 'lodash';

const SearchableDropdown = ({
    options,
    value,
    onChange,
    placeholder = 'Select an option',
    searchPlaceholder = 'Search...',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState(options);
    const dropdownRef = useRef(null);
    const panelRef = useRef(null);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced search function
    const debouncedSearch = debounce((searchTerm) => {
        const filtered = options.filter((option) =>{
            const targetValue = option.name || option.Act_name || ""; // Check `name` first, then `act_name`
            return targetValue.toLowerCase().includes(searchTerm.toLowerCase());
        });
        setFilteredOptions(filtered);
    }, 300);

    // Handle search input change
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    // Get selected option name
    const selectedName = value
        ? options.find(option => option._id === value)?.name || options.find(option => option._id === value)?.Act_name
        : '';

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/* Dropdown trigger button */}
            <button
                type="button"
                className="w-full px-4 py-2.5 text-left bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center"
                onClick={() => {
                    setIsOpen(!isOpen);
                    setFilteredOptions(options);
                }}
            >
                <span className="truncate">
                    {selectedName || placeholder}
                </span>
                {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
            </button>

            {/* Dropdown panel */}
            {isOpen && (
                <div
                    ref={panelRef}
                    className="absolute z-50 w-full bottom-full mb-1 bg-white border rounded-lg shadow-lg max-h-[80vh] flex flex-col"
                >
                    {/* Search input */}
                    <div className="sticky top-0 p-2 bg-white border-b rounded-t-lg">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                className="w-full pl-9 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder={searchPlaceholder}
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>

                    {/* Options list */}
                    <div className="overflow-y-auto overscroll-contain min-h-[100px] max-h-[300px]">
                        {filteredOptions.length === 0 ? (
                            <div className="p-4 text-sm text-gray-500 text-center">
                                No results found
                            </div>
                        ) : (
                            <ul className="py-2">
                                {filteredOptions.map((option) => (
                                    <li
                                        key={option._id}
                                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-blue-50 flex items-center ${option._id === value ? 'bg-blue-50' : ''
                                            }`}
                                        onClick={() => {
                                            onChange(option._id);
                                            setIsOpen(false);
                                            setSearchTerm('');
                                        }}
                                    >
                                        {option.name || option.Act_name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchableDropdown;