import InputBox from "../components/input";
import { Link, Navigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import AnimationWrapper from "../common/animation";
import { storeInSession } from "../common/session";
import { useContext } from "react";
import { UserContext } from "../App";

const UserAuthForm = ({ type }) => {

    let { userAuth: { access_token }, setUserAuth } = useContext(UserContext);

    console.log(access_token);
    
    const userAuthThroughServer = (formData, serverRoute) => {

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
        .then(({ data }) => {

            storeInSession("user", JSON.stringify(data));

            setUserAuth(data)
            
            // console.log(sessionStorage)

        })
        .catch(({ response }) => {
            console.log(response);
            toast.error(response.data.error);
        })

    }

    const handleSubmit = (e) => {
        
        e.preventDefault(); // stopping form from getting submit

        let serverRoute = type == 'sign_in' ? '/signin' : '/signup';
        
        // validations

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // email for password

        // form data
        let form = new FormData(formElement);
        let formData = {};

        for (let [key, value] of form.entries()) { 
            formData[key] = value
        }
        // console.log(formData, authForm.current);
        let { email, password, fullname } = formData;

        // form validation
        if(fullname){
            if (fullname.length < 3) {
                return toast.error('Full name should be at least 3 letters long');
            }
        }

        if(!email.length) {
            return toast.error("Enter your email")
        }

        if(!emailRegex.test(email)) {
            return toast.error("Invalid email")
        }

        if(!passwordRegex.test(password)) {
            return toast.error("Password should be 6 to 20 characters long with at least 1 numeric, 1 lowercase and 1 uppercase letter")
        }
        

        // sending data to server

        userAuthThroughServer(formData, serverRoute);

    }

    return (
        access_token ? 
        <Navigate to="/" />
        :
        <AnimationWrapper>
         <section className="h-cover flex items-center justify-center">
            <Toaster />
            <form className="w-[80%] max-w-[400px]" id="formElement">
               <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                 {type == "sign_in" ? "Welcome Back" : "Join Us Today"}
               </h1>
   
               {
                   type != "sign_in" ?
                   <InputBox
                     name="fullname"
                     type="text"
                     placeholder="Full Name"
                     icon="fi fi-sr-user"
                   />
                   :""
               }
                   <InputBox
                     name="email"
                     type="email"
                     placeholder="Email"
                     icon="fi fi-sr-envelope"
                   />
   
                   <InputBox
                       name="password"
                       type="password"
                       placeholder="Password"
                       icon="fi fi-sr-key"
                   />
   
                   <button
                       className="btn-dark center mt-14"
                       type="submit"
                       onClick={handleSubmit}
                   >
                       {type.replace("_", " ")}
                   </button>
   
                   <div className="relative w-full flex items-center gap-2  my-10 opacity-10 uppercase text-black font-blod">
                       <hr className="w-1/2 border-black" />
                       <p>or</p>
                       <hr className="w-1/2 border-black" />
                   </div>

                   {
                       type == "sign_in" ? 
                       <p className="mt-6 text-dark-grey text-xl text-center">
                           Don’t have an account ? 
                           <Link
                               className="underline text-black text-xl ml-1"
                               to="/signup"
                           >
                               Join us today 
                           </Link>
                       </p> : 
                       <p className="mt-6 text-dark-grey text-xl text-center">
                           Already a member ?  
                           <Link
                               className="underline text-black text-xl ml-1"
                               to="/signin"
                           >
                               Sign in here
                           </Link>
                       </p>       
                   }  
           </form>
         </section>
       </AnimationWrapper> 
        
    );
};

export default UserAuthForm;
