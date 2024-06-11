import React from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';

interface TagProps {
    text: string;
    onRemove: () => void;
    onSelected?: () => void;
    isSelected: boolean
}

const Tag = ({ text, onSelected, onRemove, isSelected }: TagProps) => {
    return (
        <div className={`flex items-center ${isSelected ? 'bg-blue-700' : 'bg-gray-900'} cursor-pointer hover:bg-red-950/50 hover:text-red-600 text-white rounded-full px-3 py-1 m-1 text-sm font-medium`}>
            <span onClick={onSelected}>{text}</span>
            <XMarkIcon 
                className="h-5 w-5 ml-2 cursor-pointer" 
                onClick={onRemove}
            />
        </div>
    );
};

export default Tag;