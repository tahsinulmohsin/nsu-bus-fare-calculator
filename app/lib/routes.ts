/* Route schedules for the NSU student bus service.
   Times come from the NSU Transport portal. Verify each semester. */

export interface PickupPoint {
  point: string;
  times: string[];
}

export interface RouteData {
  pickups: PickupPoint[];
  arrivals: string[];
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

export const ROUTES: Record<string, RouteData> = {
  Uttara: {
    pickups: [
      { point: "Abdullahpur (Polwel Market)", times: ["6:55 AM", "1:00 PM", "4:00 PM"] },
      { point: "House Building (Janata Bank)", times: ["7:00 AM", "1:05 PM", "4:05 PM"] },
      { point: "Azampur (Uttra East Thana)", times: ["7:05 AM", "1:10 PM", "4:10 PM"] },
      { point: "Jashimuddin (Footover Bridge)", times: ["7:10 AM", "1:15 PM", "4:15 PM"] },
      { point: "Airport (Traffic Police Box)", times: ["7:15 AM", "1:20 PM", "4:25 PM"] },
    ],
    arrivals: ["7:40 AM", "1:45 PM", "5:20 PM"],
    departures: ["11:20 AM", "02:40 PM", "06:30 PM"],
  },
  Mirpur: {
    pickups: [
      { point: "Bangla College (Foot Over Bridge)", times: ["6:35 AM", "12:50 PM", "4:10 PM"] },
      { point: "Mirpur-1, (New Market)", times: ["6:40 AM", "1:00 PM", "4:20 PM"] },
      { point: "Mirpur-2, (National Bangla High School)", times: ["6:45 AM", "1:05 PM", "4:30 PM"] },
      { point: "Mirpur-10, (Metro Rail Station)", times: ["6:50 AM", "1:10 PM", "4:40 PM"] },
      { point: "Mirpur-11, (Metro Rail Station)", times: ["6:55 AM", "1:15 PM", "4:45 PM"] },
      { point: "Mirpur-12, (CNG Station/Mirpur Ceramic)", times: ["7:00 AM", "1:25 PM", "4:55 PM"] },
      { point: "ECB Square Jatri Chawni / Footover Bridge", times: ["7:10 AM", "1:35 PM", "5:05 PM"] },
    ],
    arrivals: ["7:40 AM", "2:20 PM", "5:50 PM"],
    departures: ["11:20 AM", "02:40 PM", "06:30 PM", "10:20 PM"],
  },
  Mohammadpur: {
    pickups: [
      { point: "Mohammadpur (Japan Garden City)", times: ["6:30 AM", "12:30 PM", "4:15 PM"] },
      { point: "Oposite of Suchana Community Center (Probal Housing)", times: ["6:35 AM", "12:35 PM", "4:20 PM"] },
      { point: "Syamoli Bus Stand (Hotel Mohammadia)", times: ["6:40 AM", "12:40 PM", "4:25 PM"] },
      { point: "Agargoan Metro Rail Station", times: ["6:50 AM", "12:50 PM", "4:35 PM"] },
      { point: "BAF Shaheen College", times: ["7:00 AM", "1:00 PM", "4:45 PM"] },
      { point: "Banani Rail Station", times: ["7:10 AM", "1:10 PM", "4:55 PM"] },
    ],
    arrivals: ["7:40 AM", "2:20 PM", "5:45 PM"],
    departures: ["11:20 AM", "02:40 PM", "06:30 PM", "10:20 PM"],
  },
  Dhanmondi: {
    pickups: [
      { point: "Jigatola Bus Stand (Japan Bangladesh Hospital)", times: ["6:30 AM", "12:40 PM", "4:10 PM"] },
      { point: "Dhanmondi-27, (Rapa Plaza)", times: ["6:40 AM", "12:55 PM", "4:25 PM"] },
      { point: "Khamarbari Mor", times: ["6:45 AM", "1:00 PM", "4:35 PM"] },
      { point: "Mohakhali Fly Over Banani End Point.", times: ["7:00 AM", "1:20 PM", "4:55 PM"] },
    ],
    arrivals: ["7:40 AM", "2:20 PM", "5:30 PM"],
    departures: ["11:20 AM", "02:40 PM", "06:30 PM"],
  },
  Azimpur: {
    pickups: [
      { point: "Azimpur (Matri Sadan Hospital)", times: ["6:30 AM", "12:40 PM", "4:40 PM"] },
      { point: "Katabon Bus Stand", times: ["6:40 AM", "12:55 PM", "4:50 PM"] },
      { point: "Bangla Motor Pharmacy Council Office", times: ["6:45 AM", "01:05 PM", "5:05 PM"] },
      { point: "Mogbazar (NCC Bank)", times: ["6:50 AM", "1:20 PM", "5:20 PM"] },
      { point: "Gulshan Niketon Gate-1, (Jatri Chawni)", times: ["7:00 AM", "1:30 PM", "5:40 PM"] },
    ],
    arrivals: ["7:40 AM", "1:50 PM", "6:50 PM"],
    departures: ["11:20 AM", "02:40 PM"],
  },
  Khilgaon: {
    pickups: [
      { point: "Notre Dame College", times: ["6:30 AM", "12:40 PM", "4:35 PM"] },
      { point: "Rajarbag Bus Stand", times: ["6:35 AM", "12:45 PM", "4:45 PM"] },
      { point: "Khilgaon Bagicha Jame Masjid", times: ["6:40 AM", "12:50 PM", "4:55 PM"] },
      { point: "Malibagh Rail Gate (Ibne Sina Hospital)", times: ["6:50 AM", "12:55 PM", "5:10 PM"] },
      { point: "Malibag (Abul Hotel)", times: ["6:55 AM", "1:00 PM", "5:15 PM"] },
      { point: "Rampura Bridge opposite of BTV", times: ["7:00 AM", "1:05 PM", "5:25 PM"] },
    ],
    arrivals: ["7:40 AM", "2:20 PM", "6:50 PM"],
    departures: ["11:20 AM", "02:40 PM"],
  },
};

export const LIMITED_DEPARTURE_ROUTES = ["Azimpur", "Khilgaon"];
