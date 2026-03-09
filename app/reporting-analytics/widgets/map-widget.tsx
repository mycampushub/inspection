"use client"

import { useState } from "react"
import { MapPin, Globe } from "lucide-react"

// Sample data
const supplierLocations = [
  { name: "Tech Solutions Inc.", coordinates: [-74.006, 40.7128], category: "IT Services", count: 12, country: "USA" },
  { name: "Global Manufacturing", coordinates: [-87.6298, 41.8781], category: "Manufacturing", count: 8, country: "USA" },
  { name: "European Supplies", coordinates: [2.3522, 48.8566], category: "Office Supplies", count: 15, country: "France" },
  { name: "Asian Electronics", coordinates: [121.4737, 31.2304], category: "Electronics", count: 20, country: "China" },
  { name: "Middle East Trading", coordinates: [55.2708, 25.2048], category: "Trading", count: 10, country: "UAE" },
  { name: "Pacific Services", coordinates: [149.13, -35.28], category: "IT Services", count: 6, country: "Australia" },
  { name: "Nordic Logistics", coordinates: [18.07, 60.45], category: "Logistics", count: 9, country: "Sweden" },
]

interface MapWidgetProps {
  config: {
    title: string
    data: string
  }
}

export function MapWidget({ config }: MapWidgetProps) {
  const [tooltipContent, setTooltipContent] = useState("")
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null)

  const data = supplierLocations

  return (
    <div className="h-full w-full relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="absolute top-2 left-2 z-10">
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-sm">
          <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {data.length} Suppliers Worldwide
          </span>
        </div>
      </div>

      {/* World Map Placeholder */}
      <div className="h-full w-full relative">
        {/* Simple world map representation */}
        <svg
          viewBox="0 0 800 400"
          className="w-full h-full"
          style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }}
        >
          {/* Simplified world map outline */}
          <path
            d="M 200 150 Q 220 140 240 150 Q 260 155 280 165 Q 300 175 320 180 Q 350 185 380 175 Q 410 165 430 150 Q 450 135 480 145 Q 510 155 540 165 Q 560 175 580 165 Q 600 155 620 165 Q 640 175 660 185 L 660 250 Q 640 260 620 270 Q 590 280 560 285 Q 530 290 500 285 Q 470 280 440 285 Q 410 290 380 285 Q 350 280 320 285 Q 290 280 260 275 Q 230 270 200 250 Z"
            fill="rgba(59, 130, 246, 0.1)"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="2"
          />
          <path
            d="M 350 120 Q 370 110 390 115 Q 410 120 430 125 Q 460 135 490 145 Q 520 155 550 165 Q 570 175 580 190 Q 590 205 580 220 Q 570 235 550 245 Q 520 255 490 260 Q 460 265 430 260 Q 400 255 370 250 Q 350 245 330 250 Q 310 255 280 260 Q 250 265 220 255 Q 190 250 180 240 Z"
            fill="rgba(59, 130, 246, 0.05)"
            stroke="rgba(59, 130, 246, 0.2)"
            strokeWidth="1"
          />
          <path
            d="M 680 180 Q 700 170 720 175 Q 740 180 750 195 Q 760 210 755 225 Q 750 240 740 255 Q 720 265 700 270 Q 680 275 660 270 Q 640 265 620 260 Q 600 255 580 265 Q 560 275 540 285 L 540 350 Q 520 360 500 365 Q 470 370 440 365 Q 410 360 380 355 Q 350 350 320 355 Q 290 360 260 365 Q 230 370 200 365 Q 170 360 140 355 Q 120 350 100 365 Q 80 370 60 365 Q 40 360 20 355 Q 10 350 15 340 Q 20 330 40 320 Q 60 310 100 305 Q 140 300 180 305 Q 220 310 260 305 Q 300 300 340 305 Q 380 310 400 320 Q 420 330 440 340 Q 460 350 480 360 Q 500 370 520 365 Q 540 360 560 355 Q 580 350 600 355 L 600 420 Q 580 430 560 435 Q 530 440 500 435 Q 470 430 440 435 Q 410 440 380 435 Q 350 430 320 435 Q 290 440 260 445 Q 230 450 200 445 Q 170 440 150 445 Q 130 450 110 455 Q 90 460 70 455 Q 50 450 30 455 Q 15 460 20 470 Q 25 480 35 490 Q 45 500 55 510 Q 65 520 75 530 L 75 590 Q 95 600 115 605 Q 135 610 155 605 Q 175 600 195 590 Q 215 580 235 590 Q 255 600 275 605 Q 295 610 315 605 Q 335 600 355 590 Q 375 580 395 585 Q 415 590 435 595 Q 455 600 475 595 Q 495 590 515 595 Q 535 590 555 585 Q 575 580 595 590 Q 615 600 635 595 Q 655 590 675 585 Q 695 580 715 590 L 715 650 Q 735 660 755 665 Q 775 670 785 665 Q 795 660 795 640 Q 795 620 785 600 Q 775 580 755 560 Q 735 540 715 535 Q 695 530 675 525 Q 655 530 635 545 Q 615 560 595 575 Q 575 590 555 605 Q 535 620 515 625 Q 495 630 475 625 Q 455 630 435 645 Q 415 660 395 665 Q 375 680 355 685 Q 335 690 315 695 Q 295 700 275 695 Q 255 690 235 700 Q 215 705 195 700 Q 175 695 165 690 Q 155 685 145 695 Q 135 705 125 715 Q 115 725 105 735 Q 95 745 85 755 L 85 780 Q 105 790 125 795 Q 145 800 165 795 Q 185 790 205 800 Q 225 790 245 795 Q 265 800 285 795 Q 305 790 325 785 Q 345 780 365 790 Q 385 800 405 810 Q 425 820 445 830 Q 465 840 485 835 Q 505 830 525 825 Q 545 820 565 815 Q 585 810 605 805 Q 625 800 645 795 Q 665 790 685 785 Q 705 780 725 775 Q 745 770 765 775 Q 785 780 795 785 Z"
            fill="rgba(59, 130, 246, 0.08)"
            stroke="rgba(59, 130, 246, 0.25)"
            strokeWidth="2"
          />
          <path
            d="M 140 180 Q 160 170 180 175 Q 200 180 220 185 Q 240 190 260 185 Q 280 180 300 185 Q 320 190 340 200 Q 360 210 380 230 Q 400 250 420 270 Q 440 290 460 300 Q 480 310 500 305 Q 520 300 540 295 Q 560 290 570 295 Q 580 300 590 305 Q 600 310 610 320 Q 620 330 630 340 L 630 400 Q 610 410 590 415 Q 560 420 530 415 Q 500 410 470 415 Q 440 420 410 415 Q 380 410 350 415 Q 320 420 290 415 Q 260 410 230 415 Q 200 420 170 415 Q 140 410 110 415 Q 80 420 60 415 Q 40 410 20 415 Q 10 420 20 430 Q 30 440 40 445 Q 50 450 60 455 Q 70 460 80 455 Q 90 450 100 455 Q 110 460 120 455 Q 130 450 140 455 Q 150 460 160 455 Q 170 450 180 455 Z"
            fill="rgba(34, 197, 94, 0.05)"
            stroke="rgba(34, 197, 94, 0.2)"
            strokeWidth="1"
          />
          <path
            d="M 600 120 Q 620 110 640 115 Q 660 120 680 125 Q 700 130 720 135 Q 740 140 750 155 Q 760 170 755 185 Q 750 200 745 215 Q 740 230 735 245 Q 720 260 700 270 Q 680 280 660 285 Q 640 290 620 285 Q 600 280 580 285 Q 560 290 540 285 Q 520 280 500 285 Q 480 290 460 285 Q 440 280 420 285 Q 400 290 380 285 Q 360 290 340 295 Q 320 300 300 305 Q 280 310 260 305 Q 240 300 220 305 Q 200 310 180 305 Q 160 300 140 305 Q 120 310 100 305 Q 80 300 60 305 Q 40 310 20 305 Q 10 300 15 295 Q 20 290 30 295 Q 40 300 50 305 Q 60 310 70 315 Q 80 320 100 315 Q 120 310 140 305 Q 160 300 180 305 Q 200 310 220 315 Q 240 320 260 325 Q 280 330 300 335 Q 320 340 340 345 Q 360 350 380 355 Q 400 360 420 365 Q 440 370 460 365 Q 480 360 500 355 Q 520 350 540 355 Q 560 360 580 365 Q 600 370 620 365 Q 640 360 660 355 Q 680 350 700 355 Q 720 360 740 365 L 740 400 Q 720 405 700 410 Q 680 415 660 410 Q 640 415 620 420 Q 600 425 580 420 Q 560 415 540 410 Q 520 405 500 410 Q 480 415 460 410 Q 440 405 420 400 Q 400 395 380 390 Q 360 385 340 390 Q 320 395 300 390 Q 280 395 260 400 Q 240 405 220 400 Q 200 405 180 410 Q 160 415 140 410 Q 120 415 100 420 Q 80 425 60 420 Q 40 425 20 430 Q 10 435 20 440 L 20 480 Q 40 485 60 480 Q 80 485 100 480 Q 120 475 140 470 Q 160 465 180 470 Q 200 465 220 470 Q 240 465 260 460 Q 280 455 300 450 Q 320 445 340 450 Q 360 445 380 440 Q 400 435 420 430 Q 440 425 460 420 Q 480 415 500 410 Q 520 405 540 400 Q 560 395 580 390 Q 600 385 620 395 Q 640 405 660 415 Q 680 425 700 435 Q 720 445 740 455 L 740 480 Q 720 485 700 490 Q 680 495 660 500 Q 640 505 620 510 Q 600 515 580 520 Q 560 525 540 530 Q 520 535 500 540 Q 480 545 460 550 Q 440 555 420 550 Q 400 545 380 540 Q 360 535 340 545 Q 320 550 300 545 Q 280 540 260 545 Q 240 550 220 555 Q 200 560 180 555 Q 160 560 140 555 Q 120 560 100 565 Q 80 570 60 575 Q 60 580 50 585 L 60 590 Q 80 600 100 605 Q 120 610 140 605 Q 160 600 180 595 Q 200 590 220 595 Q 240 590 260 585 Q 280 580 300 575 Q 320 570 340 580 Q 360 590 380 600 Q 400 610 420 620 Q 440 630 460 640 Q 480 650 500 660 Q 520 670 540 680 Q 560 690 580 700 Q 600 710 620 720 Q 640 730 660 740 Q 680 750 700 760 Q 720 770 740 780 L 740 800 Q 720 810 700 820 Q 680 830 660 840 Q 640 850 620 860 Q 600 870 580 880 Q 560 890 540 900 Q 520 910 500 920 Q 480 930 460 940 Q 440 950 420 960 Q 400 970 380 980 Q 360 990 340 1000 Q 320 1010 300 1020 Q 280 1030 260 1040 Q 240 1050 220 1060 Q 200 1070 180 1080 Q 160 1090 140 1100 Q 120 1110 100 1120 Q 80 1130 60 1140 Q 40 1150 20 1160 Q 10 1170 0 1180 Q 20 1190 40 1200 Z"
            fill="rgba(244, 67, 54, 0.05)"
            stroke="rgba(244, 67, 54, 0.2)"
            strokeWidth="1"
          />

          {/* Supplier markers */}
          {data.map((location, index) => {
            const x = 100 + (index % 5) * 120 + (Math.random() * 50)
            const y = 100 + Math.floor(index / 5) * 80 + (Math.random() * 40)
            const size = Math.sqrt(location.count) * 8

            return (
              <g
                key={index}
                onMouseEnter={() => {
                  setTooltipContent(`${location.name} (${location.category}): ${location.count} suppliers`)
                  setHoveredLocation(location.name)
                }}
                onMouseLeave={() => {
                  setHoveredLocation(null)
                }}
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={size}
                  fill={hoveredLocation === location.name ? "#ef4444" : "#3b82f6"}
                  fillOpacity={hoveredLocation === location.name ? 0.9 : 0.7}
                  stroke="white"
                  strokeWidth={hoveredLocation === location.name ? 3 : 2}
                  style={{
                    transition: "all 0.2s ease-in-out",
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                  }}
                />
                <text
                  x={x}
                  y={y - size - 8}
                  textAnchor="middle"
                  fill="#374151"
                  fontSize="10"
                  fontWeight="bold"
                  style={{ pointerEvents: "none" }}
                >
                  {location.country}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Tooltip */}
        {tooltipContent && (
          <div
            className="absolute bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg text-xs z-20 pointer-events-none border border-gray-200 dark:border-gray-700"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              whiteSpace: "nowrap",
            }}
          >
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3 text-blue-500" />
              <span className="font-medium">{tooltipContent}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
