const secondsToAppend = document.getElementById('second');
const minutestoAppend = document.getElementById('minute');
const hourstoAppend = document.getElementById('hour');
const workedList = document.getElementById('worked');
const popup = document.getElementById('popup');
const popupButton = document.getElementsByClassName('popup-button');
const body = document.getElementsByClassName('main-body')[0];
let title = document.getElementById('title');
let actualLoop;
let currentWork = [];
let currentTitle;
let timeStart, timeEnd, verifiedTime, startDate, endDate;
let minutes, hours, afterNoon;
let totalHours = 0;
let totalMinutes = 0;
let totalSeconds = 0;

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
  }
var csrftoken = getCookie('csrftoken');
  function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
  }
$.ajaxSetup({
  beforeSend: function(xhr, settings) {
      if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
          xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
  }
});

let formatTime = function(hoursToVerify, minutesToVerify) {
  afterNoon = "PM";
  if (hoursToVerify < 12) {
    afterNoon = "AM";
    hours = hoursToVerify;
  } else {
    hours = parseInt(hoursToVerify) - 12;
    if (hours === 0) {
      hours = 12;
    }
  }
  if (minutesToVerify < 10) {
    minutes = "0" + minutesToVerify;
  } else {
    minutes = minutesToVerify;
  }
  verifiedTime = hours + ":" + minutes + " " + afterNoon;
  return verifiedTime;
};

let updateTotalTime = function(){
  if (totalSeconds >= 60) {
    totalSeconds -= 60;
    totalMinutes++;
  }
  if (totalMinutes >= 60) {
    totalMinutes -= 60;
    totalHours++;
  }
  document.getElementById('workedTotal').innerHTML = totalHours + " - Hours : " + totalMinutes + " - Minutes : " + totalSeconds + " - Seconds";
};

let formatDate = function() {
  let day = new Date().getDate();
  let month = new Date().getMonth() + 1;
  let year = new Date().getFullYear();
  let todayDate = month + '/' + day + '/' + year;
  return todayDate;
};

let showPopup = function(buttonText, titleText) {
  document.getElementById('popup-prompt').innerHTML = titleText;
  document.getElementsByClassName('popup-button')[0].id = buttonText;
  document.getElementsByClassName('popup-button')[0].innerHTML = buttonText;
  popup.classList.remove('popup-hidden');
  for (let i = 0; i < popupButton.length; i++) {
    popupButton[i].classList.remove('popup-hidden');
  }
  body.classList.add('body-hidden');
};

let hidePopup = function() {
  popup.classList.add('popup-hidden');
  body.classList.remove('body-hidden');
  document.getElementsByClassName('popup-button')[0].id = "";
  document.getElementById('popup-prompt').innerHTML = "";
  for (let i = 0; i < popupButton.length; i++) {
    popupButton[i].classList.add('popup-hidden');
  }
};

let clearLog = function() {
  workedList.innerHTML = null;
  updateTotalTime();
};

let trackTime = function(initialTime) {
  let currentMinutes = 0;
  let currentSeconds = 0;
  let currentHours = 0;
  let currentTimes = (Date.now() - initialTime) / 1000;
  currentSeconds = Math.floor(currentTimes);
  while (currentSeconds > 60) {
    if (currentMinutes < 59) {
      currentMinutes++;
    } else {
      currentMinutes = 0;
      currentHours++;
    }
    currentSeconds -= 60;
  }
  if ($('#second').text() != currentSeconds.toString()) {
    secondsToAppend.innerHTML = currentSeconds;
  }
  if ($('#minute').text() != currentMinutes.toString() && currentMinutes !== 0) {
    minutestoAppend.innerHTML = currentMinutes;
  } else if (currentMinutes === 0) {
    if (minutestoAppend.innerHTML != "None Yet!"){
      minutestoAppend.innerHTML = "None Yet!";
    }
  }
  if ($('#hour').text() != currentHours.toString() && currentHours !== 0) {
    hourstoAppend.innerHTML = currentHours;
  } else if (currentHours === 0) {
    if (hourstoAppend.innerHTML != "None Yet!") {
      hourstoAppend.innerHTML = "None Yet!";
    }
  }
  currentWork.splice(0, 1, currentSeconds);
  currentWork.splice(1, 1, currentMinutes);
  currentWork.splice(2, 1, currentHours);
};

let createLoop = function() {
  let timeStarted = Date.now();
  actualLoop = setInterval(function(){
    trackTime(timeStarted);
  }, 10);
};

let startTimeLoop = function() {
  if (!actualLoop){
    title.disabled = true;
    createLoop();
    let hours = new Date().getHours();
    let minutes = new Date().getMinutes();
    formatTime(hours, minutes);
    timeStart = verifiedTime;
    minutestoAppend.innerHTML = "None Yet!";
    hourstoAppend.innerHTML = "None Yet!";
    startDate = formatDate();
  } else {
    return;
  }
}

document.getElementById('start-prompt').onclick = function() {
   if (!actualLoop){
     let titleText;
     if (title.value !== "") {
       titleText = "<h3>" + title.value.toString() + "</h3> is the correct title for this project?";
     } else {
       titleText = "<h3>Default</h3> is the correct title for this project?";
     }
     let buttonText = "Start";
     if (currentTitle === title.value && title.value !== "") {
      startTimeLoop();
      } else {
        showPopup(buttonText, titleText);
        document.getElementById('Start').onclick = function() {
          hidePopup();
          startTimeLoop();
        };
      }
  } else {
    return;
  }
};

document.getElementById('Cancel').onclick = function() {
  hidePopup();
};

document.getElementById('stop').onclick = function() {
  if (actualLoop) {
    clearInterval(actualLoop);
    actualLoop = null;
    let loggedHours, loggedMinutes;
    let loggedSeconds, projectTitle;
    let saveText = null;
    let saveButton = 'Save';
    let hours = new Date().getHours();
    let minutes = new Date().getMinutes();
    formatTime(hours, minutes);
    timeEnd = verifiedTime;
    endDate = formatDate();
    if (title.value !== ""){
      projectTitle = title.value;
    } else {
      projectTitle = "Default";
    }
    totalSeconds += currentWork[0];
    loggedSeconds = currentWork[0];
    if (currentWork[1]) {
      totalMinutes += currentWork[1];
      loggedMinutes = currentWork[1];
      saveText = '<p>Do you want to record the project: ' +
        '<h3 style="display: inline; margin: 0;">' + projectTitle + '</h3></p><p>'+
        'Started: ' + startDate + ' | ' + timeStart + '</p><p> -- ' + loggedMinutes +
        ' minutes/' + loggedSeconds + ' seconds -- </p><p>Ended: ' + endDate +
        ' | ' + timeEnd + '</p>';
    }
    if (currentWork[2]) {
      totalHours += currentWork[2];
      loggedHours = currentWork[2];
      saveText = '<p>Do you want to record the project: ' +
        '<h3 style="display: inline;">' + projectTitle + '</h3></p><p>'+
        'Started: ' + startDate + ' | ' + timeStart + '</p><p> -- ' + loggedHours +
        ' hours/ ' + loggedMinutes + ' minutes/' + loggedSeconds +
        ' seconds -- </p><p>Ended: ' + endDate + ' | ' + timeEnd + '</p>';
    }
    if (!saveText){
      saveText = '<p>Do you want to record the project: ' +
        '<h3 style="display: inline; margin: 0;">' + projectTitle + '</h3></p><p>'+
        'Started: ' + startDate + ' | ' + timeStart + '</p><p> -- ' + loggedSeconds +
        ' seconds -- </p><p>Ended: ' + endDate + ' | ' + timeEnd + '</p>';
    }
    showPopup(saveButton, saveText);
    document.getElementById('Save').onclick = function() {
      hidePopup();
      $.ajax({
        url : "update_times/", // the endpoint
        type : "POST", // http method
        data : {
          title : projectTitle,
          startDate : startDate,
          hours : loggedHours,
          minutes : loggedMinutes,
          seconds : loggedSeconds,
          started : timeStart,
          ended : timeEnd,
          endDate : endDate
        }, // data sent with the post request

        // handle a successful response
        success : function(json) {
          console.log(json); // log the returned json to the console
          $('<li>' + json + '</li>').prependTo(workedList);
          console.log("success"); // another sanity check
        },
        // handle a non-successful response
        error : function(xhr,errmsg,err) {
          console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
      });
      updateTotalTime();
    };
    currentTitle = title.value;
    title.disabled = false;
    currentWork = [];
  } else {
    return;
  }
};

document.getElementById('clear-prompt').onclick = function() {
  let titleText = "Are you sure you want to clear the visible log?";
  let buttonText = "Clear";
  if (!actualLoop) {
    showPopup(buttonText, titleText);
    document.getElementById('Clear').onclick = function() {
      secondsToAppend.innerHTML = "0.000";
      totalSeconds = 0;
      totalMinutes = 0;
      totalHours = 0;
      clearLog();
      hidePopup();
    };
  }
};

window.onbeforeunload = confirmExit;
function confirmExit() {
    return "You have attempted to leave this page. Are you sure?";
}


$('#project-title').on('keyup keypress', function(event) {
  var enterKey = event.keyCode || event.which;
  if (enterKey === 13) {
    event.preventDefault();
    if (!actualLoop) {
      document.getElementById('start-prompt').click();
    }
    return false;
  }
  if (enterKey === 32) {
    event.preventDefault();
    return false;
  }
});
