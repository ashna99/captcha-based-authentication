import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import ReCAPTCHA from "react-google-recaptcha";
import {AppConfig} from "../configs"


const FormContainer = styled.div`
border: 1px solid lightgray;
 display: flex;
 max-width:750px;
 width:90vw;
 margin:30px auto;
 padding: 20px 20px;
`
const ReCAPTCHA_Container = styled.div`
   max-width: 400px;
   width: 96vw;
   margin:10px 0px;
   display: flex;
   #captcha-expired-info{
     color: red;
     font-weight:500;
   }
`
const Form = () => {
  const [token, setToken] = useState(null);
  const [expired, setExpired] = useState(false);
  const [error, setError] = useState("");
  const recaptchaRef = useRef();
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
    if(!token){
      alert('please verify captcha')
      return;
    }
       setError("");
     recaptchaRef.current.reset();

  }
  useEffect(() => {
    console.log(token);
  }, [setToken]);
  return (
    <FormContainer id="test-form">
      <div className="app-page">
        <form onSubmit={(event) => submissionHandler(event)}>
          <input type="text" placeholder="Enter your email" />
          <ReCAPTCHA_Container id='grecaptcha-wrapper'>
          {expired && <div id='captcha-expired-info'>
            Captcha expired. Please try again
          </div> 
          }
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
    