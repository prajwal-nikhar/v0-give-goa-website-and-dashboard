"use client";

import Image from "next/image";

interface Student {
  name: string;
  branch: string;
  image: string;
}

const students: Student[] = [
  {
    name: "Prajwal Nikhar",
    branch: "PGDM - Big Data Analytics",
    image: "/students/B2025151_PrajwalNikhar.png",
  },
  {
    name: "Darshit Jain",
    branch: "PGDM - Big Data Analytics",
    image: "/students/Darshit_Jain.jpeg",
  },
  {
    name: "Giridhar Sharma",
    branch: "PGDM - Big Data Analytics",
    image: "/students/Giridhar_Sharma.jpeg",
  },
  {
    name: "Hrithika R",
    branch: "PGDM - Big Data Analytics",
    image: "/students/hrithika_r.png",
  },
  {
    name: "Yash Nilesh Pednekar",
    branch: "PGDM - Big Data Analytics",
    image: "/students/B2025177_YashNileshPednekar_Formalpicture.jpg",
  },
  {
    name: "Soumabha Nandi",
    branch: "PGDM - Big Data Analytics",
    image: "/students/Soumabha_Nandi.jpeg",
  },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t bg-muted/30">

      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center">

        {/* ================= TITLE ================= */}
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold">
            Built by
          </h3>
          <p className="text-muted-foreground">
            PGDM Big Data Analytics Students · Goa Institute of Management
          </p>
        </div>

        {/* ================= STUDENTS ================= */}
        <div className="flex flex-wrap justify-center gap-10 max-w-6xl">
          {students.map((student, index) => (
            <div
              key={index}
              className="flex flex-col items-center group"
            >
              <div className="relative w-24 h-24">
                <Image
                  src={student.image}
                  alt={student.name}
                  fill
                  className="rounded-full object-cover border-4 border-background shadow-lg transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              <h4 className="mt-3 font-semibold text-sm text-center">
                {student.name}
              </h4>

              <p className="text-xs text-muted-foreground text-center">
                {student.branch}
              </p>
            </div>
          ))}
        </div>

        {/* ================= CONTACT SECTION ================= */}
        <div className="w-full mt-16 border-t pt-10 text-center space-y-4">

          <h3 className="text-xl font-semibold">
            Goa Institute of Management
          </h3>

          <p className="text-muted-foreground">
            Poriem, Sattari, Goa 403505
          </p>

          <div className="space-y-1 text-sm text-muted-foreground">
            <p>
              <strong>Central Helpline:</strong>{" "}
              <a href="tel:+917972722554" className="hover:text-primary">
                +91-7972722554
              </a>
            </p>

            <p>
              <strong>Tel:</strong>{" "}
              <a href="tel:08326916015" className="hover:text-primary">
                0832-6916015
              </a>
            </p>

            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:admin@gim.ac.in" className="hover:text-primary">
                admin@gim.ac.in
              </a>{" "}
              |{" "}
              <a href="mailto:director@gim.ac.in" className="hover:text-primary">
                director@gim.ac.in
              </a>{" "}
              |{" "}
              <a href="mailto:mdpoffice@gim.ac.in" className="hover:text-primary">
                mdpoffice@gim.ac.in
              </a>
            </p>
          </div>

          {/* Directions Button */}
          <div className="pt-4">
            <a
              href="https://maps.google.com/?q=Goa+Institute+of+Management"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 rounded-lg bg-primary text-white hover:opacity-90 transition"
            >
              GET DIRECTIONS
            </a>
          </div>
        </div>

        {/* ================= COPYRIGHT ================= */}
        <div className="text-sm text-muted-foreground mt-12">
          © {new Date().getFullYear()} SLRI Community Engagement Platform
        </div>

      </div>
    </footer>
  );
}