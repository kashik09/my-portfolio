'use client'

import { SectionFormProps, CardsData, Card } from '@/lib/sections/types'
import { Input } from '@/components/ui/Input'
import { StyledSelect } from '@/components/ui/StyledSelect'
import { Button } from '@/components/ui/Button'
import { Trash2, Plus } from 'lucide-react'

export function CardsForm({ data, onChange }: SectionFormProps<CardsData>) {
  const addCard = () => {
    onChange({
      ...data,
      cards: [...data.cards, { title: '', description: '', icon: '', link: '' }],
    })
  }

  const removeCard = (index: number) => {
    onChange({
      ...data,
      cards: data.cards.filter((_, i) => i !== index),
    })
  }

  const updateCard = (index: number, field: keyof Card, value: string) => {
    const newCards = [...data.cards]
    newCards[index] = { ...newCards[index], [field]: value }
    onChange({ ...data, cards: newCards })
  }

  return (
    <div className="space-y-4">
      <Input
        label="Section Title"
        value={data.title || ''}
        onChange={(e) => onChange({ ...data, title: e.target.value })}
        placeholder="e.g., Our Services"
      />

      <StyledSelect
        label="Columns"
        value={data.columns?.toString() || '3'}
        onChange={(e) => onChange({ ...data, columns: parseInt(e.target.value) as 2 | 3 | 4 })}
      >
        <option value="2">2 Columns</option>
        <option value="3">3 Columns</option>
        <option value="4">4 Columns</option>
      </StyledSelect>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Cards
          </label>
          <Button onClick={addCard} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add Card
          </Button>
        </div>

        {data.cards.map((card, index) => (
          <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Card {index + 1}
              </span>
              <button
                onClick={() => removeCard(index)}
                className="text-red-600 hover:text-red-700 dark:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <Input
              label="Title"
              value={card.title}
              onChange={(e) => updateCard(index, 'title', e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={card.description}
                onChange={(e) => updateCard(index, 'description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 text-sm"
              />
            </div>

            <Input
              label="Icon (optional)"
              value={card.icon || ''}
              onChange={(e) => updateCard(index, 'icon', e.target.value)}
              placeholder="e.g., ✨"
            />

            <Input
              label="Link (optional)"
              value={card.link || ''}
              onChange={(e) => updateCard(index, 'link', e.target.value)}
              placeholder="e.g., /services/web"
            />
          </div>
        ))}

        {data.cards.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No cards yet. Click "Add Card" to get started.
          </p>
        )}
      </div>
    </div>
  )
}
