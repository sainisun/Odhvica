export type StorefrontProduct = {
  slug: string;
  title: string;
  collection: "Jackets" | "Bags" | "Textile objects";
  price: number;
  image: string;
  alt: string;
  status: "One of one" | "Made to order" | "Limited run";
  material: string;
  leadTime: string;
  description: string;
  care: string;
  customisation: string;
  sizes: string[];
};

export const storefrontProducts: StorefrontProduct[] = [
  {
    slug: "kantha-edit-01",
    title: "Kantha Edit 01",
    collection: "Jackets",
    price: 9200,
    image: "/manus-storage/odhvica-product-kantha-jacket_9849a270.jpg",
    alt: "Hand-quilted patchwork kantha jacket on a wooden hanger",
    status: "Made to order",
    material: "Reclaimed cotton kantha, softly quilted",
    leadTime: "Dispatches in 7–14 days",
    description: "A reversible quilted layer cut for everyday movement. Each panel is selected by hand, so colour placement is individual to every jacket.",
    care: "Gentle hand wash separately in cold water. Dry in shade.",
    customisation: "Share your usual size and preferred sleeve length at checkout. We confirm any fit questions before cutting.",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    slug: "loom-carryall",
    title: "Loom Carryall",
    collection: "Bags",
    price: 4800,
    image: "/manus-storage/odhvica-product-textile-bag_4cfd06e5.jpg",
    alt: "Handwoven striped artisan shoulder bag on a stone plinth",
    status: "Limited run",
    material: "Handwoven cotton with a reinforced textile strap",
    leadTime: "Ready to dispatch in 2–4 days",
    description: "A generous everyday carryall woven in small batches. The textured body is light, resilient and designed to become softer with use.",
    care: "Spot clean with a soft cloth. Keep dry between uses.",
    customisation: "Optional hand-written gift note can be added at checkout.",
    sizes: ["One size"],
  },
  {
    slug: "quiet-stitch-wrap",
    title: "Quiet Stitch Wrap",
    collection: "Textile objects",
    price: 3600,
    image: "/manus-storage/odhvica-product-craft-detail_21e0ae0b.jpg",
    alt: "Layered hand-stitched kantha textile in warm earthy shades",
    status: "One of one",
    material: "Layered vintage cotton with visible running stitch",
    leadTime: "Ready to dispatch in 2–4 days",
    description: "A versatile hand-stitched textile to wear, layer or live with. Its irregular stitch rhythm is the record of the maker’s hand.",
    care: "Hand wash gently and line dry away from direct sun.",
    customisation: "This is a unique piece; the photographed colour composition is the piece you receive.",
    sizes: ["One size"],
  },
];

export const collectionDetails = [
  { name: "Jackets", note: "Quilted layers, cut slowly", count: 12 },
  { name: "Bags", note: "Everyday woven companions", count: 8 },
  { name: "Textile objects", note: "Small rituals for the home", count: 6 },
] as const;

export function filterStorefrontProducts(query: string, collection: string) {
  const normalizedQuery = query.trim().toLowerCase();
  return storefrontProducts.filter((product) => {
    const matchesCollection = collection === "All" || product.collection === collection;
    const searchable = `${product.title} ${product.collection} ${product.material} ${product.status}`.toLowerCase();
    return matchesCollection && (!normalizedQuery || searchable.includes(normalizedQuery));
  });
}

export function findStorefrontProduct(slug: string) {
  return storefrontProducts.find((product) => product.slug === slug);
}
