
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface ExpenseAdvancedFiltersProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

const ExpenseAdvancedFilters: React.FC<ExpenseAdvancedFiltersProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory
}) => (
  <div className="mb-3 flex items-center gap-3">
    <div>
      <label className="text-sm font-medium block mb-1">Categoria</label>
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="min-w-[120px]">
          <SelectValue placeholder="Todas" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          {categories.map(cat => (
            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>
);

export default ExpenseAdvancedFilters;
