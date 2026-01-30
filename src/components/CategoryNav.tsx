import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  { value: "all", label: "All Products" },
  { value: "watches", label: "Watches" },
  { value: "wallets", label: "Wallets" },
  { value: "handbags", label: "Handbags" },
];

export function CategoryNav() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";

  const handleCategoryClick = (category: string) => {
    if (category === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center py-8 px-4">
      {CATEGORIES.map((cat) => (
        <Button
          key={cat.value}
          onClick={() => handleCategoryClick(cat.value)}
          variant={activeCategory === cat.value ? "default" : "outline"}
          className="font-medium"
        >
          {cat.label}
        </Button>
      ))}
    </div>
  );
}
