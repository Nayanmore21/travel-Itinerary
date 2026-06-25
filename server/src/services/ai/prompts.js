export const EXTRACTION_PROMPT = `You are a travel document parser. Extract structured booking information from the provided document.

Return a single JSON object with these fields (use null for missing fields):
{
  "documentType": "flight" | "hotel" | "transport" | "visa" | "other",
  "origin": "city or airport code",
  "destination": "city or airport code",
  "departureDate": "YYYY-MM-DD",
  "returnDate": "YYYY-MM-DD or null",
  "flightNumber": "e.g. AI-204",
  "airline": "airline name",
  "hotelName": "hotel name",
  "checkIn": "YYYY-MM-DD",
  "checkOut": "YYYY-MM-DD",
  "passengerName": "full name",
  "confirmationNo": "booking reference",
  "rawText": "all text you can read from the document",
  "confidence": 0.0 to 1.0
}

Rules:
- For flight tickets: fill origin, destination, departureDate, flightNumber, airline, passengerName
- For hotel bookings: fill hotelName, destination, checkIn, checkOut, confirmationNo, passengerName
- Normalize all dates to YYYY-MM-DD format
- If a field is not present in the document, set it to null
- Set confidence based on how clearly you can read the document (1.0 = perfectly clear)`;

export const buildItineraryPrompt = (bookings) => `You are an expert travel planner. Create a detailed day-by-day travel itinerary based on the following confirmed bookings.

BOOKINGS:
${JSON.stringify(bookings, null, 2)}

Generate a comprehensive itinerary as a JSON object:
{
  "title": "Trip title e.g. 'Paris Adventure — 5 Days'",
  "days": [
    {
      "dayNumber": 1,
      "date": "YYYY-MM-DD",
      "theme": "Brief day theme e.g. 'Arrival & Explore Old Town'",
      "activities": [
        {
          "time": "09:00",
          "title": "Activity name",
          "description": "What to do and what to expect (2-3 sentences)",
          "category": "transport" | "sightseeing" | "food" | "hotel" | "leisure" | "shopping",
          "tip": "Local insider tip or booking advice",
          "locationName": "Place name",
          "mapsQuery": "Google Maps search query"
        }
      ]
    }
  ]
}

Rules:
- Create one day entry for EVERY day of the trip (from first departure to last return/checkout)
- Day 1 must include airport arrival and hotel check-in as the first activities
- Last day must include hotel checkout and departure flight
- Include 4-6 activities per day (balanced: morning, afternoon, evening)
- Mix sightseeing, local food, and leisure activities
- Include practical tips (best time to visit, booking needed?, local transport)
- For meals, suggest specific local dishes or restaurant types authentic to the destination
- Set mapsQuery to a useful Google Maps search (e.g. "Eiffel Tower Paris")
- Base the schedule around actual flight times and hotel check-in/checkout times from the bookings`;
