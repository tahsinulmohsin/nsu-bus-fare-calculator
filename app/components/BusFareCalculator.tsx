"use client";

import { useState, useMemo, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Bus,
  Calculator,
  Clock,
  ExternalLink,
  Calendar,
  MapPin,
  Ticket,
  AlertCircle,
  Minus,
  Plus,
  ChevronDown,
  Info,
  Moon,
  Sun,
  Map,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════ */
interface PickupPoint {
  point: string;
  times: string[];
}

interface RouteData {
  pickups: PickupPoint[];
  arrivals: string[];
  departures: string[];
}

interface RouteInfo {
  key: string;
  label: string;
  number: string;
}

type TripType = "round" | "one-way" | "per-day";

/* ═══════════════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════════════ */
const SEMESTER_START = "June 20, 2026";
const SEMESTER_END = "September 08, 2026";
const SEMESTER_START_DATE = new Date(2026, 5, 20); // months 0-indexed
const SEMESTER_END_DATE = new Date(2026, 8, 8);
const TOTAL_DAYS = 81;
const FRIDAYS = 11;
const BASE_ACTIVE_DAYS = TOTAL_DAYS - FRIDAYS; // 70
const FARE_PER_TRIP = 100; // BDT per direction per day
const BOOKING_URL = "https://transport.northsouth.edu/";
const CALENDAR_URL =
  "https://www.northsouth.edu/academic/academic-calendar.html";

const ROUTE_LIST: RouteInfo[] = [
  { key: "Uttara", label: "Uttara", number: "01" },
  { key: "Mirpur", label: "Mirpur", number: "02" },
  { key: "Mohammadpur", label: "Mohammadpur", number: "03" },
  { key: "Dhanmondi", label: "Dhanmondi", number: "04" },
  { key: "Azimpur", label: "Azimpur", number: "05" },
  { key: "Khilgaon", label: "Khilgaon", number: "06" },
];

/* ─── Weekdays (Sat → Thu, Friday excluded) ─── */
const WEEKDAYS = [
  { key: 6, short: "Sat", full: "Saturday" },
  { key: 0, short: "Sun", full: "Sunday" },
  { key: 1, short: "Mon", full: "Monday" },
  { key: 2, short: "Tue", full: "Tuesday" },
  { key: 3, short: "Wed", full: "Wednesday" },
  { key: 4, short: "Thu", full: "Thursday" },
];

const TRIP_LABELS = ["Morning", "Afternoon", "Evening"];

/* ═══════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════ */
function countWeekdayInRange(weekday: number, start: Date, end: Date): number {
  const msPerDay = 86_400_000;
  const totalDays = Math.floor((end.getTime() - start.getTime()) / msPerDay) + 1;
  const startDay = start.getDay();
  const offset = ((weekday - startDay) % 7 + 7) % 7;
  if (offset >= totalDays) return 0;
  return Math.floor((totalDays - offset - 1) / 7) + 1;
}

/* ═══════════════════════════════════════════════════════
   Route Data
   ═══════════════════════════════════════════════════════ */
const ROUTES: Record<string, RouteData> = {
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

/* ═══════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════ */
export default function BusFareCalculator() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  /* ── State ── */
  const [selectedRoute, setSelectedRoute] = useState<string>("");
  const [tripType, setTripType] = useState<TripType>("round");
  const [toNsuTiming, setToNsuTiming] = useState<string>("");
  const [fromNsuTiming, setFromNsuTiming] = useState<string>("");
  const [selectedDays, setSelectedDays] = useState<number[]>([]); // Default empty
  const [holidays, setHolidays] = useState<number>(0);

  // Time state for deadline calculation
  const [isDeadlineOver, setIsDeadlineOver] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    // Deadline: June 17, 2026, 04:00 PM BD Time (GMT+6)
    // Using a string representation to avoid timezone issues, parsing it correctly:
    const deadline = new Date("2026-06-17T16:00:00+06:00").getTime();
    if (Date.now() > deadline) {
      setIsDeadlineOver(true);
    }
  }, []);

  /* ── Precomputed weekday counts for semester ── */
  const weekdayCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    for (const d of WEEKDAYS) {
      counts[d.key] = countWeekdayInRange(
        d.key,
        SEMESTER_START_DATE,
        SEMESTER_END_DATE
      );
    }
    return counts;
  }, []);

  /* ── Derived values ── */
  const totalSelectedDays = useMemo(
    () => selectedDays.reduce((s, d) => s + (weekdayCounts[d] ?? 0), 0),
    [selectedDays, weekdayCounts]
  );

  const activeDays = useMemo(
    () => Math.max(0, totalSelectedDays - holidays),
    [totalSelectedDays, holidays]
  );

  let costPerDay = 0;
  let totalFare = 0;

  if (tripType === "round") {
    costPerDay = FARE_PER_TRIP * 2;
    totalFare = costPerDay * activeDays;
  } else if (tripType === "one-way") {
    costPerDay = FARE_PER_TRIP;
    totalFare = costPerDay * activeDays;
  } else if (tripType === "per-day") {
    costPerDay = FARE_PER_TRIP;
    totalFare = FARE_PER_TRIP; // Per day is fixed to 100 throughout the semester as per requirement
  }

  const routeData = selectedRoute ? ROUTES[selectedRoute] : null;
  const selectedRouteInfo = ROUTE_LIST.find((r) => r.key === selectedRoute);
  const hasLimitedDepartures =
    selectedRoute === "Azimpur" || selectedRoute === "Khilgaon";

  /* ── Handlers ── */
  const handleRouteChange = (route: string) => {
    setSelectedRoute(route);
    setToNsuTiming("");
    setFromNsuTiming("");
  };

  const toggleDay = (dayKey: number) => {
    setSelectedDays((prev) => {
      const next = prev.includes(dayKey)
        ? prev.filter((d) => d !== dayKey)
        : [...prev, dayKey];
      const newTotal = next.reduce((s, d) => s + (weekdayCounts[d] ?? 0), 0);
      if (holidays > newTotal) setHolidays(Math.max(0, newTotal));
      return next;
    });
  };

  const handleHolidayChange = (value: number) => {
    setHolidays(Math.min(totalSelectedDays, Math.max(0, value)));
  };

  const formatCurrency = (amount: number) => amount.toLocaleString("en-IN");

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  /* ═════════════════════════════════════════════════════
     Render
     ═════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 dark:bg-gradient-to-br dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/20 transition-colors duration-300">
      {/* ════════════════════════════════════════════════
          Hero Header
          ════════════════════════════════════════════════ */}
      <header className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 dark:from-slate-950 dark:via-blue-950/50 dark:to-indigo-950 border-b border-white/5 dark:border-white/10">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 left-1/4 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-10 w-[200px] h-[200px] bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex justify-between items-start mb-5">
            <div className="flex items-center gap-3 animate-fade-in-up">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/25 backdrop-blur-sm">
                <Bus className="w-6 h-6 text-amber-400" />
              </div>
              <p className="text-blue-300 text-sm font-semibold tracking-widest uppercase">
                North South University
              </p>
            </div>
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition-colors animate-fade-in-up"
                aria-label="Toggle dark mode"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 animate-fade-in-up animation-delay-100 tracking-tight">
            Bus Fare Calculator
          </h1>
          <p className="text-lg sm:text-xl text-blue-200/80 font-medium mb-7 animate-fade-in-up animation-delay-200">
            Summer 2026 Semester
          </p>

          <div className="flex flex-wrap gap-2.5 animate-fade-in-up animation-delay-300">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-sm text-sm text-blue-100 border border-white/[0.08]">
              <Calendar className="w-3.5 h-3.5 text-blue-300" />
              {SEMESTER_START} – {SEMESTER_END}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-sm text-sm text-blue-100 border border-white/[0.08]">
              {TOTAL_DAYS} Total Days
            </span>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════
          Main Content
          ════════════════════════════════════════════════ */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* ─── Route Selector ─── */}
        <div className="mb-8 animate-fade-in-up animation-delay-200">
          <label
            htmlFor="route-selector"
            className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2.5"
          >
            Select Your Route
          </label>
          <div className="relative max-w-xl">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 pointer-events-none z-10" />
            <select
              id="route-selector"
              value={selectedRoute}
              onChange={(e) => handleRouteChange(e.target.value)}
              className="w-full appearance-none pl-12 pr-12 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 font-medium shadow-sm hover:border-blue-300 dark:hover:border-blue-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all duration-200 cursor-pointer"
            >
              <option value="">— Please select —</option>
              {ROUTE_LIST.map((route) => (
                <option key={route.key} value={route.key}>
                  {route.label} (Route # {route.number})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
          </div>
        </div>

        {/* ─── Two-Column Grid ─── */}
        <div className="grid lg:grid-cols-5 gap-6 mb-8">
          {/* ─── Fare Calculator Card ─── */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden animate-fade-in-up animation-delay-300">
            {/* Card Header */}
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 dark:from-slate-800/50 to-blue-50/50 dark:to-blue-900/10">
              <div className="flex items-center gap-2.5">
                <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  Fare Calculator
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* ── Trip Type ── */}
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-3">
                  Trip Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setTripType("round")}
                    className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      tripType === "round"
                        ? "border-blue-500 bg-blue-50/80 dark:bg-blue-500/10 dark:text-blue-400 text-blue-700 shadow-sm"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                    }`}
                  >
                    <span className="block font-semibold text-sm">Round Trip</span>
                    <span className="block text-xs font-medium opacity-80 mt-0.5">
                      Semester Package
                    </span>
                  </button>
                  <button
                    onClick={() => setTripType("one-way")}
                    className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      tripType === "one-way"
                        ? "border-teal-500 bg-teal-50/80 dark:bg-teal-500/10 dark:text-teal-400 text-teal-700 shadow-sm"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                    }`}
                  >
                    <span className="block font-semibold text-sm">One-Way</span>
                    <span className="block text-xs font-medium opacity-80 mt-0.5">
                      Semester Package
                    </span>
                  </button>
                  <button
                    onClick={() => setTripType("per-day")}
                    className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      tripType === "per-day"
                        ? "border-amber-500 bg-amber-50/80 dark:bg-amber-500/10 dark:text-amber-400 text-amber-700 shadow-sm"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                    }`}
                  >
                    <span className="block font-semibold text-sm">Per Day Trip</span>
                    <span className="block text-xs font-medium opacity-80 mt-0.5">
                      Ad-hoc
                    </span>
                  </button>
                </div>
              </div>

              {/* ── Booking Schedule Notice ── */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex gap-3 items-start animate-fade-in-up">
                <AlertCircle className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Booking Schedule
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {tripType === "per-day" ? (
                      "Bus can be booked till one hour before departure."
                    ) : isDeadlineOver ? (
                      <span className="text-red-500 dark:text-red-400 font-semibold">
                        Booking time has ended.
                      </span>
                    ) : (
                      "16 June 2026 to 17 June 2026 (10:00 AM to 04:00 PM)"
                    )}
                  </p>
                </div>
              </div>

              {/* ── Preferred Timings (shown when route is selected) ── */}
              {routeData && tripType !== "per-day" && (
                <div className="space-y-3 animate-fade-in-up">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                    Preferred Timing
                    {selectedRouteInfo && (
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-normal ml-1.5">
                        — {selectedRouteInfo.label} route
                      </span>
                    )}
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* To NSU timing (Round Trip or One Way) */}
                    {(tripType === "round" || tripType === "one-way") && (
                      <div>
                        <span className="block text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1.5 uppercase tracking-wider">
                          To NSU {tripType === "one-way" ? "(Optional)" : ""}
                        </span>
                        <div className="relative">
                          <select
                            id="to-nsu-timing"
                            value={toNsuTiming}
                            onChange={(e) => setToNsuTiming(e.target.value)}
                            className="w-full appearance-none pl-3 pr-9 py-2.5 bg-blue-50/60 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all cursor-pointer"
                          >
                            <option value="">Any timing</option>
                            {routeData.arrivals.map((time, i) => (
                              <option key={i} value={String(i)}>
                                {TRIP_LABELS[i] ?? `Trip ${i + 1}`} — arrives{" "}
                                {time}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    )}

                    {/* From NSU timing */}
                    {(tripType === "round" || tripType === "one-way") && (
                      <div>
                        <span className="block text-xs text-teal-600 dark:text-teal-400 font-semibold mb-1.5 uppercase tracking-wider">
                          From NSU {tripType === "one-way" ? "(Optional)" : ""}
                        </span>
                        <div className="relative">
                          <select
                            id="from-nsu-timing"
                            value={fromNsuTiming}
                            onChange={(e) => setFromNsuTiming(e.target.value)}
                            className="w-full appearance-none pl-3 pr-9 py-2.5 bg-teal-50/60 dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 font-medium focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:outline-none transition-all cursor-pointer"
                          >
                            <option value="">Any timing</option>
                            {routeData.departures.map((time, i) => (
                              <option key={i} value={String(i)}>
                                Departs {time}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Commute Days (Hidden for Per Day Trip) ── */}
              {tripType !== "per-day" && (
                <>
                  <div className="animate-fade-in-up">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                        Commute Days
                      </label>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() =>
                            setSelectedDays(WEEKDAYS.map((d) => d.key))
                          }
                          className="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold cursor-pointer transition-colors"
                        >
                          All
                        </button>
                        <span className="text-slate-300 dark:text-slate-600 text-[11px]">·</span>
                        <button
                          onClick={() => {
                            setSelectedDays([]);
                            setHolidays(0);
                          }}
                          className="text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-semibold cursor-pointer transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-6 gap-2">
                      {WEEKDAYS.map((day) => {
                        const isOn = selectedDays.includes(day.key);
                        const count = weekdayCounts[day.key] ?? 0;
                        return (
                          <button
                            key={day.key}
                            onClick={() => toggleDay(day.key)}
                            className={`flex flex-col items-center gap-0.5 py-2.5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                              isOn
                                ? "border-blue-500 bg-blue-500 text-white shadow-sm shadow-blue-500/20"
                                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                            }`}
                          >
                            <span className="text-xs sm:text-sm font-bold leading-none">
                              {day.short}
                            </span>
                            <span
                              className={`text-[10px] font-medium leading-none mt-0.5 ${
                                isOn ? "text-blue-200" : "text-slate-400 dark:text-slate-500"
                              }`}
                            >
                              {count}d
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── Holidays / Absences ── */}
                  <div className="animate-fade-in-up">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <label
                        htmlFor="holidays-input"
                        className="block text-sm font-medium text-slate-600 dark:text-slate-300"
                      >
                        Estimated Holidays / Absences
                      </label>
                      <a
                        href={CALENDAR_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors group"
                      >
                        <Calendar className="w-3 h-3" />
                        View Academic Calendar
                        <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleHolidayChange(holidays - 1)}
                        disabled={holidays <= 0}
                        className="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer active:scale-95"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        id="holidays-input"
                        type="number"
                        min="0"
                        max={totalSelectedDays}
                        value={holidays}
                        onChange={(e) =>
                          handleHolidayChange(parseInt(e.target.value) || 0)
                        }
                        className="w-20 text-center py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
                      />
                      <button
                        onClick={() => handleHolidayChange(holidays + 1)}
                        disabled={holidays >= totalSelectedDays}
                        className="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* ── Calculation Breakdown ── */}
                  <div className="bg-slate-50/80 dark:bg-slate-800/50 rounded-xl p-4 space-y-2.5 border border-slate-100 dark:border-slate-700/50 animate-fade-in-up">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Selected weekdays</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium tabular-nums">
                        {totalSelectedDays} days
                      </span>
                    </div>
                    {holidays > 0 && (
                      <div className="flex justify-between text-sm animate-fade-in-up">
                        <span className="text-slate-500 dark:text-slate-400">
                          Holidays / Absences
                        </span>
                        <span className="text-red-500 dark:text-red-400 font-medium tabular-nums">
                          −{holidays} days
                        </span>
                      </div>
                    )}
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-2.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-700 dark:text-slate-300 font-semibold">
                          Active days
                        </span>
                        <span className="text-blue-700 dark:text-blue-400 font-bold tabular-nums">
                          {activeDays} days
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* ─── Total Fare Banner ─── */}
            <div className="px-6 py-7 bg-gradient-to-r from-blue-950 via-indigo-950 to-blue-950 dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-blue-900/40 border-t border-blue-900/50 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.15),transparent_60%)]" />
              <div className="relative">
                <p className="text-blue-300/80 dark:text-blue-200/60 text-sm font-medium mb-1.5 uppercase tracking-wider">
                  {tripType === "per-day" ? "Per Day Fare" : "Total Semester Fare"}
                </p>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums">
                    ৳{formatCurrency(totalFare)}
                  </span>
                  <span className="text-blue-300/70 text-lg font-semibold">
                    BDT
                  </span>
                </div>
                <p className="text-blue-300/50 text-xs mt-2.5 font-medium">
                  {tripType === "per-day" 
                    ? "Fixed price per day for ad-hoc trips" 
                    : `${activeDays} days × ৳${costPerDay}/day`}
                </p>
              </div>
            </div>
          </div>

          {/* ─── Right Column: Quick Actions ─── */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in-up animation-delay-400">
            {/* Book Now Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-6">
              <div className="flex items-center gap-2.5 mb-3">
                <Ticket className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  Ready to Book?
                </h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
                Head to the official NSU Transport portal to book your bus
                ticket for Summer 2026.
              </p>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                id="book-ticket-cta"
                className="flex items-center justify-center gap-2.5 w-full px-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 animate-pulse-glow"
              >
                <Ticket className="w-5 h-5" />
                Book Bus Ticket Now
                <ExternalLink className="w-4 h-4 opacity-80" />
              </a>
            </div>

            {/* Semester Info Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-6">
              <div className="flex items-center gap-2.5 mb-4">
                <Info className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  Semester Info
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50/70 dark:bg-slate-800/80 border border-blue-100/60 dark:border-slate-700/50">
                  <Calendar className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 uppercase tracking-wider">
                      Duration
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-200 mt-0.5">
                      {SEMESTER_START} – {SEMESTER_END}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Total Days
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                      {TOTAL_DAYS} days ({FRIDAYS} Fridays excluded)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50/70 dark:bg-amber-900/10 border border-amber-100/60 dark:border-amber-900/30">
                  <Map className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                      Routes Available
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">
                      6 routes across Dhaka
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Reference Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-6">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">
                Pricing Reference
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50/60 dark:bg-slate-800 border border-blue-100/50 dark:border-slate-700">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    One-Way or Per Day
                  </span>
                  <span className="text-sm font-bold text-blue-700 dark:text-blue-400 tabular-nums">
                    ৳{FARE_PER_TRIP}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-teal-50/60 dark:bg-slate-800 border border-teal-100/50 dark:border-slate-700">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Round-Trip
                  </span>
                  <span className="text-sm font-bold text-teal-700 dark:text-teal-400 tabular-nums">
                    ৳{FARE_PER_TRIP * 2}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════
            Schedule Section
            ════════════════════════════════════════════════ */}
        {routeData && selectedRouteInfo ? (
          <div
            key={selectedRoute}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden animate-fade-in-up"
          >
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 dark:from-slate-800/50 to-blue-50/50 dark:to-blue-900/10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                      Schedule — {selectedRouteInfo.label}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Route # {selectedRouteInfo.number}: NSU –{" "}
                      {selectedRouteInfo.label} – NSU
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold self-start sm:self-auto">
                  <MapPin className="w-3 h-3" />
                  {routeData.pickups.length} stops
                </span>
              </div>
            </div>

            <div className="p-6">
              {/* Pickup Points Table */}
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                Pickup Points & Approximate Times
              </h3>
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 mb-8">
                <table className="w-full text-sm min-w-[540px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                      <th className="text-left py-3.5 px-4 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider w-10">
                        #
                      </th>
                      <th className="text-left py-3.5 px-4 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">
                        Pickup Point
                      </th>
                      <th className="text-center py-3.5 px-4 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">
                        🌅 Trip 1
                      </th>
                      <th className="text-center py-3.5 px-4 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">
                        ☀️ Trip 2
                      </th>
                      <th className="text-center py-3.5 px-4 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">
                        🌇 Trip 3
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {routeData.pickups.map((pickup, index) => (
                      <tr
                        key={index}
                        className="transition-colors hover:bg-blue-50/40 dark:hover:bg-slate-800"
                      >
                        <td className="py-3 px-4 text-slate-400 dark:text-slate-500 font-mono text-xs font-medium">
                          {String(index + 1).padStart(2, "0")}
                        </td>
                        <td className="py-3 px-4 text-slate-700 dark:text-slate-200 font-medium text-sm">
                          {pickup.point}
                        </td>
                        {pickup.times.map((time, tIndex) => (
                          <td key={tIndex} className="py-3 px-4 text-center">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-semibold tabular-nums whitespace-nowrap">
                              {time}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Arrival & Departure Cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-50/80 to-teal-50/40 dark:from-emerald-900/10 dark:to-teal-900/10 p-5">
                  <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-400 mb-3.5 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Approximate Arrival at NSU
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {routeData.arrivals.map((time, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3.5 py-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-emerald-200/60 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 font-mono text-sm font-semibold shadow-sm tabular-nums"
                      >
                        {time}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-rose-200 dark:border-rose-900/50 bg-gradient-to-br from-rose-50/80 to-pink-50/40 dark:from-rose-900/10 dark:to-pink-900/10 p-5">
                  <h4 className="text-sm font-semibold text-rose-800 dark:text-rose-400 mb-3.5 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    Expected Departure from NSU
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {routeData.departures.map((time, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3.5 py-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-rose-200/60 dark:border-rose-800/50 text-rose-700 dark:text-rose-300 font-mono text-sm font-semibold shadow-sm tabular-nums"
                      >
                        {time}
                      </span>
                    ))}
                  </div>

                  {hasLimitedDepartures && (
                    <div className="mt-4 flex items-start gap-2.5 p-3 rounded-lg bg-amber-50/90 dark:bg-amber-900/20 border border-amber-200/80 dark:border-amber-900/50">
                      <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                        <strong className="font-semibold">Note:</strong> The{" "}
                        <strong>{selectedRouteInfo.label}</strong> route does
                        not have departures at 6:30 PM or 10:20 PM.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-12 sm:p-16 text-center animate-fade-in-up">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 mx-auto mb-5">
              <MapPin className="w-8 h-8 text-blue-400 dark:text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Select a Route
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Choose your bus route from the dropdown above to view the
              complete pickup schedule, arrival times, and departure times.
            </p>
          </div>
        )}
      </main>

      {/* ════════════════════════════════════════════════
          Footer
          ════════════════════════════════════════════════ */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Bus className="w-4 h-4" />
              <span className="font-medium">
                NSU Bus Fare Calculator — Summer 2026
              </span>
            </div>
            <p className="text-xs text-slate-400 text-center sm:text-right">
              Unofficial tool. Always verify with the{" "}
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 underline underline-offset-2 transition-colors"
              >
                official NSU Transport portal
              </a>
              .
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
