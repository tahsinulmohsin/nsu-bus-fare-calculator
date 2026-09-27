import Image, { type StaticImageData } from "next/image";
import fleet from "../assets/gallery-fleet.webp";
import showroom from "../assets/gallery-showroom.webp";
import handoverOne from "../assets/gallery-handover-1.webp";
import handoverTwo from "../assets/gallery-handover-2.webp";
import { SectionHeading } from "./ui";

const PHOTOS: { src: StaticImageData; alt: string }[] = [
  {
    src: fleet,
    alt: "The back of a white NSU minibus, lettered North South University, parked in a row of NSU buses under trees",
  },
  {
    src: showroom,
    alt: "The front of a white Mitsubishi Fuso Rosa minibus with NSU on the bonnet, seen through a showroom window",
  },
  {
    src: handoverOne,
    alt: "Officials receive flowers beside a North South University bus at the Mitsubishi Fuso Rosa handover ceremony",
  },
  {
    src: handoverTwo,
    alt: "A group of officials stands beside two NSU buses behind the handover ceremony board",
  },
];

/* Photos of the buses, set the way northsouth.edu sets its photo band:
   a centred title over a row of rounded images, square on every screen,
   two across on a phone and four on a wide screen. Rendered on the
   server; the images load lazily at the size each screen needs. */
export function BusGallery() {
  return (
    <section id="buses" aria-labelledby="buses-title" className="scroll-mt-4 bg-band py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="buses-title" title="The NSU student buses">
          NSU&apos;s Mitsubishi Fuso Rosa minibuses, and the ceremony where
          they were handed over.
        </SectionHeading>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-4 lg:grid-cols-4 lg:gap-6">
          {PHOTOS.map((photo) => (
            <li key={photo.alt}>
              <Image
                src={photo.src}
                alt={photo.alt}
                placeholder="blur"
                sizes="(min-width: 1280px) 296px, (min-width: 1024px) 23vw, 48vw"
                className="aspect-square h-auto w-full rounded-card object-cover shadow-card"
              />
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-8 max-w-[65ch] text-center text-sm leading-relaxed text-ink-body">
          The photo of the buses in a row is by NSU Daily Hub.
        </p>
      </div>
    </section>
  );
}
