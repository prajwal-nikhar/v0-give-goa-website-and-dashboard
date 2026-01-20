import React from "react";
import { IndiaMap, GeographyData } from "@/components/india-map";
import styles from "./IndiaMapCard.module.css";

export default function IndiaMapCard({ data }: { data: GeographyData }) {
  return (
    <div className={styles.card}>
      <div className={styles.overlay} />

      <div className={styles.content}>
        <h2 className={styles.title}>Impact Across India</h2>
        <p className={styles.subtitle}>
          Empowering communities through projects and partnerships
        </p>

        <IndiaMap data={data} />
      </div>
    </div>
  );
}
