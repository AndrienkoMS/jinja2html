// key elements ids
const FIRST_TEMP_CREDITS_BUTTON_ID = 'firstTempCreditsButton';
const SECOND_TEMP_CREDITS_BUTTON_ID = 'secondTempCreditsButton';
const VALIDATION_CREDITS_MODAL_ID = 'validationCreditsModal';
const VALIDATION_CREDITS_MODAL_CLOSE_BUTTON_ID = 'validationCreditsModalCloseButton';
const VALIDATION_MANAGEMENT_CONSOLE_URL = 'validationManagementConsoleURL';
const VALIDATION_ACCESS_KEY_ID_ID = 'validationAccessKeyId';
const VALIDATION_SECRET_ACCESS_KEY_ID = 'validationSecretAccessKey';
const VALIDATION_SESSION_TOKEN_ID = 'validationSessionToken';
const VALIDATION_LINUX_CREDS_ID = 'validationLinuxCreds';
const VALIDATION_WINDOWS_CREDS_ID = 'validationWindowsCreds';
const VALIDATION_POWERSHELL_CREDS_ID = 'validationPowerShellCreds';
const BONUS_CALCULATION_NOTIFICATION = 'bonusCalculationNotification';

let firstTempCreditsButton;
let secondTempCreditsButton;
let validationCreditsModal;
let validationCreditsModalCloseButton;
let validationManagementConsoleURL;
let validationAccessKeyId;
let validationSecretAccessKey;
let validationSessionToken;
let validationLinuxCreds;
let validationWindowsCreds;
let validationPowerShellCreds;
let bonusCalculationNotification;

function showValidationCredentials(event){
    validationManagementConsoleURL.setAttribute('href', event.data.validationManagementConsoleURL);
    validationAccessKeyId.value = event.data.validationAccessKeyId;
    validationSecretAccessKey.value = event.data.validationSecretAccessKey;
    validationSessionToken.value = event.data.validationSessionToken;
    validationLinuxCreds.innerText = generateLinuxEnvCommands(event);
    validationWindowsCreds.innerText = generateWindowsEnvCommands(event);
    validationPowerShellCreds.innerText = generatePowerShellEnvCommands(event);
    validationCreditsModal.show();
}

function handleOngoingTask(event){
    return;
}

function handleEvalReady(event) {
    taskValidationForm.classList.remove('d-none');
    secondTemporaryCredits.classList.remove('d-none');
    verifyTaskButton.disabled = false;
    abortTaskButton.disabled = false;
    secondTemporaryCredits.classList.remove('d-none');
    let spans1 = verifyTaskButton.querySelectorAll('span');
    spans1[0].classList.remove('spinner-border');
    spans1[1].innerText = VERIFY;
    let spans2 = abortTaskButton.querySelectorAll('span');
    spans2[0].classList.remove('spinner-border');
    spans2[1].innerText = ABORT;
}

function handleEvalBegan(event){
    return;
}

function handleSetupSucceeded(event) {
    updatePlaceholders(TASK_DEFINITION_CONTENT_ID, event.data.definition.content);
}

function handleSetupError(event){
    return;
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

function customSubmitFeedbackButton(){
    return;
}

function customRestartTaskButton(){
    return;
}

document.addEventListener('DOMContentLoaded', () => {
    firstTempCreditsButton = document.getElementById(FIRST_TEMP_CREDITS_BUTTON_ID);
    secondTempCreditsButton = document.getElementById(SECOND_TEMP_CREDITS_BUTTON_ID);
    validationCreditsModal = new bootstrap.Modal(document.getElementById(VALIDATION_CREDITS_MODAL_ID), {});
    validationManagementConsoleURL = document.getElementById(VALIDATION_MANAGEMENT_CONSOLE_URL);
    validationAccessKeyId = document.getElementById(VALIDATION_ACCESS_KEY_ID_ID);
    validationSecretAccessKey = document.getElementById(VALIDATION_SECRET_ACCESS_KEY_ID);
    validationSessionToken = document.getElementById(VALIDATION_SESSION_TOKEN_ID);
    validationCreditsModalCloseButton = document.getElementById(VALIDATION_CREDITS_MODAL_CLOSE_BUTTON_ID);
    validationLinuxCreds = document.getElementById(VALIDATION_LINUX_CREDS_ID);
    validationWindowsCreds = document.getElementById(VALIDATION_WINDOWS_CREDS_ID);
    validationPowerShellCreds = document.getElementById(VALIDATION_POWERSHELL_CREDS_ID);
    bonusCalculationNotification = document.getElementById(BONUS_CALCULATION_NOTIFICATION);

    firstTempCreditsButton.addEventListener('click', (e) => {
        e.preventDefault();
        console.log("Sending get_validation_credentials request");
        this.ws.send(buildBody('get_validation_credentials', {}));
    });
    startTaskButton.addEventListener('click', (e) => {
        showResetTaskModalWithDelay(RESET_TASK_DELAY);
        e.preventDefault();
        this.ws.send(buildBody('start_task', {}));
        taskStartForm.classList.add('d-none');
        deploymentLoader.classList.remove('d-none');
    });
    secondTempCreditsButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.ws.send(buildBody('get_validation_credentials', {}));
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
    validationCreditsModalCloseButton.addEventListener('click', (e) => {
        validationCreditsModal.hide();
    });
});

// must be runned after all js is loaded
//setTimeout( () => fetchAndReplayEvents(), 1000);

console.log('aws_no_credits js ended!');
console.log("Events fetched:", mock_events_data);
setTimeout( () => replayEvents(mock_events_data), 2000);
