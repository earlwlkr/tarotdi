"use client";

import { forwardRef, useState, type CSSProperties } from "react";
import type { TarotCard } from "@/lib/tarot";

type TarotCardProps = {
  card: TarotCard;
  isReversed: boolean;
  revealed: boolean;
  visible?: boolean;
};

// --- DYNAMIC VECTOR EMBLEMS & GLYPHS LIBRARY ---

// Main Suit Emblems (rendered at center of astrolabe, scale fits within 30px radius)
const suitEmblems: Record<string, React.ReactNode> = {
  "Major Arcana": (
    <g transform="scale(1.2)">
      {/* Mystical All-Seeing Cosmic Eye */}
      <circle cx="0" cy="0" r="16" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="3 3" />
      <path d="M -15,0 C -6,-10 6,-10 15,0 C 6,10 -6,10 -15,0 Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <circle cx="0" cy="0" r="5" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <circle cx="0" cy="0" r="2" fill="currentColor" />
      <path d="M 0,-12 L 0,-16 M 0,12 L 0,16 M -12,0 L -16,0 M 12,0 L 16,0" stroke="currentColor" strokeWidth="1" />
      <circle cx="0" cy="0" r="20" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.4" />
    </g>
  ),
  Cups: (
    <g transform="scale(1.1) translate(0, -2)">
      {/* Celestial Holy Chalice */}
      <path d="M -10,-12 C -10,0 10,0 10,-12 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M 0,0 L 0,12 M -6,12 L 6,12" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M -8,-6 C -4,-8 4,-8 8,-6" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="1 1" />
      {/* Glowing lotus/fluid spark above */}
      <path d="M 0,-18 Q 3,-14 0,-10 Q -3,-14 0,-18 Z" fill="currentColor" />
      <circle cx="-6" cy="-15" r="1" fill="currentColor" />
      <circle cx="6" cy="-15" r="1" fill="currentColor" />
    </g>
  ),
  Pentacles: (
    <g transform="scale(1.1)">
      {/* Geometric Sacred Coin */}
      <circle cx="0" cy="0" r="16" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="0" cy="0" r="13" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="2 1" />
      {/* Stellar Pentagram */}
      <path
        d="M 0,-12 L 3.5,-2.5 L 11.5,-2.5 L 5,2 L 7.5,11.5 L 0,5.5 L -7.5,11.5 L -5,2 L -11.5,-2.5 L -3.5,-2.5 Z"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        strokeLinejoin="round"
      />
      <circle cx="0" cy="0" r="3.5" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="0" cy="0" r="1" fill="currentColor" />
    </g>
  ),
  Swords: (
    <g transform="scale(1.1) translate(0, 1)">
      {/* Astral Stellar Blade */}
      <path d="M -2.5,-18 L 2.5,-18 L 2,6 L -2,6 Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <path d="M 0,-18 L 0,6" stroke="currentColor" strokeWidth="1" />
      {/* Guard as moon crescents */}
      <path d="M -10,6 C -4,6 4,6 10,6" stroke="currentColor" strokeWidth="1.8" fill="none" />
      <path d="M 0,6 L 0,13" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="0" cy="15" r="2.5" stroke="currentColor" strokeWidth="1.2" fill="currentColor" />
      {/* Wing-like energy rays */}
      <path d="M -8,-6 C -12,-8 -12,-14 -8,-15 C -4,-16 -1,-12 -2,-6" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.7" />
      <path d="M 8,-6 C 12,-8 12,-14 8,-15 C 4,-16 1,-12 2,-6" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.7" />
    </g>
  ),
  Wands: (
    <g transform="scale(1.1) translate(0, -1)">
      {/* Magical Wooden Staff / Sprout */}
      <path d="M -1.5,14 L 1.5,14 L 1,-14 L -1,-14 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* Sprouting leaves */}
      <path d="M 1,-8 Q 6,-11 4,-6 C 2,-4 1,-5 1,-8 Z" fill="currentColor" />
      <path d="M -1,-1 Q -6,-4 -4,1 C -2,3 -1,2 -1,-1 Z" fill="currentColor" />
      <path d="M 1,4 Q 6,1 4,6 C 2,8 1,7 1,4 Z" fill="currentColor" />
      {/* Solar/Fire energy spikes */}
      <path d="M 0,-14 C -3,-18 0,-22 0,-22 C 0,-22 3,-18 0,-14 Z" fill="currentColor" />
      <circle cx="-6" cy="-14" r="1.2" fill="currentColor" />
      <circle cx="6" cy="-14" r="1.2" fill="currentColor" />
      <circle cx="0" cy="0" r="15" stroke="currentColor" strokeWidth="0.8" fill="none" strokeDasharray="4 4" opacity="0.5" />
    </g>
  )
};

// Secondary Symbol Glyphs (rendered inside orbiting nodes, scaled within 10px radius)
const symbolGlyphs: Record<string, React.ReactNode> = {
  Moon: <path d="M-5,-1 C-5,3 -1,6 3,5 C1,4 0,2 0,0 C0,-2 1,-3 3,-4 C-1,-5 -5,-3 -5,-1 Z" fill="currentColor" />,
  Sun: (
    <g>
      <circle cx="0" cy="0" r="3.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <circle cx="0" cy="0" r="1" fill="currentColor" />
      <path d="M0,-5.5 L0,-7.5 M0,5.5 L0,7.5 M-5.5,0 L-7.5,0 M5.5,0 L7.5,0 M-4,-4 L-5.5,-5.5 M4,4 L5.5,5.5 M-4,4 L-5.5,5.5 M4,-4 L5.5,-5.5" stroke="currentColor" strokeWidth="1" />
    </g>
  ),
  Star: (
    <path d="M0,-7 L1.5,-2 L6.5,-2 L2.5,1 L4,6 L0,3 L-4,6 L-2.5,1 L-6.5,-2 L-1.5,-2 Z" fill="currentColor" />
  ),
  Stars: (
    <g>
      <path d="M0,-6 L1,-2 L5,-2 L2,0.5 L3.5,4.5 L0,2 L-3.5,4.5 L-2,0.5 L-5,-2 L-1,-2 Z" fill="currentColor" />
      <path d="M-6,3 L-5.5,1 L-3.5,1 L-5,0 L-4.5,-2 L-6,-1 L-7.5,-2 L-7,0 L-8.5,1 L-6.5,1 Z" fill="currentColor" transform="scale(0.6)" opacity="0.7" />
      <path d="M8,-3 L8.5,-5 L10.5,-5 L9,-6 L9.5,-8 L8,-7 L6.5,-8 L7,-6 L5.5,-5 L7.5,-5 Z" fill="currentColor" transform="scale(0.6)" opacity="0.7" />
    </g>
  ),
  Infinity: (
    <path d="M-5,-2 C-2.5,-2 -2.5,2 0,0 C2.5,-2 2.5,2 5,0 C2.5,-2 2.5,2 0,0 C-2.5,-2 -2.5,2 -5,0 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
  ),
  Crown: (
    <path d="M-6,4 L6,4 L8,-3 L3.5,0.5 L0,-5 L-3.5,0.5 L-8,-3 Z M-6,4" stroke="currentColor" strokeWidth="1.2" fill="currentColor" />
  ),
  Rose: (
    <g>
      <circle cx="0" cy="0" r="5" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M-3,-2 C-1,-4 1,-4 3,-2 C4,-0.5 4,1.5 2,3 C0,4.5 -2,3 -3,1.5 C-4.5,-0.2 -4,-1.8 -3,-2 Z" stroke="currentColor" strokeWidth="0.8" fill="none" />
      <path d="M-1.5,1 C-2.5,-0.5 -1.5,-2.5 0.5,-2 C2,-1.5 2,1 0,1.5 Z" stroke="currentColor" strokeWidth="0.8" fill="none" />
      <circle cx="0" cy="0" r="1" fill="currentColor" />
    </g>
  ),
  Flame: (
    <path d="M0,6 C-3.5,6 -5.5,3.5 -4.5,0.5 C-3.8,-1.5 -1,-4.5 0,-7 C1,-4.5 3.8,-1.5 4.5,0.5 C5.5,3.5 3.5,6 0,6 Z M0,-1 C-1.5,1.5 -0.5,3.5 0.5,3.5 C1.5,3.5 1.5,1.5 0,-1 Z" fill="currentColor" />
  ),
  Heart: (
    <path d="M0,5 C-4.5,1.5 -5,-2.5 -2.5,-4 C-0.8,-5 0.8,-3.5 0,-1.5 C-0.8,-3.5 0.8,-5 2.5,-4 C5,-2.5 4.5,1.5 0,5 Z M0,5" fill="currentColor" />
  ),
  Scale: (
    <g>
      <path d="M0,-6 L0,6 M-8,6 L8,6" stroke="currentColor" strokeWidth="1" />
      <path d="M-7,-3 L7,-3" stroke="currentColor" strokeWidth="1.2" />
      <path d="M-7,-3 L-9,2 L-5,2 Z M7,-3 L5,2 L9,2 Z" stroke="currentColor" strokeWidth="0.8" fill="none" />
      <circle cx="0" cy="-4" r="1.5" fill="currentColor" />
    </g>
  ),
  Tree: (
    <g>
      <path d="M0,6 L0,-2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M0,1 L-4,-1 M0,-1 L4,-3 M0,-2 L-3,-4 M0,-3 L3,-5" stroke="currentColor" strokeWidth="1" />
      <circle cx="0" cy="-4" r="3" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.6" />
      <circle cx="-2" cy="-2" r="2" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.5" />
      <circle cx="2" cy="-3" r="2" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.5" />
    </g>
  ),
  Wave: (
    <path d="M-7,2 C-5,0 -4,0 -2,2 C0,4 1,4 3,2 C5,0 6,0 8,2 M-7,-1 C-5,-3 -4,-3 -2,-1 C0,1 1,1 3,-1 C5,-3 6,-3 8,-1" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
  ),
  Lightning: (
    <path d="M1.5,-6.5 L-4.5,0.5 L-1,0.5 L-2.5,7 L4.5,-0.5 L1,-0.5 Z" fill="currentColor" />
  ),
  Wings: (
    <g>
      <path d="M-1,-3 C-4,-4 -7,-2 -9,1 C-6,1.5 -3,0 -1,-1 Z M-1,-1 C-3,1 -5,3.5 -6,6 C-4,5 -1,2.5 0,1.5 Z" fill="currentColor" />
      <path d="M1,-3 C4,-4 7,-2 9,1 C6,1.5 3,0 1,-1 Z M1,-1 C3,1 5,3.5 6,6 C4,5 1,2.5 0,1.5 Z" fill="currentColor" />
    </g>
  ),
  Keys: (
    <g transform="rotate(45)">
      {/* Crossed Skeleton Keys */}
      <g transform="rotate(25)">
        <circle cx="0" cy="-6" r="2.5" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M0,-3.5 L0,7 M-1.5,4.5 L0,4.5 M-1.5,6 L0,6" stroke="currentColor" strokeWidth="1" />
      </g>
      <g transform="rotate(-25)">
        <circle cx="0" cy="-6" r="2.5" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M0,-3.5 L0,7 M1.5,4.5 L0,4.5 M1.5,6 L0,6" stroke="currentColor" strokeWidth="1" />
      </g>
    </g>
  ),
  Wind: (
    <path d="M-7,-2 C-4,-2 -3,-3.5 -1.5,-3.5 C0,-3.5 1,-2 3,-2 C5.5,-2 5.5,-4 4.5,-4.5 M-8,1 C-5.5,1 -4.5,2.5 -3,2.5 C-1.5,2.5 -1,1.5 1,1.5 C3.5,1.5 4,3 5.5,2.5 C6.5,2 6,0.5 4.5,0.5" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" />
  ),
  Mountain: (
    <g>
      <path d="M-8,5 L0,-6 L8,5 Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <path d="M0,-6 L-3,5 M0,-6 L2,5" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
    </g>
  )
};

// Enhanced case-insensitive symbol glyph resolver for robust custom iconography
function resolveSymbolGlyph(symbolName: string): React.ReactNode {
  const name = symbolName.toLowerCase();

  if (name.includes("crescent") || name.includes("moon") || name.includes("tide") || name.includes("night")) {
    return symbolGlyphs.Moon;
  }
  if (name.includes("sun") || name.includes("dawn") || name.includes("morning") || name.includes("daylight") || name.includes("sunrise")) {
    return symbolGlyphs.Sun;
  }
  if (name.includes("stars") || name.includes("constellation") || name.includes("sky") || name.includes("clouds") || name.includes("cloud")) {
    return symbolGlyphs.Stars;
  }
  if (name.includes("star") || name.includes("horizon")) {
    return symbolGlyphs.Star;
  }
  if (name.includes("infinity") || name.includes("loop") || name.includes("caduceus")) {
    return symbolGlyphs.Infinity;
  }
  if (name.includes("crown") || name.includes("throne") || name.includes("leader") || name.includes("authority")) {
    return strokeScaleCrown();
  }
  if (name.includes("rose") || name.includes("flower") || name.includes("sunflower") || name.includes("laurel") || name.includes("wreath") || name.includes("garland") || name.includes("lotus")) {
    return symbolGlyphs.Rose;
  }
  if (name.includes("flame") || name.includes("fire") || name.includes("torch") || name.includes("heat") || name.includes("spark")) {
    return symbolGlyphs.Flame;
  }
  if (name.includes("heart") || name.includes("love") || name.includes("passion") || name.includes("sorrow") || name.includes("grief") || name.includes("heartbreak")) {
    return symbolGlyphs.Heart;
  }
  if (name.includes("scale") || name.includes("scales") || name.includes("balance") || name.includes("justice") || name.includes("fairness")) {
    return symbolGlyphs.Scale;
  }
  if (name.includes("tree") || name.includes("sprout") || name.includes("vine") || name.includes("leaf") || name.includes("wheat") || name.includes("garden") || name.includes("fruit")) {
    return symbolGlyphs.Tree;
  }
  if (name.includes("wave") || name.includes("water") || name.includes("river") || name.includes("stream") || name.includes("sea") || name.includes("waterfall") || name.includes("rain") || name.includes("tide") || name.includes("spilled")) {
    return symbolGlyphs.Wave;
  }
  if (name.includes("wing") || name.includes("wings") || name.includes("angel") || name.includes("feather") || name.includes("falcon")) {
    return symbolGlyphs.Wings;
  }
  if (name.includes("key") || name.includes("keys") || name.includes("lock") || name.includes("gate") || name.includes("arch") || name.includes("archway") || name.includes("pillar") || name.includes("pillars") || name.includes("wall")) {
    return symbolGlyphs.Keys;
  }
  if (name.includes("wind") || name.includes("dust") || name.includes("storm") || name.includes("breathe") || name.includes("breath")) {
    return symbolGlyphs.Wind;
  }
  if (name.includes("mountain") || name.includes("cliff") || name.includes("rock") || name.includes("stone") || name.includes("bench") || name.includes("tomb") || name.includes("crutch")) {
    return symbolGlyphs.Mountain;
  }

  // Animal/Totem symbols fallback
  if (name.includes("lion") || name.includes("bull") || name.includes("goat") || name.includes("ram") || name.includes("dog") || name.includes("dogs") || name.includes("rabbit") || name.includes("snake") || name.includes("fish") || name.includes("shell") || name.includes("sphinx") || name.includes("horse") || name.includes("beast")) {
    return (
      <g>
        <path d="M-5,3 L-2,5 L0,2 L2,5 L5,3 L2,-3 L-2,-3 Z" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="0" cy="0" r="1.5" fill="currentColor" />
      </g>
    );
  }

  // Fallback to sparkling diamond shape to keep sacred geometry style
  return (
    <polygon points="0,-4 3,0 0,4 -3,0" fill="currentColor" opacity="0.8" />
  );
}

function strokeScaleCrown() {
  return (
    <g transform="scale(0.9)">
      <path d="-6,4 L6,4 L8,-3 L3.5,0.5 L0,-5 L-3.5,0.5 L-8,-3 Z" stroke="currentColor" strokeWidth="1" fill="currentColor" />
    </g>
  );
}

// --- THE PROGRAMMATIC ASTROLABE COMPONENT ---

type AstrolabeProps = {
  card: TarotCard;
};

function Astrolabe({ card }: AstrolabeProps) {
  // Grab suit emblem
  const centerEmblem = suitEmblems[card.suit] || centerStarPlaceholder();

  // Resolve symbols
  const activeSymbols = card.symbols.slice(0, 3);
  const n = activeSymbols.length;

  function centerStarPlaceholder() {
    return (
      <g>
        <circle cx="0" cy="0" r="14" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M-8,-8 L8,8 M-8,8 L8,-8 M0,-11 L0,11 M-11,0 L11,0" stroke="currentColor" strokeWidth="1" />
      </g>
    );
  }

  // Dynamic Sacred Geometry Grid based on card's suit/family
  let backgroundGrid = null;
  if (card.suit === "Major Arcana") {
    // 12-point zodiac grid
    backgroundGrid = (
      <g opacity="0.14" stroke="var(--gold)" strokeWidth="0.6">
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          return <line key={i} x1={100 - 82 * Math.cos(angle)} y1={100 - 82 * Math.sin(angle)} x2={100 + 82 * Math.cos(angle)} y2={100 + 82 * Math.sin(angle)} />;
        })}
        <circle cx="100" cy="100" r="74" stroke="var(--gold)" strokeWidth="0.5" strokeDasharray="1 3" />
      </g>
    );
  } else if (card.suit === "Cups") {
    // Concentric orbital wave rings
    backgroundGrid = (
      <g opacity="0.14" stroke="var(--gold)" strokeWidth="0.6">
        <circle cx="100" cy="100" r="45" stroke="var(--gold)" />
        <circle cx="100" cy="100" r="72" stroke="var(--gold)" strokeDasharray="6 4" />
        <line x1="20" y1="100" x2="180" y2="100" />
        <line x1="100" y1="20" x2="100" y2="180" />
      </g>
    );
  } else if (card.suit === "Swords") {
    // Diamond/Octagram geometric axis
    backgroundGrid = (
      <g opacity="0.14" stroke="var(--gold)" strokeWidth="0.6">
        <rect x="50" y="50" width="100" height="100" transform="rotate(45 100 100)" stroke="var(--gold)" fill="none" />
        <line x1="100" y1="15" x2="100" y2="185" />
        <line x1="15" y1="100" x2="185" y2="100" />
      </g>
    );
  } else if (card.suit === "Pentacles") {
    // Pentagonal alignment star
    backgroundGrid = (
      <g opacity="0.14" stroke="var(--gold)" strokeWidth="0.6">
        <polygon points="100,30 142,160 30,80 170,80 58,160" stroke="var(--gold)" fill="none" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="70" stroke="var(--gold)" />
      </g>
    );
  } else {
    // Interlocking hexagram alignment (Wands)
    backgroundGrid = (
      <g opacity="0.14" stroke="var(--gold)" strokeWidth="0.6">
        <polygon points="100,25 165,138 35,138" stroke="var(--gold)" fill="none" />
        <polygon points="100,175 165,62 35,62" stroke="var(--gold)" fill="none" />
        <line x1="100" y1="20" x2="100" y2="180" />
      </g>
    );
  }

  // Custom Tick mark count depending on card family
  let tickCount = 24;
  if (card.suit === "Major Arcana") tickCount = 36;
  else if (card.suit === "Cups") tickCount = 24;
  else if (card.suit === "Swords") tickCount = 28;
  else if (card.suit === "Pentacles") tickCount = 32;
  else tickCount = 20;

  return (
    <div className="astrolabe">
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--card-glow)" stopOpacity="0.45" />
            <stop offset="60%" stopColor="var(--card-glow)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--card-glow)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Center Glow backing */}
        <circle cx="100" cy="100" r="60" fill="url(#centerGlow)" />

        {/* Dynamic Sacred Geometry Background Grid */}
        {backgroundGrid}

        {/* Intricate Outer Astrolabe Dials */}
        <circle cx="100" cy="100" r="88" stroke="var(--gold)" strokeWidth="0.8" opacity="0.3" />
        <circle cx="100" cy="100" r="84" stroke="var(--gold)" strokeWidth="1.2" opacity="0.5" />
        <circle cx="100" cy="100" r="81" stroke="var(--gold)" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.4" />

        {/* Outer Ring Tick Marks (Astro-Grid) */}
        <g stroke="var(--gold)" strokeWidth="0.8" opacity="0.35">
          {Array.from({ length: tickCount }).map((_, i) => {
            const angle = (i * (360 / tickCount) * Math.PI) / 180;
            const x1 = 100 + 84 * Math.cos(angle);
            const y1 = 100 + 84 * Math.sin(angle);
            const x2 = 100 + 87 * Math.cos(angle);
            const y2 = 100 + 87 * Math.sin(angle);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </g>

        {/* Main Orbital Track for Symbols */}
        <circle cx="100" cy="100" r="60" stroke="var(--gold)" strokeWidth="0.8" strokeDasharray="4 6" opacity="0.3" />

        {/* Central Dial Gilded Base */}
        <circle cx="100" cy="100" r="30" stroke="var(--gold)" strokeWidth="1.2" fill="#040508" fillOpacity="0.4" />
        <circle cx="100" cy="100" r="27" stroke="var(--gold)" strokeWidth="0.6" strokeDasharray="1 2" opacity="0.4" />

        {/* Programmatic Alignment Vectors & Nodes */}
        {n > 0 ? (
          activeSymbols.map((symbolName, i) => {
            // Distribute symbols at symmetrical angles starting from top (-90 deg)
            const angleDeg = i * (360 / n) - 90;
            const angleRad = (angleDeg * Math.PI) / 180;
            const radius = 60;
            const nodeX = 100 + radius * Math.cos(angleRad);
            const nodeY = 100 + radius * Math.sin(angleRad);

            // Dynamically resolve matching symbol glyph path
            const glyph = resolveSymbolGlyph(symbolName);

            return (
              <g key={symbolName}>
                {/* Connecting gold alignment vector lines */}
                <line
                  x1="100"
                  y1="100"
                  x2={nodeX}
                  y2={nodeY}
                  stroke="var(--gold)"
                  strokeWidth="0.8"
                  opacity="0.45"
                />

                {/* Star-like flares connecting node to outer dial */}
                <line
                  x1={nodeX}
                  y1={nodeY}
                  x2={100 + 84 * Math.cos(angleRad)}
                  y2={100 + 84 * Math.sin(angleRad)}
                  stroke="var(--gold)"
                  strokeWidth="0.6"
                  opacity="0.3"
                  strokeDasharray="1 1"
                />

                {/* Symmetrical Orbiting Node */}
                <circle
                  cx={nodeX}
                  cy={nodeY}
                  r="13"
                  stroke="var(--gold)"
                  strokeWidth="1.2"
                  fill="#06080d"
                  opacity="0.95"
                />
                <circle
                  cx={nodeX}
                  cy={nodeY}
                  r="11"
                  stroke="var(--gold)"
                  strokeWidth="0.5"
                  strokeDasharray="1 1"
                  opacity="0.5"
                />

                {/* Secondary Glyph nested in the node */}
                <g transform={`translate(${nodeX}, ${nodeY})`} color="var(--gold)" opacity="0.9">
                  {glyph}
                </g>
              </g>
            );
          })
        ) : (
          // Fallback symmetrical stars if no symbols defined
          Array.from({ length: 3 }).map((_, i) => {
            const angleRad = (i * 120 - 90) * Math.PI / 180;
            const radius = 60;
            const nodeX = 100 + radius * Math.cos(angleRad);
            const nodeY = 100 + radius * Math.sin(angleRad);
            return (
              <g key={i}>
                <line x1="100" y1="100" x2={nodeX} y2={nodeY} stroke="var(--gold)" strokeWidth="0.6" opacity="0.3" />
                <circle cx={nodeX} cy={nodeY} r="3" fill="var(--gold)" opacity="0.4" />
              </g>
            );
          })
        )}

        {/* Central Suit Emblem Group */}
        <g transform="translate(100, 100)" color="var(--text)">
          {centerEmblem}
        </g>
      </svg>
    </div>
  );
}

// --- DYNAMIC INTERACTIVE 3D TAROT CARD COMPONENT ---

export const TarotCardFace = forwardRef<HTMLElement, TarotCardProps>(function TarotCardFace(
  { card, isReversed, revealed, visible },
  ref
) {
  const [isHovering, setIsHovering] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50 });

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const cardElement = e.currentTarget;
    const rect = cardElement.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within card element.
    const y = e.clientY - rect.top;  // y position within card element.
    
    const width = rect.width;
    const height = rect.height;
    
    // Scale tracking rotation parameters: max 15deg tilt
    const maxTilt = 16;
    const ry = ((x / width) - 0.5) * maxTilt;
    const rx = -((y / height) - 0.5) * maxTilt;
    
    // Specular glare coords in percentages
    const mx = (x / width) * 100;
    const my = (y / height) * 100;
    
    setTilt({ rx, ry, mx, my });
  }

  function handleMouseEnter() {
    setIsHovering(true);
  }

  function handleMouseLeave() {
    setIsHovering(false);
    // Smoothly snap back to center
    setTilt({ rx: 0, ry: 0, mx: 50, my: 50 });
  }

  return (
    <article
      ref={ref}
      className={`tarot-card-3d ${visible ?? revealed ? "is-revealed" : ""} ${revealed ? "is-revealing-flip" : ""} ${isReversed ? "is-reversed" : ""}`}
      style={
        {
          ["--rx" as string]: tilt.rx.toFixed(2),
          ["--ry" as string]: tilt.ry.toFixed(2),
          ["--mx" as string]: tilt.mx.toFixed(2),
          ["--my" as string]: tilt.my.toFixed(2),
          ["--card-glow" as string]: card.palette.glow,
          ["--card-accent" as string]: card.palette.accent,
          ["--card-ink" as string]: card.palette.ink
        } as CSSProperties
      }
      tabIndex={-1}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`tarot-card-inner ${isHovering ? "is-hovering" : ""}`}>
        
        {/* PHYSICAL CARD BACK */}
        <div className="tarot-card-back">
          <div className="tarot-card-back__frame" />
          <div className="tarot-card-back__corners" />
          <div className="tarot-card-back__art">
            <div className="tarot-card-back__orbits tarot-card-back__orbits--one" />
            <div className="tarot-card-back__orbits tarot-card-back__orbits--two" />
            <div className="tarot-card-back__core">
              {/* Star-burst core SVG */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                <path d="M12,4 L12,20 M4,12 L20,12 M6.3,6.3 L17.7,17.7 M6.3,17.7 L17.7,6.3" stroke="currentColor" strokeWidth="1" />
                <polygon points="12,7 13.5,10.5 17,12 13.5,13.5 12,17 10.5,13.5 7,12 10.5,10.5" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>

        {/* PHYSICAL CARD FRONT */}
        <div className="tarot-card-front">
          <div className="tarot-card__reveal-flare" />
          <div className="tarot-card__frame" />
          <div className="tarot-card__halo" />
          <div className="tarot-card__grain" />
          
          <header className="tarot-card__header">
            <span>{card.arcana}</span>
            <span>{card.number}</span>
          </header>
          
          <div className="tarot-card__art">
            <Astrolabe card={card} />
          </div>
          
          <footer className="tarot-card__footer">
            <h2>{card.name}</h2>
            <p>{isReversed ? "Reversed" : "Upright"} · {card.suit}</p>
          </footer>
        </div>

      </div>
    </article>
  );
});
