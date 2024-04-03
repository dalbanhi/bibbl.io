import React from 'react';
import Cookies from 'js-cookie';

let csrftoken = Cookies.get('csrftoken');

const CSRFToken = () => {

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
  
  return (
    <>
      {console.log("token here", csrftoken)}
      {console.log("token here", getCookie("csrftoken"))}
      <input type="hidden" name='csrfmiddlewaretoken' value={getCookie("csrftoken")}></input>
    </>
    
  )
}

export default CSRFToken;