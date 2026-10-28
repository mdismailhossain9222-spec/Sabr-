export type Category = "Eveningwear" | "Tailoring" | "Occasion" | "Tweed";

export type Product = {
  id: number;
  name: string;
  price: number;
  tag: string;
  category: Category;
  sizes: string[];
  description: string;
};

export type CartItem = { key: string; product: Product; size: string; qty: number };

export const CATEGORIES: ("All" | Category)[] = ["All", "Eveningwear", "Occasion", "Tailoring", "Tweed"];

export const PRODUCTS: Product[] = [
  {
    id: 1, name: "The Black Swan", price: 450, tag: "No. 01", category: "Eveningwear",
    sizes: ["S", "M", "L", "XL"],
    description: "A fluid midnight silhouette with a sculpted bodice and soft column skirt. Made for gala evenings in Dubai.",
  },
  {
    id: 2, name: "The Éclat", price: 380, tag: "No. 02", category: "Occasion",
    sizes: ["S", "M", "L", "XL"],
    description: "Luminous satin with a delicate cowl neckline, made to catch the light at every celebration.",
  },
  {
    id: 3, name: "The Espresso", price: 520, tag: "No. 03", category: "Tailoring",
    sizes: ["S", "M", "L", "XL"],
    description: "Precision-cut co-ord in a rich espresso tone. Sharp shoulders and a relaxed wide-leg trouser.",
  },
  {
    id: 4, name: "The Coco", price: 410, tag: "No. 04", category: "Tweed",
    sizes: ["S", "M", "L"],
    description: "A softly structured blazer dress with gilded buttons. Modern tailoring with a feminine touch.",
  },
];
