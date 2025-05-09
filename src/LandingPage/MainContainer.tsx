import GetStartedBtn from "../Buttons/GetStartedBtn"


const MainContainer = () => {
    return (
        <div className="bg-[#000] h-[93vh] w-full">
            <div className="absolute top-[100px] left-[30px] sm:left-[50px] md:left-[80px] lg:left-[100px] max-w-[90%] sm:max-w-[80%]">
                <h1
                    data-aos="zoom-out"
                    data-aos-duration="1500"
                    className="text-[#b1ddfa] text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight md:leading-[4rem] font-medium"
                >
                    Empowering Rural Minds,<br />
                    Enlightening <b className="text-amber-200 font-medium">Futures</b>
                </h1>

                <p
                    data-aos="fade-up"
                    data-aos-duration="1300"
                    className="text-[#5a737c] text-base sm:text-lg md:text-xl lg:text-[23px] mt-4 ml-1 sm:ml-2"
                >
                    Bringing world-class education and healthcare resources to underserved areas.
                </p>

                <div className="mt-6">
                    <GetStartedBtn />
                </div>
            </div>

        </div>
    )
}

export default MainContainer
