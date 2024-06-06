// jenkins events
const ONBOARD_STAGE = 'onboard';

const BEGAN_EVENT = 'began';
const FAILED_EVENT = 'failed';
const SUCCEEDED_EVENT = 'succeeded';


const LOADING_ONBOARD_ID = 'loadingOnboard';
const FAILED_ONBOARD_ID = 'failedOnboard';
const SUCCEEDED_ONBOARD_ID = 'succeededOnboard';
const ONBOARD_START_TEXT_ID = 'onboardStartText';
const ONBOARD_IN_PROGRESS_TEXT_ID = 'onboardInProgressText';

// WebSocket Config Constants

const EVENTS_URL = '/v1/events'; // v1 - MAJOR version. It should be changed if
                                 // major version will change
                                 // ('/v2/events' for 2nd version and so on


let loadingOnboard;
let failedOnboard;
let succeededOnboard;
let onboardStartText;
let onboardInProgressText;

if (false) {  // or false
    console.log = () => { };
}

class JenkinsEvent {
    constructor(action, data) {
        this._action = action;  // string "[stage]:[event]"
        this._data = data;  // object
    }
    get stage() {
        return this._action.split(':')[0];
    }
    get event() {
        return this._action.split(':')[1];
    }
    set action(value) {
        if (value.split(':').length != 2) {
            console.warn(`Event came not from jenkins: ${value}`);
        }
        this._action = value;
    }
    get action() {
        return this._action;
    }
    get data() {
        return this._data;
    }
    static fromObject(obj) {
        return new JenkinsEvent(obj.action, obj.data);
    }
    isValid() {
        try {
            return Boolean(this.stage && this.event);
        } catch (error) {
            console.warn(`Error occurred checking whether the event is valid: ${error}`)
            return false;
        }

    }
}


function handleIncomingEvent(eventData) {
    console.log('Message received', eventData);
    let event = JenkinsEvent.fromObject(eventData);
    if (!event.isValid()) {
        console.log('Incoming event is not valid jenkins event. Maybe it is an event from adapter');
    } else if (event.stage == ONBOARD_STAGE){
        handleOnboard(event);
    }
}


// if html page will be rebooted it would collect events
// and then rebuild it to actual stage
function fetchAndReplayEvents() {
  fetchEvents()
    .then((eventsData) => {
      if (!eventsData.items || eventsData.items.length === 0) {
        console.log("No events fetched. Starting onboarding");
      } else {
        console.log("Events fetched:", eventsData);
        replayEvents(eventsData);
      }
    })
}


function replayEvents(eventsData) {
  eventsData.items.forEach((eventData) => {
    handleIncomingEvent(eventData);
  });
}


function fetchEvents() {
  return fetch(EVENTS_URL, { method: "GET" })
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}


function handleOnboard(event) {
    if (event.event == BEGAN_EVENT){
        onboardStartText.classList.add('d-none');
        onboardInProgressText.classList.remove('d-none');
    } else if (event.event == FAILED_EVENT){
        loadingOnboard.classList.add('d-none');
        failedOnboard.classList.remove('d-none');
    } else if (event.event == SUCCEEDED_EVENT){
        loadingOnboard.classList.add('d-none');
        succeededOnboard.classList.remove('d-none');
    }
}


const setupWebSocket = () => {
    console.log('Initializing socket connection');
    this.ws = new WebSocket(`{{ web_socket_url }}`)
    this.ws.onerror = function (e) {
        console.error('Web socket is in error', e);
    };
    this.ws.onopen = function (e) {
        console.log('Web socket is open');
    };
    this.ws.onmessage = function (e) {
        handleIncomingEvent(JSON.parse(e.data));
    };
    this.ws.onclose = function () {
        console.log('Web socket is closed');
        setTimeout(setupWebSocket, 1000);
    };
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Document was loaded');
    setupWebSocket();
    loadingOnboard = document.getElementById(LOADING_ONBOARD_ID);
    failedOnboard = document.getElementById(FAILED_ONBOARD_ID);
    succeededOnboard = document.getElementById(SUCCEEDED_ONBOARD_ID);
    onboardStartText = document.getElementById(ONBOARD_START_TEXT_ID);
    onboardInProgressText = document.getElementById(ONBOARD_IN_PROGRESS_TEXT_ID);
});

// must be runned after all js is loaded
setTimeout( () => fetchAndReplayEvents(), 1000);