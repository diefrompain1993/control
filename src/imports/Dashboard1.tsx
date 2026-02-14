import svgPaths from "./svg-008pl2q4qh";
import imgBitmap1 from "figma:asset/b09a67c7b12c248bcdf97b21ac58d52a4d76a275.png";
import imgALLEFVINICIUS343875Unsplash1 from "figma:asset/95bca3ecaf6d28d115834f85b6163b6e58e91c7c.png";
import imgUkFlag1 from "figma:asset/7260fbd7cccd7993400c3b1165f33370bf034acd.png";
import { imgBitmap, imgALLEFVINICIUS343875Unsplash, imgUkFlag, imgHideBg } from "./svg-cb01i";

function MainBgColor() {
  return (
    <div className="absolute inset-[0_-0.07%_0_16.6%]" data-name="Main Bg Color">
      <div className="absolute bg-[#f5f6fa] inset-0" data-name="Main Bg" />
    </div>
  );
}

function Separator() {
  return (
    <div className="absolute inset-[0_-0.03%_0_16.67%]" data-name="Separator">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1200.75 1070.9">
        <g id="Separator">
          <path d="M0.5 70.45L1200.5 70.45" id="Separator_2" stroke="var(--stroke-0, #E0E0E0)" strokeLinecap="square" strokeWidth="0.5" />
          <path d="M0.5 0.45V1070.45" id="Separator_3" stroke="var(--stroke-0, #E0E0E0)" strokeLinecap="square" strokeWidth="0.9" />
        </g>
      </svg>
    </div>
  );
}

function Image() {
  return (
    <div className="absolute contents inset-[93.27%_74.86%_3.36%_22.64%]" data-name="Image">
      <div className="absolute bg-[#d8d8d8] inset-[93.27%_74.86%_3.36%_22.64%] rounded-[18px]" data-name="Rectangle" />
      <div className="absolute inset-[93.27%_74.86%_3.36%_22.64%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[36px_36px]" data-name="Bitmap" style={{ maskImage: `url('${imgBitmap}')` }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgBitmap1} />
        </div>
      </div>
    </div>
  );
}

function Delivered() {
  return (
    <div className="absolute contents inset-[93.74%_7.01%_3.74%_86.53%]" data-name="Delivered">
      <div className="absolute bg-[#00b69b] inset-[93.74%_7.01%_3.74%_86.53%] rounded-[13.5px]" data-name="Rectangle" />
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[87.64%] right-[8.13%] text-[14px] text-white top-[calc(50%+472px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Delivered
      </p>
    </div>
  );
}

function Component() {
  return (
    <div className="absolute contents inset-[93.27%_4.44%_1.4%_20.97%]" data-name="1">
      <Image />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[26.25%] opacity-80 right-[67.92%] text-[#202224] text-[14px] top-[calc(50%+472px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Apple Watch
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[37.36%] opacity-80 right-[51.67%] text-[#202224] text-[14px] top-[calc(50%+472px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        6096 Marjolaine Landing
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[52.5%] opacity-80 right-[37.15%] text-[#202224] text-[14px] top-[calc(50%+472px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        12.09.2026 - 12.53 PM
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[68.33%] opacity-80 right-[29.86%] text-[#202224] text-[14px] top-[calc(50%+472px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        423
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[75.83%] opacity-80 right-[20.42%] text-[#202224] text-[14px] top-[calc(50%+472px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        $34,295
      </p>
      <Delivered />
      <div className="absolute inset-[98.5%_4.44%_1.4%_20.97%]">
        <div className="absolute inset-[30%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1074.4 0.4">
            <path d="M0.2 0.2H1074.2" id="Line 2" opacity="0.4" stroke="var(--stroke-0, #979797)" strokeLinecap="square" strokeWidth="0.4" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Image1() {
  return (
    <div className="absolute contents inset-[100.84%_74.86%_-4.21%_22.64%]" data-name="Image">
      <div className="absolute bg-[#d8d8d8] inset-[100.84%_74.86%_-4.21%_22.64%] rounded-[18px]" data-name="Rectangle" />
      <div className="absolute inset-[100.84%_74.86%_-4.21%_22.64%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[36px_36px]" data-name="Bitmap" style={{ maskImage: `url('${imgBitmap}')` }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgBitmap1} />
        </div>
      </div>
    </div>
  );
}

function Delivered1() {
  return (
    <div className="absolute contents inset-[101.31%_7.01%_-3.83%_86.53%]" data-name="Delivered">
      <div className="absolute bg-[#fcbe2d] inset-[101.31%_7.01%_-3.83%_86.53%] rounded-[13.5px]" data-name="Rectangle" />
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[87.92%] right-[8.33%] text-[14px] text-center text-white top-[calc(50%+553px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Pending
      </p>
    </div>
  );
}

function Component1() {
  return (
    <div className="absolute contents inset-[100.84%_4.44%_-6.17%_20.97%]" data-name="1">
      <Image1 />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[26.25%] opacity-80 right-[67.92%] text-[#202224] text-[14px] top-[calc(50%+553px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Apple Watch
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[37.36%] opacity-80 right-[51.67%] text-[#202224] text-[14px] top-[calc(50%+553px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        6096 Marjolaine Landing
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[52.5%] opacity-80 right-[37.15%] text-[#202224] text-[14px] top-[calc(50%+553px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        12.09.2026 - 12.53 PM
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[68.33%] opacity-80 right-[29.86%] text-[#202224] text-[14px] top-[calc(50%+553px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        423
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[75.83%] opacity-80 right-[20.42%] text-[#202224] text-[14px] top-[calc(50%+553px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        $34,295
      </p>
      <Delivered1 />
      <div className="absolute inset-[106.07%_4.44%_-6.17%_20.97%]">
        <div className="absolute inset-[30%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1074.4 0.4">
            <path d="M0.2 0.2H1074.2" id="Line 2" opacity="0.4" stroke="var(--stroke-0, #979797)" strokeLinecap="square" strokeWidth="0.4" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Image2() {
  return (
    <div className="absolute contents inset-[108.41%_74.86%_-11.78%_22.64%]" data-name="Image">
      <div className="absolute bg-[#d8d8d8] inset-[108.41%_74.86%_-11.78%_22.64%] rounded-[18px]" data-name="Rectangle" />
      <div className="absolute inset-[108.41%_74.86%_-11.78%_22.64%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[36px_36px]" data-name="Bitmap" style={{ maskImage: `url('${imgBitmap}')` }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgBitmap1} />
        </div>
      </div>
    </div>
  );
}

function Delivered2() {
  return (
    <div className="absolute contents inset-[108.88%_7.01%_-11.4%_86.53%]" data-name="Delivered">
      <div className="absolute bg-[#fd5454] inset-[108.88%_7.01%_-11.4%_86.53%] rounded-[13.5px]" data-name="Rectangle" />
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[87.85%] right-[8.19%] text-[14px] text-white top-[calc(50%+634px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Rejected
      </p>
    </div>
  );
}

function Component2() {
  return (
    <div className="absolute contents inset-[108.41%_4.44%_-13.74%_20.97%]" data-name="1">
      <Image2 />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[26.25%] opacity-80 right-[67.92%] text-[#202224] text-[14px] top-[calc(50%+634px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Apple Watch
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[37.36%] opacity-80 right-[51.67%] text-[#202224] text-[14px] top-[calc(50%+634px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        6096 Marjolaine Landing
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[52.5%] opacity-80 right-[37.15%] text-[#202224] text-[14px] top-[calc(50%+634px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        12.09.2026 - 12.53 PM
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[68.33%] opacity-80 right-[29.86%] text-[#202224] text-[14px] top-[calc(50%+634px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        423
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[75.83%] opacity-80 right-[20.42%] text-[#202224] text-[14px] top-[calc(50%+634px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        $34,295
      </p>
      <Delivered2 />
      <div className="absolute inset-[113.64%_4.44%_-13.74%_20.97%]">
        <div className="absolute inset-[30%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1074.4 0.4">
            <path d="M0.2 0.2H1074.2" id="Line 2" opacity="0.4" stroke="var(--stroke-0, #979797)" strokeLinecap="square" strokeWidth="0.4" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Bar() {
  return (
    <div className="absolute contents inset-[86.54%_4.44%_8.97%_20.97%]" data-name="Bar">
      <div className="absolute bg-[#f1f4f9] inset-[86.54%_4.44%_8.97%_20.97%] rounded-[12px]" data-name="Rectangle" />
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[22.64%] right-[70.9%] text-[#202224] text-[14px] top-[calc(50%+407px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Product Name
      </p>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[37.36%] right-[58.75%] text-[#202224] text-[14px] top-[calc(50%+407px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Location
      </p>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[52.64%] right-[42.01%] text-[#202224] text-[14px] top-[calc(50%+407px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Date - Time
      </p>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[68.33%] right-[29.24%] text-[#202224] text-[14px] top-[calc(50%+407px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Piece
      </p>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[75.9%] right-[20.42%] text-[#202224] text-[14px] top-[calc(50%+407px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Amount
      </p>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[88.33%] right-[8.75%] text-[#202224] text-[14px] top-[calc(50%+407px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Status
      </p>
    </div>
  );
}

function IconChevronDown() {
  return (
    <div className="absolute inset-[81.78%_5.56%_17.29%_93.75%]" data-name="icon_chevron-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
        <g id="icon_chevron-down">
          <g id="frame" />
          <path d={svgPaths.p2dc75300} fill="var(--fill-0, #2B3034)" fillOpacity="0.4" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Month() {
  return (
    <div className="absolute contents inset-[81.78%_5.56%_17.29%_89.51%]" data-name="Month">
      <IconChevronDown />
      <p className="absolute font-['Circular_Std:Medium',sans-serif] leading-[10px] left-[89.51%] not-italic right-[7.29%] text-[12px] text-[rgba(43,48,52,0.4)] text-right top-[calc(50%+340px)]">October</p>
    </div>
  );
}

function MonthSelector() {
  return (
    <div className="absolute contents inset-[80.93%_4.44%_16.45%_88.33%]" data-name="Month selector">
      <div className="absolute bg-[#fcfdfd] border-[#d5d5d5] border-[0.6px] border-solid inset-[80.93%_4.44%_16.45%_88.33%] rounded-[4px]" data-name="Rectangle" />
      <Month />
    </div>
  );
}

function DealsDetails() {
  return (
    <div className="absolute contents inset-[77.94%_2.22%_-17.2%_18.75%]" data-name="Deals Details">
      <div className="absolute inset-[77.94%_2.22%_-17.2%_18.75%]" data-name="card">
        <div className="absolute inset-[-11.43%_-5.27%_-14.29%_-4.22%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1246 528">
            <g filter="url(#filter0_d_71_1488)" id="card">
              <path clipRule="evenodd" d={svgPaths.p2b101e00} fill="var(--fill-0, white)" fillRule="evenodd" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="528" id="filter0_d_71_1488" width="1246" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="6" dy="6" />
                <feGaussianBlur stdDeviation="27" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_71_1488" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_71_1488" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <Component />
      <Component1 />
      <Component2 />
      <Bar />
      <MonthSelector />
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[20px] left-[20.97%] right-[68.96%] text-[#202224] text-[24px] top-[calc(50%+336px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Deals Details
      </p>
    </div>
  );
}

function Line() {
  return (
    <div className="absolute inset-[44.3%_4.44%_33.55%_26.25%]" data-name="Line">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 998.5 237">
        <g id="Line" opacity="0.7">
          <g id="Line_2">
            <path clipRule="evenodd" d="M0.5 236.5H997.659Z" fill="var(--fill-0, white)" fillRule="evenodd" />
            <path d="M0.5 236.5H997.659" stroke="var(--stroke-0, #EAEAEA)" strokeLinecap="square" />
          </g>
          <g id="Line_3">
            <path clipRule="evenodd" d="M0.5 177.5H997.659Z" fill="var(--fill-0, white)" fillRule="evenodd" />
            <path d="M0.5 177.5H997.659" stroke="var(--stroke-0, #EAEAEA)" strokeLinecap="square" />
          </g>
          <g id="Line_4">
            <path clipRule="evenodd" d="M0.5 118.5H997.659Z" fill="var(--fill-0, white)" fillRule="evenodd" />
            <path d="M0.5 118.5H997.659" stroke="var(--stroke-0, #EAEAEA)" strokeLinecap="square" />
          </g>
          <g id="Line_5">
            <path clipRule="evenodd" d="M0.5 59.5H997.659Z" fill="var(--fill-0, white)" fillRule="evenodd" />
            <path d="M0.5 59.5H997.659" stroke="var(--stroke-0, #EAEAEA)" strokeLinecap="square" />
          </g>
          <g id="Line_6">
            <path clipRule="evenodd" d="M0.5 0.5H997.659Z" fill="var(--fill-0, white)" fillRule="evenodd" />
            <path d="M0.5 0.5H997.659" stroke="var(--stroke-0, #EAEAEA)" strokeLinecap="square" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Units() {
  return (
    <div className="absolute contents inset-[43.93%_4.44%_30.09%_20.97%]" data-name="units">
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[9px] left-[67.64%] right-[30.9%] text-[12px] text-[rgba(43,48,52,0.4)] text-center top-[calc(50%+204px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        40k
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[9px] left-[73.61%] right-[24.93%] text-[12px] text-[rgba(43,48,52,0.4)] text-center top-[calc(50%+204px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        45k
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[9px] left-[79.58%] right-[18.96%] text-[12px] text-[rgba(43,48,52,0.4)] text-center top-[calc(50%+204px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        50k
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[9px] left-[85.56%] right-[12.99%] text-[12px] text-[rgba(43,48,52,0.4)] text-center top-[calc(50%+204px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        55k
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[9px] left-[91.53%] right-[7.01%] text-[12px] text-[rgba(43,48,52,0.4)] text-center top-[calc(50%+204px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        60k
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[9px] left-[26.25%] right-[72.78%] text-[12px] text-[rgba(43,48,52,0.4)] text-center top-[calc(50%+204px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        5k
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[9px] left-[31.77%] right-[66.77%] text-[12px] text-[rgba(43,48,52,0.4)] text-center top-[calc(50%+204px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        10k
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[9px] left-[37.74%] right-[60.8%] text-[12px] text-[rgba(43,48,52,0.4)] text-center top-[calc(50%+204px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        15k
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[9px] left-[43.72%] right-[54.83%] text-[12px] text-[rgba(43,48,52,0.4)] text-center top-[calc(50%+204px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        20k
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[9px] left-[49.69%] right-[48.85%] text-[12px] text-[rgba(43,48,52,0.4)] text-center top-[calc(50%+204px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        25k
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[9px] left-[61.67%] right-[36.88%] text-[12px] text-[rgba(43,48,52,0.4)] text-center top-[calc(50%+204px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        35k
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[9px] left-[55.66%] right-[42.88%] text-[12px] text-[rgba(43,48,52,0.4)] text-center top-[calc(50%+204px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        30k
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[9px] left-[20.97%] right-[77.22%] text-[12px] text-[rgba(43,48,52,0.4)] top-[calc(50%+171px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        20%
      </p>
      <Line />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[9px] left-[20.97%] right-[77.22%] text-[12px] text-[rgba(43,48,52,0.4)] top-[calc(50%+112px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        40%
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[9px] left-[20.97%] right-[77.22%] text-[12px] text-[rgba(43,48,52,0.4)] top-[calc(50%+53px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        60%
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[9px] left-[20.97%] right-[77.22%] text-[12px] text-[rgba(43,48,52,0.4)] top-[calc(50%-6px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        80%
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[9px] left-[20.97%] right-[76.74%] text-[12px] text-[rgba(43,48,52,0.4)] top-[calc(50%-65px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        100%
      </p>
    </div>
  );
}

function Graph() {
  return (
    <div className="absolute inset-[48.56%_4.44%_33.18%_26.25%]" data-name="Graph">
      <div className="absolute inset-[0_0_-0.11%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 998.721 195.653">
          <g id="Graph">
            <path clipRule="evenodd" d={svgPaths.p1cc88580} fill="url(#paint0_linear_71_1473)" fillRule="evenodd" id="Gradient" />
            <path d={svgPaths.p35351200} id="Ouline Graph" stroke="var(--stroke-0, #4379EE)" strokeWidth="1.5" />
          </g>
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_71_1473" x1="250.221" x2="250.221" y1="97.2696" y2="194.448">
              <stop stopColor="#4379EE" stopOpacity="0.16" />
              <stop offset="1" stopColor="white" stopOpacity="0.176942" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function TopSale() {
  return (
    <div className="absolute contents inset-[44.95%_51.53%_52.43%_42.92%]" data-name="Top Sale">
      <div className="absolute inset-[44.95%_51.53%_52.43%_42.92%]" data-name="Combined Shape">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 80 27.9775">
          <path d={svgPaths.p205ad400} fill="var(--fill-0, #4880FF)" id="Combined Shape" />
        </svg>
      </div>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[43.61%] right-[51.94%] text-[12px] text-white top-[calc(50%-52px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        64,3664.77
      </p>
    </div>
  );
}

function Point() {
  return (
    <div className="absolute inset-[47.76%_8.82%_33.08%_26.04%]" data-name="Point">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 938 205">
        <g id="Point">
          <path clipRule="evenodd" d={svgPaths.p25e20300} fill="var(--fill-0, #4880FF)" fillRule="evenodd" id="Oval" />
          <path clipRule="evenodd" d={svgPaths.p20303100} fill="var(--fill-0, #4379EE)" fillRule="evenodd" id="Oval_2" />
          <path clipRule="evenodd" d={svgPaths.p199e5f00} fill="var(--fill-0, #4379EE)" fillRule="evenodd" id="Oval_3" />
          <path clipRule="evenodd" d={svgPaths.p2366bf00} fill="var(--fill-0, #4379EE)" fillRule="evenodd" id="Oval_4" />
          <path clipRule="evenodd" d={svgPaths.p60a6500} fill="var(--fill-0, #4379EE)" fillRule="evenodd" id="Oval_5" />
          <path clipRule="evenodd" d={svgPaths.p2f89ae70} fill="var(--fill-0, #4379EE)" fillRule="evenodd" id="Oval_6" />
          <path clipRule="evenodd" d={svgPaths.p675ea00} fill="var(--fill-0, #4379EE)" fillRule="evenodd" id="Oval_7" />
          <path clipRule="evenodd" d={svgPaths.p3925b500} fill="var(--fill-0, #4379EE)" fillRule="evenodd" id="Oval_8" />
          <path clipRule="evenodd" d={svgPaths.p2a7f1a00} fill="var(--fill-0, #4379EE)" fillRule="evenodd" id="Oval_9" />
          <path clipRule="evenodd" d={svgPaths.p5e5200} fill="var(--fill-0, #4379EE)" fillRule="evenodd" id="Oval_10" />
          <path clipRule="evenodd" d={svgPaths.p1c0b8e00} fill="var(--fill-0, #4379EE)" fillRule="evenodd" id="Oval_11" />
          <path clipRule="evenodd" d={svgPaths.p1156a400} fill="var(--fill-0, #4379EE)" fillRule="evenodd" id="Oval_12" />
          <path clipRule="evenodd" d={svgPaths.p3cb97700} fill="var(--fill-0, #4379EE)" fillRule="evenodd" id="Oval_13" />
          <path clipRule="evenodd" d={svgPaths.p32926a00} fill="var(--fill-0, #4379EE)" fillRule="evenodd" id="Oval_14" />
          <path clipRule="evenodd" d={svgPaths.p222cec80} fill="var(--fill-0, #4379EE)" fillRule="evenodd" id="Oval_15" />
          <path clipRule="evenodd" d={svgPaths.p397756f0} fill="var(--fill-0, #4379EE)" fillRule="evenodd" id="Oval_16" />
          <path clipRule="evenodd" d={svgPaths.p1f4d5900} fill="var(--fill-0, #4379EE)" fillRule="evenodd" id="Oval_17" />
          <path clipRule="evenodd" d={svgPaths.p5f65880} fill="var(--fill-0, #4379EE)" fillRule="evenodd" id="Oval_18" />
          <path clipRule="evenodd" d={svgPaths.p2546f300} fill="var(--fill-0, #4379EE)" fillRule="evenodd" id="Oval_19" />
          <path clipRule="evenodd" d={svgPaths.p3847a200} fill="var(--fill-0, #4379EE)" fillRule="evenodd" id="Oval_20" />
        </g>
      </svg>
    </div>
  );
}

function IconChevronDown1() {
  return (
    <div className="absolute inset-[37.66%_5.56%_61.4%_93.75%]" data-name="icon_chevron-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
        <g id="icon_chevron-down">
          <g id="frame" />
          <path d={svgPaths.p2dc75300} fill="var(--fill-0, #2B3034)" fillOpacity="0.4" id="Shape" />
        </g>
      </svg>
    </div>
  );
}

function Month1() {
  return (
    <div className="absolute contents inset-[37.66%_5.56%_61.4%_89.65%]" data-name="Month">
      <IconChevronDown1 />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[10px] left-[89.65%] right-[7.29%] text-[12px] text-[rgba(43,48,52,0.4)] text-right top-[calc(50%-132px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        October
      </p>
    </div>
  );
}

function MonthSelector1() {
  return (
    <div className="absolute contents inset-[36.82%_4.44%_60.56%_88.33%]" data-name="Month selector">
      <div className="absolute bg-[#fcfdfd] border-[#d5d5d5] border-[0.6px] border-solid inset-[36.82%_4.44%_60.56%_88.33%] rounded-[4px]" data-name="Rectangle" />
      <Month1 />
    </div>
  );
}

function SalesDetails() {
  return (
    <div className="absolute contents inset-[33.83%_2.22%_24.67%_18.75%]" data-name="Sales Details">
      <div className="absolute inset-[33.83%_2.22%_24.67%_18.75%]" data-name="card">
        <div className="absolute inset-[-10.81%_-5.27%_-13.51%_-4.22%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1246 552">
            <g filter="url(#filter0_d_71_1434)" id="card">
              <path clipRule="evenodd" d={svgPaths.p3c3afb40} fill="var(--fill-0, white)" fillRule="evenodd" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="552" id="filter0_d_71_1434" width="1246" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="6" dy="6" />
                <feGaussianBlur stdDeviation="27" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_71_1434" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_71_1434" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <Units />
      <Graph />
      <TopSale />
      <Point />
      <MonthSelector1 />
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[20px] left-[20.97%] right-[69.17%] text-[#202224] text-[24px] top-[calc(50%-136px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Sales Details
      </p>
    </div>
  );
}

function IcTrendingUp24Px() {
  return (
    <div className="absolute inset-[27.29%_17.64%_70.47%_80.69%]" data-name="ic-trending-up-24px">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="ic-trending-up-24px">
          <g id="Path" />
          <path d={svgPaths.p8cd0a80} fill="var(--fill-0, #00B69B)" id="Path_2" />
        </g>
      </svg>
    </div>
  );
}

function Component85UpFromYesterday() {
  return (
    <div className="absolute contents inset-[27.29%_4.79%_70.47%_80.69%]" data-name="8.5% Up from yesterday">
      <IcTrendingUp24Px />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[0] left-[82.92%] right-[4.79%] text-[#00b69b] text-[16px] top-[calc(50%-242px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        <span className="leading-[normal]">1.8%</span>
        <span className="leading-[normal] text-[#12163c]">{` `}</span>
        <span className="leading-[normal] text-[#606060]">Up from yesterday</span>
      </p>
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute inset-[17.48%_3.33%_76.92%_92.5%]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 60 60">
        <g id="Icon">
          <path d={svgPaths.p3095c00} fill="var(--fill-0, #FF9066)" id="Circle 2" opacity="0.3" />
          <g id="icon">
            <path clipRule="evenodd" d={svgPaths.p232ccc80} fill="var(--fill-0, #FF9066)" fillRule="evenodd" id="Path 107" opacity="0.78" />
            <path d={svgPaths.p984f980} fill="var(--fill-0, #FF9066)" id="Combined Shape" opacity="0.901274" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function OrderPending() {
  return (
    <div className="absolute contents inset-[15.98%_2.22%_68.97%_79.58%]" data-name="Order Pending">
      <div className="absolute bg-white inset-[15.98%_2.22%_68.97%_79.58%] rounded-[14px] shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]" data-name="Bg" />
      <Component85UpFromYesterday />
      <Icon />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[80.69%] opacity-70 right-[12.36%] text-[#202224] text-[16px] top-[calc(50%-348px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Total Pending
      </p>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[80.69%] right-[14.38%] text-[#202224] text-[28px] top-[calc(50%-310px)] tracking-[1px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        2040
      </p>
    </div>
  );
}

function IcTrendingDown24Px() {
  return (
    <div className="absolute inset-[27.29%_37.92%_70.47%_60.42%]" data-name="ic-trending-down-24px">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="ic-trending-down-24px">
          <g id="Path" />
          <path d={svgPaths.p13cb6880} fill="var(--fill-0, #F93C65)" id="Path_2" />
        </g>
      </svg>
    </div>
  );
}

function Component85UpFromYesterday1() {
  return (
    <div className="absolute contents inset-[27.29%_23.54%_70.47%_60.42%]" data-name="8.5% Up from yesterday">
      <IcTrendingDown24Px />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[0] left-[62.64%] right-[23.54%] text-[#f93c65] text-[16px] top-[calc(50%-242px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        <span className="leading-[normal]">4.3%</span>
        <span className="leading-[normal] text-[#12163c]">{` `}</span>
        <span className="leading-[normal] text-[#606060]">Down from yesterday</span>
      </p>
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute inset-[17.48%_23.61%_76.92%_72.22%]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 60 60">
        <g id="Icon">
          <path d={svgPaths.p3095c00} fill="var(--fill-0, #4AD991)" id="Circle 2" opacity="0.21" />
          <g id="icon">
            <path d={svgPaths.p257dc680} fill="var(--fill-0, #4AD991)" id="Path 95" />
            <path d={svgPaths.p1041400} fill="var(--fill-0, #4AD991)" id="Path 97" opacity="0.5" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function TotalSales() {
  return (
    <div className="absolute contents inset-[15.98%_22.5%_68.97%_59.31%]" data-name="Total Sales">
      <div className="absolute bg-white inset-[15.98%_22.5%_68.97%_59.31%] rounded-[14px] shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]" data-name="Bg" />
      <Component85UpFromYesterday1 />
      <Icon1 />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[60.42%] opacity-70 right-[34.1%] text-[#202224] text-[16px] top-[calc(50%-348px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Total Sales
      </p>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[60.42%] right-[31.67%] text-[#202224] text-[28px] top-[calc(50%-310px)] tracking-[1px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        $89,000
      </p>
    </div>
  );
}

function IcTrendingUp24Px1() {
  return (
    <div className="absolute inset-[27.29%_58.19%_70.47%_40.14%]" data-name="ic-trending-up-24px">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="ic-trending-up-24px">
          <g id="Path" />
          <path d={svgPaths.p8cd0a80} fill="var(--fill-0, #00B69B)" id="Path_2" />
        </g>
      </svg>
    </div>
  );
}

function Component85UpFromYesterday2() {
  return (
    <div className="absolute contents inset-[27.29%_45.14%_70.47%_40.14%]" data-name="8.5% Up from yesterday">
      <IcTrendingUp24Px1 />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[0] left-[42.36%] right-[45.14%] text-[#00b69b] text-[16px] top-[calc(50%-242px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        <span className="leading-[normal]">1.3%</span>
        <span className="leading-[normal] text-[#12163c]">{` `}</span>
        <span className="leading-[normal] text-[#606060]">Up from past week</span>
      </p>
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute inset-[17.48%_43.89%_76.92%_51.94%]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 60 60">
        <g id="Icon">
          <path d={svgPaths.p3095c00} fill="var(--fill-0, #FEC53D)" id="Circle 2" opacity="0.21" />
          <g id="icon">
            <path clipRule="evenodd" d={svgPaths.p30549d80} fill="var(--fill-0, #FEC53D)" fillRule="evenodd" id="Combined Shape" />
            <path clipRule="evenodd" d={svgPaths.pb436a00} fill="var(--fill-0, #FEC53D)" fillRule="evenodd" id="Path" opacity="0.499209" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function TotalOrder() {
  return (
    <div className="absolute contents inset-[15.98%_42.78%_68.97%_39.03%]" data-name="Total Order">
      <div className="absolute bg-white inset-[15.98%_42.78%_68.97%_39.03%] rounded-[14px] shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]" data-name="Bg" />
      <Component85UpFromYesterday2 />
      <Icon2 />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[40.14%] opacity-70 right-[54.17%] text-[#202224] text-[16px] top-[calc(50%-348px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Total Order
      </p>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[40.14%] right-[53.75%] text-[#202224] text-[28px] top-[calc(50%-310px)] tracking-[1px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        10293
      </p>
    </div>
  );
}

function IcTrendingUp24Px2() {
  return (
    <div className="absolute inset-[27.29%_78.47%_70.47%_19.86%]" data-name="ic-trending-up-24px">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="ic-trending-up-24px">
          <g id="Path" />
          <path d={svgPaths.p8cd0a80} fill="var(--fill-0, #00B69B)" id="Path_2" />
        </g>
      </svg>
    </div>
  );
}

function Component85UpFromYesterday3() {
  return (
    <div className="absolute contents inset-[27.29%_65.63%_70.47%_19.86%]" data-name="8.5% Up from yesterday">
      <IcTrendingUp24Px2 />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[0] left-[22.08%] right-[65.63%] text-[#00b69b] text-[16px] top-[calc(50%-242px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        <span className="leading-[normal]">8.5%</span>
        <span className="leading-[normal] text-[#12163c]">{` `}</span>
        <span className="leading-[normal] text-[#606060]">Up from yesterday</span>
      </p>
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute inset-[17.48%_64.17%_76.92%_31.67%]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 60 60">
        <g id="Icon">
          <path d={svgPaths.p3095c00} fill="var(--fill-0, #8280FF)" id="Circle 2" opacity="0.21" />
          <g id="Group">
            <path d={svgPaths.pac84000} fill="var(--fill-0, #8280FF)" id="Combined Shape" opacity="0.587821" />
            <path d={svgPaths.p59dde70} fill="var(--fill-0, #8280FF)" id="Combined Shape_2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function TotalUsers() {
  return (
    <div className="absolute contents inset-[15.98%_63.06%_68.97%_18.75%]" data-name="Total Users">
      <div className="absolute bg-white inset-[15.98%_63.06%_68.97%_18.75%] rounded-[14px] shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]" data-name="Bg" />
      <Component85UpFromYesterday3 />
      <Icon3 />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[19.86%] opacity-70 right-3/4 text-[#202224] text-[16px] top-[calc(50%-348px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Total User
      </p>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[19.86%] right-[73.47%] text-[#202224] text-[28px] top-[calc(50%-310px)] tracking-[1px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        40,689
      </p>
    </div>
  );
}

function More() {
  return (
    <div className="absolute inset-[37.14%_2.58%_37.14%_95.92%]" data-name="More">
      <div className="absolute inset-[-1.11%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.4 18.4">
          <g id="More">
            <path d={svgPaths.p14c1f580} id="Border" stroke="var(--stroke-0, #5C5C5C)" strokeWidth="0.2" />
            <g id="chevron-down">
              <path d={svgPaths.p35078000} fill="var(--fill-0, #565656)" id="Shape" />
              <mask height="5" id="mask0_66_690" maskUnits="userSpaceOnUse" style={{ maskType: "luminance" }} width="7" x="6" y="7">
                <path d={svgPaths.p35078000} fill="var(--fill-0, white)" id="Shape_2" />
              </mask>
              <g mask="url(#mask0_66_690)" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

function Man() {
  return (
    <div className="absolute contents inset-[18.57%_12.99%_18.57%_83.35%]" data-name="man-438081_960_720">
      <div className="absolute inset-[18.57%_12.99%_18.57%_83.35%]" data-name="Mask">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 44">
          <path clipRule="evenodd" d={svgPaths.p28ed6f70} fill="var(--fill-0, #D8D8D8)" fillRule="evenodd" id="Mask" />
        </svg>
      </div>
      <div className="absolute inset-[11.43%_12.66%_14.29%_83.18%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[2px_5px] mask-size-[44px_44px]" data-name="a-l-l-e-f-v-i-n-i-c-i-u-s-343875-unsplash" style={{ maskImage: `url('${imgALLEFVINICIUS343875Unsplash}')` }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgALLEFVINICIUS343875Unsplash1} />
        </div>
      </div>
    </div>
  );
}

function Profile() {
  return (
    <div className="absolute contents inset-[18.57%_2.58%_18.57%_83.35%]" data-name="Profile">
      <More />
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[88.68%] right-[6.24%] text-[#404040] text-[14px] top-[calc(50%-19px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Moni Roy
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[88.68%] right-[8.24%] text-[#565656] text-[12px] top-[calc(50%+3px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Admin
      </p>
      <Man />
    </div>
  );
}

function DropDown() {
  return (
    <div className="absolute inset-[45.24%_18.89%_48.1%_80.43%]" data-name="Drop Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.16675 4.66667">
        <g id="Drop Down">
          <path d={svgPaths.p1a6a6880} fill="var(--fill-0, #646464)" id="Shape" />
          <mask height="5" id="mask0_66_664" maskUnits="userSpaceOnUse" style={{ maskType: "luminance" }} width="9" x="0" y="0">
            <path d={svgPaths.p1a6a6880} fill="var(--fill-0, white)" id="Shape_2" />
          </mask>
          <g mask="url(#mask0_66_664)" />
        </g>
      </svg>
    </div>
  );
}

function Flag() {
  return (
    <div className="absolute contents inset-[31.43%_25.81%_30%_70.86%]" data-name="Flag">
      <div className="absolute bg-[#d8d8d8] inset-[31.43%_25.81%_30%_70.86%] rounded-[5px]" data-name="Mask" />
      <div className="absolute inset-[31.43%_25.81%_30%_70.86%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[40px_27px]" data-name="UK Flag" style={{ maskImage: `url('${imgUkFlag}')` }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgUkFlag1} />
        </div>
      </div>
    </div>
  );
}

function English() {
  return (
    <div className="absolute contents inset-[31.43%_18.89%_30%_70.86%]" data-name="English">
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[75.52%] right-[20.48%] text-[#646464] text-[14px] top-[calc(50%-8px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        English
      </p>
      <DropDown />
      <Flag />
    </div>
  );
}

function Icon5() {
  return (
    <div className="absolute inset-[34.29%_31.72%_29.29%_66.28%]" data-name="icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 25.5">
        <g id="icon">
          <path d={svgPaths.p38df200} fill="var(--fill-0, #4880FF)" id="Combined Shape" />
          <rect fill="var(--fill-0, #FF0000)" height="6" id="Rectangle 23" opacity="0.3" rx="2.25" width="6" x="9" y="19.5" />
        </g>
      </svg>
    </div>
  );
}

function Icon4() {
  return (
    <div className="absolute contents inset-[27.14%_31.31%_29.29%_66.28%]" data-name="Icon">
      <Icon5 />
      <div className="absolute bottom-1/2 left-[67.36%] right-[31.31%] top-[27.14%]" data-name="Oval">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <path clipRule="evenodd" d={svgPaths.p30769300} fill="var(--fill-0, #F93C65)" fillRule="evenodd" id="Oval" />
        </svg>
      </div>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[67.69%] right-[31.64%] text-[12px] text-white top-[calc(50%-16px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        6
      </p>
    </div>
  );
}

function Icon6() {
  return (
    <div className="absolute contents inset-[32.86%_95.5%_30%_2.5%]" data-name="Icon">
      <div className="absolute inset-[32.86%_95.5%_32.86%_2.5%] opacity-90" data-name="Path">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <g id="Path" />
        </svg>
      </div>
      <p className="absolute font-['Gilroy:Medium',sans-serif] leading-[normal] left-[3.08%] not-italic opacity-90 right-[96%] text-[#202224] text-[22px] text-center top-[calc(50%-12px)]"></p>
    </div>
  );
}

function Search1() {
  return (
    <div className="absolute inset-[37.93%_90.88%_40.63%_7.87%]" data-name="search">
      <div className="absolute inset-[0_-4%_-4%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.6061 15.6066">
          <g id="search" opacity="0.5">
            <path clipRule="evenodd" d={svgPaths.pe55a700} fillRule="evenodd" id="Oval" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d={svgPaths.p186e9d00} id="Path" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Search() {
  return (
    <div className="absolute contents inset-[22.86%_61.2%_22.86%_6.49%]" data-name="Search">
      <div className="absolute bg-[#f5f6fa] border-[#d5d5d5] border-[0.6px] border-solid inset-[22.86%_61.2%_22.86%_6.49%] rounded-[19px]" data-name="Bg" />
      <p className="absolute font-['Nunito_Sans:Regular',sans-serif] font-normal leading-[normal] left-[10.24%] opacity-50 right-[86.18%] text-[#202224] text-[14px] text-center top-[calc(50%-9px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Search
      </p>
      <Search1 />
    </div>
  );
}

function NavigationTopBar1() {
  return (
    <div className="absolute contents inset-0" data-name="Navigation / Top Bar #1">
      <div className="absolute bg-white inset-0" data-name="Top Bar Bg" />
      <Profile />
      <English />
      <Icon4 />
      <div className="absolute inset-[25.71%_31.22%_48.57%_67.28%]" data-name="Oval">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
          <path clipRule="evenodd" d={svgPaths.p3896100} fill="var(--fill-0, #F93C65)" fillOpacity="0.613691" fillRule="evenodd" id="Oval" opacity="0.173224" />
        </svg>
      </div>
      <Icon6 />
      <Search />
    </div>
  );
}

function NavigationTopBar() {
  return (
    <div className="absolute inset-[0_-0.07%_93.46%_16.67%]" data-name="Navigation / Top Bar #1">
      <NavigationTopBar1 />
    </div>
  );
}

function Products() {
  return (
    <div className="absolute contents inset-0" data-name="Products">
      <div className="absolute bg-white inset-0 opacity-0" data-name="Hide Bg" />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[32.5%] right-[47.92%] text-[#202224] text-[14px] top-[calc(50%-9px)] tracking-[0.3px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Logout
      </p>
      <p className="absolute font-['Gilroy:Medium',sans-serif] leading-[normal] left-[19.17%] not-italic right-[76.25%] text-[#202224] text-[22px] text-center top-[calc(50%-12px)]"></p>
    </div>
  );
}

function NavigationSidebarItemLight() {
  return (
    <div className="absolute inset-[86.82%_83.33%_8.5%_0]" data-name="Navigation / Sidebar Item / Light">
      <Products />
    </div>
  );
}

function Products1() {
  return (
    <div className="absolute contents inset-0" data-name="Products">
      <div className="absolute bg-white inset-0 opacity-0" data-name="Hide Bg" />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[32.5%] right-[44.58%] text-[#202224] text-[14px] top-[calc(50%-9px)] tracking-[0.3px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Settings
      </p>
      <p className="absolute font-['Gilroy:Medium',sans-serif] leading-[normal] left-[19.17%] not-italic right-[76.25%] text-[#202224] text-[22px] text-center top-[calc(50%-12px)]"></p>
    </div>
  );
}

function NavigationSidebarItemLight1() {
  return (
    <div className="absolute inset-[82.15%_83.33%_13.18%_0]" data-name="Navigation / Sidebar Item / Light">
      <Products1 />
    </div>
  );
}

function Products2() {
  return (
    <div className="absolute contents inset-0" data-name="Products">
      <div className="absolute bg-white inset-0 opacity-0" data-name="Hide Bg" />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[32.5%] right-[52.08%] text-[#202224] text-[14px] top-[calc(50%-9px)] tracking-[0.3px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Table
      </p>
      <p className="absolute font-['Gilroy:Medium',sans-serif] leading-[normal] left-[19.17%] not-italic right-[76.25%] text-[#202224] text-[22px] text-center top-[calc(50%-12px)]"></p>
    </div>
  );
}

function NavigationSidebarItemLight2() {
  return (
    <div className="absolute inset-[74.39%_83.33%_20.93%_0]" data-name="Navigation / Sidebar Item / Light">
      <Products2 />
    </div>
  );
}

function Products3() {
  return (
    <div className="absolute contents inset-0" data-name="Products">
      <div className="absolute bg-white inset-0 opacity-0" data-name="Hide Bg" />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[32.5%] right-[52.5%] text-[#202224] text-[14px] top-[calc(50%-9px)] tracking-[0.3px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Team
      </p>
      <p className="absolute font-['Gilroy:Medium',sans-serif] leading-[normal] left-[19.17%] not-italic right-[76.25%] text-[#202224] text-[22px] text-center top-[calc(50%-12px)]"></p>
    </div>
  );
}

function NavigationSidebarItemLight3() {
  return (
    <div className="absolute inset-[69.72%_83.33%_25.61%_0]" data-name="Navigation / Sidebar Item / Light">
      <Products3 />
    </div>
  );
}

function Products4() {
  return (
    <div className="absolute contents inset-0" data-name="Products">
      <div className="absolute bg-white inset-0 opacity-0" data-name="Hide Bg" />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[32.5%] right-[33.75%] text-[#202224] text-[14px] top-[calc(50%-9px)] tracking-[0.3px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        UI Elements
      </p>
      <p className="absolute font-['Gilroy:Medium',sans-serif] leading-[normal] left-[19.17%] not-italic right-[76.25%] text-[#202224] text-[22px] text-center top-[calc(50%-12px)]"></p>
    </div>
  );
}

function NavigationSidebarItemLight4() {
  return (
    <div className="absolute inset-[65.05%_83.33%_30.28%_0]" data-name="Navigation / Sidebar Item / Light">
      <Products4 />
    </div>
  );
}

function Products5() {
  return (
    <div className="absolute contents inset-0" data-name="Products">
      <div className="absolute bg-white inset-0 opacity-0" data-name="Hide Bg" />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[32.5%] right-[48.33%] text-[#202224] text-[14px] top-[calc(50%-9px)] tracking-[0.3px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Invoice
      </p>
      <p className="absolute font-['Gilroy:Medium',sans-serif] leading-[normal] left-[19.17%] not-italic right-[76.25%] text-[#202224] text-[22px] text-center top-[calc(50%-12px)]"></p>
    </div>
  );
}

function NavigationSidebarItemLight5() {
  return (
    <div className="absolute inset-[60.37%_83.33%_34.95%_0]" data-name="Navigation / Sidebar Item / Light">
      <Products5 />
    </div>
  );
}

function Products6() {
  return (
    <div className="absolute contents inset-0" data-name="Products">
      <div className="absolute bg-white inset-0 opacity-0" data-name="Hide Bg" />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[32.5%] right-[45.83%] text-[#202224] text-[14px] top-[calc(50%-9px)] tracking-[0.3px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Contact
      </p>
      <p className="absolute font-['Gilroy:Medium',sans-serif] leading-[normal] left-[19.17%] not-italic right-[76.25%] text-[#202224] text-[22px] text-center top-[calc(50%-12px)]"></p>
    </div>
  );
}

function NavigationSidebarItemLight6() {
  return (
    <div className="absolute inset-[55.7%_83.33%_39.63%_0]" data-name="Navigation / Sidebar Item / Light">
      <Products6 />
    </div>
  );
}

function Products7() {
  return (
    <div className="absolute contents inset-0" data-name="Products">
      <div className="absolute bg-white inset-0 opacity-0" data-name="Hide Bg" />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[32.5%] right-1/2 text-[#202224] text-[14px] top-[calc(50%-9px)] tracking-[0.3px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        To-Do
      </p>
      <p className="absolute font-['Gilroy:Medium',sans-serif] leading-[normal] left-[19.17%] not-italic right-[76.25%] text-[#202224] text-[22px] text-center top-[calc(50%-12px)]"></p>
    </div>
  );
}

function NavigationSidebarItemLight7() {
  return (
    <div className="absolute inset-[51.03%_83.33%_44.3%_0]" data-name="Navigation / Sidebar Item / Light">
      <Products7 />
    </div>
  );
}

function Products8() {
  return (
    <div className="absolute contents inset-0" data-name="Products">
      <div className="absolute bg-white inset-0 opacity-0" data-name="Hide Bg" />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[32.5%] right-[42.5%] text-[#202224] text-[14px] top-[calc(50%-9px)] tracking-[0.3px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Calender
      </p>
      <p className="absolute font-['Gilroy:Medium',sans-serif] leading-[normal] left-[19.17%] not-italic right-[76.25%] text-[#202224] text-[22px] text-center top-[calc(50%-12px)]"></p>
    </div>
  );
}

function NavigationSidebarItemLight8() {
  return (
    <div className="absolute inset-[46.36%_83.33%_48.97%_0]" data-name="Navigation / Sidebar Item / Light">
      <Products8 />
    </div>
  );
}

function Products9() {
  return (
    <div className="absolute contents inset-0" data-name="Products">
      <div className="absolute bg-white inset-0 opacity-0" data-name="Hide Bg" />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[32.5%] right-[48.33%] text-[#202224] text-[14px] top-[calc(50%-9px)] tracking-[0.3px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Pricing
      </p>
      <p className="absolute font-['Gilroy:Medium',sans-serif] leading-[normal] left-[19.17%] not-italic right-[76.25%] text-[#202224] text-[22px] text-center top-[calc(50%-12px)]"></p>
    </div>
  );
}

function NavigationSidebarItemLight9() {
  return (
    <div className="absolute inset-[41.68%_83.33%_53.64%_0]" data-name="Navigation / Sidebar Item / Light">
      <Products9 />
    </div>
  );
}

function Products10() {
  return (
    <div className="absolute contents inset-0" data-name="Products">
      <div className="absolute bg-white inset-0 opacity-0" data-name="Hide Bg" />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[32.5%] right-[28.75%] text-[#202224] text-[14px] top-[calc(50%-9px)] tracking-[0.3px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Product Stock
      </p>
      <p className="absolute font-['Gilroy:Medium',sans-serif] leading-[normal] left-[19.17%] not-italic right-[76.25%] text-[#202224] text-[22px] text-center top-[calc(50%-12px)]"></p>
    </div>
  );
}

function NavigationSidebarItemLight10() {
  return (
    <div className="absolute inset-[30.93%_83.33%_64.39%_0]" data-name="Navigation / Sidebar Item / Light">
      <Products10 />
    </div>
  );
}

function Products11() {
  return (
    <div className="absolute contents inset-0" data-name="Products">
      <div className="absolute bg-white inset-0 opacity-0" data-name="Hide Bg" />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[32.5%] right-[36.67%] text-[#202224] text-[14px] top-[calc(50%-9px)] tracking-[0.3px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Order Lists
      </p>
      <p className="absolute font-['Gilroy:Medium',sans-serif] leading-[normal] left-[19.17%] not-italic right-[76.25%] text-[#202224] text-[22px] text-center top-[calc(50%-12px)]"></p>
    </div>
  );
}

function NavigationSidebarItemLight11() {
  return (
    <div className="absolute inset-[26.26%_83.33%_69.07%_0]" data-name="Navigation / Sidebar Item / Light">
      <Products11 />
    </div>
  );
}

function Products12() {
  return (
    <div className="absolute contents inset-0" data-name="Products">
      <div className="absolute bg-white inset-0 opacity-0" data-name="Hide Bg" />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[32.5%] right-[52.08%] text-[#202224] text-[14px] top-[calc(50%-9px)] tracking-[0.3px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Inbox
      </p>
      <p className="absolute font-['Gilroy:Medium',sans-serif] leading-[normal] left-[19.17%] not-italic right-[76.25%] text-[#202224] text-[22px] text-center top-[calc(50%-12px)]"></p>
    </div>
  );
}

function NavigationSidebarItemLight12() {
  return (
    <div className="absolute inset-[21.59%_83.33%_73.74%_0]" data-name="Navigation / Sidebar Item / Light">
      <Products12 />
    </div>
  );
}

function Products13() {
  return (
    <div className="absolute contents inset-0" data-name="Products">
      <div className="absolute bg-white inset-0 opacity-0" data-name="Hide Bg" />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[32.5%] right-[42.08%] text-[#202224] text-[14px] top-[calc(50%-9px)] tracking-[0.3px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Favorites
      </p>
      <p className="absolute font-['Gilroy:Medium',sans-serif] leading-[normal] left-[19.17%] not-italic right-[76.25%] text-[#202224] text-[22px] text-center top-[calc(50%-12px)]"></p>
    </div>
  );
}

function NavigationSidebarItemLight13() {
  return (
    <div className="absolute inset-[16.92%_83.33%_78.41%_0]" data-name="Navigation / Sidebar Item / Light">
      <Products13 />
    </div>
  );
}

function Products14() {
  return (
    <div className="absolute contents inset-0" data-name="Products">
      <div className="absolute bg-white inset-0 opacity-0" data-name="Hide Bg" />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[32.5%] right-[42.92%] text-[#202224] text-[14px] top-[calc(50%-9px)] tracking-[0.3px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Products
      </p>
      <p className="absolute font-['Gilroy:Medium',sans-serif] leading-[normal] left-[19.17%] not-italic right-[76.25%] text-[#202224] text-[22px] text-center top-[calc(50%-12px)]"></p>
    </div>
  );
}

function NavigationSidebarItemLight14() {
  return (
    <div className="absolute inset-[12.24%_83.33%_83.08%_0]" data-name="Navigation / Sidebar Item / Light">
      <Products14 />
    </div>
  );
}

function HideBgHideBgCopyMask() {
  return (
    <div className="absolute contents inset-0" data-name="Hide Bg + Hide Bg Copy Mask">
      <div className="absolute bg-white inset-0 opacity-0" data-name="Mask" />
      <div className="absolute bg-[#4880ff] inset-[0_10%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-24px_0px] mask-size-[240px_50px] rounded-[6px]" data-name="Hide Bg" style={{ maskImage: `url('${imgHideBg}')` }} />
      <div className="absolute bg-[#4880ff] inset-[0_98.33%_0_-2.08%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[5px_0px] mask-size-[240px_50px] rounded-[4px]" data-name="Hide Bg Copy" style={{ maskImage: `url('${imgHideBg}')` }} />
    </div>
  );
}

function Products15() {
  return (
    <div className="absolute contents inset-0" data-name="Products">
      <HideBgHideBgCopyMask />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[32.5%] right-[37.08%] text-[14px] text-white top-[calc(50%-9px)] tracking-[0.3px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Dashboard
      </p>
      <p className="absolute font-['Gilroy:Medium',sans-serif] leading-[normal] left-[19.17%] not-italic right-[76.25%] text-[22px] text-center text-white top-[calc(50%-12px)]"></p>
    </div>
  );
}

function NavigationSidebarItemLight15() {
  return (
    <div className="absolute inset-[7.57%_83.33%_87.76%_0]" data-name="Navigation / Sidebar Item / Light">
      <Products15 />
    </div>
  );
}

function Logo() {
  return (
    <div className="-translate-y-1/2 absolute h-[27px] left-[4.58%] right-[86.46%] top-[calc(50%-497.5px)]" data-name="Logo">
      <p className="absolute font-['Nunito_Sans:ExtraBold',sans-serif] font-extrabold leading-[0] left-0 right-[6.48%] text-[#4880ff] text-[20px] top-[calc(50%-13.5px)] whitespace-pre-wrap" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        <span className="leading-[normal]">Dash</span>
        <span className="leading-[normal] text-[#202224]">Stack</span>
      </p>
    </div>
  );
}

function NavigationSidebarMenuLight() {
  return (
    <div className="absolute contents inset-[0_83.33%_0_0]" data-name="Navigation / Sidebar Menu / Light">
      <div className="absolute bg-white inset-[0_83.33%_0_0]" data-name="Side Bar Bg" />
      <NavigationSidebarItemLight />
      <NavigationSidebarItemLight1 />
      <div className="absolute inset-[80.56%_83.33%_19.35%_0]" data-name="Divider">
        <div className="absolute inset-[20%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 239.6 0.6">
            <path d="M0.3 0.3H239.3" id="Divider" stroke="var(--stroke-0, #E0E0E0)" strokeLinecap="square" strokeWidth="0.6" />
          </svg>
        </div>
      </div>
      <NavigationSidebarItemLight2 />
      <NavigationSidebarItemLight3 />
      <NavigationSidebarItemLight4 />
      <NavigationSidebarItemLight5 />
      <NavigationSidebarItemLight6 />
      <NavigationSidebarItemLight7 />
      <NavigationSidebarItemLight8 />
      <NavigationSidebarItemLight9 />
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[2.78%] opacity-60 right-[94.38%] text-[#202224] text-[12px] top-[calc(50%-121px)] tracking-[0.2571px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        PAGES
      </p>
      <div className="absolute inset-[37.1%_83.33%_62.8%_0]" data-name="Divider">
        <div className="absolute inset-[20%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 239.6 0.6">
            <path d="M0.3 0.3H239.3" id="Divider" stroke="var(--stroke-0, #E0E0E0)" strokeLinecap="square" strokeWidth="0.6" />
          </svg>
        </div>
      </div>
      <NavigationSidebarItemLight10 />
      <NavigationSidebarItemLight11 />
      <NavigationSidebarItemLight12 />
      <NavigationSidebarItemLight13 />
      <NavigationSidebarItemLight14 />
      <NavigationSidebarItemLight15 />
      <Logo />
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="bg-white relative size-full" data-name="Dashboard  #1">
      <MainBgColor />
      <Separator />
      <DealsDetails />
      <SalesDetails />
      <OrderPending />
      <TotalSales />
      <TotalOrder />
      <TotalUsers />
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[18.75%] right-[70.07%] text-[#202224] text-[32px] top-[calc(50%-435px)] tracking-[-0.1143px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Dashboard
      </p>
      <NavigationTopBar />
      <NavigationSidebarMenuLight />
    </div>
  );
}