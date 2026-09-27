/* Routes, stoppages and timings for the NSU student bus service.

   Source: "Sale of NSU Students' Bus Ticket - Fall 2026", Office of the
   Registrar. Stoppage names and every NSU arrival and departure time
   below are quoted from that notice.

   The notice lists stoppages WITHOUT per-stoppage pickup times, and it
   standardised the NSU arrival times across all six routes (Summer 2026
   had a different afternoon or evening arrival on four of them). The
   afternoon and evening pickup times therefore had to be re-timed and
   have not been republished, so they are not shown here.

   Morning pickup times are carried over from the Summer 2026 schedule
   and marked indicative in the UI. They are the one set that still
   holds: the 7:40 AM arrival and the stoppage list are identical in
   both notices. Confirm on the transport portal before relying on them. */

export interface PickupPoint {
  point: string;
  /* Indicative morning pickup, carried over from Summer 2026. */
  morning: string;
}

export interface RouteData {
  pickups: PickupPoint[];
  departures: string[];
}

export interface RouteInfo {
  key: string;
  label: string;
  number: string;
}

export const ROUTE_LIST: RouteInfo[] = [
  { key: "Uttara", label: "Uttara", number: "01" },
  { key: "Mirpur", label: "Mirpur", number: "02" },
  { key: "Mohammadpur", label: "Mohammadpur", number: "03" },
  { key: "Dhanmondi", label: "Dhanmondi", number: "04" },
  { key: "Azimpur", label: "Azimpur", number: "05" },
  { key: "Khilgaon", label: "Khilgaon", number: "06" },
];

/* Same three arrivals on every route for Fall 2026. */
export const ARRIVALS = ["7:40 AM", "2:20 PM", "5:45 PM"];

export const ROUTES: Record<string, RouteData> = {
  Uttara: {
    pickups: [
      { point: "Abdullahpur (Polwel Market)", morning: "6:55 AM" },
      { point: "House Building (Janata Bank)", morning: "7:00 AM" },
      { point: "Azampur (Uttara East Police Station)", morning: "7:05 AM" },
      { point: "Jashimuddin (Foot Over Bridge)", morning: "7:10 AM" },
      { point: "Airport (Traffic Police Box)", morning: "7:15 AM" },
    ],
    departures: ["11:20 AM", "2:40 PM", "6:30 PM"],
  },
  Mirpur: {
    pickups: [
      { point: "Bangla College (Foot Over Bridge)", morning: "6:35 AM" },
      { point: "Mirpur-1 (New Market)", morning: "6:40 AM" },
      { point: "Mirpur-2 (National Bangla High School)", morning: "6:45 AM" },
      { point: "Mirpur-10 (Metro Rail Station)", morning: "6:50 AM" },
      { point: "Mirpur-11 (Metro Rail Station)", morning: "6:55 AM" },
      { point: "Mirpur-12 (CNG Station / Mirpur Ceramic)", morning: "7:00 AM" },
      { point: "ECB Square (Jatri Chhawni) / Foot Over Bridge", morning: "7:10 AM" },
    ],
    departures: ["11:20 AM", "2:40 PM", "6:30 PM", "10:20 PM"],
  },
  Mohammadpur: {
    pickups: [
      { point: "Mohammadpur (Japan Garden City)", morning: "6:30 AM" },
      {
        point: "Opposite of Suchana Community Center (Probal Housing)",
        morning: "6:35 AM",
      },
      { point: "Syamoli Bus Stand (Hotel Mohammadia)", morning: "6:40 AM" },
      /* The notice prints "Agargoan", a typo for Agargaon. */
      { point: "Agargaon Metro Rail Station", morning: "6:50 AM" },
      { point: "BAF Shaheen College", morning: "7:00 AM" },
      { point: "Banani Rail Station", morning: "7:10 AM" },
    ],
    departures: ["11:20 AM", "2:40 PM", "6:30 PM", "10:20 PM"],
  },
  Dhanmondi: {
    pickups: [
      { point: "Jigatola Bus Stand (Japan Bangladesh Hospital)", morning: "6:30 AM" },
      { point: "Dhanmondi-27 (Rapa Plaza)", morning: "6:40 AM" },
      /* The notice prints "Khamarbari Mother", which is a typo for
         "Khamarbari Mor" as printed in earlier notices. */
      { point: "Khamarbari Mor", morning: "6:45 AM" },
      { point: "Mohakhali Fly Over (Banani End Point)", morning: "7:00 AM" },
    ],
    departures: ["11:20 AM", "2:40 PM", "6:30 PM"],
  },
  Azimpur: {
    pickups: [
      { point: "Azimpur (Matri Sadan Hospital)", morning: "6:30 AM" },
      { point: "Katabon Bus Stand", morning: "6:40 AM" },
      { point: "Bangla Motor Pharmacy Council Office", morning: "6:45 AM" },
      { point: "Mogbazar (NCC Bank)", morning: "6:50 AM" },
      { point: "Gulshan Niketon Gate-1 (Jatri Chhawni)", morning: "7:00 AM" },
    ],
    departures: ["11:20 AM", "2:40 PM"],
  },
  Khilgaon: {
    pickups: [
      { point: "Notre Dame College", morning: "6:30 AM" },
      { point: "Rajarbag Bus Stand", morning: "6:35 AM" },
      { point: "Khilgaon Bagicha Jame Masjid", morning: "6:40 AM" },
      { point: "Malibagh Rail Gate (Ibne Sina Hospital)", morning: "6:50 AM" },
      { point: "Malibag Abul Hotel", morning: "6:55 AM" },
      { point: "Rampura Bridge (Opposite of BTV)", morning: "7:00 AM" },
    ],
    departures: ["11:20 AM", "2:40 PM"],
  },
};

/* Why a route's evening departures stop early, quoted from the notice. */
export const DEPARTURE_NOTES: Record<string, string> = {
  Uttara: "No 10:20 PM departure to Uttara.",
  Dhanmondi: "No 10:20 PM departure to Dhanmondi.",
  Azimpur: "No 6:30 PM or 10:20 PM departure to Azimpur.",
  Khilgaon: "No 6:30 PM or 10:20 PM departure to Khilgaon.",
};
