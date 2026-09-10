import { LayoutGrid } from "@/components/ui/layout-grid";
import styles from "./CampusLife.module.css";

function CampusContent({
  title,
  category,
  description,
}: {
  title: string;
  category: string;
  description: string;
}) {
  return (
    <div>
      <span className="mb-2 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
        {category}
      </span>
      <p className="font-bold text-xl md:text-3xl text-white">{title}</p>
      <p className="font-normal text-sm md:text-base my-3 max-w-lg text-neutral-200">
        {description}
      </p>
    </div>
  );
}

const cards = [
  {
    id: 1,
    className: "md:col-span-2",
    thumbnail:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2000&auto=format&fit=crop",
    content: (
      <CampusContent
        category="Annual Fest"
        title="Cultural Fest — Utsav"
        description="A vibrant three-day celebration of music, dance, drama, and art bringing together students from across the university for a showcase of creativity and talent."
      />
    ),
  },
  {
    id: 2,
    className: "col-span-1",
    thumbnail:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2000&auto=format&fit=crop",
    content: (
      <CampusContent
        category="Facility"
        title="Central Library"
        description="A four-floor learning hub with reading rooms, digital archives, and quiet study zones open to all students through the academic year."
      />
    ),
  },
  {
    id: 3,
    className: "col-span-1",
    thumbnail:
      "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=2000&auto=format&fit=crop",
    content: (
      <CampusContent
        category="Workshop"
        title="Innovation & Startup Bootcamp"
        description="Hands-on sessions led by industry mentors on ideation, prototyping, and pitching — designed to turn student ideas into real ventures."
      />
    ),
  },
  {
    id: 4,
    className: "md:col-span-2",
    thumbnail:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2000&auto=format&fit=crop",
    content: (
      <CampusContent
        category="Sports"
        title="Sports Complex & Annual Meet"
        description="State-of-the-art courts, a running track, and a gymnasium hosting inter-college tournaments and the university's annual sports meet."
      />
    ),
  },
  {
    id: 5,
    className: "md:col-span-2",
    thumbnail:
      "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2000&auto=format&fit=crop",
    content: (
      <CampusContent
        category="Facility"
        title="Research Labs"
        description="Well-equipped interdisciplinary labs supporting applied research, prototyping, and student-led innovation projects."
      />
    ),
  },
  {
    id: 6,
    className: "col-span-1",
    thumbnail:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2000&auto=format&fit=crop",
    content: (
      <CampusContent
        category="Cultural Activity"
        title="Indigenous Knowledge Exhibition"
        description="A showcase of traditional crafts, Bharatiya sciences, and indigenous innovations curated by the Swadeshi Knowledge Network."
      />
    ),
  },
];

export default function CampusLife() {
  return (
    <section className="w-full py-8 md:py-12 bg-[#fff5ec]">
      <div className="mx-auto max-w-6xl px-6 md:px-12 mb-10 text-left">
        <div className={styles.eyebrow}>Campus Life</div>

        <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#6b3410]">
          Life Beyond the Classroom
        </h2>
        <p className="mt-3 text-sm md:text-base text-[#5b6d8c] max-w-2xl">
          From cultural fests to research labs, explore the moments and spaces
          that shape student life at the Consortium.
        </p>
      </div>

      <div className="mx-auto max-w-6xl h-[60rem] px-4">
        <LayoutGrid cards={cards} />
      </div>
    </section>
  );
}
