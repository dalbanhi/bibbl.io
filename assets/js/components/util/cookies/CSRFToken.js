import React from 'react';
import Cookies from 'js-cookie';

let csrftoken = Cookies.get('csrftoken');

const CSRFToken = () => {
  
  return (
    <>
      {console.log("token here", csrftoken)}
      <input type="hidden" name='csrfmiddlewaretoken' value={csrftoken}></input>
    </>
    
  )
}

export default CSRFToken;