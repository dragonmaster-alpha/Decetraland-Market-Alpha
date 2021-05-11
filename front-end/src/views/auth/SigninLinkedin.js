import React, { useState, useEffect } from 'react'
import axios from "axios";

const SigninLinkedin = (props) => {

    console.log(props.location.search)
    var search = props.location.search.split("&");
    var code = search[0].substr(6);
    console.log(code)
    var redirect_uri = encodeURI("http://localhost:8000/signin-linkedin")
    var client_id = "78h4kkaooe3g65";
    var client_secret = "VHWLFDFIWux9lUW6"
    axios.post("https://www.linkedin.com/oauth/v2/accessToken?client_id="+client_id+
                "&client_secret="+client_secret+
                "&grant_type=authorization_code&redirect_uri="+redirect_uri+
                "&code="+code, {
      headers:{
      "Content-Type": "application/x-www-form-urlencoded",
      
      },

  }).then(function (response){
    console.log("got an access token");
    console.log(response);
    localStorage.setItem('token', response.access_token);
    localStorage.setItem('authType', 'linkedin')
  }).catch(err => {
    console.error("link err: "+err);
  });
  
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
    </div>
  )
}

export default SigninLinkedin
