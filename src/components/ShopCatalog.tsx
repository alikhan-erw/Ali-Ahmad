'use client';

import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Check } from 'lucide-react';

interface ShopCatalogProps {
  initialCategory?: string | null;
}

export const ShopCatalog: React.FC<ShopCatalogProps> = ({ initialCategory }) => {
  const { products, categories, language } = useStore();
  const isUrdu = language === 'ur';

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(50000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>(
    'featured'
  );
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract unique brands
  const brands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand)));
  }, [products]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          selectedCategory === 'all' || p.category === selectedCategory;
        const matchesBrand = selectedBrand === 'all' || p.brand === selectedBrand;
        const currentPrice = p.salePrice || p.price;
        const matchesPrice = currentPrice <= maxPrice;
        const matchesStock = inStockOnly ? p.stock > 0 : true;

        return matchesCategory && matchesBrand && matchesPrice && matchesStock;
      })
      .sort((a, b) => {
        const priceA = a.salePrice || a.price;
        const priceB = b.salePrice || b.price;

        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, selectedBrand, maxPrice, inStockOnly, sortBy]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setMaxPrice(50000);
    setInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-10 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-stone-200">
          <div>
            <span className="text-xs uppercase font-semibold tracking-widest text-stone-500">
              {isUrdu ? 'مجموعہ نمائش' : 'Artisanal Archive'}
            </span>
            <h1
              className={`text-3xl sm:text-4xl font-display font-semibold text-stone-950 mt-1 ${
                isUrdu ? 'font-urdu' : ''
              }`}
            >
              {isUrdu ? 'تمام شاہکار مصنوعات' : 'Curated Masterpieces'}
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Showing {filteredProducts.length} handcrafted pieces
            </p>
          </div>

          {/* Sort & Mobile Filter Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-white border border-stone-300 text-stone-800 text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-none focus:outline-hidden font-medium"
              >
                <option value="featured">Featured Curations</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Client Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
          
          {/* Desktop Left Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6 shadow-xs">
              
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <span className="font-semibold text-stone-900 text-xs uppercase tracking-wider">
                  Filter Criteria
                </span>
                <button
                  onClick={clearFilters}
                  className="text-stone-400 hover:text-stone-900 text-xs underline"
                >
                  Clear All
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase text-stone-700">
                  Categories
                </label>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left py-1.5 px-2 rounded-lg transition-colors flex justify-between ${
                      selectedCategory === 'all'
                        ? 'bg-stone-900 text-white font-semibold'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span>All Collections</span>
                    <span className="font-mono">{products.length}</span>
                  </button>

                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.name)}
                      className={`w-full text-left py-1.5 px-2 rounded-lg transition-colors flex justify-between ${
                        selectedCategory === c.name
                          ? 'bg-stone-900 text-white font-semibold'
                          : 'text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <span>{isUrdu ? c.urduName : c.name}</span>
                      <span className="font-mono">
                        {products.filter((p) => p.category === c.name).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <label className="block text-xs font-semibold uppercase text-stone-700">
                  Atelier / Brand
                </label>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => setSelectedBrand('all')}
                    className={`w-full text-left py-1.5 px-2 rounded-lg transition-colors ${
                      selectedBrand === 'all'
                        ? 'bg-stone-900 text-white font-semibold'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    All Ateliers
                  </button>
                  {brands.map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBrand(b)}
                      className={`w-full text-left py-1.5 px-2 rounded-lg transition-colors ${
                        selectedBrand === b
                          ? 'bg-stone-900 text-white font-semibold'
                          : 'text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-stone-700 uppercase">Max Budget</span>
                  <span className="font-mono font-bold text-stone-900 tabular-nums">
                    PKR {maxPrice.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={50000}
                  step={2000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-stone-900 cursor-pointer"
                />
              </div>

              {/* Availability */}
              <div className="pt-2 border-t border-stone-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="accent-stone-900 rounded"
                  />
                  <span>Show In-Stock Pieces Only</span>
                </label>
              </div>

            </div>
          </aside>

          {/* Right Products Grid */}
          <main className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
                <p className="font-medium text-stone-900">No pieces match your selected filters.</p>
                <p className="text-xs text-stone-500">
                  Try adjusting the maximum price or selecting another artisanal atelier.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-stone-900 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-stone-800"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>

        </div>

      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-6 space-y-6 overflow-y-auto">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <span className="font-semibold text-stone-900 text-sm">Filter Catalog</span>
              <button onClick={() => setMobileFilterOpen(false)}>
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="space-y-2 text-xs">
              <label className="font-semibold text-stone-700 block">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-stone-300 rounded"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Max Price */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="font-semibold text-stone-700">Max Budget</span>
                <span className="font-mono">PKR {maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={10000}
                max={50000}
                step={2000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-stone-900"
              />
            </div>

            <div className="pt-4 flex gap-2">
              <button
                onClick={() => {
                  clearFilters();
                  setMobileFilterOpen(false);
                }}
                className="flex-1 py-2 border rounded text-xs text-stone-600"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2 bg-stone-900 text-white rounded text-xs font-semibold"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
