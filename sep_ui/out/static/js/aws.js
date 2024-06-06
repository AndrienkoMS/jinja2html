const BONUS_CALCULATION_NOTIFICATION = 'bonusCalculationNotification';

let bonusCalculationNotification;

function handleOngoingTask(event){
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

function handleCleanupFailed(event){
    destroymentNotification.classList.remove('d-none');
    taskFeedback.querySelector('fieldset').disabled = true;
    restartTask.classList.remove('d-none');
    feedbackThank.classList.remove('d-none');
    bonusCalculationNotification.classList.add('d-none');
}

function handleCleanupSucceeded(event){
    destroymentNotification.classList.remove('d-none');
    destroymentContent.innerHTML = SUCCESS_CLEANUP_MESSAGE;
    taskFeedback.querySelector('fieldset').disabled = true;
    restartTask.classList.remove('d-none');
    feedbackThank.classList.remove('d-none');
    bonusCalculationNotification.classList.add('d-none');
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
    bonusCalculationNotification.classList.remove('d-none');
}

function customSubmitFeedbackButton(){
    return;
}

function customRestartTaskButton(){
    return;
}

document.addEventListener('DOMContentLoaded', () => {
    bonusCalculationNotification = document.getElementById(BONUS_CALCULATION_NOTIFICATION);

    startTaskButton.addEventListener('click', (e) => {
        showResetTaskModalWithDelay(RESET_TASK_DELAY);
        e.preventDefault();
        this.ws.send(buildBody('start_task', {
            aws_region: taskStartForm.querySelector('#awsRegionInput').value,
            aws_access_key_id: taskStartForm.querySelector('#awsAccessKeyIdInput').value,
            aws_secret_access_key: taskStartForm.querySelector('#awsSecretAccessKeyInput').value
        }))
        taskStartForm.classList.add('d-none');
        deploymentLoader.classList.remove('d-none');
    });
    verifyTaskButton.addEventListener('click', (e) => {
        verifyTaskButton.disabled = true;
        abortTaskButton.disabled = true;
        let spans = verifyTaskButton.querySelectorAll('span');
        spans[0].classList.add('spinner-border');
        spans[1].innerText = VERIFYING;
        this.ws.send(buildBody('send_input', { 'type': 'submit' }));
    });
    abortTaskButton.addEventListener('click', (e) => {
        abortTaskButton.disabled = true;
        verifyTaskButton.disabled = true;
        let spans = abortTaskButton.querySelectorAll('span');
        spans[0].classList.add('spinner-border');
        spans[1].innerText = ABORTING;
        this.ws.send(buildBody('send_input', { 'type': 'abort' }));
    });
});

// must be runned after all js is loaded
setTimeout( () => fetchAndReplayEvents(), 1000);
