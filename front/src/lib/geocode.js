const cache = new Map();

export const geocode = async (query) => {
  if (!query || !query.trim()) return null;
  const key = query.trim().toLowerCase();
  if (cache.has(key)) return cache.get(key);

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&format=json&limit=1&countrycodes=es`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "ConectCar/1.0 TFG (educational)",
        "Accept-Language": "es",
      },
    });
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      cache.set(key, null);
      return null;
    }
    const result = {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
      label: data[0].display_name,
    };
    cache.set(key, result);
    return result;
  } catch (err) {
    console.warn("[geocode]", query, err?.message);
    return null;
  }
};
