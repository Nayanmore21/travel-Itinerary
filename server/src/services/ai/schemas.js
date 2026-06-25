import { z } from 'zod';

export const ExtractedBookingSchema = z.object({
  documentType: z.enum(['flight', 'hotel', 'transport', 'visa', 'other']).default('other'),
  origin: z.string().nullish(),
  destination: z.string().nullish(),
  departureDate: z.string().nullish(),
  returnDate: z.string().nullish(),
  flightNumber: z.string().nullish(),
  airline: z.string().nullish(),
  hotelName: z.string().nullish(),
  checkIn: z.string().nullish(),
  checkOut: z.string().nullish(),
  passengerName: z.string().nullish(),
  confirmationNo: z.string().nullish(),
  rawText: z.string().nullish(),
  confidence: z.number().min(0).max(1).nullish(),
});

const ActivitySchema = z.object({
  time: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.enum(['transport', 'sightseeing', 'food', 'hotel', 'leisure', 'shopping']),
  tip: z.string().optional(),
  locationName: z.string().optional(),
  mapsQuery: z.string().optional(),
});

export const DaySchema = z.object({
  dayNumber: z.number().int().positive(),
  date: z.string(),
  theme: z.string(),
  activities: z.array(ActivitySchema),
});

export const ItineraryOutputSchema = z.object({
  title: z.string(),
  days: z.array(DaySchema),
});
