// import { useForm } from 'react-hook-form'; // Missing imporclet

// type FormData = {
//   username: string;
//   password: string;
// };

// const DataComponent = () => {
//   // const {
//   //   register,
//   //   handleSubmit,
//   //   formState: { errors, isSubmitting },
//   // } = useForm<FormData>(); // Add type parameter

//   // const onSubmit = async (data: FormData) => {
//   //   // await delay(2) 
//   //   let r = await fetch("http://localhost:3000", {
//   //     method: "POST"})

//   //   let res = await r.text()
//   //   console.log(data, res)
//   // };

//   return (
//     <>
//       {isSubmitting && <div>Loading...</div>}
//       <div className="bg-gray-900 h-[100vh] flex justify-center items-center">
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <input
//             type="text"
//             placeholder="username"
//             {...register("username", {
//               required: "Username is required",
//               minLength: {
//                 value: 3,
//                 message: "Minimum 3 characters"
//               },
//               maxLength: {
//                 value: 8,
//                 message: "Maximum 8 characters"
//               }
//             })}
//             className="placeholder:text-white border-2 border-white mb-10 text-white"
//           />
//           {errors.username && (
//             <div className="text-red-500">
//               {errors.username.message}
//             </div>
//           )}
//           <br />

//           <input
//             type="password" // Changed to lowercase 'password'
//             placeholder="password"
//             {...register("password", {
//               required: "Password is required"
//             })}
//             className="placeholder:text-white border-2 border-white mb-10 text-white"
//           />
//           {errors.password && (
//             <div className="text-red-500">
//               {errors.password.message}
//             </div>
//           )}
//           <br />

//           <input
//             type="submit"
//             value="submit"
//             disabled={isSubmitting}
//             className="border-2 border-white text-white"
//           />
//         </form>
//       </div>
//     </>
//   );
// };

// export default DataComponent;


