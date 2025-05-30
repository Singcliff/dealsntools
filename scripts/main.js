""import { useEffect, useState } from 'react';
import { fetchSheetData } from './utils/api';

export default function Main() {
  const [deals, setDeals] = useState([]);
  const [featuredDeal, setFeaturedDeal] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  useEffect(() => {
    async function loadData() {
      const sheetData = await fetchSheetData();
      const validDeals = sheetData.filter(
        (deal) => deal.name && deal.link && deal.image
      );
      setDeals(validDeals);

      const featured = validDeals.find((deal) =>
        deal.tags?.toLowerCase().includes('featured')
      );
      setFeaturedDeal(featured);
    }

    loadData();
  }, []);

  const toggleDescription = (index) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <main className="bg-white dark:bg-black text-black dark:text-white min-h-screen px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold text-center mb-4">Featured Deal</h2>
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-md transition-colors">
          {featuredDeal ? (
            <div className="flex items-center space-x-4">
              <img
                src={featuredDeal.image}
                alt={featuredDeal.name}
                className="w-24 h-24 object-contain"
              />
              <div>
                <p className="text-lg font-semibold text-black dark:text-white">
                  {featuredDeal.name}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {featuredDeal.description}
                </p>
                <p className="text-green-600 font-bold mt-1">
                  ₹{featuredDeal.price}
                </p>
                <a
                  href={featuredDeal.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Buy Now
                </a>
              </div>
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500">
              ✨ Your top deal will appear here!
            </p>
          )}
        </div>

        <h2 className="text-xl font-semibold mt-10 mb-4 text-center">
          Trending Deals
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {deals.map((deal, index) => (
            <div
              key={index}
              className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow-md flex flex-col justify-between"
            >
              <img
                src={deal.image}
                alt={deal.name}
                className="w-full h-32 object-contain mb-2"
              />
              <div>
                <p className="font-semibold text-sm text-black dark:text-white">
                  {deal.name}
                </p>
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  {expandedDescriptions[index]
                    ? deal.description
                    : deal.description?.slice(0, 80)}
                  {deal.description?.length > 80 && (
                    <button
                      onClick={() => toggleDescription(index)}
                      className="text-blue-600 ml-1 text-xs"
                    >
                      {expandedDescriptions[index] ? 'Read Less' : 'Read More'}
                    </button>
                  )}
                </p>
                <p className="text-green-600 font-bold mt-1">₹{deal.price}</p>
              </div>
              <a
                href={deal.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm text-center"
              >
                Buy Now
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
""
