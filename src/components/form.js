import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import ReCAPTCHA from "react-google-recaptcha";
import {AppConfig} from "../configs"
import axios from 'axios'


const FormContainer = styled.div`
border: 1px solid lightgray;
 display: flex;
 max-width:750px;
 width:90vw;
 margin:30px auto;
 padding: 20px 20px;
 #captcha-expired-info{
     color: red;
     font-weight:500;
   }
`
const ReCAPTCHA_Container = styled.div`
   max-width: 400px;
   width: 96vw;
   margin:10px 0px;
   display: flex;
 
`
const Form = () => {
  const [token, setToken] = useState(null);
  const [expired, setExpired] = useState(false);
  const recaptchaRef = useRef();
  const emailRef = useRef();
  const verificationHandler = (token) => {
    //recaptcha expired
    if (token === null) {
        setExpired(true);
      setToken("");
      return;
    }
    setExpired(false);
    const recaptchaValue = recaptchaRef.current.getValue();
    setToken(recaptchaValue);
  };

  const submissionHandler = (event) =>{
    event.preventDefault();
    console.log(token);
    if(!token){
      alert('please verify captcha')
      return;
    }
    // alert(AppConfig.api + 'users/signup-with-recaptcha');
 
       axios.post(AppConfig.api + 'users/signup-with-recaptcha',{
           token,
           email_value: emailRef.current.value,
       })
       .then((res)=>{
           if(res.data && res.data.success){
            //    alert('signup success')
               console.log(res.data);
           }else{
            //    alert('invalid captcha...please try again') 
                console.log(res.data.error);
           }
       }) 
       .catch((e)=>{
           console.log(e);
       }) 
     recaptchaRef.current.reset();
    emailRef.current.value='';   
    setToken(null);
  }
 
  return (
    <FormContainer id="test-form">
      <div className="app-page">
        <form onSubmit={(event) => submissionHandler(event)}>
          <input type="text" placeholder="Enter your email" ref={emailRef}/>
          {expired && <div id='captcha-expired-info'>
            Captcha expired. Please try again
          </div> 
          }
          <ReCAPTCHA_Container id='grecaptcha-wrapper'>
          <ReCAPTCHA
            sitekey={AppConfig.grecaptcha.siteKey}
            onChange={(token) => verificationHandler(token)}
            ref={recaptchaRef}
            size='normal'
            theme='dark'
          />
          </ReCAPTCHA_Container>
          <button type='submit' >Submit</button>
        </form>
      </div>
    </FormContainer>
  );
}

export default Form;
    