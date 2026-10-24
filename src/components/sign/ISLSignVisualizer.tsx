import React from 'react';
import type { SignData, SignType } from '../../lib/signGeneration';

interface ISLSignVisualizerProps {
  signData: SignData;
  signType: SignType;
  word?: string;
  isPlaying?: boolean;
}

/**
 * Authentic Indian Sign Language (ISL) Visualizer
 *
 * Rather than displaying generic emojis (e.g., a sunrise 🌅 for "Morning"),
 * this visualizer renders authentic ISL hand postures, dual-hand configurations,
 * movement vector trajectories, and contact points aligned with ISLRTC conventions.
 */
export const ISLSignVisualizer: React.FC<ISLSignVisualizerProps> = ({
  signData,
  signType,
  word,
  isPlaying = false,
}) => {
  const isTwoHanded = signData.hands === 'two-handed';
  const animKey = (signData.animation || '').toLowerCase();
  const labelLower = (signData.label || word || '').toLowerCase();

  // Helper to determine specific sign visual type
  const getVisualType = (): string => {
    if (signType === 'fingerspell') {
      const letter = signData.label.replace('Letter ', '').toUpperCase();
      return `letter-${letter}`;
    }

    if (labelLower.includes('morning') || animKey.includes('sun-rise')) return 'morning';
    if (labelLower.includes('night') || animKey.includes('sun-set')) return 'night';
    if (labelLower.includes('namaste') || animKey.includes('prayer')) return 'namaste';
    if (labelLower.includes('good') || animKey.includes('thumb-forward') || animKey.includes('thumbs-up')) return 'good';
    if (labelLower.includes('water') || animKey.includes('water-chin') || animKey.includes('chin-tap')) return 'water';
    if (labelLower.includes('help') || animKey.includes('help-lift')) return 'help';
    if (labelLower.includes('love') || animKey.includes('heart-cross') || animKey.includes('chest-cross')) return 'love';
    if (labelLower.includes('thank') || animKey.includes('chin-forward')) return 'thank-you';
    if (labelLower.includes('book') || animKey.includes('open-book')) return 'book';
    if (labelLower.includes('stop') || animKey.includes('palm-forward')) return 'stop';
    if (labelLower.includes('house') || animKey.includes('roof')) return 'house';
    if (labelLower.includes('eat') || labelLower.includes('food') || animKey.includes('mouth-feed')) return 'eat';
    if (labelLower.includes('drink') || animKey.includes('cup-tilt')) return 'drink';
    if (labelLower.includes('rain') || animKey.includes('tears-fall')) return 'rain';

    if (animKey.includes('tap') || animKey.includes('touch')) return 'generic-tap';
    if (animKey.includes('circle') || animKey.includes('roll')) return 'generic-circle';
    if (animKey.includes('lift') || animKey.includes('up')) return 'generic-up';
    if (animKey.includes('down')) return 'generic-down';
    if (animKey.includes('forward') || animKey.includes('push')) return 'generic-forward';

    return isTwoHanded ? 'generic-two-handed' : 'generic-one-handed';
  };

  const visualType = getVisualType();

  // Anatomical specifications for the kinematic badge strip
  const getKinematicSpecs = () => {
    switch (visualType) {
      case 'morning':
        return {
          activeHand: 'Right Hand: Open curved palm rising upward',
          baseHand: 'Left Arm: Horizontal base forearm across chest',
          motion: 'Vertical Ascending (↑) simulating sunrise',
          touchPoint: 'Spatial rise starting behind forearm',
        };
      case 'night':
        return {
          activeHand: 'Right Hand: Open palm curving down over base arm',
          baseHand: 'Left Arm: Horizontal base forearm',
          motion: 'Downward Arc (↓) simulating sunset',
          touchPoint: 'Curving over base forearm',
        };
      case 'namaste':
        return {
          activeHand: 'Right Palm: Flat facing left inward',
          baseHand: 'Left Palm: Flat facing right inward',
          motion: 'Palms joined in Anjali Mudra with gentle nod',
          touchPoint: 'Full palm-to-palm contact at chest',
        };
      case 'good':
        return {
          activeHand: 'Right Hand: Firm thumbs-up with upward wrist flex',
          baseHand: 'Neutral / Resting',
          motion: 'Upward & outward thrust (↑)',
          touchPoint: 'Chest height in neutral space',
        };
      case 'water':
        return {
          activeHand: 'Right Hand: "W" shape (3 middle fingers upright)',
          baseHand: 'Neutral / Resting',
          motion: 'Double tap against chin (⊙⊙)',
          touchPoint: 'Index edge touches right side of chin',
        };
      case 'help':
        return {
          activeHand: 'Right Hand: Thumbs-up resting in left palm',
          baseHand: 'Left Hand: Open flat palm facing upward',
          motion: 'Both hands lift upward together (↑)',
          touchPoint: 'Right fist base rests on left palm',
        };
      case 'love':
        return {
          activeHand: 'Right Arm: Crossed over chest to left shoulder',
          baseHand: 'Left Arm: Crossed over chest to right shoulder',
          motion: 'Gentle inward compression over heart',
          touchPoint: 'Arms crossed at mid-chest',
        };
      case 'thank-you':
        return {
          activeHand: 'Right Hand: Flat open fingers touch chin, move forward',
          baseHand: 'Neutral / Resting',
          motion: 'Forward extension towards conversation partner (→)',
          touchPoint: 'Fingertips start at chin/lips',
        };
      case 'book':
        return {
          activeHand: 'Right Hand: Flat palm facing left, hinged open',
          baseHand: 'Left Hand: Flat palm facing right, hinged open',
          motion: 'Palms joined flat then opening outward at 45°',
          touchPoint: 'Pinky edges stay in contact',
        };
      case 'stop':
        return {
          activeHand: 'Right Hand: Flat open palm facing forward at shoulder',
          baseHand: 'Neutral / Resting',
          motion: 'Firm static forward push (→)',
          touchPoint: 'Shoulder height forward barrier',
        };
      case 'house':
        return {
          activeHand: 'Right Hand: Slanted open palm forming right roof slope',
          baseHand: 'Left Hand: Slanted open palm forming left roof slope',
          motion: 'Fingertips meet to form roof peak (∧)',
          touchPoint: 'Fingertip to fingertip contact at top',
        };
      default:
        if (visualType.startsWith('letter-')) {
          const letter = visualType.replace('letter-', '');
          return {
            activeHand: `Dominant hand shaping letter "${letter}" contact`,
            baseHand: isTwoHanded ? 'Base hand providing reference anchor' : 'Neutral',
            motion: 'Two-handed fingerspelling posture',
            touchPoint: signData.touchPoint?.replace(/_/g, ' ') || 'Specific finger contact',
          };
        }
        return {
          activeHand: isTwoHanded ? 'Dominant active hand' : 'Single active hand',
          baseHand: isTwoHanded ? 'Supporting base hand / forearm' : 'Resting at side',
          motion: signData.description.slice(0, 48) + '...',
          touchPoint: isTwoHanded ? 'Two-handed spatial coordination' : 'One-handed posture',
        };
    }
  };

  const specs = getKinematicSpecs();

  return (
    <div className="w-full flex flex-col items-center">
      {/* Visual Canvas Stage */}
      <div className="relative w-full max-w-[340px] sm:max-w-[380px] h-[220px] sm:h-[240px] rounded-3xl bg-gradient-to-b from-cream-white via-warm-sand/30 to-warm-sand/70 border-2 border-peacock-teal/25 shadow-warm-md flex items-center justify-center overflow-hidden group select-none">
        
        {/* Subtle decorative grid & target lines */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#236D65_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Center Target Focal Guides */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-48 h-48 rounded-full border border-peacock-teal border-dashed animate-smooth-spin" style={{ animationDuration: '40s' }} />
        </div>

        {/* Hand Landmark / Vector Render Engine */}
        <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
          
          {/* ================= MORNING (Sunrise Hand over Horizon Arm) ================= */}
          {visualType === 'morning' && (
            <svg viewBox="0 0 280 200" className="w-full h-full max-w-[280px] max-h-[190px]">
              <defs>
                <linearGradient id="sunGlow" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#E8BD50" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#B94E36" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="armGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#382F28" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#236D65" stopOpacity="0.9" />
                </linearGradient>
                <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Upward Movement Arrow & Arc Trajectory */}
              <g className={isPlaying ? 'animate-bounce' : ''}>
                <path
                  d="M 140 145 L 140 50"
                  stroke="#E8BD50"
                  strokeWidth="3.5"
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                  opacity="0.85"
                />
                <polygon points="140,40 133,54 147,54" fill="#B94E36" />
                <text x="150" y="70" fill="#B94E36" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                  Rise (↑)
                </text>
              </g>

              {/* Rising Sun Glow Arcs */}
              <circle cx="140" cy="75" r="32" fill="url(#sunGlow)" opacity="0.35" className="animate-pulse" />

              {/* ACTIVE HAND: Right Hand with Curved Open Fingers (Sun Rays) */}
              <g transform="translate(140, 75)" className="transition-transform duration-700 hover:scale-105">
                {/* Palm Base */}
                <ellipse cx="0" cy="18" rx="19" ry="14" fill="#E8BD50" stroke="#382F28" strokeWidth="2.5" />
                
                {/* 5 Radiating Curved Fingers (Sun rising) */}
                {/* Thumb */}
                <path d="M -16 12 C -24 6 -28 -2 -22 -8 C -18 -12 -12 -8 -11 4 Z" fill="#F8F0DF" stroke="#382F28" strokeWidth="2.2" />
                {/* Index */}
                <path d="M -10 6 C -14 -12 -12 -28 -6 -32 C 0 -34 2 -18 0 4 Z" fill="#F8F0DF" stroke="#382F28" strokeWidth="2.2" />
                {/* Middle */}
                <path d="M -3 4 C -2 -18 1 -34 7 -36 C 13 -36 13 -20 8 4 Z" fill="#F8F0DF" stroke="#382F28" strokeWidth="2.2" />
                {/* Ring */}
                <path d="M 6 6 C 10 -14 16 -28 20 -29 C 25 -30 25 -16 16 6 Z" fill="#F8F0DF" stroke="#382F28" strokeWidth="2.2" />
                {/* Pinky */}
                <path d="M 14 10 C 22 -4 28 -14 31 -13 C 34 -11 31 2 21 15 Z" fill="#F8F0DF" stroke="#382F28" strokeWidth="2.2" />

                {/* Hand Annotation Pin */}
                <circle cx="0" cy="5" r="4" fill="#B94E36" />
                <text x="35" y="-10" fill="#236D65" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                  Dominant Hand (Sun)
                </text>
              </g>

              {/* BASE HAND: Left Forearm Horizontal across Chest (The Horizon) */}
              <g transform="translate(40, 130)">
                {/* Arm Body */}
                <rect
                  x="0"
                  y="0"
                  width="180"
                  height="22"
                  rx="11"
                  fill="url(#armGrad)"
                  stroke="#382F28"
                  strokeWidth="2.5"
                  filter="url(#glowEffect)"
                />
                {/* Horizontal reference dashed baseline */}
                <line x1="10" y1="11" x2="170" y2="11" stroke="#FFFDF7" strokeWidth="2" strokeDasharray="4 4" opacity="0.8" />
                
                {/* Hand extension of the base arm (flat palm pointing right) */}
                <path
                  d="M 175 2 C 190 2 205 6 205 11 C 205 16 190 20 175 20 Z"
                  fill="#F8F0DF"
                  stroke="#382F28"
                  strokeWidth="2.5"
                />

                {/* Label for base arm */}
                <rect x="25" y="28" width="130" height="18" rx="6" fill="#EDE4D3" stroke="#236D65" strokeWidth="1" />
                <text x="90" y="41" fill="#382F28" fontSize="9.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  Base Forearm (Horizon)
                </text>
              </g>

              {/* Sun Ray Micro-accents */}
              <line x1="110" y1="35" x2="102" y2="25" stroke="#E8BD50" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="140" y1="28" x2="140" y2="16" stroke="#E8BD50" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="170" y1="35" x2="178" y2="25" stroke="#E8BD50" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          )}

          {/* ================= NAMASTE (Two Palms Pressed in Anjali Mudra) ================= */}
          {visualType === 'namaste' && (
            <svg viewBox="0 0 280 200" className="w-full h-full max-w-[280px] max-h-[190px]">
              <defs>
                <filter id="namastePulse" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Concentric Prayer Resonance Rings */}
              <circle cx="140" cy="95" r="46" fill="none" stroke="#236D65" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" className="animate-ping" style={{ animationDuration: '3s' }} />
              <circle cx="140" cy="95" r="62" fill="none" stroke="#E8BD50" strokeWidth="1" strokeDasharray="6 4" opacity="0.3" />

              {/* Centered Anjali Mudra Palms */}
              <g transform="translate(140, 95)">
                {/* Left Palm (Angled inwards) */}
                <g transform="translate(-1, 0) scale(-1, 1)">
                  <path
                    d="M 2 45 L 2 -40 C 2 -48 10 -46 12 -38 L 18 10 C 20 20 18 35 12 45 Z"
                    fill="#F8F0DF"
                    stroke="#382F28"
                    strokeWidth="2.5"
                  />
                  <path d="M 6 -32 L 6 35" stroke="#EDE4D3" strokeWidth="1.5" />
                  <path d="M 10 -25 L 10 30" stroke="#EDE4D3" strokeWidth="1.5" />
                </g>

                {/* Right Palm (Angled inwards meeting left palm) */}
                <g transform="translate(1, 0)">
                  <path
                    d="M 2 45 L 2 -40 C 2 -48 10 -46 12 -38 L 18 10 C 20 20 18 35 12 45 Z"
                    fill="#F8F0DF"
                    stroke="#382F28"
                    strokeWidth="2.5"
                  />
                  <path d="M 6 -32 L 6 35" stroke="#EDE4D3" strokeWidth="1.5" />
                  <path d="M 10 -25 L 10 30" stroke="#EDE4D3" strokeWidth="1.5" />
                </g>

                {/* Meeting Seam Glow */}
                <line x1="0" y1="-44" x2="0" y2="46" stroke="#B94E36" strokeWidth="3" strokeLinecap="round" />
                <circle cx="0" cy="5" r="5" fill="#E8BD50" stroke="#382F28" strokeWidth="1.5" />
              </g>

              {/* Labels & Markers */}
              <text x="140" y="165" fill="#382F28" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                Both Palms Pressed Together (Chest Level)
              </text>
              <text x="140" y="180" fill="#236D65" fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">
                Anjali Mudra • Two-Handed Reverence
              </text>
            </svg>
          )}

          {/* ================= GOOD (Thumbs Up Upward Flexion) ================= */}
          {visualType === 'good' && (
            <svg viewBox="0 0 280 200" className="w-full h-full max-w-[280px] max-h-[190px]">
              {/* Upward motion trails */}
              <g className={isPlaying ? 'animate-bounce' : ''}>
                <line x1="140" y1="130" x2="140" y2="55" stroke="#236D65" strokeWidth="3" strokeDasharray="5 4" />
                <polygon points="140,45 133,58 147,58" fill="#236D65" />
                <line x1="115" y1="110" x2="115" y2="70" stroke="#E8BD50" strokeWidth="2" strokeDasharray="4 3" />
                <line x1="165" y1="110" x2="165" y2="70" stroke="#E8BD50" strokeWidth="2" strokeDasharray="4 3" />
              </g>

              {/* Thumbs Up Hand Drawing */}
              <g transform="translate(140, 105)">
                {/* Wrist */}
                <rect x="-18" y="24" width="36" height="26" rx="6" fill="#EDE4D3" stroke="#382F28" strokeWidth="2.5" />
                
                {/* Curled Fingers (Fist body) */}
                <rect x="-24" y="-8" width="48" height="36" rx="12" fill="#F8F0DF" stroke="#382F28" strokeWidth="2.5" />
                <line x1="-16" y1="2" x2="16" y2="2" stroke="#382F28" strokeWidth="2" strokeLinecap="round" />
                <line x1="-16" y1="11" x2="16" y2="11" stroke="#382F28" strokeWidth="2" strokeLinecap="round" />
                <line x1="-16" y1="20" x2="16" y2="20" stroke="#382F28" strokeWidth="2" strokeLinecap="round" />

                {/* Extended Upright Thumb */}
                <path
                  d="M -22 -4 C -22 -25 -16 -46 -6 -48 C 4 -50 8 -30 2 -4 Z"
                  fill="#F8F0DF"
                  stroke="#382F28"
                  strokeWidth="2.5"
                />
                {/* Thumb knuckle line */}
                <path d="M -16 -24 C -12 -22 -6 -22 -2 -24" stroke="#382F28" strokeWidth="1.8" strokeLinecap="round" />

                {/* Positive energy spark */}
                <circle cx="-6" cy="-48" r="4" fill="#E8BD50" />
              </g>

              <text x="140" y="165" fill="#382F28" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                Dominant Thumb Upright (Thumbs Up)
              </text>
              <text x="140" y="180" fill="#B94E36" fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">
                Slight upward thrust (↑) • Positive affirmation
              </text>
            </svg>
          )}

          {/* ================= WATER (W-Handshape tapping on Chin) ================= */}
          {visualType === 'water' && (
            <svg viewBox="0 0 280 200" className="w-full h-full max-w-[280px] max-h-[190px]">
              {/* Silhouette of lower profile / jawline */}
              <path
                d="M 60 40 C 65 90 90 120 125 125 C 145 128 170 125 185 110"
                fill="none"
                stroke="#EDE4D3"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M 60 40 C 65 90 90 120 125 125 C 145 128 170 125 185 110"
                fill="none"
                stroke="#382F28"
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />
              <text x="75" y="85" fill="#382F28" opacity="0.6" fontSize="9" fontWeight="bold">Chin / Jaw</text>

              {/* Concentric Tap Rings at Chin Point */}
              <circle cx="130" cy="120" r="14" fill="none" stroke="#236D65" strokeWidth="2" strokeDasharray="3 3" className="animate-ping" />
              <circle cx="130" cy="120" r="8" fill="#E8BD50" stroke="#382F28" strokeWidth="1.5" />

              {/* Hand in "W" shape (3 fingers upright: index, middle, ring) */}
              <g transform="translate(150, 100)">
                {/* Palm Base */}
                <ellipse cx="2" cy="22" rx="16" ry="14" fill="#F8F0DF" stroke="#382F28" strokeWidth="2.5" />
                
                {/* Thumb holding pinky curled */}
                <ellipse cx="14" cy="22" rx="6" ry="8" fill="#F8F0DF" stroke="#382F28" strokeWidth="2" />

                {/* 3 Extended Fingers forming "W" */}
                {/* Finger 1 (Index) */}
                <path d="M -12 12 L -14 -35 C -14 -40 -6 -40 -6 -35 L -4 10" fill="#F8F0DF" stroke="#382F28" strokeWidth="2.2" />
                {/* Finger 2 (Middle) */}
                <path d="M -4 10 L 0 -42 C 0 -47 8 -47 8 -42 L 6 10" fill="#F8F0DF" stroke="#382F28" strokeWidth="2.2" />
                {/* Finger 3 (Ring) */}
                <path d="M 6 10 L 14 -35 C 14 -40 22 -40 22 -35 L 16 12" fill="#F8F0DF" stroke="#382F28" strokeWidth="2.2" />

                {/* Direction arrow to chin */}
                <path d="M -20 -10 L -30 10" stroke="#B94E36" strokeWidth="3" markerEnd="url(#arrow)" />
                <polygon points="-32,15 -24,8 -32,2" fill="#B94E36" />
              </g>

              <text x="140" y="165" fill="#382F28" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                &quot;W&quot; Handshape Tapping Chin (2x)
              </text>
              <text x="140" y="180" fill="#236D65" fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">
                Index, Middle &amp; Ring Fingers Upright • ISL Water Sign
              </text>
            </svg>
          )}

          {/* ================= HELP (Thumbs-Up in Open Supporting Palm) ================= */}
          {visualType === 'help' && (
            <svg viewBox="0 0 280 200" className="w-full h-full max-w-[280px] max-h-[190px]">
              {/* Dual Upward Lift Arrows */}
              <g className={isPlaying ? 'animate-bounce' : ''}>
                <line x1="85" y1="120" x2="85" y2="50" stroke="#236D65" strokeWidth="3" strokeDasharray="5 3" />
                <polygon points="85,42 78,55 92,55" fill="#236D65" />
                <line x1="195" y1="120" x2="195" y2="50" stroke="#236D65" strokeWidth="3" strokeDasharray="5 3" />
                <polygon points="195,42 188,55 202,55" fill="#236D65" />
              </g>

              <g transform="translate(140, 105)">
                {/* Non-dominant supporting flat palm (Base) */}
                <ellipse cx="0" cy="30" rx="42" ry="12" fill="#EDE4D3" stroke="#382F28" strokeWidth="2.5" />
                <line x1="-30" y1="30" x2="30" y2="30" stroke="#382F28" strokeWidth="1.5" strokeDasharray="3 3" />

                {/* Dominant Hand: Thumbs up sitting on the base palm */}
                <rect x="-16" y="0" width="32" height="24" rx="8" fill="#F8F0DF" stroke="#382F28" strokeWidth="2.5" />
                <path d="M -14 4 C -14 -18 -8 -34 0 -36 C 8 -34 8 -18 2 4 Z" fill="#F8F0DF" stroke="#382F28" strokeWidth="2.5" />
                
                {/* Contact glow */}
                <ellipse cx="0" cy="24" rx="14" ry="4" fill="#E8BD50" opacity="0.8" />
              </g>

              <text x="140" y="165" fill="#382F28" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                Support Hand Underneath + Fist Lifts Up (↑)
              </text>
              <text x="140" y="180" fill="#B94E36" fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">
                Two-Handed Mutual Assistance Gesture
              </text>
            </svg>
          )}

          {/* ================= LOVE (Crossed Arms Over Heart) ================= */}
          {visualType === 'love' && (
            <svg viewBox="0 0 280 200" className="w-full h-full max-w-[280px] max-h-[190px]">
              {/* Heart Pulse Glow in Background */}
              <path
                d="M 140 100 C 140 70 105 50 85 75 C 65 100 140 145 140 145 C 140 145 215 100 195 75 C 175 50 140 70 140 100 Z"
                fill="#B94E36"
                opacity="0.18"
                className="animate-pulse"
              />

              {/* Left Arm crossing diagonally to right shoulder */}
              <g transform="translate(140, 100) rotate(28)">
                <rect x="-65" y="-10" width="130" height="20" rx="10" fill="#EDE4D3" stroke="#382F28" strokeWidth="2.5" />
                <ellipse cx="65" cy="0" rx="14" ry="12" fill="#F8F0DF" stroke="#382F28" strokeWidth="2.5" />
              </g>

              {/* Right Arm crossing diagonally to left shoulder */}
              <g transform="translate(140, 100) rotate(-28)">
                <rect x="-65" y="-10" width="130" height="20" rx="10" fill="#F8F0DF" stroke="#382F28" strokeWidth="2.5" />
                <ellipse cx="-65" cy="0" rx="14" ry="12" fill="#EDE4D3" stroke="#382F28" strokeWidth="2.5" />
              </g>

              <circle cx="140" cy="100" r="7" fill="#B94E36" stroke="#FFFDF7" strokeWidth="2" />

              <text x="140" y="165" fill="#382F28" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                Both Arms Crossed Flat Over Chest
              </text>
              <text x="140" y="180" fill="#B94E36" fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">
                Holding close to heart • Universal ISL Love Sign
              </text>
            </svg>
          )}

          {/* ================= THANK YOU (Chin to Forward Extension) ================= */}
          {visualType === 'thank-you' && (
            <svg viewBox="0 0 280 200" className="w-full h-full max-w-[280px] max-h-[190px]">
              {/* Forward Projecting Trajectory Arrow */}
              <g className={isPlaying ? 'animate-bounce' : ''}>
                <path d="M 110 90 Q 140 75 180 85" fill="none" stroke="#236D65" strokeWidth="3" strokeDasharray="5 3" />
                <polygon points="186,87 172,81 176,93" fill="#236D65" />
                <text x="150" y="70" fill="#236D65" fontSize="10" fontWeight="bold">Forward (→)</text>
              </g>

              {/* Hand starting at chin level */}
              <g transform="translate(100, 100)">
                <rect x="-14" y="16" width="28" height="20" rx="6" fill="#EDE4D3" stroke="#382F28" strokeWidth="2" />
                <ellipse cx="0" cy="10" rx="16" ry="12" fill="#F8F0DF" stroke="#382F28" strokeWidth="2.2" />
                {/* 4 extended fingers */}
                <rect x="-12" y="-24" width="6" height="34" rx="3" fill="#F8F0DF" stroke="#382F28" strokeWidth="2" />
                <rect x="-5" y="-28" width="6" height="38" rx="3" fill="#F8F0DF" stroke="#382F28" strokeWidth="2" />
                <rect x="2" y="-26" width="6" height="36" rx="3" fill="#F8F0DF" stroke="#382F28" strokeWidth="2" />
                <rect x="9" y="-20" width="6" height="30" rx="3" fill="#F8F0DF" stroke="#382F28" strokeWidth="2" />
                <circle cx="-14" cy="5" r="4" fill="#E8BD50" />
              </g>

              {/* Target receiver hand silhouette */}
              <g transform="translate(190, 95) scale(0.85)" opacity="0.65">
                <ellipse cx="0" cy="10" rx="14" ry="10" fill="#EDE4D3" stroke="#382F28" strokeWidth="1.8" />
                <rect x="-10" y="-18" width="5" height="28" rx="2.5" fill="#EDE4D3" stroke="#382F28" strokeWidth="1.8" />
                <rect x="-4" y="-22" width="5" height="32" rx="2.5" fill="#EDE4D3" stroke="#382F28" strokeWidth="1.8" />
                <rect x="2" y="-20" width="5" height="30" rx="2.5" fill="#EDE4D3" stroke="#382F28" strokeWidth="1.8" />
                <rect x="8" y="-16" width="5" height="26" rx="2.5" fill="#EDE4D3" stroke="#382F28" strokeWidth="1.8" />
              </g>

              <text x="140" y="165" fill="#382F28" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                Flat Palm from Lips/Chin Moving Forward (→)
              </text>
              <text x="140" y="180" fill="#236D65" fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">
                Respectful offering of thanks to partner
              </text>
            </svg>
          )}

          {/* ================= TWO-HANDED ISL ALPHABET (Fingerspelling) ================= */}
          {visualType.startsWith('letter-') && (
            <svg viewBox="0 0 280 200" className="w-full h-full max-w-[280px] max-h-[190px]">
              {/* Letter Display Plate */}
              <rect x="110" y="15" width="60" height="38" rx="12" fill="#E8BD50" stroke="#382F28" strokeWidth="2" />
              <text x="140" y="41" fill="#382F28" fontSize="22" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                {visualType.replace('letter-', '')}
              </text>

              {/* Two-Handed Fingerspelling Diagram */}
              <g transform="translate(140, 105)">
                {/* Base Anchor Hand (Left Hand upright open palm) */}
                <g transform="translate(-35, 10)">
                  <rect x="-10" y="18" width="20" height="18" rx="5" fill="#EDE4D3" stroke="#382F28" strokeWidth="2" />
                  <ellipse cx="0" cy="8" rx="14" ry="12" fill="#F8F0DF" stroke="#382F28" strokeWidth="2.2" />
                  {/* Fingers pointing up */}
                  <rect x="-12" y="-25" width="5" height="32" rx="2.5" fill="#F8F0DF" stroke="#382F28" strokeWidth="2" />
                  <rect x="-6" y="-30" width="5" height="37" rx="2.5" fill="#F8F0DF" stroke="#382F28" strokeWidth="2" />
                  <rect x="0" y="-27" width="5" height="34" rx="2.5" fill="#F8F0DF" stroke="#382F28" strokeWidth="2" />
                  <rect x="6" y="-21" width="5" height="28" rx="2.5" fill="#F8F0DF" stroke="#382F28" strokeWidth="2" />
                  {/* Thumb extended outwards */}
                  <path d="M -12 6 C -22 4 -28 0 -26 -6 C -24 -10 -16 -4 -12 0 Z" fill="#F8F0DF" stroke="#382F28" strokeWidth="2" />
                </g>

                {/* Active Pointer Hand (Right Hand index pointing to contact) */}
                <g transform="translate(35, 10)">
                  <rect x="-10" y="18" width="20" height="18" rx="5" fill="#EDE4D3" stroke="#382F28" strokeWidth="2" />
                  <ellipse cx="0" cy="8" rx="14" ry="12" fill="#F8F0DF" stroke="#382F28" strokeWidth="2.2" />
                  {/* Index pointing left towards base hand */}
                  <path d="M -8 2 L -42 -10 C -48 -12 -46 -18 -40 -18 L -6 -6 Z" fill="#F8F0DF" stroke="#382F28" strokeWidth="2.2" />
                  {/* Other fingers curled */}
                  <circle cx="4" cy="2" r="5" fill="#EDE4D3" stroke="#382F28" strokeWidth="1.8" />
                  <circle cx="6" cy="9" r="5" fill="#EDE4D3" stroke="#382F28" strokeWidth="1.8" />
                  <circle cx="6" cy="16" r="5" fill="#EDE4D3" stroke="#382F28" strokeWidth="1.8" />
                </g>

                {/* Contact Point Glow Target */}
                <circle cx="-12" cy="-4" r="8" fill="#B94E36" opacity="0.3" className="animate-ping" />
                <circle cx="-12" cy="-4" r="4.5" fill="#B94E36" stroke="#FFFDF7" strokeWidth="1.5" />
              </g>

              <text x="140" y="165" fill="#382F28" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                Touch Point: {signData.touchPoint?.replace(/_/g, ' ') || 'Specific Contact Zone'}
              </text>
              <text x="140" y="180" fill="#B94E36" fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">
                ISLRTC Standard Two-Handed Fingerspelling
              </text>
            </svg>
          )}

          {/* ================= GENERIC TWO-HANDED SIGN ================= */}
          {visualType === 'generic-two-handed' && (
            <svg viewBox="0 0 280 200" className="w-full h-full max-w-[280px] max-h-[190px]">
              {/* Dual Motion Lines */}
              <path d="M 70 85 C 90 60 120 60 140 85 C 160 60 190 60 210 85" fill="none" stroke="#236D65" strokeWidth="2.5" strokeDasharray="5 3" />
              
              <g transform="translate(90, 105)">
                <ellipse cx="0" cy="10" rx="18" ry="14" fill="#EDE4D3" stroke="#382F28" strokeWidth="2.2" />
                <rect x="-12" y="-24" width="6" height="32" rx="3" fill="#EDE4D3" stroke="#382F28" strokeWidth="2" />
                <rect x="-4" y="-28" width="6" height="36" rx="3" fill="#EDE4D3" stroke="#382F28" strokeWidth="2" />
                <rect x="4" y="-24" width="6" height="32" rx="3" fill="#EDE4D3" stroke="#382F28" strokeWidth="2" />
                <text x="0" y="38" fill="#236D65" fontSize="9" fontWeight="bold" textAnchor="middle">Left Hand</text>
              </g>

              <g transform="translate(190, 105)">
                <ellipse cx="0" cy="10" rx="18" ry="14" fill="#F8F0DF" stroke="#382F28" strokeWidth="2.2" />
                <rect x="-12" y="-24" width="6" height="32" rx="3" fill="#F8F0DF" stroke="#382F28" strokeWidth="2" />
                <rect x="-4" y="-28" width="6" height="36" rx="3" fill="#F8F0DF" stroke="#382F28" strokeWidth="2" />
                <rect x="4" y="-24" width="6" height="32" rx="3" fill="#F8F0DF" stroke="#382F28" strokeWidth="2" />
                <text x="0" y="38" fill="#B94E36" fontSize="9" fontWeight="bold" textAnchor="middle">Right Hand</text>
              </g>

              <text x="140" y="165" fill="#382F28" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                Two-Handed Coordinated Gesture
              </text>
              <text x="140" y="180" fill="#236D65" fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">
                Both hands active in symmetry or base-action
              </text>
            </svg>
          )}

          {/* ================= GENERIC ONE-HANDED SIGN ================= */}
          {(visualType === 'generic-one-handed' ||
            visualType === 'generic-up' ||
            visualType === 'generic-down' ||
            visualType === 'generic-tap' ||
            visualType === 'generic-forward' ||
            visualType === 'generic-circle') && (
            <svg viewBox="0 0 280 200" className="w-full h-full max-w-[280px] max-h-[190px]">
              {/* Dynamic trajectory indicator */}
              {visualType === 'generic-up' && (
                <g className={isPlaying ? 'animate-bounce' : ''}>
                  <line x1="140" y1="125" x2="140" y2="55" stroke="#236D65" strokeWidth="3" strokeDasharray="5 3" />
                  <polygon points="140,46 133,58 147,58" fill="#236D65" />
                </g>
              )}
              {visualType === 'generic-down' && (
                <g className={isPlaying ? 'animate-bounce' : ''}>
                  <line x1="140" y1="55" x2="140" y2="125" stroke="#B94E36" strokeWidth="3" strokeDasharray="5 3" />
                  <polygon points="140,134 133,122 147,122" fill="#B94E36" />
                </g>
              )}
              {visualType === 'generic-tap' && (
                <g>
                  <circle cx="140" cy="80" r="14" fill="none" stroke="#E8BD50" strokeWidth="2" strokeDasharray="3 3" className="animate-ping" />
                  <circle cx="140" cy="80" r="6" fill="#B94E36" />
                </g>
              )}
              {visualType === 'generic-circle' && (
                <circle cx="140" cy="95" r="32" fill="none" stroke="#236D65" strokeWidth="2.5" strokeDasharray="6 4" className="animate-smooth-spin" />
              )}

              {/* Hand Silhouette */}
              <g transform="translate(140, 105)">
                <ellipse cx="0" cy="14" rx="20" ry="16" fill="#F8F0DF" stroke="#382F28" strokeWidth="2.5" />
                <rect x="-14" y="-22" width="6" height="34" rx="3" fill="#F8F0DF" stroke="#382F28" strokeWidth="2.2" />
                <rect x="-6" y="-28" width="6" height="40" rx="3" fill="#F8F0DF" stroke="#382F28" strokeWidth="2.2" />
                <rect x="2" y="-24" width="6" height="36" rx="3" fill="#F8F0DF" stroke="#382F28" strokeWidth="2.2" />
                <rect x="10" y="-18" width="6" height="30" rx="3" fill="#F8F0DF" stroke="#382F28" strokeWidth="2.2" />
              </g>

              <text x="140" y="165" fill="#382F28" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                Dominant One-Handed Gesture
              </text>
              <text x="140" y="180" fill="#236D65" fontSize="9.5" textAnchor="middle" fontFamily="sans-serif">
                Movement: {signData.animation || 'Standard spatial articulation'}
              </text>
            </svg>
          )}

        </div>

        {/* Hand Coordination Floating Pill */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-peacock-teal/90 text-cream-white text-[10px] font-bold shadow-xs flex items-center gap-1.5 backdrop-blur-xs">
          <span>{isTwoHanded ? '👐 Two-Handed' : '✋ One-Handed'}</span>
        </div>

        {/* Small subtle concept badge (Demoted from primary visual) */}
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-warm-sand/80 text-deep-brown text-[11px] font-semibold border border-warm-sand flex items-center gap-1 shadow-xs">
          <span className="opacity-75">{signData.emoji}</span>
          <span className="text-[10px] text-deep-brown/70">{signData.label}</span>
        </div>

      </div>

      {/* Kinematic Anatomy Breakdown Strip */}
      <div className="w-full max-w-[340px] sm:max-w-[380px] mt-3.5 grid grid-cols-2 gap-2 text-left">
        <div className="p-2.5 rounded-xl bg-warm-ivory border border-warm-sand shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-peacock-teal block">Active Hand</span>
          <p className="text-[11px] font-medium text-deep-brown leading-tight mt-0.5">{specs.activeHand}</p>
        </div>
        <div className="p-2.5 rounded-xl bg-warm-ivory border border-warm-sand shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta block">Base Hand</span>
          <p className="text-[11px] font-medium text-deep-brown leading-tight mt-0.5">{specs.baseHand}</p>
        </div>
        <div className="p-2.5 rounded-xl bg-warm-ivory border border-warm-sand shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-deep-brown/70 block">Movement Vector</span>
          <p className="text-[11px] font-medium text-deep-brown leading-tight mt-0.5">{specs.motion}</p>
        </div>
        <div className="p-2.5 rounded-xl bg-warm-ivory border border-warm-sand shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-turmeric-dark block">Touch Point</span>
          <p className="text-[11px] font-medium text-deep-brown leading-tight mt-0.5">{specs.touchPoint}</p>
        </div>
      </div>
    </div>
  );
};
export default ISLSignVisualizer;
