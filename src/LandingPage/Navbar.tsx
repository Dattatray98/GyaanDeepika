
const Navbar = () => {
  return (
    <div className="h-[50px] bg-black w-full flex items-center px-3">
      <div>
        <img src="/GyaanDeepika.png" alt="logo" className="h-[40px] cursor-pointer" />
      </div>

      <div className="flex absolute right-[300px] text-white gap-7">
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Services</a>
        <a href="#">Resources</a>
        <a href="# ">Testimonials</a>
        <a href="#">Contact</a>
      </div>

      <div className=" flex gap-7 absolute right-5">
        <button className="border-2 text-orange-500 border-orange-500 px-5 py-1 rounded-[9px] font-medium cursor-pointer">Login</button>
        <button className="border-2 text-white border-white bg-orange-500 px-5 py-1 rounded-[9px] font-medium cursor-pointer">Sing Up</button>
      </div>

    </div>
  )
}

export default Navbar
