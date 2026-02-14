import svgPaths from "./svg-vyiei4qhdc";
import imgALLEFVINICIUS343875Unsplash1 from "figma:asset/95bca3ecaf6d28d115834f85b6163b6e58e91c7c.png";
import imgUkFlag1 from "figma:asset/7260fbd7cccd7993400c3b1165f33370bf034acd.png";
import { imgALLEFVINICIUS343875Unsplash, imgUkFlag, imgHideBg } from "./svg-a2hx5";

function MainBgColor() {
  return (
    <div className="absolute inset-[0_0_0_16.6%]" data-name="Main Bg Color">
      <div className="absolute bg-[#f5f6fa] inset-0" data-name="Main Bg" />
    </div>
  );
}

function Indicator() {
  return (
    <div className="absolute inset-[95.61%_2.15%_1.59%_91.88%]" data-name="Indicator">
      <div className="absolute inset-[-0.67%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 86 30.4">
          <g id="Indicator">
            <rect fill="var(--fill-0, #FAFBFD)" height="29.4" id="Bg" rx="7.7" stroke="var(--stroke-0, #D5D5D5)" strokeWidth="0.6" width="85.4" x="0.3" y="0.5" />
            <g id="ic-keyboard-arrow-left-24px" opacity="0.6">
              <g id="Path" />
              <path d={svgPaths.p59fda80} fill="var(--fill-0, #202224)" id="Path_2" />
            </g>
            <g id="ic-keyboard-arrow-left-24px_2" opacity="0.9">
              <g id="Path_3" />
              <path d={svgPaths.p3c29f700} fill="var(--fill-0, #202224)" id="Path_4" />
            </g>
            <path d="M43.5 30.2V0.2" id="Line" opacity="0.700544" stroke="var(--stroke-0, #979797)" strokeLinecap="square" strokeWidth="0.4" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function LabelPrimary1() {
  return (
    <div className="absolute contents inset-0" data-name="Label / Primary">
      <div className="absolute bg-[#00b69b] inset-0 opacity-20 rounded-[3px]" data-name="Rectangle" />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[15%] right-[13.33%] text-[#00b69b] text-[12px] text-center top-[calc(50%-8px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Primary
      </p>
    </div>
  );
}

function LabelPrimary() {
  return (
    <div className="absolute inset-[26.45%_38.47%_71.5%_57.36%]" data-name="Label / Primary">
      <LabelPrimary1 />
    </div>
  );
}

function Message() {
  return (
    <div className="absolute contents inset-[26.45%_2.08%_69.63%_40%]" data-name="Message">
      <div className="absolute inset-[30.28%_2.08%_69.63%_40%]" data-name="Divider">
        <div className="absolute inset-[10%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 834.8 0.8">
            <path d="M0.4 0.4H834.4" id="Divider" stroke="var(--stroke-0, #E0E0E0)" strokeLinecap="square" strokeWidth="0.8" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[47.36%] right-[48.47%] text-[#202224] text-[14px] top-[calc(50%-250px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Jullu Jalal
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[62.92%] opacity-90 right-[11.46%] text-[#202224] text-[14px] top-[calc(50%-250px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Our Bachelor of Commerce program is ACBSP-accredited.
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[92.71%] opacity-70 right-[3.47%] text-[#202224] text-[14px] top-[calc(50%-250px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        8:38 AM
      </p>
      <div className="absolute inset-[26.82%_57.5%_71.68%_41.39%] rounded-[3px]" data-name="Check Box">
        <div aria-hidden="true" className="absolute border-[#b3b3b3] border-[1.2px] border-solid inset-[-0.6px] pointer-events-none rounded-[3.6px]" />
      </div>
      <div className="absolute inset-[26.82%_54.72%_71.68%_44.17%]" data-name="Star">
        <div className="absolute inset-[-3.75%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.2012 17.1995">
            <path clipRule="evenodd" d={svgPaths.p234ceef0} fillRule="evenodd" id="Star" stroke="var(--stroke-0, #B3B3B3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
      <LabelPrimary />
    </div>
  );
}

function LabelWork1() {
  return (
    <div className="absolute contents inset-0" data-name="Label / Work">
      <div className="absolute bg-[#fd9a56] inset-0 opacity-20 rounded-[3px]" data-name="Rectangle" />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-1/4 right-[23.33%] text-[#fd9a56] text-[12px] text-center top-[calc(50%-8px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Work
      </p>
    </div>
  );
}

function LabelWork() {
  return (
    <div className="absolute inset-[32.24%_38.47%_65.7%_57.36%]" data-name="Label / Work">
      <LabelWork1 />
    </div>
  );
}

function Message1() {
  return (
    <div className="absolute contents inset-[32.24%_2.08%_63.83%_40%]" data-name="Message">
      <div className="absolute inset-[36.07%_2.08%_63.83%_40%]" data-name="Divider">
        <div className="absolute inset-[10%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 834.8 0.8">
            <path d="M0.4 0.4H834.4" id="Divider" stroke="var(--stroke-0, #E0E0E0)" strokeLinecap="square" strokeWidth="0.8" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[47.36%] right-[45.42%] text-[#202224] text-[14px] top-[calc(50%-188px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Minerva Barnett
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[62.92%] opacity-90 right-[19.65%] text-[#202224] text-[14px] top-[calc(50%-188px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Get Best Advertiser In Your Side Pocket
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[92.71%] opacity-70 right-[3.47%] text-[#202224] text-[14px] top-[calc(50%-188px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        8:13 AM
      </p>
      <div className="absolute inset-[32.62%_57.5%_65.89%_41.39%] rounded-[3px]" data-name="Check Box">
        <div aria-hidden="true" className="absolute border-[#b3b3b3] border-[1.2px] border-solid inset-[-0.6px] pointer-events-none rounded-[3.6px]" />
      </div>
      <div className="absolute inset-[32.62%_54.72%_65.89%_44.17%]" data-name="Star">
        <div className="absolute inset-[-3.75%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.2012 17.1995">
            <path clipRule="evenodd" d={svgPaths.p234ceef0} fillRule="evenodd" id="Star" stroke="var(--stroke-0, #B3B3B3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
      <LabelWork />
    </div>
  );
}

function LabelPrimary3() {
  return (
    <div className="absolute contents inset-0" data-name="Label / Primary">
      <div className="absolute bg-[#00b69b] inset-0 opacity-20 rounded-[3px]" data-name="Rectangle" />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[15%] right-[13.33%] text-[#00b69b] text-[12px] text-center top-[calc(50%-8px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Primary
      </p>
    </div>
  );
}

function LabelPrimary2() {
  return (
    <div className="absolute inset-[67.01%_38.47%_30.93%_57.36%]" data-name="Label / Primary">
      <LabelPrimary3 />
    </div>
  );
}

function Message2() {
  return (
    <div className="absolute contents inset-[67.01%_2.08%_29.07%_40%]" data-name="Message">
      <div className="absolute inset-[70.84%_2.08%_29.07%_40%]" data-name="Divider">
        <div className="absolute inset-[10%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 834.8 0.8">
            <path d="M0.4 0.4H834.4" id="Divider" stroke="var(--stroke-0, #E0E0E0)" strokeLinecap="square" strokeWidth="0.8" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[47.36%] right-[47.29%] text-[#202224] text-[14px] top-[calc(50%+184px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Willie Blake
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[62.92%] opacity-90 right-[11.46%] text-[#202224] text-[14px] top-[calc(50%+184px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Our Bachelor of Commerce program is ACBSP-accredited.
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[92.71%] opacity-70 right-[3.47%] text-[#202224] text-[14px] top-[calc(50%+184px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        8:38 AM
      </p>
      <div className="absolute inset-[67.38%_57.5%_31.12%_41.39%] rounded-[3px]" data-name="Check Box">
        <div aria-hidden="true" className="absolute border-[#b3b3b3] border-[1.2px] border-solid inset-[-0.6px] pointer-events-none rounded-[3.6px]" />
      </div>
      <div className="absolute inset-[67.38%_54.72%_31.12%_44.17%]" data-name="Star">
        <div className="absolute inset-[-3.75%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.2012 17.1995">
            <path clipRule="evenodd" d={svgPaths.p234ceef0} fillRule="evenodd" id="Star" stroke="var(--stroke-0, #B3B3B3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
      <LabelPrimary2 />
    </div>
  );
}

function LabelWork3() {
  return (
    <div className="absolute contents inset-0" data-name="Label / Work">
      <div className="absolute bg-[#fd9a56] inset-0 opacity-20 rounded-[3px]" data-name="Rectangle" />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-1/4 right-[23.33%] text-[#fd9a56] text-[12px] text-center top-[calc(50%-8px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Work
      </p>
    </div>
  );
}

function LabelWork2() {
  return (
    <div className="absolute inset-[72.8%_38.47%_25.14%_57.36%]" data-name="Label / Work">
      <LabelWork3 />
    </div>
  );
}

function Message3() {
  return (
    <div className="absolute contents inset-[72.8%_2.08%_23.27%_40%]" data-name="Message">
      <div className="absolute inset-[76.64%_2.08%_23.27%_40%]" data-name="Divider">
        <div className="absolute inset-[10%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 834.8 0.8">
            <path d="M0.4 0.4H834.4" id="Divider" stroke="var(--stroke-0, #E0E0E0)" strokeLinecap="square" strokeWidth="0.8" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[47.36%] right-[45.42%] text-[#202224] text-[14px] top-[calc(50%+246px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Minerva Barnett
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[62.92%] opacity-90 right-[19.65%] text-[#202224] text-[14px] top-[calc(50%+246px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Get Best Advertiser In Your Side Pocket
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[92.71%] opacity-70 right-[3.47%] text-[#202224] text-[14px] top-[calc(50%+246px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        8:13 AM
      </p>
      <div className="absolute inset-[73.18%_57.5%_25.33%_41.39%] rounded-[3px]" data-name="Check Box">
        <div aria-hidden="true" className="absolute border-[#b3b3b3] border-[1.2px] border-solid inset-[-0.6px] pointer-events-none rounded-[3.6px]" />
      </div>
      <div className="absolute inset-[73.18%_54.72%_25.33%_44.17%]" data-name="Star">
        <div className="absolute inset-[-3.75%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.2012 17.1995">
            <path clipRule="evenodd" d={svgPaths.p234ceef0} fillRule="evenodd" id="Star" stroke="var(--stroke-0, #B3B3B3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
      <LabelWork2 />
    </div>
  );
}

function LabelFriends1() {
  return (
    <div className="absolute contents inset-0" data-name="Label / Friends">
      <div className="absolute bg-[#d456fd] inset-0 opacity-20 rounded-[3px]" data-name="Rectangle" />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[16.67%] right-[15%] text-[#d456fd] text-[12px] top-[calc(50%-8px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Friends
      </p>
    </div>
  );
}

function LabelFriends() {
  return (
    <div className="absolute inset-[38.04%_38.47%_59.91%_57.36%]" data-name="Label / Friends">
      <LabelFriends1 />
    </div>
  );
}

function Message4() {
  return (
    <div className="absolute contents inset-[38.04%_2.08%_58.04%_40%]" data-name="Message">
      <div className="absolute inset-[41.87%_2.08%_58.04%_40%]" data-name="Divider">
        <div className="absolute inset-[10%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 834.8 0.8">
            <path d="M0.4 0.4H834.4" id="Divider" stroke="var(--stroke-0, #E0E0E0)" strokeLinecap="square" strokeWidth="0.8" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[47.36%] right-[47.36%] text-[#202224] text-[14px] top-[calc(50%-126px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Peter Lewis
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[62.92%] opacity-90 right-[23.4%] text-[#202224] text-[14px] top-[calc(50%-126px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Vacation Home Rental Success
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[92.71%] opacity-70 right-[3.54%] text-[#202224] text-[14px] top-[calc(50%-126px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        7:52 PM
      </p>
      <div className="absolute inset-[38.41%_57.5%_60.09%_41.39%] rounded-[3px]" data-name="Check Box">
        <div aria-hidden="true" className="absolute border-[#b3b3b3] border-[1.2px] border-solid inset-[-0.6px] pointer-events-none rounded-[3.6px]" />
      </div>
      <div className="absolute inset-[38.41%_54.72%_60.09%_44.17%]" data-name="Star">
        <div className="absolute inset-[-3.75%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.2012 17.1995">
            <path clipRule="evenodd" d={svgPaths.p234ceef0} fillRule="evenodd" id="Star" stroke="var(--stroke-0, #B3B3B3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
      <LabelFriends />
    </div>
  );
}

function LabelFriends3() {
  return (
    <div className="absolute contents inset-0" data-name="Label / Friends">
      <div className="absolute bg-[#d456fd] inset-0 opacity-20 rounded-[3px]" data-name="Rectangle" />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[16.67%] right-[15%] text-[#d456fd] text-[12px] top-[calc(50%-8px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Friends
      </p>
    </div>
  );
}

function LabelFriends2() {
  return (
    <div className="absolute inset-[90.19%_38.47%_7.76%_57.36%]" data-name="Label / Friends">
      <LabelFriends3 />
    </div>
  );
}

function Message5() {
  return (
    <div className="absolute contents inset-[90.19%_3.54%_7.76%_41.39%]" data-name="Message">
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[47.36%] right-[46.53%] text-[#202224] text-[14px] top-[calc(50%+432px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Lora Houston
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[62.92%] opacity-90 right-[23.4%] text-[#202224] text-[14px] top-[calc(50%+432px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Vacation Home Rental Success
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[92.71%] opacity-70 right-[3.54%] text-[#202224] text-[14px] top-[calc(50%+432px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        7:52 PM
      </p>
      <div className="absolute inset-[90.56%_57.5%_7.94%_41.39%] rounded-[3px]" data-name="Check Box">
        <div aria-hidden="true" className="absolute border-[#b3b3b3] border-[1.2px] border-solid inset-[-0.6px] pointer-events-none rounded-[3.6px]" />
      </div>
      <div className="absolute inset-[90.56%_54.72%_7.94%_44.17%]" data-name="Star">
        <div className="absolute inset-[-3.75%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.2012 17.1995">
            <path clipRule="evenodd" d={svgPaths.p234ceef0} fillRule="evenodd" id="Star" stroke="var(--stroke-0, #B3B3B3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
      <LabelFriends2 />
    </div>
  );
}

function LabelSocial1() {
  return (
    <div className="absolute contents inset-0" data-name="Label /  Social">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 60 22">
        <path clipRule="evenodd" d={svgPaths.p8b7d500} fill="var(--fill-0, #5A8CFF)" fillRule="evenodd" id="Rectangle" opacity="0.2" />
      </svg>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[23.33%] right-[21.67%] text-[#5a8cff] text-[12px] top-[calc(50%-8px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Social
      </p>
    </div>
  );
}

function LabelSocial() {
  return (
    <div className="absolute inset-[49.63%_38.47%_48.32%_57.36%]" data-name="Label /  Social">
      <LabelSocial1 />
    </div>
  );
}

function Message6() {
  return (
    <div className="absolute contents inset-[49.63%_2.08%_46.45%_40%]" data-name="Message">
      <div className="absolute inset-[53.46%_2.08%_46.45%_40%]" data-name="Divider">
        <div className="absolute inset-[10%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 834.8 0.8">
            <path d="M0.4 0.4H834.4" id="Divider" stroke="var(--stroke-0, #E0E0E0)" strokeLinecap="square" strokeWidth="0.8" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[47.36%] right-[45.56%] text-[#202224] text-[14px] top-[calc(50%-2px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Clifford Morgan
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[62.92%] opacity-90 right-[10.21%] text-[#202224] text-[14px] top-[calc(50%-2px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Enhance Your Brand Potential With Giant Advertising Blimps
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[92.71%] opacity-70 right-[3.54%] text-[#202224] text-[14px] top-[calc(50%-2px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        4:13 PM
      </p>
      <div className="absolute bottom-[48.5%] left-[41.39%] right-[57.5%] rounded-[3px] top-1/2" data-name="Check Box">
        <div aria-hidden="true" className="absolute border-[#b3b3b3] border-[1.2px] border-solid inset-[-0.6px] pointer-events-none rounded-[3.6px]" />
      </div>
      <div className="absolute bottom-[48.5%] left-[44.17%] right-[54.72%] top-1/2" data-name="Star">
        <div className="absolute inset-[-3.75%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.2012 17.1995">
            <path clipRule="evenodd" d={svgPaths.p234ceef0} fillRule="evenodd" id="Star" stroke="var(--stroke-0, #B3B3B3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
      <LabelSocial />
    </div>
  );
}

function LabelSocial3() {
  return (
    <div className="absolute contents inset-0" data-name="Label /  Social">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 60 22">
        <path clipRule="evenodd" d={svgPaths.p8b7d500} fill="var(--fill-0, #5A8CFF)" fillRule="evenodd" id="Rectangle" opacity="0.2" />
      </svg>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[23.33%] right-[21.67%] text-[#5a8cff] text-[12px] top-[calc(50%-8px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Social
      </p>
    </div>
  );
}

function LabelSocial2() {
  return (
    <div className="absolute inset-[84.39%_38.47%_13.55%_57.36%]" data-name="Label /  Social">
      <LabelSocial3 />
    </div>
  );
}

function Message7() {
  return (
    <div className="absolute contents inset-[84.39%_2.08%_11.68%_40%]" data-name="Message">
      <div className="absolute inset-[88.22%_2.08%_11.68%_40%]" data-name="Divider">
        <div className="absolute inset-[10%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 834.8 0.8">
            <path d="M0.4 0.4H834.4" id="Divider" stroke="var(--stroke-0, #E0E0E0)" strokeLinecap="square" strokeWidth="0.8" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[47.36%] right-[47.22%] text-[#202224] text-[14px] top-[calc(50%+370px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Olga Hogan
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[62.92%] opacity-90 right-[10.21%] text-[#202224] text-[14px] top-[calc(50%+370px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Enhance Your Brand Potential With Giant Advertising Blimps
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[92.71%] opacity-70 right-[3.54%] text-[#202224] text-[14px] top-[calc(50%+370px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        4:13 PM
      </p>
      <div className="absolute inset-[84.77%_57.5%_13.74%_41.39%] rounded-[3px]" data-name="Check Box">
        <div aria-hidden="true" className="absolute border-[#b3b3b3] border-[1.2px] border-solid inset-[-0.6px] pointer-events-none rounded-[3.6px]" />
      </div>
      <div className="absolute inset-[84.77%_54.72%_13.74%_44.17%]" data-name="Star">
        <div className="absolute inset-[-3.75%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.2012 17.1995">
            <path clipRule="evenodd" d={svgPaths.p234ceef0} fillRule="evenodd" id="Star" stroke="var(--stroke-0, #B3B3B3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
      <LabelSocial2 />
    </div>
  );
}

function LabelFriends5() {
  return (
    <div className="absolute contents inset-0" data-name="Label / Friends">
      <div className="absolute bg-[#d456fd] inset-0 opacity-20 rounded-[3px]" data-name="Rectangle" />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[16.67%] right-[15%] text-[#d456fd] text-[12px] top-[calc(50%-8px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Friends
      </p>
    </div>
  );
}

function LabelFriends4() {
  return (
    <div className="absolute inset-[55.42%_38.47%_42.52%_57.36%]" data-name="Label / Friends">
      <LabelFriends5 />
    </div>
  );
}

function Message8() {
  return (
    <div className="absolute contents inset-[55.42%_2.08%_40.65%_40%]" data-name="Message">
      <div className="absolute inset-[59.25%_2.08%_40.65%_40%]" data-name="Divider">
        <div className="absolute inset-[10%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 834.8 0.8">
            <path d="M0.4 0.4H834.4" id="Divider" stroke="var(--stroke-0, #E0E0E0)" strokeLinecap="square" strokeWidth="0.8" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[47.36%] right-[45.63%] text-[#202224] text-[14px] top-[calc(50%+60px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Cecilia Webster
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[62.92%] opacity-90 right-[19.51%] text-[#202224] text-[14px] top-[calc(50%+60px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Always Look On The Bright Side Of Life
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[92.71%] opacity-70 right-[3.54%] text-[#202224] text-[14px] top-[calc(50%+60px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        3:52 PM
      </p>
      <div className="absolute inset-[55.79%_57.5%_42.71%_41.39%] rounded-[3px]" data-name="Check Box">
        <div aria-hidden="true" className="absolute border-[#b3b3b3] border-[1.2px] border-solid inset-[-0.6px] pointer-events-none rounded-[3.6px]" />
      </div>
      <div className="absolute inset-[55.79%_54.72%_42.71%_44.17%]" data-name="Star">
        <div className="absolute inset-[-3.75%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.2012 17.1995">
            <path clipRule="evenodd" d={svgPaths.p234ceef0} fillRule="evenodd" id="Star" stroke="var(--stroke-0, #B3B3B3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
      <LabelFriends4 />
    </div>
  );
}

function Message9() {
  return (
    <div className="absolute contents inset-[44.02%_2.08%_52.24%_40%]" data-name="Message">
      <div className="absolute inset-[47.66%_2.08%_52.24%_40%]" data-name="Divider">
        <div className="absolute inset-[10%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 834.8 0.8">
            <path d="M0.4 0.4H834.4" id="Divider" stroke="var(--stroke-0, #E0E0E0)" strokeLinecap="square" strokeWidth="0.8" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[47.36%] right-[45.56%] text-[#202224] text-[14px] top-[calc(50%-64px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Anthony Briggs
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[57.29%] opacity-90 right-[17.15%] text-[#202224] text-[14px] top-[calc(50%-64px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Free Classifieds Using Them To Promote Your Stuff Online
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[92.71%] opacity-70 right-[3.54%] text-[#202224] text-[14px] top-[calc(50%-64px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        7:52 PM
      </p>
      <div className="absolute inset-[44.21%_57.5%_54.3%_41.39%] rounded-[3px]" data-name="Check Box">
        <div aria-hidden="true" className="absolute border-[#b3b3b3] border-[1.2px] border-solid inset-[-0.6px] pointer-events-none rounded-[3.6px]" />
      </div>
      <div className="absolute inset-[44.21%_54.72%_54.3%_44.17%]" data-name="Star">
        <div className="absolute inset-[-3.75%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.2012 17.1995">
            <path clipRule="evenodd" d={svgPaths.p234ceef0} fill="var(--fill-0, #FFD56D)" fillRule="evenodd" id="Star" stroke="var(--stroke-0, #FFD56D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Message10() {
  return (
    <div className="absolute contents inset-[78.79%_2.08%_17.48%_40%]" data-name="Message">
      <div className="absolute inset-[82.43%_2.08%_17.48%_40%]" data-name="Divider">
        <div className="absolute inset-[10%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 834.8 0.8">
            <path d="M0.4 0.4H834.4" id="Divider" stroke="var(--stroke-0, #E0E0E0)" strokeLinecap="square" strokeWidth="0.8" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[47.36%] right-[46.18%] text-[#202224] text-[14px] top-[calc(50%+308px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Fanny Weaver
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[57.29%] opacity-90 right-[17.15%] text-[#202224] text-[14px] top-[calc(50%+308px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Free Classifieds Using Them To Promote Your Stuff Online
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[92.71%] opacity-70 right-[3.54%] text-[#202224] text-[14px] top-[calc(50%+308px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        7:52 PM
      </p>
      <div className="absolute inset-[78.97%_57.5%_19.53%_41.39%] rounded-[3px]" data-name="Check Box">
        <div aria-hidden="true" className="absolute border-[#b3b3b3] border-[1.2px] border-solid inset-[-0.6px] pointer-events-none rounded-[3.6px]" />
      </div>
      <div className="absolute inset-[78.97%_54.72%_19.53%_44.17%]" data-name="Star">
        <div className="absolute inset-[-3.75%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.2012 17.1995">
            <path clipRule="evenodd" d={svgPaths.p234ceef0} fill="var(--fill-0, #FFD56D)" fillRule="evenodd" id="Star" stroke="var(--stroke-0, #FFD56D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Message11() {
  return (
    <div className="absolute contents inset-[61.4%_2.08%_34.86%_40%]" data-name="Message">
      <div className="absolute inset-[65.05%_2.08%_34.86%_40%]" data-name="Divider">
        <div className="absolute inset-[10%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 834.8 0.8">
            <path d="M0.4 0.4H834.4" id="Divider" stroke="var(--stroke-0, #E0E0E0)" strokeLinecap="square" strokeWidth="0.8" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[47.36%] right-[45.28%] text-[#202224] text-[14px] top-[calc(50%+122px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Harvey Manning
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[57.29%] opacity-90 right-[15.07%] text-[#202224] text-[14px] top-[calc(50%+122px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Curling Irons Are As Individual As The Women Who Use Them
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[92.71%] opacity-70 right-[3.54%] text-[#202224] text-[14px] top-[calc(50%+122px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        2:30 PM
      </p>
      <div className="absolute inset-[61.59%_57.5%_36.92%_41.39%] rounded-[3px]" data-name="Check Box">
        <div aria-hidden="true" className="absolute border-[#b3b3b3] border-[1.2px] border-solid inset-[-0.6px] pointer-events-none rounded-[3.6px]" />
      </div>
      <div className="absolute inset-[61.59%_54.72%_36.92%_44.17%]" data-name="Star">
        <div className="absolute inset-[-3.75%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.2012 17.1995">
            <path clipRule="evenodd" d={svgPaths.p234ceef0} fill="var(--fill-0, #FFD56D)" fillRule="evenodd" id="Star" stroke="var(--stroke-0, #FFD56D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function OtherAction() {
  return (
    <div className="absolute inset-[17.85%_3.75%_78.41%_87.15%]" data-name="Other Action">
      <div className="absolute inset-[-0.5%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 131 40.4">
          <g id="Other Action">
            <rect fill="var(--fill-0, #FAFBFD)" height="39.4" id="Rectangle" rx="11.7" stroke="var(--stroke-0, #D5D5D5)" strokeWidth="0.6" width="130.4" x="0.3" y="0.5" />
            <path d="M44.5 40.2V0.2" id="Line" opacity="0.700544" stroke="var(--stroke-0, #979797)" strokeLinecap="square" strokeWidth="0.4" />
            <path d="M89.5 40.2V0.2" id="Line_2" opacity="0.700544" stroke="var(--stroke-0, #979797)" strokeLinecap="square" strokeWidth="0.4" />
            <path clipRule="evenodd" d={svgPaths.p18651980} fill="var(--fill-0, black)" fillRule="evenodd" id="Shape" />
            <path clipRule="evenodd" d={svgPaths.p34d1700} fill="var(--fill-0, #202224)" fillRule="evenodd" id="Shape_2" />
            <path clipRule="evenodd" d={svgPaths.p31a1ddb2} fill="var(--fill-0, #202224)" fillRule="evenodd" id="Shape_3" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Search() {
  return (
    <div className="absolute inset-[19.02%_56.14%_79.57%_42.82%]" data-name="search">
      <div className="absolute inset-[0_-5%_-5%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.7562 15.7566">
          <g id="search" opacity="0.5">
            <path clipRule="evenodd" d={svgPaths.p1e0a4880} fillRule="evenodd" id="Oval" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p35860e00} id="Path" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function SearchBar() {
  return (
    <div className="absolute contents inset-[17.85%_35.28%_78.41%_41.67%]" data-name="Search Bar">
      <div className="absolute bg-[#f5f6fa] border-[#d5d5d5] border-[0.6px] border-solid inset-[17.85%_35.28%_78.41%_41.67%] rounded-[20px]" data-name="Rectangle" />
      <Search />
      <p className="absolute font-['Nunito_Sans:Regular',sans-serif] font-normal leading-[normal] left-[44.79%] opacity-60 right-[50.14%] text-[#202224] text-[14px] top-[calc(50%-334px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Search mail
      </p>
    </div>
  );
}

function RightSide() {
  return (
    <div className="absolute contents inset-[15.61%_2.08%_5.89%_40%]" data-name="Right Side">
      <div className="absolute bg-white border-[#b9b9b9] border-[0.3px] border-solid inset-[15.61%_2.08%_5.89%_40%] rounded-[14px]" data-name="Bg" />
      <Message />
      <Message1 />
      <Message2 />
      <Message3 />
      <Message4 />
      <Message5 />
      <Message6 />
      <Message7 />
      <Message8 />
      <Message9 />
      <Message10 />
      <Message11 />
      <OtherAction />
      <SearchBar />
    </div>
  );
}

function CreateNew() {
  return (
    <div className="absolute contents font-['Nunito_Sans:SemiBold',sans-serif] font-semibold inset-[79.81%_68.82%_17.66%_21.53%] leading-[normal] text-[#202224]" data-name="Create new">
      <p className="absolute left-[23.33%] opacity-50 right-[68.82%] text-[14px] top-[calc(50%+323px)] tracking-[-0.05px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Create New Label
      </p>
      <p className="absolute left-[21.53%] opacity-50 right-[77.64%] text-[20px] top-[calc(50%+319px)] tracking-[-0.0714px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        +
      </p>
    </div>
  );
}

function MaskCircle() {
  return (
    <div className="absolute contents inset-[75.7%_77.43%_22.9%_21.53%]" data-name="mask-circle">
      <div className="absolute inset-[75.7%_77.43%_22.9%_21.53%] rounded-[1px]" data-name="Rectangle">
        <div aria-hidden="true" className="absolute border-[#d456fd] border-[1.2px] border-solid inset-[-0.6px] pointer-events-none rounded-[1.6px]" />
      </div>
    </div>
  );
}

function Friend() {
  return (
    <div className="absolute contents inset-[75.51%_73.26%_22.71%_21.53%]" data-name="Friend">
      <MaskCircle />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[23.47%] right-[73.26%] text-[#202224] text-[14px] top-[calc(50%+273px)] tracking-[-0.05px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Friends
      </p>
    </div>
  );
}

function MaskCircle1() {
  return (
    <div className="absolute contents inset-[71.68%_77.43%_26.92%_21.53%]" data-name="mask-circle">
      <div className="absolute inset-[71.68%_77.43%_26.92%_21.53%] rounded-[1px]" data-name="Rectangle">
        <div aria-hidden="true" className="absolute border-[#fd9a56] border-[1.2px] border-solid inset-[-0.6px] pointer-events-none rounded-[1.6px]" />
      </div>
    </div>
  );
}

function Work() {
  return (
    <div className="absolute contents inset-[71.5%_74.1%_26.73%_21.53%]" data-name="Work">
      <MaskCircle1 />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[23.47%] right-[74.1%] text-[#202224] text-[14px] top-[calc(50%+230px)] tracking-[-0.05px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Work
      </p>
    </div>
  );
}

function MaskCircle2() {
  return (
    <div className="absolute contents inset-[67.66%_77.43%_30.93%_21.53%]" data-name="mask-circle">
      <div className="absolute inset-[67.66%_77.43%_30.93%_21.53%] rounded-[1px]" data-name="Rectangle">
        <div aria-hidden="true" className="absolute border-[#5a8cff] border-[1.2px] border-solid inset-[-0.6px] pointer-events-none rounded-[1.6px]" />
      </div>
    </div>
  );
}

function Social() {
  return (
    <div className="absolute contents inset-[67.48%_73.89%_30.75%_21.53%]" data-name="Social">
      <MaskCircle2 />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[23.47%] right-[73.89%] text-[#202224] text-[14px] top-[calc(50%+187px)] tracking-[-0.05px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Social
      </p>
    </div>
  );
}

function MaskCircle3() {
  return (
    <div className="absolute contents inset-[63.64%_77.43%_34.95%_21.53%]" data-name="mask-circle">
      <div className="absolute inset-[63.64%_77.43%_34.95%_21.53%] rounded-[1px]" data-name="Rectangle">
        <div aria-hidden="true" className="absolute border-[#00b69b] border-[1.2px] border-solid inset-[-0.6px] pointer-events-none rounded-[1.6px]" />
      </div>
    </div>
  );
}

function Primary() {
  return (
    <div className="absolute contents inset-[63.46%_73.06%_34.77%_21.53%]" data-name="Primary">
      <MaskCircle3 />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[23.47%] right-[73.06%] text-[#202224] text-[14px] top-[calc(50%+144px)] tracking-[-0.05px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Primary
      </p>
    </div>
  );
}

function Label() {
  return (
    <div className="absolute contents inset-[58.79%_73.06%_22.71%_20.42%]" data-name="Label">
      <Friend />
      <Work />
      <Social />
      <Primary />
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[20.42%] right-[76.81%] text-[#202224] text-[16px] top-[calc(50%+94px)] tracking-[-0.0571px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Label
      </p>
    </div>
  );
}

function Bin1() {
  return (
    <div className="absolute inset-[53.08%_77.37%_45.57%_21.54%]" data-name="bin">
      <div className="absolute inset-[-4.17%_-3.84%_-4.17%_-3.85%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.8 15.6">
          <g id="bin">
            <path clipRule="evenodd" d={svgPaths.p2da6ee80} fillRule="evenodd" id="Path" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d="M6.6 11.4V6.6" id="Path_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d="M10.2 11.4V6.6" id="Path_3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d="M0.6 3H16.2" id="Path_4" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path clipRule="evenodd" d={svgPaths.p27af1700} fillRule="evenodd" id="Path_5" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Bin() {
  return (
    <div className="absolute contents inset-[52.9%_64.17%_45.33%_21.54%]" data-name="Bin">
      <Bin1 />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[23.47%] right-[75.07%] text-[#202224] text-[14px] top-[calc(50%+31px)] tracking-[-0.05px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Bin
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[35.21%] opacity-60 right-[64.17%] text-[#202224] text-[14px] text-right top-[calc(50%+31px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        9
      </p>
    </div>
  );
}

function MessagesBubbleSettings() {
  return (
    <div className="absolute inset-[49.11%_77.4%_49.49%_21.56%]" data-name="messages-bubble-settings">
      <div className="absolute inset-[-3.99%_-4%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.1974 16.2216">
          <g id="messages-bubble-settings">
            <path clipRule="evenodd" d={svgPaths.p2243be30} fillRule="evenodd" id="Oval" stroke="var(--stroke-0, #202224)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path clipRule="evenodd" d={svgPaths.p1be6fa40} fillRule="evenodd" id="Path" stroke="var(--stroke-0, #202224)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d={svgPaths.p1256e880} id="Path_2" stroke="var(--stroke-0, #202224)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Important() {
  return (
    <div className="absolute contents inset-[48.88%_64.17%_49.35%_21.56%]" data-name="Important">
      <MessagesBubbleSettings />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[23.47%] right-[72.15%] text-[#202224] text-[14px] top-[calc(50%-12px)] tracking-[-0.05px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Important
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[34.65%] opacity-60 right-[64.17%] text-[#202224] text-[14px] text-right top-[calc(50%-12px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        18
      </p>
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute inset-[45.05%_77.43%_53.55%_21.53%]" data-name="icon">
      <div className="absolute inset-[-4%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.2 16.1998">
          <g id="icon">
            <path d={svgPaths.p22950b80} id="Path" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d="M8.10001 10.5998V5.59984" id="Path_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeWidth="1.2" />
            <path clipRule="evenodd" d={svgPaths.p1ec15900} fillRule="evenodd" id="Path_3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Spam() {
  return (
    <div className="absolute contents inset-[44.86%_64.17%_53.36%_21.53%]" data-name="Spam">
      <Icon />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[23.47%] right-[73.96%] text-[#202224] text-[14px] top-[calc(50%-55px)] tracking-[-0.05px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Spam
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[34.65%] opacity-60 right-[64.17%] text-[#202224] text-[14px] text-right top-[calc(50%-55px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        14
      </p>
    </div>
  );
}

function Pencil() {
  return (
    <div className="absolute inset-[41.07%_77.4%_57.52%_21.56%]" data-name="pencil">
      <div className="absolute inset-[-4%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.2005 16.2002">
          <g id="pencil">
            <path clipRule="evenodd" d={svgPaths.p1a14b00} fillRule="evenodd" id="Path" stroke="var(--stroke-0, #202224)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d={svgPaths.p16979e00} id="Path_2" stroke="var(--stroke-0, #202224)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d={svgPaths.p973e80} id="Path_3" stroke="var(--stroke-0, #202224)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Draft() {
  return (
    <div className="absolute contents inset-[40.84%_64.17%_57.38%_21.56%]" data-name="Draft">
      <Pencil />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[23.47%] right-[74.24%] text-[#202224] text-[14px] top-[calc(50%-98px)] tracking-[-0.05px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Draft
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[34.65%] opacity-60 right-[64.17%] text-[#202224] text-[14px] text-right top-[calc(50%-98px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        09
      </p>
    </div>
  );
}

function SendEmail() {
  return (
    <div className="absolute inset-[37.07%_77.41%_61.56%_21.57%]" data-name="send-email-1">
      <div className="absolute inset-[-4.08%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9127 15.9182">
          <g id="send-email-1">
            <path clipRule="evenodd" d={svgPaths.p3f3ff200} fillRule="evenodd" id="Path" stroke="var(--stroke-0, #202224)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d={svgPaths.p72d2400} id="Path_2" stroke="var(--stroke-0, #202224)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Sent() {
  return (
    <div className="absolute contents inset-[36.82%_64.17%_61.4%_21.57%]" data-name="Sent">
      <SendEmail />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[23.47%] right-[74.44%] text-[#202224] text-[14px] top-[calc(50%-141px)] tracking-[-0.05px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Sent
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[32.64%] opacity-60 right-[64.17%] text-[#202224] text-[14px] text-right top-[calc(50%-141px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        24,532
      </p>
    </div>
  );
}

function RatingStar() {
  return (
    <div className="absolute inset-[33.04%_77.4%_65.56%_21.56%]" data-name="rating-star">
      <div className="absolute inset-[-4%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.2012 16.1996">
          <g id="rating-star">
            <path clipRule="evenodd" d={svgPaths.p306efd80} fillRule="evenodd" id="Path" stroke="var(--stroke-0, #202224)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Starred() {
  return (
    <div className="absolute contents inset-[32.8%_64.17%_65.42%_21.56%]" data-name="Starred">
      <RatingStar />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[23.47%] right-[73.26%] text-[#202224] text-[14px] top-[calc(50%-184px)] tracking-[-0.05px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Starred
      </p>
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[34.03%] opacity-60 right-[64.17%] text-[#202224] text-[14px] text-right top-[calc(50%-184px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        245
      </p>
    </div>
  );
}

function EmailActionUnread() {
  return (
    <div className="absolute inset-[29.21%_77.39%_69.77%_21.55%]" data-name="email-action-unread">
      <div className="absolute inset-[-5.5%_-3.93%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.4727 12.1091">
          <g id="email-action-unread">
            <rect height="10.9091" id="Rectangle" rx="1.5" stroke="var(--stroke-0, #4880FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" width="15.2727" x="0.6" y="0.6" />
            <path d={svgPaths.p3efdac40} id="Path" stroke="var(--stroke-0, #4880FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Inbox() {
  return (
    <div className="absolute contents inset-[27.66%_63.06%_68.32%_20.42%]" data-name="Inbox">
      <div className="absolute bg-[#4880ff] inset-[27.66%_63.06%_68.32%_20.42%] opacity-13 rounded-[4px]" data-name="Bg" />
      <EmailActionUnread />
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[23.47%] right-[74.03%] text-[#4880ff] text-[14px] top-[calc(50%-227px)] tracking-[-0.05px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Inbox
      </p>
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[33.4%] opacity-80 right-[64.24%] text-[#4880ff] text-[14px] top-[calc(50%-227px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        1253
      </p>
    </div>
  );
}

function All() {
  return (
    <div className="absolute contents inset-[27.66%_63.06%_45.33%_20.42%]" data-name="All">
      <Bin />
      <Important />
      <Spam />
      <Draft />
      <Sent />
      <Starred />
      <Inbox />
    </div>
  );
}

function MyEmail() {
  return (
    <div className="absolute contents inset-[24.11%_63.06%_45.33%_20.42%]" data-name="My Email">
      <All />
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[20.42%] right-3/4 text-[#202224] text-[16px] top-[calc(50%-277px)] tracking-[-0.0571px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        My Email
      </p>
    </div>
  );
}

function ButtonComposeMessage1() {
  return (
    <div className="absolute contents inset-0" data-name="Button / Compose message">
      <div className="absolute bg-[#4880ff] inset-0 opacity-90 rounded-[8px]" data-name="Rectangle" />
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[34.87%] right-[34.45%] text-[14px] text-center text-white top-[calc(50%-9.5px)] tracking-[-0.05px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        + Compose
      </p>
    </div>
  );
}

function ButtonComposeMessage() {
  return (
    <div className="absolute inset-[17.85%_63.06%_78.13%_20.42%]" data-name="Button / Compose message">
      <ButtonComposeMessage1 />
    </div>
  );
}

function LeftSide() {
  return (
    <div className="absolute contents inset-[15.61%_61.46%_5.89%_18.68%]" data-name="Left Side">
      <div className="absolute bg-white border-[#b9b9b9] border-[0.3px] border-solid inset-[15.61%_61.46%_5.89%_18.68%] rounded-[14px]" data-name="Bg" />
      <CreateNew />
      <Label />
      <MyEmail />
      <ButtonComposeMessage />
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

function Icon2() {
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

function Icon1() {
  return (
    <div className="absolute contents inset-[27.14%_31.31%_29.29%_66.28%]" data-name="Icon">
      <Icon2 />
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

function Icon3() {
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

function Search2() {
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

function Search1() {
  return (
    <div className="absolute contents inset-[22.86%_61.2%_22.86%_6.49%]" data-name="Search">
      <div className="absolute bg-[#f5f6fa] border-[#d5d5d5] border-[0.6px] border-solid inset-[22.86%_61.2%_22.86%_6.49%] rounded-[19px]" data-name="Bg" />
      <p className="absolute font-['Nunito_Sans:Regular',sans-serif] font-normal leading-[normal] left-[10.24%] opacity-50 right-[86.18%] text-[#202224] text-[14px] text-center top-[calc(50%-9px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Search
      </p>
      <Search2 />
    </div>
  );
}

function NavigationTopBar1() {
  return (
    <div className="absolute contents inset-0" data-name="Navigation / Top Bar #1">
      <div className="absolute bg-white inset-0" data-name="Top Bar Bg" />
      <Profile />
      <English />
      <Icon1 />
      <div className="absolute inset-[25.71%_31.22%_48.57%_67.28%]" data-name="Oval">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
          <path clipRule="evenodd" d={svgPaths.p3896100} fill="var(--fill-0, #F93C65)" fillOpacity="0.613691" fillRule="evenodd" id="Oval" opacity="0.173224" />
        </svg>
      </div>
      <Icon3 />
      <Search1 />
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

function HideBgHideBgCopyMask() {
  return (
    <div className="absolute contents inset-0" data-name="Hide Bg + Hide Bg Copy Mask">
      <div className="absolute bg-white inset-0 opacity-0" data-name="Mask" />
      <div className="absolute bg-[#4880ff] inset-[0_10%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-24px_0px] mask-size-[240px_50px] rounded-[6px]" data-name="Hide Bg" style={{ maskImage: `url('${imgHideBg}')` }} />
      <div className="absolute bg-[#4880ff] inset-[0_98.33%_0_-2.08%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[5px_0px] mask-size-[240px_50px] rounded-[4px]" data-name="Hide Bg Copy" style={{ maskImage: `url('${imgHideBg}')` }} />
    </div>
  );
}

function Products12() {
  return (
    <div className="absolute contents inset-0" data-name="Products">
      <HideBgHideBgCopyMask />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[32.5%] right-[52.08%] text-[14px] text-white top-[calc(50%-9px)] tracking-[0.3px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Inbox
      </p>
      <p className="absolute font-['Gilroy:Medium',sans-serif] leading-[normal] left-[19.17%] not-italic right-[76.25%] text-[22px] text-center text-white top-[calc(50%-12px)]"></p>
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

function Products15() {
  return (
    <div className="absolute contents inset-0" data-name="Products">
      <div className="absolute bg-white inset-0 opacity-0" data-name="Hide Bg" />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[32.5%] right-[37.08%] text-[#202224] text-[14px] top-[calc(50%-9px)] tracking-[0.3px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Dashboard
      </p>
      <p className="absolute font-['Gilroy:Medium',sans-serif] leading-[normal] left-[19.17%] not-italic right-[76.25%] text-[#202224] text-[22px] text-center top-[calc(50%-12px)]"></p>
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
    <div className="bg-white relative size-full" data-name="Dashboard  # 5">
      <MainBgColor />
      <p className="absolute font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[39.93%] opacity-60 right-[49.72%] text-[#202224] text-[14px] top-[calc(50%+494px)]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Showing 1-12 of 1,253
      </p>
      <Indicator />
      <RightSide />
      <LeftSide />
      <p className="absolute font-['Nunito_Sans:Bold',sans-serif] font-bold leading-[normal] left-[18.75%] right-[75.56%] text-[#202224] text-[32px] top-[calc(50%-435px)] tracking-[-0.1143px]" style={{ fontVariationSettings: "\'YTLC\' 500, \'wdth\' 100" }}>
        Inbox
      </p>
      <NavigationTopBar />
      <NavigationSidebarMenuLight />
    </div>
  );
}