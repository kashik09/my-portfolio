'use client'

import { SectionFormProps, CTAData } from '@/lib/sections/types'
import { Input } from '@/components/ui/Input'
import { StyledSelect } from '@/components/ui/StyledSelect'

export function CTAForm({ data, onChange }: SectionFormProps<CTAData>) {
  return (
    <div className="space-y-4">
      <Input
        label="Title"
        value={data.title}
        onChange={(e) => onChange({ ...data, title: e.target.value })}
        required
        placeholder="e.g., Ready to start your project?"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          value={data.description || ''}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 text-sm"
          placeholder="Optional description"
        />
      </div>

      <Input
        label="Button Text"
        value={data.buttonText}
        onChange={(e) => onChange({ ...data, buttonText: e.target.value })}
        required
        placeholder="e.g., Get Started"
      />

      <Input
        label="Button Link"
        value={data.buttonLink}
        onChange={(e) => onChange({ ...data, buttonLink: e.target.value })}
        required
        placeholder="e.g., /request"
      />

      <StyledSelect
        label="Variant"
        value={data.variant || 'primary'}
        onChange={(e) => onChange({ ...data, variant: e.target.value as 'primary' | 'secondary' })}
      >
        <option value="primary">Primary (Blue)</option>
        <option value="secondary">Secondary (Gray)</option>
      </StyledSelect>
    </div>
  )
}
