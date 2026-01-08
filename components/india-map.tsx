"use client"

import { useState } from "react"

interface MapRegion {
  name: string
  code: string
  projects: number
  color: string
}

const regions: MapRegion[] = [
  { name: "Goa", code: "GA", projects: 395, color: "hsl(200, 75%, 50%)" },
  { name: "Maharashtra", code: "MH", projects: 45, color: "hsl(220, 60%, 55%)" },
  { name: "Karnataka", code: "KA", projects: 38, color: "hsl(240, 55%, 60%)" },
  { name: "Delhi", code: "DL", projects: 22, color: "hsl(180, 50%, 55%)" },
  { name: "Tamil Nadu", code: "TN", projects: 18, color: "hsl(280, 50%, 60%)" },
  { name: "Kerala", code: "KL", projects: 15, color: "hsl(160, 45%, 55%)" },
]

export function IndiaMap() {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)

  const getRegionByCode = (code: string) => {
    return regions.find((r) => r.code === code)
  }

  const isActiveRegion = (code: string) => {
    return regions.some((r) => r.code === code)
  }

  const getStateFill = (code: string) => {
    const region = getRegionByCode(code)
    return region ? region.color : "hsl(var(--muted)/0.3)"
  }

  return (
    <div className="relative w-full h-[700px] flex items-center justify-center bg-muted/20 rounded-lg p-6">
      <div className="w-full h-full max-w-3xl relative">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 800 1000"
          className="w-full h-full drop-shadow-md"
        >
          <defs>
            <style>
              {`
                .india-state {
                  stroke: #fff;
                  stroke-width: 1.5;
                  transition: all 0.2s ease;
                }
                .india-state.active {
                  stroke-width: 2.5;
                  cursor: pointer;
                  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
                }
                .india-state.active:hover {
                  opacity: 0.85;
                  filter: drop-shadow(0 6px 12px rgba(0,0,0,0.2));
                }
              `}
            </style>
          </defs>

          {/* Jammu & Kashmir */}
          <path
            id="JK"
            d="M315,45 L330,42 L345,48 L358,55 L368,65 L375,78 L380,92 L378,105 L370,115 L358,122 L345,125 L330,123 L318,118 L308,110 L302,98 L300,85 L303,70 L310,55z"
            className={`india-state ${isActiveRegion("JK") ? "active" : ""}`}
            fill={getStateFill("JK")}
          />

          {/* Himachal Pradesh */}
          <path
            id="HP"
            d="M302,125 L318,122 L335,125 L350,132 L358,142 L362,155 L358,168 L348,178 L335,183 L320,182 L308,176 L300,165 L298,152 L300,138z"
            className={`india-state ${isActiveRegion("HP") ? "active" : ""}`}
            fill={getStateFill("HP")}
          />

          {/* Punjab */}
          <path
            id="PB"
            d="M285,135 L300,132 L315,135 L328,142 L335,153 L335,166 L328,178 L315,185 L300,186 L288,182 L280,172 L278,160 L280,148z"
            className={`india-state ${isActiveRegion("PB") ? "active" : ""}`}
            fill={getStateFill("PB")}
          />

          {/* Haryana & Delhi */}
          <path
            id="HR"
            d="M300,186 L315,188 L330,192 L342,200 L348,212 L348,225 L342,238 L330,245 L315,247 L302,244 L292,236 L288,224 L288,210 L292,198z"
            className={`india-state ${isActiveRegion("HR") ? "active" : ""}`}
            fill={getStateFill("HR")}
          />

          {/* Delhi - small circle within Haryana */}
          <circle
            id="DL"
            cx="318"
            cy="218"
            r="8"
            className={`india-state ${isActiveRegion("DL") ? "active" : ""}`}
            fill={getStateFill("DL")}
            onMouseEnter={() => getRegionByCode("DL") && setHoveredRegion("Delhi")}
            onMouseLeave={() => setHoveredRegion(null)}
          />

          {/* Uttarakhand */}
          <path
            id="UT"
            d="M348,165 L365,168 L380,175 L390,185 L395,198 L393,212 L385,223 L372,228 L358,228 L348,222 L342,210 L342,195 L345,180z"
            className={`india-state ${isActiveRegion("UT") ? "active" : ""}`}
            fill={getStateFill("UT")}
          />

          {/* Rajasthan */}
          <path
            id="RJ"
            d="M255,195 L272,192 L288,195 L302,202 L312,215 L318,230 L320,248 L318,268 L312,288 L302,308 L288,325 L272,338 L255,345 L238,345 L225,338 L215,325 L210,308 L210,288 L215,268 L225,248 L238,230 L248,215z"
            className={`india-state ${isActiveRegion("RJ") ? "active" : ""}`}
            fill={getStateFill("RJ")}
          />

          {/* Uttar Pradesh */}
          <path
            id="UP"
            d="M348,228 L365,232 L382,238 L398,248 L410,262 L418,278 L422,295 L420,312 L412,328 L398,340 L382,348 L365,352 L348,350 L335,343 L325,332 L320,318 L320,302 L325,285 L335,270 L342,255z"
            className={`india-state ${isActiveRegion("UP") ? "active" : ""}`}
            fill={getStateFill("UP")}
          />

          {/* Bihar */}
          <path
            id="BR"
            d="M420,312 L438,315 L455,322 L468,332 L475,345 L475,360 L468,373 L455,380 L438,382 L422,378 L410,368 L405,355 L405,340 L410,328z"
            className={`india-state ${isActiveRegion("BR") ? "active" : ""}`}
            fill={getStateFill("BR")}
          />

          {/* West Bengal */}
          <path
            id="WB"
            d="M475,360 L488,365 L500,375 L508,388 L512,403 L512,420 L508,438 L500,453 L488,465 L475,472 L462,472 L450,465 L442,453 L438,438 L438,420 L442,403 L450,388 L462,378z"
            className={`india-state ${isActiveRegion("WB") ? "active" : ""}`}
            fill={getStateFill("WB")}
          />

          {/* Jharkhand */}
          <path
            id="JH"
            d="M420,378 L438,382 L453,390 L463,402 L468,418 L468,435 L463,450 L453,462 L438,470 L422,472 L408,468 L398,458 L393,443 L393,428 L398,412 L408,398z"
            className={`india-state ${isActiveRegion("JH") ? "active" : ""}`}
            fill={getStateFill("JH")}
          />

          {/* Odisha */}
          <path
            id="OR"
            d="M438,472 L453,478 L468,490 L478,505 L483,522 L483,540 L478,558 L468,573 L453,585 L438,592 L422,590 L408,582 L398,568 L393,552 L393,535 L398,518 L408,503 L422,490z"
            className={`india-state ${isActiveRegion("OR") ? "active" : ""}`}
            fill={getStateFill("OR")}
          />

          {/* Chhattisgarh */}
          <path
            id="CT"
            d="M365,435 L382,440 L398,450 L410,465 L418,482 L420,500 L418,518 L410,535 L398,548 L382,558 L365,562 L350,558 L338,548 L332,532 L330,515 L332,498 L338,482 L348,468z"
            className={`india-state ${isActiveRegion("CT") ? "active" : ""}`}
            fill={getStateFill("CT")}
          />

          {/* Madhya Pradesh */}
          <path
            id="MP"
            d="M288,345 L308,348 L328,355 L345,365 L358,378 L368,395 L373,415 L373,438 L368,460 L358,480 L345,495 L328,505 L308,510 L288,510 L270,505 L255,495 L245,480 L238,460 L235,438 L238,415 L245,395 L255,378 L268,365z"
            className={`india-state ${isActiveRegion("MP") ? "active" : ""}`}
            fill={getStateFill("MP")}
          />

          {/* Gujarat */}
          <path
            id="GJ"
            d="M180,325 L198,322 L218,328 L235,340 L248,358 L255,378 L258,400 L258,425 L255,448 L248,468 L235,485 L218,497 L198,502 L180,502 L165,497 L152,485 L142,468 L135,448 L132,425 L132,400 L135,378 L142,358 L152,343z"
            className={`india-state ${isActiveRegion("GJ") ? "active" : ""}`}
            fill={getStateFill("GJ")}
          />

          {/* Maharashtra */}
          <path
            id="MH"
            d="M255,505 L275,510 L295,520 L312,535 L325,553 L333,573 L338,595 L338,620 L333,643 L325,663 L312,680 L295,693 L275,702 L255,705 L235,702 L218,693 L205,680 L195,663 L188,643 L185,620 L185,595 L190,573 L198,553 L212,535 L232,520z"
            className={`india-state ${isActiveRegion("MH") ? "active" : ""}`}
            fill={getStateFill("MH")}
            onMouseEnter={() => getRegionByCode("MH") && setHoveredRegion("Maharashtra")}
            onMouseLeave={() => setHoveredRegion(null)}
          />

          {/* Goa */}
          <path
            id="GA"
            d="M235,708 L248,710 L260,715 L268,725 L272,738 L272,752 L268,765 L260,775 L248,780 L235,782 L222,780 L210,775 L202,765 L198,752 L198,738 L202,725 L210,715 L222,710z"
            className={`india-state ${isActiveRegion("GA") ? "active" : ""}`}
            fill={getStateFill("GA")}
            onMouseEnter={() => getRegionByCode("GA") && setHoveredRegion("Goa")}
            onMouseLeave={() => setHoveredRegion(null)}
          />

          {/* Telangana */}
          <path
            id="TG"
            d="M338,595 L355,600 L370,610 L382,625 L388,642 L388,660 L382,678 L370,693 L355,703 L338,708 L322,705 L310,695 L303,678 L300,660 L300,642 L305,625 L315,612z"
            className={`india-state ${isActiveRegion("TG") ? "active" : ""}`}
            fill={getStateFill("TG")}
          />

          {/* Andhra Pradesh */}
          <path
            id="AP"
            d="M355,708 L373,713 L390,723 L403,738 L412,755 L418,775 L420,798 L418,820 L412,840 L403,857 L390,870 L373,880 L355,885 L338,882 L323,872 L312,857 L305,840 L302,820 L302,798 L305,775 L312,755 L323,738 L338,723z"
            className={`india-state ${isActiveRegion("AP") ? "active" : ""}`}
            fill={getStateFill("AP")}
          />

          {/* Karnataka */}
          <path
            id="KA"
            d="M255,708 L275,715 L295,728 L310,745 L322,765 L330,788 L333,812 L333,838 L330,862 L322,883 L310,900 L295,913 L275,923 L255,928 L235,925 L218,915 L205,900 L195,883 L188,862 L185,838 L185,812 L188,788 L195,765 L205,745 L218,732z"
            className={`india-state ${isActiveRegion("KA") ? "active" : ""}`}
            fill={getStateFill("KA")}
            onMouseEnter={() => getRegionByCode("KA") && setHoveredRegion("Karnataka")}
            onMouseLeave={() => setHoveredRegion(null)}
          />

          {/* Tamil Nadu */}
          <path
            id="TN"
            d="M302,850 L320,858 L338,872 L352,890 L362,910 L368,932 L370,955 L368,978 L362,998 L352,1015 L338,1028 L320,1038 L302,1042 L285,1038 L270,1028 L258,1015 L250,998 L245,978 L243,955 L245,932 L250,910 L258,890 L270,872 L285,858z"
            className={`india-state ${isActiveRegion("TN") ? "active" : ""}`}
            fill={getStateFill("TN")}
            onMouseEnter={() => getRegionByCode("TN") && setHoveredRegion("Tamil Nadu")}
            onMouseLeave={() => setHoveredRegion(null)}
          />

          {/* Kerala */}
          <path
            id="KL"
            d="M235,880 L250,888 L262,900 L270,915 L275,932 L278,952 L278,973 L275,993 L270,1012 L262,1028 L250,1040 L235,1048 L220,1050 L208,1045 L198,1033 L192,1018 L188,1000 L188,980 L190,960 L195,940 L202,922 L212,905 L222,892z"
            className={`india-state ${isActiveRegion("KL") ? "active" : ""}`}
            fill={getStateFill("KL")}
            onMouseEnter={() => getRegionByCode("KL") && setHoveredRegion("Kerala")}
            onMouseLeave={() => setHoveredRegion(null)}
          />

          {/* Northeast States */}
          <path
            id="AS"
            d="M512,280 L528,285 L543,295 L555,308 L562,325 L565,345 L562,365 L555,382 L543,395 L528,402 L512,405 L498,400 L488,388 L482,372 L480,355 L482,335 L488,318 L498,303z"
            className={`india-state ${isActiveRegion("AS") ? "active" : ""}`}
            fill={getStateFill("AS")}
          />

          <path
            id="AR"
            d="M530,240 L548,245 L565,255 L578,270 L585,288 L585,308 L578,325 L565,338 L548,345 L530,348 L515,343 L505,330 L500,315 L500,298 L505,280 L515,265z"
            className={`india-state ${isActiveRegion("AR") ? "active" : ""}`}
            fill={getStateFill("AR")}
          />
        </svg>
      </div>

      {/* Hover Tooltip */}
      {hoveredRegion && (
        <div className="absolute top-8 right-8 bg-card border-2 rounded-xl shadow-2xl p-5 animate-in fade-in zoom-in duration-200 z-10">
          <div className="font-semibold text-lg">{hoveredRegion}</div>
          <div className="text-4xl font-bold text-primary mt-1.5">
            {regions.find((r) => r.name === hoveredRegion)?.projects}
          </div>
          <div className="text-sm text-muted-foreground mt-0.5">active projects</div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-8 left-8 bg-card border-2 rounded-xl shadow-2xl p-5 space-y-2.5 max-w-[240px] z-10">
        <div className="text-base font-bold mb-3 text-foreground">Project Distribution</div>
        {regions.map((region) => (
          <div key={region.name} className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-md shadow-sm flex-shrink-0" style={{ backgroundColor: region.color }} />
              <span className="font-medium">{region.name}</span>
            </div>
            <span className="font-bold text-primary tabular-nums">{region.projects}</span>
          </div>
        ))}
        <div className="pt-3 mt-3 border-t text-sm text-muted-foreground font-medium">
          Total: {regions.reduce((sum, r) => sum + r.projects, 0)} projects
        </div>
      </div>
    </div>
  )
}
