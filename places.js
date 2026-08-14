

const DESTINATION_COORDINATES = {
  'Santorini|Greece': { lat: 36.3932, lng: 25.4615 },
  'Tokyo|Japan': { lat: 35.6762, lng: 139.6503 },
  'Bali|Indonesia': { lat: -8.4095, lng: 115.1889 },
  'Reykjavik|Iceland': { lat: 64.1466, lng: -21.9426 },
  'Marrakech|Morocco': { lat: 31.6295, lng: -7.9811 },
  'Machu Picchu|Peru': { lat: -13.1631, lng: -72.5450 },
  'Kyoto|Japan': { lat: 35.0116, lng: 135.7681 },
  'Paris|France': { lat: 48.8566, lng: 2.3522 },
  'Rome|Italy': { lat: 41.9028, lng: 12.4964 },
  'Barcelona|Spain': { lat: 41.3851, lng: 2.1734 },
  'Dubai|UAE': { lat: 25.2048, lng: 55.2708 },
  'London|UK': { lat: 51.5074, lng: -0.1278 },
  'New York City|USA': { lat: 40.7128, lng: -74.0060 },
  'Sydney|Australia': { lat: -33.8688, lng: 151.2093 },
  'Cape Town|South Africa': { lat: -33.9249, lng: 18.4241 },
  'Queenstown|New Zealand': { lat: -45.0312, lng: 168.6626 },
  'Prague|Czech Republic': { lat: 50.0755, lng: 14.4378 },
  'Havana|Cuba': { lat: 23.1136, lng: -82.3666 },
  'Patagonia|Argentina': { lat: -50.0000, lng: -73.0000 },
  'Amalfi Coast|Italy': { lat: 40.6340, lng: 14.6027 },
  'Maldives|Maldives': { lat: 3.2028, lng: 73.2207 },
  'Petra|Jordan': { lat: 30.3285, lng: 35.4444 },
  'Norwegian Fjords|Norway': { lat: 61.0000, lng: 6.0000 },
  'Swiss Alps|Switzerland': { lat: 46.8182, lng: 8.2275 },
  'Banff|Canada': { lat: 51.4968, lng: -115.9281 },
  'Rio de Janeiro|Brazil': { lat: -22.9068, lng: -43.1729 },
  'Cartagena|Colombia': { lat: 10.3910, lng: -75.4794 }
};

function getDestinationKey(destination, country) {
  return `${String(destination || '').trim()}|${String(country || '').trim()}`;
}

function getDestinationCoordinates(destination, country) {
  return DESTINATION_COORDINATES[getDestinationKey(destination, country)] || null;
}

if (typeof window !== 'undefined') {
  window.DESTINATION_COORDINATES = DESTINATION_COORDINATES;
  window.getDestinationCoordinates = getDestinationCoordinates;
}