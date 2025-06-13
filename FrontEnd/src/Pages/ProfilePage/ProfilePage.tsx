import CourseBlock from "./CourseBlock"
import ProfileBlock from "./ProfileBlock"


const Profile = () => {
  return (
    <div className=" bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex justify-center p-2 w-full h-[100vh] flex-wrap">
    <ProfileBlock />
    <CourseBlock />
    </div>
  )
}

export default Profile
