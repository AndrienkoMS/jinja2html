const DYNAMIC_INPUT_ERROR_MODAL_ID = 'dynamicInputErrorModal';
const DYNAMIC_INPUT_ERROR_CLOSE_BUTTON_ID = 'dynamicInputErrorCloseButton';
const DYNAMIC_START_PARAMETERS_ID = 'dynamicStartParameters';
const DYNAMIC_VERIFY_PARAMETERS_ID = 'dynamicVerifyParameters';

let dynamicInputErrorModal;
let dynamicInputErrorCloseButton;
let dynamicParameters;
let errorMessage;


function handleOngoingTask(event){
    return;
}


function handleSetupSucceeded(event) {
    try {
        var placeholders = JSON.parse(event.data.definition.content);
    } catch (error) {
        console.error('Error while parsing placeholders to JSON:', error);
        return;
    }
    var html = taskDefinition.querySelector(`#${TASK_DEFINITION_CONTENT_ID}`).innerHTML;
    var regex = /\${(.*?)}/g;
    var matches = html.match(regex);

    if (matches != null) {
    var validPlaceholders = matches.filter(function(match) {
      var placeholder = match.substring(2, match.length - 1).trim();
      return placeholders.hasOwnProperty(placeholder);
    });

    validPlaceholders.forEach(function(match) {
      var placeholder = match.substring(2, match.length - 1).trim();
      var value = placeholders[placeholder];
      html = html.replace(match, value);
    });
    }
    taskDefinition.querySelector(`#${TASK_DEFINITION_CONTENT_ID}`).innerHTML = html;
}


function handleSetupError(event){
    return;
}


function handleEvalReady(event) {
    taskValidationForm.classList.remove('d-none');
    verifyTaskButton.disabled = false;
    abortTaskButton.disabled = false;
    let spans1 = verifyTaskButton.querySelectorAll('span');
    spans1[0].classList.remove('spinner-border');
    spans1[1].innerText = VERIFY;
    let spans2 = abortTaskButton.querySelectorAll('span');
    spans2[0].classList.remove('spinner-border');
    spans2[1].innerText = ABORT;
	if (window.dynamicData && window.dynamicData.verify_params) {
        toggleDynamicData(DYNAMIC_VERIFY_PARAMETERS_ID,window.dynamicData.verify_params, 'enable');
    }
}


function handleEvalBegan(event){
	if (window.dynamicData && window.dynamicData.verify_params) {
        toggleDynamicData(DYNAMIC_VERIFY_PARAMETERS_ID,window.dynamicData.verify_params, 'disable');
    }
}


function handleEvalFailedSucceeded(event){
    let container = taskValidations.querySelector(`#${TASK_VALIDATIONS_ACCORDION_ID}`);
    let index = container.childElementCount + 1;
    let id = `validation-${index}`;
    let content;
    if (typeof event.data.validation == 'object') {
        content = JSON.stringify(event.data.validation, null, 2);
    } else {
        content = event.data.validation;
    }
    taskValidations.classList.remove('d-none');
    const validationResult = JSON.parse(event.data.validation);
    taskValidations.querySelector(`#${TASK_VALIDATIONS_ACCORDION_ID}`).appendChild(buildAccordionItem(
        id, validationResult.result, `Verification ${index}`, content
    ));
    // unlocking buttons
    let spans1 = verifyTaskButton.querySelectorAll('span');
    spans1[0].classList.remove('spinner-border');
    spans1[1].innerText = VERIFY;
    let spans2 = abortTaskButton.querySelectorAll('span');
    spans2[0].classList.remove('spinner-border');
    spans2[1].innerText = ABORT;
    if (event.event == FAILED_EVENT) {
        verifyTaskButton.disabled = false;
        abortTaskButton.disabled = false;
    } else {  // SUCCEEDED_EVENT
        verifyTaskButton.disabled = true;
        abortTaskButton.disabled = true;
        destroymentLoader.classList.remove('d-none');
    }
}


function handleEvalError(event){
    destroymentLoader.classList.remove('d-none');
}


function handleCleanupBegan(event){
// need to add method to prevent errors, as such functions are used
// in another scenarios
    return;
}


function handleCleanupStatus(event){
    let destroyment_content;
    let destroyment_button_color;
    if (typeof event.data.status == 'object') {
        destroyment_content = JSON.stringify(event.data.status, null, 2);
    } else {
        destroyment_content = event.data.status;
    }
    if (typeof destroyment_content === 'string' && destroyment_content.trim() === '') {
        destroyment_button_color = BG_SUCCESS_SUBTLE;
        destroymentContent.innerHTML = SUCCESS_CLEANUP_MESSAGE;
    } else {
        destroyment_button_color = BG_DANGER_SUBTLE;
        destroymentContent.innerHTML = destroyment_content;
    }
    destroymentLoader.classList.add('d-none');
    destroymentNotification.classList.remove('d-none');
    destroymentNotificationButton.classList.remove(BG_SUCCESS_SUBTLE);
    destroymentNotificationButton.classList.remove(BG_DANGER_SUBTLE);
    destroymentNotificationButton.classList.add(destroyment_button_color);
    taskFeedback.querySelector('fieldset').disabled = false;
    taskFeedback.classList.remove('d-none');
}


function handleCleanupFailed(event){
    destroymentNotification.classList.remove('d-none');
    taskFeedback.querySelector('fieldset').disabled = true;
    restartTask.classList.remove('d-none');
    feedbackThank.classList.remove('d-none');
}


function handleCleanupSucceeded(event){
    destroymentNotification.classList.remove('d-none');
    destroymentContent.innerHTML = SUCCESS_CLEANUP_MESSAGE;
    taskFeedback.querySelector('fieldset').disabled = true;
    restartTask.classList.remove('d-none');
    feedbackThank.classList.remove('d-none');
}


function customSubmitFeedbackButton(){
    return;
}

function customRestartTaskButton(){
    return;
}


function showModalWindow(message, modalElement) {
  const modalTitle = modalElement.querySelector('.modal-title');
  const modalBody = modalElement.querySelector('.modal-body');

  modalTitle.textContent = 'Input parameters error';
  modalBody.innerHTML = message;

  const closeButton = modalElement.querySelector('#dynamicInputErrorCloseButton');
  closeButton.addEventListener('click', function() {
    dynamicInputErrorModal.hide();
  });

  dynamicInputErrorModal.show();
}


document.addEventListener('DOMContentLoaded', () => {
    const dynamicInputErrorModal = new bootstrap.Modal(document.getElementById(DYNAMIC_INPUT_ERROR_MODAL_ID));
    const dynamicInputErrorCloseButton = document.getElementById(DYNAMIC_INPUT_ERROR_CLOSE_BUTTON_ID);

    dynamicInputErrorCloseButton.addEventListener('click', (e) => {
        dynamicInputErrorModal.hide();
    });
    startTaskButton.addEventListener('click', async (e) => {
        showResetTaskModalWithDelay(RESET_TASK_DELAY);
        e.preventDefault();
        let dynamicParameters;
        if (window.dynamicData && window.dynamicData.verify_params) {
            dynamicParameters = await gatherAndValidateValues(DYNAMIC_START_PARAMETERS_ID, window.dynamicData.start_params);
        } else {
            dynamicParameters = {};
        }
        if (typeof dynamicParameters === 'string') {
          errorMessage = dynamicParameters;
          const modalBody = document.querySelector(`#${DYNAMIC_INPUT_ERROR_MODAL_ID} .modal-body`);
          modalBody.textContent = errorMessage;
          dynamicInputErrorModal.show();
          return;
        }
        console.log("Starting task");
        body = buildBody('start_task', dynamicParameters);
        console.log("buildBody: ", body);
        this.ws.send(body);
        taskStartForm.classList.add('d-none');
        deploymentLoader.classList.remove('d-none');
        updateElements(window.dynamicData.start_params,
                       window.dynamicData.verify_params,
                       DYNAMIC_START_PARAMETERS_ID,
                       DYNAMIC_VERIFY_PARAMETERS_ID);
    });
    verifyTaskButton.addEventListener('click', async (e) => {
        let dynamicParameters;
        if (window.dynamicData && window.dynamicData.verify_params) {
            dynamicParameters = await gatherAndValidateValues(DYNAMIC_VERIFY_PARAMETERS_ID, window.dynamicData.verify_params);
            toggleDynamicData(DYNAMIC_VERIFY_PARAMETERS_ID,window.dynamicData.verify_params, 'disable');
        } else {
            dynamicParameters = {};
        }

        if (typeof dynamicParameters === 'string') {
          errorMessage = dynamicParameters;
          const modalBody = document.querySelector(`#${DYNAMIC_INPUT_ERROR_MODAL_ID} .modal-body`);
          modalBody.textContent = errorMessage;
          dynamicInputErrorModal.show();
          return;
        }
        console.log('dynamicParameters: ', dynamicParameters);
        verifyTaskButton.disabled = true;
        abortTaskButton.disabled = true;
        let spans = verifyTaskButton.querySelectorAll('span');
        spans[0].classList.add('spinner-border');
        spans[1].innerText = VERIFYING;
        this.ws.send(buildBody('send_input', {
            type: 'submit',
            dynamic_parameters: dynamicParameters
        }));
    });
    abortTaskButton.addEventListener('click', (e) => {
        if (window.dynamicData && window.dynamicData.verify_params) {
            toggleDynamicData(DYNAMIC_VERIFY_PARAMETERS_ID,window.dynamicData.verify_params, 'disable');
        }
        abortTaskButton.disabled = true;
        verifyTaskButton.disabled = true;
        let spans = abortTaskButton.querySelectorAll('span');
        spans[0].classList.add('spinner-border');
        spans[1].innerText = ABORTING;
        this.ws.send(buildBody('send_input', { 'type': 'abort' }));
    });

    console.log('dynamicData', window.dynamicData);
    if (window.dynamicData && window.dynamicData.start_params) {
        appendChildElements(DYNAMIC_START_PARAMETERS_ID, window.dynamicData.start_params);
    } else {
        console.log("No start parameters")
    }
    if (window.dynamicData && window.dynamicData.verify_params) {
        appendChildElements(DYNAMIC_VERIFY_PARAMETERS_ID, window.dynamicData.verify_params);
    } else {
        console.log("No verify parameters")
    }
});

// must be runned after all js is loaded
//setTimeout( () => fetchAndReplayEvents(), 1000);

console.log('jtm js ended!');
console.log("Events fetched:", mock_events_jtm_data);
//replayEvents(mock_events_data);
setTimeout( () => replayEvents(mock_events_jtm_data), 2000);
