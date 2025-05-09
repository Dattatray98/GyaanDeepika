import React from 'react';

const GetStartedBtn: React.FC = () => {
  return (
      <button data-aos="fade-up" data-aos-duration="1800"  className="stylish-button">
        <span>Get Started</span>
        <span className="arrow">→</span>
        <span className="glow-effect"></span>
      </button>
  );
};

export default GetStartedBtn;
