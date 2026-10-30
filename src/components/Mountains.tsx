"use client";
import { useId } from "react";

export const ridges = [
  "M-50 192C20 184 60 150 100 151S145 132 180 125 211 133 235 115 264 106 290 81 308 91 331 65 350 77 365 49 382 67 408 59 431 85 453 71 480 97 504 90 529 107 558 99 584 124 620 112 647 139 674 126 702 111 730 92 751 106 776 87 802 100 822 75 849 89 874 65 898 79 925 63 948 86 976 77 1000 98 1021 82 1049 111 1072 102 1090 126 1116 114 1140 142 1185 132 1220 156 1260 145 1294 163 1325 157 1360 177 1400 169 1490 194V400H-50Z",
  "M-50 246C10 234 46 207 84 209S143 174 178 181 224 151 262 162 305 135 343 153 391 135 432 166 474 155 512 183 550 174 589 201 620 181 655 187 694 161 725 176 757 148 798 157 833 140 864 157 900 141 938 171 968 161 1001 187 1039 175 1074 201 1101 190 1140 211 1176 201 1217 218 1260 207 1304 231 1360 215 1490 247V400H-50Z",
  "M-50 282C50 270 105 222 173 235S270 199 333 219 424 209 486 245 587 233 648 260 738 226 805 240 894 219 964 250 1050 229 1120 263 1235 244 1306 271 1405 249 1490 286V400H-50Z",
  "M-50 343C82 310 165 302 265 316S427 303 522 323 660 329 753 314 900 300 994 317 1150 294 1253 314 1415 303 1490 329V400H-50Z",
];
export default function Mountains({ className = "" }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const colors = [["#becfd9", "#e4ebeb"], ["#8faeb9", "#bccfce"], ["#6b9295", "#91ae9e"], ["#365e60", "#568074"]];
  return <div className={`mountains ${className}`} aria-hidden="true" onPointerMove={event => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mountain-x", `${(event.clientX - box.left) / box.width - 0.5}`);
    event.currentTarget.style.setProperty("--mountain-y", `${(event.clientY - box.top) / box.height - 0.5}`);
  }} onPointerLeave={event => {
    event.currentTarget.style.setProperty("--mountain-x", "0");
    event.currentTarget.style.setProperty("--mountain-y", "0");
  }}>
    <div className="mountain-atmosphere" />
    {ridges.map((path, i) => <svg key={path} className={`ridge ridge-${i}`} viewBox="0 0 1440 400" preserveAspectRatio="none" style={{ "--depth": i + 1 } as React.CSSProperties}>
      <defs><linearGradient id={`${uid}-ridge-${i}`} x1="0" y1="0" x2="0.3" y2="1"><stop stopColor={colors[i][0]}/><stop offset="1" stopColor={colors[i][1]}/></linearGradient><filter id={`${uid}-grain-${i}`}><feTurbulence type="fractalNoise" baseFrequency="0.035 0.08" numOctaves="3" seed={i + 4}/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.1"/></feComponentTransfer><feComposite in2="SourceAlpha" operator="in"/><feBlend in="SourceGraphic" mode="multiply"/></filter></defs>
      <path d={path} fill={`url(#${uid}-ridge-${i})`} />
      <path d={path} fill={`url(#${uid}-ridge-${i})`} filter={`url(#${uid}-grain-${i})`} opacity="0.38" />
      {i < 3 ? <path d={i === 0 ? "m382 67 60 90 54 20m402-68-30 55-19 59m451-134 37 66 41 28" : "m343 153 50 61 38 7m394-64-41 65-44 17m116 2 50-51"} fill="none" stroke="#f2f6ed" strokeWidth="1" opacity="0.16"/> : null}
    </svg>)}
  </div>;
}
