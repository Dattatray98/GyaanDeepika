import CourseBlock from "./CourseBlock"
import ProfileBlock from "./ProfileBlock"


const Profile = () => {
  return (
    <div className=" bg-[#f3f4f6] flex justify-center p-2 w-full h-[100vh] flex-wrap">
    <ProfileBlock />
    <CourseBlock />
    </div>
  )
}

export default Profile
