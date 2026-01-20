import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { Tooltip } from "react-tooltip";

const INDIA_GEO_URL = "/india-states.json";

export interface StateData {
  projects: number;
  partners: number;
  coordinates: [number, number];
}

export interface GeographyData {
  [key: string]: StateData;
}

export const IndiaMap = ({ data }: { data: GeographyData }) => {
  const [tooltipContent, setTooltipContent] = useState("");

  return (
    <>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 800,
          center: [82.5, 22.5],
        }}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={INDIA_GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: {
                    fill: "#F4F6F8",
                    stroke: "#9EA7AD",
                    strokeWidth: 0.6,
                    outline: "none",
                  },
                  hover: {
                    fill: "#FF9933", // Saffron
                    stroke: "#607D8B",
                    strokeWidth: 1,
                    outline: "none",
                  },
                  pressed: {
                    fill: "#138808", // Green
                    outline: "none",
                  },
                }}
              />
            ))
          }
        </Geographies>

        {Object.keys(data).map((state) => {
          const { coordinates, projects, partners } = data[state];

          return (
            <Marker
              key={state}
              coordinates={coordinates}
              onMouseEnter={() =>
                setTooltipContent(
                  `${state}: ${projects} projects, ${partners} partners`
                )
              }
              onMouseLeave={() => setTooltipContent("")}
            >
              <circle
                r={4}
                fill="#138808"
                stroke="#FF9933"
                strokeWidth={1}
              />
              <text
                y={-10}
                textAnchor="middle"
                style={{
                  fontSize: "10px",
                  fill: "#333",
                  fontFamily: "system-ui",
                }}
              >
                {state}
              </text>
            </Marker>
          );
        })}
      </ComposableMap>

      <Tooltip>{tooltipContent}</Tooltip>
    </>
  );
};
