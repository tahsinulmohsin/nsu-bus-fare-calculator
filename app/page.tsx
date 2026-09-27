import BusFareCalculator from "./components/BusFareCalculator";

/* Regenerated at most hourly, so the ticket sale band ships in the state
   that matches the current time (open, closed, collapsed) instead of
   jumping after load. */
export const revalidate = 3600;

export default function Home() {
  return <BusFareCalculator renderedAt={Date.now()} />;
}
