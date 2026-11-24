export function Sleigh({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 260" className={className} fill="none">
      <g transform="translate(420 0) scale(-1 1)">
        <circle cx="400" cy="120" r="5" fill="#ffe500" opacity="0.9" />
        <circle cx="412" cy="150" r="3" fill="#ffe500" opacity="0.6" />
        <circle cx="404" cy="95" r="3" fill="#fdf9f0" opacity="0.7" />

        <circle cx="118" cy="78" r="46" fill="#fdf9f0" />
        <circle cx="96" cy="66" r="18" fill="#ffffff" />
        <path d="M90 40 Q118 24 146 40" stroke="#c9a36b" strokeWidth="6" strokeLinecap="round" />

        <rect x="160" y="70" width="78" height="62" rx="30" fill="#c62a22" />
        <rect x="160" y="104" width="78" height="12" fill="#1a1a1a" />
        <rect x="190" y="104" width="16" height="12" fill="#ffe500" />
        <path d="M236 92 Q 272 70 286 44" stroke="#c62a22" strokeWidth="20" strokeLinecap="round" />
        <circle cx="288" cy="40" r="13" fill="#fdf9f0" />
        <circle cx="199" cy="42" r="24" fill="#f2c9a5" />
        <path d="M175 46 Q199 96 223 46 Q199 58 175 46 Z" fill="#ffffff" />
        <circle cx="191" cy="38" r="3" fill="#1a1a1a" />
        <circle cx="207" cy="38" r="3" fill="#1a1a1a" />
        <path d="M172 26 Q196 -8 236 4 L 222 28 Z" fill="#c62a22" />
        <rect x="170" y="20" width="58" height="12" rx="6" fill="#fdf9f0" />
        <circle cx="238" cy="6" r="9" fill="#fdf9f0" />

        <path
          d="M40 150 Q30 106 72 102 L300 102 Q338 100 348 66 L372 66 Q366 152 300 172 L80 172 Q46 172 40 150 Z"
          fill="#c62a22"
        />
        <path d="M58 122 L330 122" stroke="#ffe500" strokeWidth="5" />
        <path d="M110 172 L104 204 M270 172 L276 204" stroke="#c9a36b" strokeWidth="8" />
        <path
          d="M24 206 L330 206 Q382 206 392 170"
          stroke="#c9a36b"
          strokeWidth="9"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
