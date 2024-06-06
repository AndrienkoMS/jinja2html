// base events
const INIT_STAGE = 'init';
const SETUP_STAGE = 'setup';
const EVAL_STAGE = 'eval';
const CLEANUP_STAGE = 'cleanup';
const ONBOARD_STAGE = 'onboard';
const AI_SUMMARY_STAGE = 'ai_summary';

//batch events
const SETUP_START_JOB_STAGE = 'setup_start_job';
const VERIFY_START_JOB_STAGE = 'verify_start_job';
const CLEAN_START_JOB_STAGE = 'clean_start_job';


const READY_EVENT = 'ready';
const BEGAN_EVENT = 'began';
const STATUS_EVENT = 'status';
const FAILED_EVENT = 'failed';
const SUCCEEDED_EVENT = 'succeeded';
const ERROR_EVENT = 'error';

// key elements ids

const START_TASK_BUTTON_ID = 'startTaskButton';

const VERIFY_TASK_BUTTON_ID = 'verifyTaskButton';
const ABORT_TASK_BUTTON_ID = 'abortTaskButton';
const SUBMIT_FEEDBACK_BUTTON_ID = 'submitFeedbackButton';
const RESTART_TASK_BUTTON_ID = 'restartTaskButton';
const RESET_TASK_BUTTON_ID = 'resetTaskButton';
const RESET_TASK_MODAL_ID = 'resetTaskModal';
const CLOSE_DIALOG_BUTTON_ID = 'closeDialogButton';
const TASK_START_FORM_ID = 'taskStartForm';
const DEPLOYMENT_LOADER_ID = 'deploymentLoader';
const TASK_VALIDATIONS_ID = 'taskValidations';
const TASK_VALIDATIONS_ACCORDION_ID = 'validationsAccordion';
const FIRST_TEMPORARY_CREDITS_ID = 'firstTemporaryCredits';
const TASK_DEFINITION_ID = 'taskDefinition';
const TASK_DEFINITION_CONTENT_ID = 'definitionContent';
const SECOND_TEMPORARY_CREDITS_ID = 'secondTemporaryCredits';
const TASK_VALIDATION_FORM_ID = 'taskValidationForm';
const DESTROYMENT_LOADER_ID = 'destroymentLoader';
const DESTROYMENT_NOTIFICATION_ID = 'destroymentNotification';
const DESTROYMENT_NOTIFICATION_BUTTON_ID = 'destroymentNotificationButton';
const DESTROYMENT_CONTENT_ID = 'destroymentContent';
const TASK_FEEDBACK_ID = 'taskFeedback';
const FEEDBACK_THANK = 'feedbackThank';
const RESTART_TASK_ID = 'restartTask';
const RESTART_LOADER_ID = 'restartLoader';
const LIVE_ALERT_PLACEHOLDER_ID = 'liveAlertPlaceholder';

// WebSocket Config Constants

const EVENTS_URL = '/v1/events'; // v1 - MAJOR version. It should be changed if
                                 // major version will change
                                 // ('/v2/events' for 2nd version and so on

// linebrakes
CMD_LINE_BREAK = '^'
POWERSHELL_LINE_BREAK = '`'
LINUX_LINE_BREAK = '\\'

// labels

const VERIFY = 'Verify';
const VERIFYING = 'Verifying...';
const ABORT = 'Abort';
const ABORTING = 'Aborting...';
const DESTROY = 'Destroy resources';
const DESTROYING = 'Destroying...';
const SUCCESS_CLEANUP_MESSAGE = 'Task resources have been successfully deleted!';

const BG_SUCCESS_SUBTLE = 'bg-success-subtle';
const BG_WARNING_SUBTLE = 'bg-warning-subtle';
const BG_DANGER_SUBTLE = 'bg-danger-subtle';
const RESET_TASK_DELAY = 1800000; // 1000 milliseconds = 1 second
const REFRESH_DELAY = 1000;


let startTaskButton;
let verifyTaskButton;
let abortTaskButton;
let submitFeedbackButton;
let restartTaskButton;
let resetTaskButton;
let closeDialogButton;

let taskStartForm;
let deploymentLoader;
let firstTemporaryCredits;
let taskDefinition;
let secondTemporaryCredits;
let taskValidationForm;
let taskValidations;
let destroymentLoader;
let destroymentNotification;
let taskFeedback;
let feedbackThank;
let restartTask;
let liveAlertPlaceholder;
let resetTaskTimer;
let resetTaskModal;
let restartLoader;

let events; // collects stage events to rebuild page after reload

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


const buildBody = function (action, data) {
    return JSON.stringify({
        action: action,
        data: data
    });
};


function showResetTaskModalWithDelay(delay) {
  resetTaskTimer = setTimeout(function () {
    resetTaskModal.show();
  }, delay);
}


function stopResetTaskTimer() {
  clearTimeout(resetTaskTimer);
    if (resetTaskModal) {
    resetTaskModal.hide(); // Hide the modal if it is shown
  }
}


function generateInnerAccordion(id, description) {
    try {
        const data = JSON.parse(JSON.stringify(description['rules']));
        const innerAccordionContainer = document.createElement('div');
        innerAccordionContainer.className = 'accordion';
        data.forEach((stepData, index) => {
            const color = BG_DANGER_SUBTLE;

            const item = createAccordionItem(
                `${id}-innerAccordion-${index}`, `${stepData.description}`,
                color, 'inner'
            );

            const collapse = document.createElement('div');
            collapse.id = `${id}-innerAccordion-${index}`;
            collapse.className = 'accordion-collapse collapse';

            const body = document.createElement('div');
            body.className = 'accordion-body inner';
            body.style.whiteSpace = 'pre-wrap';
            delete stepData.description;
//              check that json is valid and parse back to have proper endlines instead of "\n"
            body.innerHTML = JSON.stringify(stepData, null, 2);
            collapse.appendChild(body);
            item.style.marginBottom = '1px';
            item.appendChild(collapse);
            innerAccordionContainer.appendChild(item);
        });

        return innerAccordionContainer;
    } catch (error) {
        console.error("Error parsing JSON for inner accordion items:", error);
        return null;
    }
}


function handleIncomingEvent(eventData) {
    console.log('Message received', eventData);
    let event = JenkinsEvent.fromObject(eventData);
    if (!event.isValid()) {
        console.log('Incoming event is not valid jenkins event. Maybe it is an event from adapter');
        if (event.action == 'failed') {
            stopResetTaskTimer();
            appendAlert(event.data.message, 'warning');
            taskStartForm.classList.remove('d-none');
            deploymentLoader.classList.add('d-none');
            handleOngoingTask(event);
        } else if (event.action == 'reload_ui'){
        // need to wait here so dynamodb will be updated on page reload
        console.log(`Sleeping ${REFRESH_DELAY / 1000} seconds`);
        setTimeout(function() {
          location.reload();
        }, REFRESH_DELAY);
            console.log('Reload ui completed');
        } else if (event.action == 'validation_credentials'){
            console.log('event.action == validation_credentials');
            showValidationCredentials(event);
        } else if (event.action == 'execution_credentials'){
            console.log('event.action == execution_credentials');
            showExecutionCredentials(event);
        }
        return;
    }
    // todo dispatch here
    if (event.stage == ONBOARD_STAGE){
        handleOnboard(event);
    } else if (event.stage == CLEAN_START_JOB_STAGE){
        handleCleanStartJob(event);
    } else if (event.stage == INIT_STAGE){
        taskStartForm.classList.add('d-none');
        deploymentLoader.classList.remove('d-none');
    } else if (event.stage == SETUP_START_JOB_STAGE
            && (event.event == FAILED_EVENT || event.event == SUCCEEDED_EVENT)){
        handleSetupStartJobFailedSucceeded(event);
    } else if (event.stage == SETUP_STAGE && event.event == BEGAN_EVENT) {
        taskStartForm.classList.add('d-none');
        deploymentLoader.classList.remove('d-none');
    } else if (event.stage == SETUP_STAGE && event.event == SUCCEEDED_EVENT) {
        // user should see "Reset task" button only in deploymentLoader section
        stopResetTaskTimer();
        taskStartForm.classList.add('d-none');
        handleSetupSucceeded(event);
    } else if (event.stage == SETUP_STAGE && event.event == ERROR_EVENT) {
        // user should see "Reset task" button only in deploymentLoader section
        stopResetTaskTimer();
        taskStartForm.classList.add('d-none');
        handleSetupError(event);
    } else if (event.stage == VERIFY_START_JOB_STAGE
            && (event.event == FAILED_EVENT || event.event == SUCCEEDED_EVENT)){
        handleVerifyStartJobFailedSucceeded(event);
    } else if (event.stage == EVAL_STAGE && event.event == READY_EVENT) {
        stopResetTaskTimer();
        deploymentLoader.classList.add('d-none');
        handleEvalReady(event);
        scrollToBottom();
    } else if (event.stage == EVAL_STAGE && event.event == BEGAN_EVENT) {
        verifyTaskButton.disabled = true;
        abortTaskButton.disabled = true;
        scrollToBottom();
    } else if (event.stage == EVAL_STAGE && event.event == ERROR_EVENT) {
        taskValidationsFailed.classList.remove('d-none');
        handleEvalError(event);
        scrollToBottom();
    } else if (event.stage == EVAL_STAGE && (event.event == FAILED_EVENT || event.event == SUCCEEDED_EVENT)) {
        handleEvalFailedSucceeded(event);
        scrollToBottom();
    } else if (event.stage == AI_SUMMARY_STAGE && event.event == BEGAN_EVENT) {
        handleAISummaryBegan(event);
    } else if (event.stage == AI_SUMMARY_STAGE && (event.event == FAILED_EVENT || event.event == SUCCEEDED_EVENT)) {
        handleAISummaryFailedSucceeded(event);
    } else if (event.stage == AI_SUMMARY_STAGE && event.event == ERROR_EVENT) {
        handleAISummaryError(event);
    } else if (event.stage == CLEANUP_STAGE && event.event == BEGAN_EVENT) {
        taskStartForm.classList.add('d-none');
        verifyTaskButton.disabled = true;
        abortTaskButton.disabled = true;
        let spans1 = verifyTaskButton.querySelectorAll('span');
        spans1[0].classList.remove('spinner-border');
        spans1[1].innerText = VERIFY;
        let spans2 = abortTaskButton.querySelectorAll('span');
        spans2[0].classList.remove('spinner-border');
        spans2[1].innerText = ABORT;
        // user should see "Reset task" button only in deploymentLoader section
        stopResetTaskTimer();
        deploymentLoader.classList.add('d-none');
        destroymentLoader.classList.remove('d-none');
        handleCleanupBegan(event);
        scrollToBottom();
    } else if (event.stage == CLEANUP_STAGE && event.event == STATUS_EVENT) {
        handleCleanupStatus(event);
        scrollToBottom();
    } else if (event.stage == CLEANUP_STAGE && event.event == FAILED_EVENT) {
        destroymentLoader.classList.add('d-none');
        taskFeedback.classList.remove('d-none');
        handleCleanupFailed(event);
        scrollToBottom();
    } else if (event.stage == CLEANUP_STAGE && event.event == SUCCEEDED_EVENT) {
        destroymentLoader.classList.add('d-none');
        taskFeedback.classList.remove('d-none');
        handleCleanupSucceeded(event);
        scrollToBottom();
    }
}


// if html page will be rebooted it would collect events
// and then rebuild it to actual stage
function fetchAndReplayEvents() {
  fetchEvents()
    .then((eventsData) => {
      if (!eventsData.items || eventsData.items.length === 0) {
        console.log("No events fetched. Starting new task");
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


//function fetchEvents() {
//  return fetch(EVENTS_URL, { method: "GET" })
//    .then((response) => {
//      return response.json();
//    })
//    .catch((error) => {
//      console.error("Fetch error:", error);
//    });
//}


function scrollToBottom() {
    console.log('Scrolling page');
    const scrollHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
    );
    const clientHeight = document.documentElement.clientHeight;
    const scrollPosition = scrollHeight - clientHeight;
    window.scroll({
        top: scrollPosition,
        left: 0,
        behavior: 'smooth'
    });
}


function createAccordionItem(id, title, color, className = '') {
    const item = document.createElement('div');
    item.className = `accordion-item ${className}`;

    const header = document.createElement('h2');
    header.className = 'accordion-header';

    const button = document.createElement('button');
    button.className = `accordion-button collapsed ${color}`;
    button.setAttribute('type', 'button');
    button.setAttribute('data-bs-toggle', 'collapse');
    button.setAttribute('data-bs-target', `#${id}`);
    button.setAttribute('aria-expanded', 'false');
//    button.setAttribute('aria-controls', id);
    button.textContent = title;

    header.appendChild(button);
    item.appendChild(header);

    return item;
}


function createAccordionBody(id, description) {
    const collapse = document.createElement('div');
    collapse.id = id;
    collapse.className = 'accordion-collapse collapse';

    const body = document.createElement('div');
    body.className = 'accordion-body';
    body.style.whiteSpace = 'normal';

    // Append the content generated by generateInnerAccordion
    const innerAccordionContent = generateInnerAccordion(id, description);
    body.appendChild(innerAccordionContent);

    collapse.appendChild(body);
    return collapse;
}


const buildAccordionItem = function (id, result, title, description) {
    const color = result === 'success' ? BG_SUCCESS_SUBTLE : BG_DANGER_SUBTLE;
    const item = createAccordionItem(id, title, color);
    const body = createAccordionBody(id, description);
    item.appendChild(body);
    return item;
}


const appendAlert = (message, type) => {
    let wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    liveAlertPlaceholder.append(wrapper)
}

//const setupWebSocket = () => {
//    console.log('Initializing socket connection');
//    this.ws = new WebSocket(`{{ web_socket_url }}`)
//    this.ws.onerror = function (e) {
//        console.error('Web socket is in error', e);
//    };
//    this.ws.onopen = function (e) {
//        console.log('Web socket is open');
//    };
//    this.ws.onmessage = function (e) {
//        handleIncomingEvent(JSON.parse(e.data));
//    };
//    this.ws.onclose = function () {
//        console.log('Web socket is closed');
//        setTimeout(setupWebSocket, 1000);
//    };
//}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Document was loaded');
//    setupWebSocket();
    startTaskButton = document.getElementById(START_TASK_BUTTON_ID);
    verifyTaskButton = document.getElementById(VERIFY_TASK_BUTTON_ID);
    abortTaskButton = document.getElementById(ABORT_TASK_BUTTON_ID);
    submitFeedbackButton = document.getElementById(SUBMIT_FEEDBACK_BUTTON_ID);
    restartTaskButton = document.getElementById(RESTART_TASK_BUTTON_ID);
    resetTaskButton = document.getElementById(RESET_TASK_BUTTON_ID);
    closeDialogButton = document.getElementById(CLOSE_DIALOG_BUTTON_ID);
    taskStartForm = document.getElementById(TASK_START_FORM_ID);
    deploymentLoader = document.getElementById(DEPLOYMENT_LOADER_ID);
    firstTemporaryCredits = document.getElementById(FIRST_TEMPORARY_CREDITS_ID);
    taskDefinition = document.getElementById(TASK_DEFINITION_ID);
    secondTemporaryCredits = document.getElementById(SECOND_TEMPORARY_CREDITS_ID);
    taskValidationForm = document.getElementById(TASK_VALIDATION_FORM_ID);
    taskValidations = document.getElementById(TASK_VALIDATIONS_ID);
    destroymentLoader = document.getElementById(DESTROYMENT_LOADER_ID);
    destroymentNotification = document.getElementById(DESTROYMENT_NOTIFICATION_ID);
    destroymentNotificationButton = document.getElementById(DESTROYMENT_NOTIFICATION_BUTTON_ID);
    destroymentContent = document.getElementById(DESTROYMENT_CONTENT_ID);
    taskFeedback = document.getElementById(TASK_FEEDBACK_ID);
    feedbackThank = document.getElementById(FEEDBACK_THANK);
    restartTask = document.getElementById(RESTART_TASK_ID);
    restartLoader = document.getElementById(RESTART_LOADER_ID);
    liveAlertPlaceholder = document.getElementById(LIVE_ALERT_PLACEHOLDER_ID);
    resetTaskModal = new bootstrap.Modal(document.getElementById(RESET_TASK_MODAL_ID));


    submitFeedbackButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.ws.send(buildBody('send_feedback', {
            type: 'send_feedback',
            parameters: {
                feedback_score: taskFeedback.querySelector('#feedbackScoreInput').value,
                feedback_comments: taskFeedback.querySelector('#feedbackCommentInput').value
            }
        }));
        taskFeedback.querySelector('fieldset').disabled = true;
        feedbackThank.classList.remove('d-none');
        customSubmitFeedbackButton();
    });
    restartTaskButton.addEventListener('click', (e) => {
        this.ws.send(buildBody('restart_task', {}));
        customRestartTaskButton();
        deploymentLoader.classList.add('d-none');
        secondTemporaryCredits.classList.add('d-none');
        taskValidationForm.classList.add('d-none');
        taskValidations.classList.add('d-none');
        taskValidationsFailed.classList.add('d-none');
        destroymentNotification.classList.add('d-none');
        taskFeedback.classList.add('d-none');
        restartTask.classList.add('d-none');
        restartLoader.classList.remove('d-none');
        console.log('restarting');
    });
    resetTaskButton.addEventListener('click', (e) => {
        this.ws.send(buildBody('reset_task', {}));
        deploymentLoader.classList.add('d-none');
        taskDefinition.classList.add('d-none');
        secondTemporaryCredits.classList.add('d-none');
        taskFeedback.classList.remove('d-none');
        console.log('reseting task');
    });
    closeDialogButton.addEventListener('click', (e) => {
        resetTaskModal.hide();
        showResetTaskModalWithDelay(RESET_TASK_DELAY);
    });
});

console.log('main.js loaded');
//window.onload = function() {
//  fetchAndReplayEvents();
//}