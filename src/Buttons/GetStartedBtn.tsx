import React from 'react';

const GetStartedBtn: React.FC = () => {
  return (
    <button
      data-aos="fade-up"
      data-aos-duration="1800"
      className="stylish-button w-[60vw] sm:w-[40vw] md:w-[30vw] lg:w-[26vh] ml-[10vw] sm:ml-[20vw] md:ml-[30vh] mt-10"
    >
      <span>Get Started</span>
      <span className="arrow">→</span>
      <span className="glow-effect"></span>
    </button>

  );
};

export default GetStartedBtn;
