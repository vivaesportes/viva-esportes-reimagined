
import ElegantShape from "./ElegantShape";

const HeroBackground = () => {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-viva-blue/20 to-viva-darkBlue/80 blur-3xl" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ElegantShape
          delay={0.25}
          width={640}
          height={160}
          rotate={14}
          gradient="from-viva-yellow/[0.14]"
          className="left-[-12vw] md:left-[-10vw] top-[8%] md:top-[14%]"
        />
        <ElegantShape
          delay={0.4}
          width={480}
          height={130}
          rotate={-13}
          gradient="from-viva-red/[0.22]"
          className="right-[-7vw] md:right-[-2vw] top-[71%] md:top-[76%]"
        />
        <ElegantShape
          delay={0.38}
          width={340}
          height={80}
          rotate={-8}
          gradient="from-viva-blue/[0.12]"
          className="left-[12vw] md:left-[17vw] bottom-[7%] md:bottom-[17%]"
        />
        <ElegantShape
          delay={0.55}
          width={180}
          height={60}
          rotate={17}
          gradient="from-viva-yellow/[0.13]"
          className="right-[17vw] md:right-[21vw] top-[15%] md:top-[19%]"
        />
        <ElegantShape
          delay={0.6}
          width={125}
          height={42}
          rotate={-27}
          gradient="from-viva-red/[0.17]"
          className="left-[27vw] md:left-[33vw] top-[5%] md:top-[11%]"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#01010a] via-transparent to-[#01010a]/80 pointer-events-none" />
    </>
  );
};

export default HeroBackground;
