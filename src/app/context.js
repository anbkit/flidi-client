import React from "react";
const state = {
    loginVisible:false,
    signupVisible:false,
    showModalLogin:()=>{
    },
    hideModalLogin:()=>{
    },
    showModalSignup:()=>{
    },
    hideModalSignup:()=>{
    }
};
export const AppContext = React.createContext(state); 