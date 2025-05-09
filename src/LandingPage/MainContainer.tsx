import GetStartedBtn from "../Buttons/GetStartedBtn"


const MainContainer = () => {
    return (
        <div className="bg-[#000] h-[93vh] w-full">
            <div className="absolute top-[150px] left-[100px]">
                <h1 data-aos="zoom-out" data-aos-duration="1500" className="text-[#b1ddfa] text-7xl leading-26 font-medium">Empowering Rural Minds,<br /> Enlightening <b className="text-amber-200 font-medium">Futures</b></h1>
                <p data-aos="fade-up" data-aos-duration="1300" className="text-[#5a737c] text-[23px] ml-2">Bringing world-class education and healthcare resources to underserved areas.</p>

                <GetStartedBtn />

            </div>
        </div>
    )
}

export default MainContainer
