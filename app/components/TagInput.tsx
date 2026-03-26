'use client'

import { useState, KeyboardEvent, ChangeEvent } from 'react'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

export function TagInput({ value, onChange, placeholder }: TagInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      // 入力が空の状態でBackspaceを押したら最後のタグを削除
      onChange(value.slice(0, -1))
    }
  }

  const addTag = () => {
    const trimmed = inputValue.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
      setInputValue('')
    }
  }

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    // カンマまたは読点が入力されたら自動追加
    if (newValue.endsWith(',') || newValue.endsWith('、')) {
      setInputValue(newValue.slice(0, -1))
      addTag()
    } else {
      setInputValue(newValue)
    }
  }

  return (
    <div className="border rounded-md p-2 flex flex-wrap gap-2 items-center min-h-[42px] focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-ring">
      {value.map((tag, index) => (
        <div
          key={index}
          className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1 text-sm"
        >
          <span>{tag}</span>
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="hover:bg-blue-200 rounded-full p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      <Input
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={value.length === 0 ? placeholder : ''}
        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 min-w-[120px] p-0 h-auto"
      />
    </div>
  )
}