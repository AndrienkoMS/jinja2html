// key elements ids
const FIRST_TEMP_CREDITS_BUTTON_ID = 'firstTempCreditsButton';
const SECOND_TEMP_CREDITS_BUTTON_ID = 'secondTempCreditsButton';
const VALIDATION_CREDITS_MODAL_ID = 'validationCreditsModal';
const VALIDATION_CREDITS_MODAL_CLOSE_BUTTON_ID = 'validationCreditsModalCloseButton';
const EXECUTION_CREDITS_MODAL_ID = 'executionCreditsModal';
const EXECUTION_CREDITS_MODAL_CLOSE_BUTTON_ID ='executionCreditsModalCloseButton';
const AI_SUMMARY_SWITCH_ID = 'AISummarySwitch';
const AI_SUMMARY_LOADER_ID = 'AISummaryLoader';
const AI_SUMMARY_ERROR_ALERT_TEMPLATE_ID = 'AISummaryErrorAlertTemplate';
const AI_SUMMARY_ERROR_ALERT_PLACEHOLDER_ID = 'AISummaryErrorAlertPlaceholder';
const AI_SUMMARY_ACCORDION = 'AISummaryAccordion';
const AI_SUMMARY_ACCORDION_BUTTON_ID = 'AISummaryAccordionButton';
const AI_SUMMARY_CONTENT_ID = 'AISummaryContent';
const EXECUTOR_FAILED_ID = 'executorFailed';
const TASK_VALIDATIONS_FAILED_ID = 'taskValidationsFailed';
const TASK_VALIDATIONS_FAILED_CLOSE_BUTTON_ID = 'taskValidationsFailedCloseButton';
const DESTROY_RESOURCES_BUTTON_ID = 'destroyResources';
const VALIDATION_MANAGEMENT_CONSOLE_URL = 'validationManagementConsoleURL';
const VALIDATION_ACCESS_KEY_ID_ID = 'validationAccessKeyId';
const VALIDATION_SECRET_ACCESS_KEY_ID = 'validationSecretAccessKey';
const VALIDATION_SESSION_TOKEN_ID = 'validationSessionToken';
const EVAL_ERROR_MESSAGE_ID = 'evalErrorMessage';

const EXECUTION_REGION_ID = 'executionRegion';
const EXECUTION_BUCKET_ID = 'executionBucket';
const EXECUTION_ACCESS_KEY_ID_ID = 'executionAccessKeyId';
const EXECUTION_SECRET_KEY = 'executionSecretKey';
const EXECUTION_SESSION_TOKEN = 'executionSessionToken';
const EXECUTION_PREFIX_ID = 'executionPrefix';
const EXECUTION_SUFFIX_ID = 'executionSuffix';
const SYNDICATE_GENERATE_LINUX_ID ='syndicateGenerateLinux';
const SYNDICATE_GENERATE_WINDOWS_ID = 'syndicateGenerateWindows';
const SYNDICATE_GENERATE_POWERSHELL_ID = 'syndicateGeneratePowerShell';
const SYNDICATE_UPDATE_CREDENTIALS_ID = 'syndicateUpdateCredentials';

const DYNAMIC_START_PARAMETERS_ID = 'dynamicStartParameters';
const DYNAMIC_VERIFY_PARAMETERS_ID = 'dynamicVerifyParameters';
const DESTROY_TO_PROCEED_NOTIFICATION_ID = 'destroyToProceedNotification';
const DESTROY_RESOURCES_NOTIFICATION_BUTTON_ID= 'destroyResourcesNotificationButton';


let firstTempCreditsButton;
let secondTempCreditsButton;
let validationCreditsModal;
let validationCreditsModalCloseButton;
let executionCreditsModal;
let executionCreditsModalCloseButton;
let destroyResourcesButton;
let destroyToProceedNotification;
let destroyResourcesNotificationButton;
let validationManagementConsoleURL;
let validationAccessKeyId;
let validationSecretAccessKey;
let validationSessionToken;
let executionRegion;
let executionBucket;
let executionAccessKeyId;
let executionSecretKey;
let executionSessionToken;
let executionPrefix;
let executionSuffix;
let syndicateGenerateLinux;
let syndicateGenerateWindows;
let syndicateGeneratePowerShell;
let syndicateUpdateCredentials;
let AISummarySwitch;
let AISummaryLoader;
let AISummaryErrorAlertTemplate;
let AISummaryErrorAlertPlaceholder;
let AISummaryAccordion;
let AISummaryAccordionButton;
let AISummaryContent;
let executorFailed;
let taskValidationsFailed;
let taskValidationsFailedCloseButton;
let evalErrorMessage;

let dynamicParameters;

function copyToClipboard(id) {
  var element = document.querySelector(`#${CSS.escape(id)}`);

  if (element) {
    var text = element.tagName.toLowerCase() === "input" ? element.value : element.innerText;
    navigator.clipboard.writeText(text);
  }
}

function generateSyndicateConfigCommand(event, lineBreakSymbol) {
    return `syndicate generate config --name "dev" ${lineBreakSymbol}
    --region "${event.data.executionRegion}" ${lineBreakSymbol}
    --bundle_bucket_name "${event.data.executionBucket}/${event.data.studentID}/${event.data.taskID}" ${lineBreakSymbol}
    --prefix "${event.data.executionPrefix}" ${lineBreakSymbol}
    --extended_prefix True ${lineBreakSymbol}
    --iam_permissions_boundary "arn:aws:iam::${event.data.executionAccountId}:policy/eo_role_boundary" ${lineBreakSymbol}
    --access_key "${event.data.executionAccessKeyId}" ${lineBreakSymbol}
    --secret_key "${event.data.executionSecretKey}" ${lineBreakSymbol}
    --session_token "${event.data.executionSessionToken}"`;
}

function generateSyndicateCredentialsText(event) {
    return `expiration: ${event.data.executionExpiration}
temp_aws_access_key_id: ${event.data.executionAccessKeyId}
temp_aws_secret_access_key: ${event.data.executionSecretKey}
temp_aws_session_token: ${event.data.executionSessionToken}`;
}

function showExecutionCredentials(event){
    executionRegion.value = event.data.executionRegion;
    executionBucket.value = event.data.executionBucket + "/" + event.data.studentID + "/" + event.data.taskID;
    executionAccessKeyId.value = event.data.executionAccessKeyId;
    executionSecretKey.value = event.data.executionSecretKey;
    executionSessionToken.value = event.data.executionSessionToken;
    executionPrefix.value = event.data.executionPrefix;
//    executionSuffix.value = event.data.executionSuffix;
    syndicateGenerateLinux.innerText = generateSyndicateConfigCommand(event, LINUX_LINE_BREAK);
    syndicateGenerateWindows.innerText = generateSyndicateConfigCommand(event, CMD_LINE_BREAK);
    syndicateGeneratePowerShell.innerText = generateSyndicateConfigCommand(event, POWERSHELL_LINE_BREAK);
    syndicateUpdateCredentials.innerText = generateSyndicateCredentialsText(event);
    executionCreditsModal.show();
}

function showValidationCredentials(event){
    validationManagementConsoleURL.setAttribute('href', event.data.validationManagementConsoleURL);
    validationAccessKeyId.value = event.data.validationAccessKeyId;
    validationSecretAccessKey.value = event.data.validationSecretAccessKey;
    validationSessionToken.value = event.data.validationSessionToken;
    validationCreditsModal.show();
}

const buildSREAccordionItem = function (id, result, title, description) {
    const color = result === 'success' ? BG_SUCCESS_SUBTLE : BG_DANGER_SUBTLE;
    // for sre tasks title should be in format like: 'validation-*: some_issue_description

    const sre_title = id + ': ' + title;
    const item = createAccordionItem(id, sre_title, color);
    const body = createAccordionBody(id, description);
    item.appendChild(body);
    return item;
}

function handleOngoingTask(event){
    startTaskButton.style.display = 'block';
    verifyTaskButton.style.display = 'none';
    verifyTaskButton.disabled = false;
    abortTaskButton.disabled = true;
    let spans = verifyTaskButton.querySelectorAll('span');
    spans[0].classList.remove('spinner-border');
    spans[1].innerText = VERIFY;
}

function handleSetupStartJobFailedSucceeded(event){
    // we are here when (event.stage == SETUP_START_JOB_STAGE)
    if (event.event == SUCCEEDED_EVENT){
        stopResetTaskTimer();
        taskStartForm.classList.add('d-none');
        deploymentLoader.classList.remove('d-none');
    } else if (event.event == FAILED_EVENT){
        taskStartForm.classList.add('d-none');
        executorFailed.classList.remove('d-none');
        scrollToBottom();
    }
}

function handleSetupError(event){
    executorFailed.classList.remove('d-none');
}

function handleVerifyStartJobFailedSucceeded(event){
    // we are here when (event.stage == VERIFY_START_JOB_STAGE)
    if (event.event == SUCCEEDED_EVENT){
        verifyTaskButton.disabled = true;
        abortTaskButton.disabled = true;
        destroyResourcesButton.disabled = true;
        let spans = verifyTaskButton.querySelectorAll('span');
        spans[0].classList.add('spinner-border');
        spans[1].innerText = VERIFYING;
    } else if (event.event == FAILED_EVENT){
        executorFailed.classList.remove('d-none');
        startTaskButton.disabled = true;
        verifyTaskButton.disabled = true;
        abortTaskButton.disabled = true;
        let spans = verifyTaskButton.querySelectorAll('span');
        spans[0].classList.remove('spinner-border');
        spans[1].innerText = VERIFY;
        scrollToBottom();
    }
}

function handleCleanStartJob(event){
    // we are here when (event.stage == CLEAN_START_JOB_STAGE)
    if (event.event == SUCCEEDED_EVENT){
        taskValidationsFailed.classList.add('d-none');
        let spans = destroyResourcesButton.querySelectorAll('span');
        spans[0].classList.add('spinner-border');
        spans[1].innerText = DESTROYING;
        destroyResourcesButton.disabled = true;
        destroyToProceedNotification.classList.add('d-none');
        scrollToBottom();
    }
}

function handleEvalReady(event) {
    let spans = destroyResourcesButton.querySelectorAll('span');
    spans[0].classList.remove('spinner-border');
    spans[1].innerText = DESTROY;
    let spans1 = verifyTaskButton.querySelectorAll('span');
    spans1[0].classList.remove('spinner-border');
    spans1[1].innerText = VERIFY;
    let spans2 = abortTaskButton.querySelectorAll('span');
    spans2[0].classList.remove('spinner-border');
    spans2[1].innerText = ABORT;

    verifyTaskButton.disabled = false;
    abortTaskButton.disabled = false;
    destroyResourcesButton.disabled = true;
}

function handleSetupSucceeded(event) {
    let container = taskValidations.querySelector(`#${TASK_VALIDATIONS_ACCORDION_ID}`);
    try {
        const steps = event.data.validation_steps;
        const innerAccordionContainer = document.createElement('div');
        innerAccordionContainer.className = 'accordion';
        steps.forEach(stepData => {
            let index = container.childElementCount + 1;
            const id = stepData.index;
            const title = stepData.description;
            const description = stepData.meta;
            const stepResult = 'failed';
            const isStepPassed = stepData.step_passed !== undefined ? stepData.step_passed : false;
            const buttonClass = isStepPassed ? BG_SUCCESS_SUBTLE : BG_DANGER_SUBTLE;

            taskValidations.querySelector(`#${TASK_VALIDATIONS_ACCORDION_ID}`)
                .appendChild(buildSREAccordionItem(id, stepResult, title, description));
        });
    } catch (error) {
        console.error("Error parsing JSON for inner accordion items:", error);
        return null;
    }
    // unlocking buttons
    taskValidations.classList.remove('d-none');
//    let spans1 = verifyTaskButton.querySelectorAll('span');
//    spans1[0].classList.remove('spinner-border');
//    spans1[1].innerText = VERIFY;
//    let spans2 = abortTaskButton.querySelectorAll('span');
//    spans2[0].classList.remove('spinner-border');
//    spans2[1].innerText = ABORT;
    deploymentLoader.classList.add('d-none');
    abortTaskButton.disabled = true;
    destroyResourcesButton.disabled = true;
//    AISummarySwitch.disabled = false;
}

function handleEvalFailedSucceeded(event){
    let container = taskValidations.querySelector(`#${TASK_VALIDATIONS_ACCORDION_ID}`);
    const accordions = container.querySelectorAll('.accordion-item:not(.inner)');

    accordions.forEach(a => {
        const description = a.querySelector('.accordion-button').innerText;

        const accordionItems = a.querySelectorAll('.accordion-item');
        accordionItems.forEach(item => {
            const button = item.querySelector('.accordion-button');
            const content = item.querySelector('.inner').innerText;
            button.classList.remove(BG_DANGER_SUBTLE);
            button.classList.remove(BG_SUCCESS_SUBTLE);
            if (isStored(description, content, event.data.validation_steps)){
                button.classList.add(BG_DANGER_SUBTLE);
            } else {
                button.classList.add(BG_SUCCESS_SUBTLE);
            }
        })
    });

    // unlocking buttons
    let spans1 = verifyTaskButton.querySelectorAll('span');
    spans1[0].classList.remove('spinner-border');
    spans1[1].innerText = VERIFY;
    let spans2 = abortTaskButton.querySelectorAll('span');
    spans2[0].classList.remove('spinner-border');
    spans2[1].innerText = ABORT;
    abortTaskButton.disabled = true;
    destroyResourcesButton.disabled = false;
    AISummarySwitch.disabled = false;
    if (event.event == SUCCEEDED_EVENT){
        destroyToProceedNotification.classList.remove('d-none');
    }
}

function handleEvalError(event){
    let spans = verifyTaskButton.querySelectorAll('span');
    spans[0].classList.remove('spinner-border');
    spans[1].innerText = VERIFY;
    if (event.data.error_message) {
        evalErrorMessage.innerText = event.data.error_message;
        evalErrorMessage.classList.remove('d-none');
    }
    verifyTaskButton.disabled = true;
    abortTaskButton.disabled = true;
    destroyResourcesButton.disabled = false;
}

function handleAISummaryBegan(event){
    AISummaryLoader.classList.remove('d-none');
}

function handleAISummaryFailedSucceeded(event){
    AISummaryLoader.classList.add('d-none');
    if (event.event == SUCCEEDED_EVENT){
        AISummaryAccordionButton.classList.remove(BG_DANGER_SUBTLE);
        AISummaryAccordionButton.classList.add(BG_SUCCESS_SUBTLE);
    } else {
        AISummaryAccordionButton.classList.remove(BG_SUCCESS_SUBTLE);
        AISummaryAccordionButton.classList.add(BG_DANGER_SUBTLE);
    }
    AISummaryContent.innerHTML = event.data.summary;
    AISummaryAccordion.classList.remove('d-none');
    AISummaryAccordion.scrollIntoView({ behavior: 'smooth' });
}

function handleAISummaryError(event){
    AISummaryLoader.classList.add('d-none');
    let newAlert = AISummaryErrorAlertTemplate.cloneNode(true);
    newAlert.classList.remove('d-none');
    AISummaryErrorAlertPlaceholder.appendChild(newAlert);
}

function handleCleanupBegan(event){
    destroyToProceedNotification.classList.add('d-none');
    AISummarySwitch.disabled = true;
}

function handleCleanupStatus(event){
    return;
}

function handleCleanupFailed(event){
    verifyTaskButton.disabled = true;
    abortTaskButton.disabled = true;
    let spans = destroyResourcesButton.querySelectorAll('span');
    spans[0].classList.remove('spinner-border');
    spans[1].innerText = DESTROY;
    let data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
    if (data.unblock_feedback) {
        console.log('Unblocking feedback fields');
        taskFeedback.querySelector('fieldset').disabled = false;
    } else {
        feedbackThank.classList.remove('d-none');
        restartTask.classList.remove('d-none');
        feedbackThank.classList.remove('d-none');
    }
}

function handleCleanupSucceeded(event){
    verifyTaskButton.disabled = true;
    abortTaskButton.disabled = true;
    let spans = destroyResourcesButton.querySelectorAll('span');
    spans[0].classList.remove('spinner-border');
    spans[1].innerText = DESTROY;
    destroymentContent.innerHTML = SUCCESS_CLEANUP_MESSAGE;
//    let data = JSON.parse(event.data);
    let data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
    if (data.unblock_feedback) {
        console.log('Unblocking feedback fields');
        taskFeedback.querySelector('fieldset').disabled = false;
    } else {
        feedbackThank.classList.remove('d-none');
        restartTask.classList.remove('d-none');
        feedbackThank.classList.remove('d-none');
    }
}

function customSubmitFeedbackButton(){
    restartTask.classList.remove('d-none');
    feedbackThank.classList.remove('d-none');
}

function customRestartTaskButton(){
    AISummaryAccordion.classList.add('d-none');
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
    executionCreditsModal = new bootstrap.Modal(document.getElementById(EXECUTION_CREDITS_MODAL_ID), {});
    executionRegion = document.getElementById(EXECUTION_REGION_ID);
    executionBucket = document.getElementById(EXECUTION_BUCKET_ID);
    executionAccessKeyId = document.getElementById(EXECUTION_ACCESS_KEY_ID_ID);
    executionSecretKey = document.getElementById(EXECUTION_SECRET_KEY);
    executionSessionToken = document.getElementById(EXECUTION_SESSION_TOKEN);
    executionPrefix = document.getElementById(EXECUTION_PREFIX_ID);
    executionSuffix = document.getElementById(EXECUTION_SUFFIX_ID);
    syndicateGenerateLinux = document.getElementById(SYNDICATE_GENERATE_LINUX_ID);
    syndicateGenerateWindows = document.getElementById(SYNDICATE_GENERATE_WINDOWS_ID);
    syndicateGeneratePowerShell = document.getElementById(SYNDICATE_GENERATE_POWERSHELL_ID);
    syndicateUpdateCredentials = document.getElementById(SYNDICATE_UPDATE_CREDENTIALS_ID);
    executionCreditsModalCloseButton = document.getElementById(EXECUTION_CREDITS_MODAL_CLOSE_BUTTON_ID);

    AISummarySwitch = document.getElementById(AI_SUMMARY_SWITCH_ID);
    AISummaryLoader = document.getElementById(AI_SUMMARY_LOADER_ID);
    AISummaryErrorAlertTemplate = document.getElementById(AI_SUMMARY_ERROR_ALERT_TEMPLATE_ID);
    AISummaryErrorAlertPlaceholder = document.getElementById(AI_SUMMARY_ERROR_ALERT_PLACEHOLDER_ID);
    AISummaryContent = document.getElementById(AI_SUMMARY_CONTENT_ID);
    AISummaryAccordion = document.getElementById(AI_SUMMARY_ACCORDION);
    AISummaryAccordionButton = document.getElementById(AI_SUMMARY_ACCORDION_BUTTON_ID);
    executorFailed = document.getElementById(EXECUTOR_FAILED_ID);
    taskValidationsFailed = document.getElementById(TASK_VALIDATIONS_FAILED_ID);
    taskValidationsFailedCloseButton = document.getElementById(TASK_VALIDATIONS_FAILED_CLOSE_BUTTON_ID);
    destroyResourcesButton = document.getElementById(DESTROY_RESOURCES_BUTTON_ID);
    destroyToProceedNotification = document.getElementById(DESTROY_TO_PROCEED_NOTIFICATION_ID);
    destroyResourcesNotificationButton = document.getElementById(DESTROY_RESOURCES_NOTIFICATION_BUTTON_ID);
    evalErrorMessage = document.getElementById(EVAL_ERROR_MESSAGE_ID);

    firstTempCreditsButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.ws.send(buildBody('get_validation_credentials', {}));
    });
    secondTempCreditsButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.ws.send(buildBody('get_validation_credentials', {}));
    });

    startTaskButton.addEventListener('click', async (e) => {
        e.preventDefault();
        let dynamicParameters;
        if (window.dynamicData && window.dynamicData.start_params) {
          dynamicParameters = await gatherAndValidateValues(DYNAMIC_START_PARAMETERS_ID, window.dynamicData.start_params);
        } else {
          dynamicParameters = {};
        }
        body = buildBody('start_task', {
            dynamic_parameters: dynamicParameters
        });
        console.log("buildBody: ", body)
        this.ws.send(body);
        taskStartForm.classList.add('d-none');
        deploymentLoader.classList.remove('d-none');
    });
    verifyTaskButton.addEventListener('click', async (e) => {
        e.preventDefault();
        dynamicParameters = await gatherAndValidateValues(DYNAMIC_VERIFY_PARAMETERS_ID, window.dynamicData.verify_params);
        console.log('dynamicParameters: ', dynamicParameters);
        if (dynamicParameters) {
            this.ws.send(buildBody('send_input', {
                type: VERIFY_START_JOB_STAGE,
                dynamic_parameters: dynamicParameters
            }));
        }
        else {
            console.log('Dynamic parameters error');
            return;
        }
        verifyTaskButton.disabled = true;
        abortTaskButton.disabled = true;
        let spans = verifyTaskButton.querySelectorAll('span');
        spans[0].classList.add('spinner-border');
        spans[1].innerText = VERIFYING;
        executorFailed.classList.add('d-none');
    });
    abortTaskButton.addEventListener('click', (e) => {
        abortTaskButton.disabled = true;
        verifyTaskButton.disabled = true;
        this.ws.send(buildBody('send_input', { 'type': 'abort' }));
        taskFeedback.querySelector('fieldset').disabled = false;
        taskFeedback.classList.remove('d-none');
        scrollToBottom();
    });
    destroyResourcesButton.addEventListener('click', (e) => {
        taskValidationsFailed.classList.add('d-none');
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
    AISummarySwitch.addEventListener('change', (e) => {
    if (e.target.checked) {
      console.log('Eda recommendations enabled');
      this.ws.send(buildBody('get_ai_summary', {}));
    } else {
      console.log('Eda recommendations disabled');
      AISummaryAccordion.classList.add('d-none')
    }
  });
    validationCreditsModalCloseButton.addEventListener('click', (e) => {
        validationCreditsModal.hide();
    });
    executionCreditsModalCloseButton.addEventListener('click', (e) => {
        executionCreditsModal.hide();
    });
    taskValidationsFailedCloseButton.addEventListener('click', (e) => {
        taskValidationsFailed.classList.add('d-none');
    });

    console.log('dynamicData', window.dynamicData);
    appendChildElements(DYNAMIC_START_PARAMETERS_ID, window.dynamicData.start_params);
    appendChildElements(DYNAMIC_VERIFY_PARAMETERS_ID, window.dynamicData.verify_params);
});

// must be runned after all js is loaded
//setTimeout( () => fetchAndReplayEvents(), 1000);

console.log('sre js ended!');
console.log("Events fetched:", mock_events_data);
//replayEvents(mock_events_data);
setTimeout( () => replayEvents(mock_events_data), 1000);
// if it wouldn't work can try next:
//window.handleEvalFailedSucceeded = function
//<script async defer src="{{ static('js/syndicate.js') }}"></script>
