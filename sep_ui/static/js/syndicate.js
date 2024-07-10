// key elements ids
const FIRST_TEMP_CREDITS_BUTTON_ID = 'firstTempCreditsButton';
const SECOND_TEMP_CREDITS_BUTTON_ID = 'secondTempCreditsButton';
const VALIDATION_CREDITS_MODAL_ID = 'validationCreditsModal';
const VALIDATION_CREDITS_MODAL_CLOSE_BUTTON_ID = 'validationCreditsModalCloseButton';
const PASSWORD_VISIBILITY_ID = 'passwordVisibility';
const DESTROY_RESOURCES_BUTTON_ID = 'destroyResources';
const VALIDATION_MANAGEMENT_CONSOLE_URL = 'validationManagementConsoleURL';
const VALIDATION_ACCESS_KEY_ID_ID = 'validationAccessKeyId';
const VALIDATION_SECRET_ACCESS_KEY_ID = 'validationSecretAccessKey';
const VALIDATION_SESSION_TOKEN_ID = 'validationSessionToken';

const REPOSITORY_INPUT_ID = 'repositoryInput';
const WRONG_REPOSITORY_MODAL_ID = 'wrongRepositoryModal';
const WRONG_REPOSITORY_MODAL_CLOSE_BUTTON_ID = 'wrongRepositoryCloseButton';
const DESTROY_TO_PROCEED_NOTIFICATION_ID = 'destroyToProceedNotification';
const DESTROY_RESOURCES_NOTIFICATION_BUTTON_ID= 'destroyResourcesNotificationButton';
const BONUS_CALCULATION_NOTIFICATION = 'bonusCalculationNotification';

let firstTempCreditsButton;
let secondTempCreditsButton;
let destroyResourcesButton;
let destroyToProceedNotification;
let destroyResourcesNotificationButton;
let validationManagementConsoleURL;
let validationAccessKeyId;
let validationSecretAccessKey;
let validationSessionToken;
let bonusCalculationNotification;

function copyToClipboard(id) {
  var inputElement = document.querySelector(`#${CSS.escape(id)}`);

  if (inputElement &&
      inputElement.tagName.toLowerCase() === "input" &&
      inputElement.type === "text") {
    inputElement.select();
    navigator.clipboard.writeText(inputElement.value);
    inputElement.setSelectionRange(0, 0);
  }
}

function showValidationCredentials(event){
    validationManagementConsoleURL.setAttribute('href', event.data.validationManagementConsoleURL);
    validationAccessKeyId.value = event.data.validationAccessKeyId;
    validationSecretAccessKey.value = event.data.validationSecretAccessKey;
    validationSessionToken.value = event.data.validationSessionToken;
    validationCreditsModal.show();
}

function handleOngoingTask(event){
    return;
}

function handleSetupSucceeded(event) {
    return;
}

function handleEvalReady(event) {
    secondTemporaryCredits.classList.remove('d-none');
    let spans = destroyResourcesButton.querySelectorAll('span');
    spans[0].classList.remove('spinner-border');
    spans[1].innerText = DESTROY;
    let spans1 = verifyTaskButton.querySelectorAll('span');
    spans1[0].classList.remove('spinner-border');
    spans1[1].innerText = VERIFY;
    let spans2 = abortTaskButton.querySelectorAll('span');
    spans2[0].classList.remove('spinner-border');
    spans2[1].innerText = ABORT;
    if (!taskValidationForm.classList.contains('d-none')) {
        //  any except first run check =>
        repositoryInput.disabled = false;
    }
    verifyTaskButton.disabled = false;
    abortTaskButton.disabled = false;
    destroyResourcesButton.disabled = true;
    //  don't put that line before if => used as a first run check!
    taskValidationForm.classList.remove('d-none');
}


function handleEvalBegan(event){
    return;
}


function handleEvalBegan(event){
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
    repositoryInput.disabled = true;
    verifyTaskButton.disabled = true;
    abortTaskButton.disabled = true;
    destroyResourcesButton.disabled = false;
    if (event.event == SUCCEEDED_EVENT){
        destroyToProceedNotification.classList.remove('d-none');
    }
}

function handleEvalError(event){
    destroymentLoader.classList.remove('d-none');
}

function handleCleanupBegan(event){
    destroyToProceedNotification.classList.add('d-none');
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
    destroyResourcesButton.disabled = true;
    let spans = destroyResourcesButton.querySelectorAll('span');
    spans[0].classList.remove('spinner-border');
    spans[1].innerText = DESTROY;
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

function isValidRepositoryInput(repositoryInputValue) {
    if (repositoryInputValue.startsWith('http')) {
        return true;
    }
    wrongRepositoryModal.show();
    return false;
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
    bonusCalculationNotification = document.getElementById(BONUS_CALCULATION_NOTIFICATION);

    repositoryInput = document.getElementById(REPOSITORY_INPUT_ID);
    wrongRepositoryModal = new bootstrap.Modal(document.getElementById(WRONG_REPOSITORY_MODAL_ID), {});
    wrongRepositoryCloseButton = document.getElementById(WRONG_REPOSITORY_MODAL_CLOSE_BUTTON_ID);
    passwordVisibility = document.getElementById(PASSWORD_VISIBILITY_ID);
    destroyResourcesButton = document.getElementById(DESTROY_RESOURCES_BUTTON_ID);
    destroyToProceedNotification = document.getElementById(DESTROY_TO_PROCEED_NOTIFICATION_ID);
    destroyResourcesNotificationButton = document.getElementById(DESTROY_RESOURCES_NOTIFICATION_BUTTON_ID);

    firstTempCreditsButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.ws.send(buildBody('get_validation_credentials', {}));
    });
    startTaskButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.ws.send(buildBody('start_task', {}));
        taskStartForm.classList.add('d-none');
        deploymentLoader.classList.remove('d-none');
    });
    secondTempCreditsButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.ws.send(buildBody('get_validation_credentials', {}));
    });
    passwordVisibility.addEventListener('click', (e) => {
        const type = repositoryInput.getAttribute('type') === 'password' ? 'text' : 'password';
        repositoryInput.setAttribute('type', type);
        passwordVisibility.querySelector('i').classList.toggle('fa-eye-slash');
    });
    verifyTaskButton.addEventListener('click', (e) => {
        e.preventDefault();
        let repositoryInputValue = taskValidationForm.querySelector('#repositoryInput').value;
        if (!isValidRepositoryInput(repositoryInputValue)) return;
        verifyTaskButton.disabled = true;
        repositoryInput.disabled = true;
        abortTaskButton.disabled = true;
        let spans = verifyTaskButton.querySelectorAll('span');
        spans[0].classList.add('spinner-border');
        spans[1].innerText = VERIFYING;
        this.ws.send(buildBody('send_input', {
            type: 'syndicate_verify',
            parameters: {
                repository: taskValidationForm.querySelector('#repositoryInput').value
            }
        }));
    });
    abortTaskButton.addEventListener('click', (e) => {
        abortTaskButton.disabled = true;
        verifyTaskButton.disabled = true;
        let spans = abortTaskButton.querySelectorAll('span');
        spans[0].classList.add('spinner-border');
        spans[1].innerText = ABORTING;
        this.ws.send(buildBody('send_input', { 'type': 'syndicate_abort' }));
    });
    destroyResourcesButton.addEventListener('click', (e) => {
        let spans = destroyResourcesButton.querySelectorAll('span');
        spans[0].classList.add('spinner-border');
        spans[1].innerText = DESTROYING;
        destroyResourcesButton.disabled = true;
        destroyToProceedNotification.classList.add('d-none');
        this.ws.send(buildBody('send_input', { 'type': 'destroy_resources' }));
    });
    destroyResourcesNotificationButton.addEventListener('click', (e) => {
        let spans = destroyResourcesButton.querySelectorAll('span');
        spans[0].classList.add('spinner-border');
        spans[1].innerText = DESTROYING;
        destroyResourcesButton.disabled = true;
        destroyToProceedNotification.classList.add('d-none');
        this.ws.send(buildBody('send_input', { 'type': 'destroy_resources' }));
    });
    validationCreditsModalCloseButton.addEventListener('click', (e) => {
        validationCreditsModal.hide();
    });
    wrongRepositoryCloseButton.addEventListener('click', (e) => {
        wrongRepositoryModal.hide();
    });
});

// must be runned after all js is loaded
setTimeout( () => fetchAndReplayEvents(), 1000);
// if it wouldn't work can try next:
//window.handleEvalFailedSucceeded = function
//<script async defer src="{{ static('js/syndicate.js') }}"></script>
