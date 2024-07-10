// key elements ids
const FIRST_TEMP_CREDITS_BUTTON_ID = 'firstTempCreditsButton';
const SECOND_TEMP_CREDITS_BUTTON_ID = 'secondTempCreditsButton';
const VALIDATION_CREDITS_MODAL_ID = 'validationCreditsModal';
const VALIDATION_CREDITS_MODAL_CLOSE_BUTTON_ID = 'validationCreditsModalCloseButton';
const EXECUTION_CREDITS_MODAL_ID = 'executionCreditsModal';
const EXECUTION_CREDITS_MODAL_CLOSE_BUTTON_ID ='executionCreditsModalCloseButton';
//const AI_SUMMARY_SWITCH_ID = 'AISummarySwitch';
const AI_SUMMARY_LOADER_ID = 'AISummaryLoader';
const AI_SUMMARY_ERROR_ALERT_TEMPLATE_ID = 'AISummaryErrorAlertTemplate';
const AI_SUMMARY_ERROR_ALERT_PLACEHOLDER_ID = 'AISummaryErrorAlertPlaceholder';
const AI_SUMMARY_ACCORDION = 'AISummaryAccordion';
const AI_SUMMARY_ACCORDION_BUTTON_ID = 'AISummaryAccordionButton';
const AI_SUMMARY_CONTENT_ID = 'AISummaryContent';
const EXECUTOR_FAILED_ID = 'executorFailed';
const TASK_VALIDATIONS_FAILED_ID = 'taskValidationsFailed';
const TASK_VALIDATIONS_FAILED_CLOSE_BUTTON_ID = 'taskValidationsFailedCloseButton';
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
const VALIDATION_LINUX_CREDS_ID = 'validationLinuxCreds';
const VALIDATION_WINDOWS_CREDS_ID = 'validationWindowsCreds';
const VALIDATION_POWERSHELL_CREDS_ID = 'validationPowerShellCreds';

const DYNAMIC_START_PARAMETERS_ID = 'dynamicStartParameters';
const DYNAMIC_VERIFY_PARAMETERS_ID = 'dynamicVerifyParameters';
const DESTROY_TO_PROCEED_NOTIFICATION_ID = 'destroyToProceedNotification';
const DESTROY_RESOURCES_NOTIFICATION_BUTTON_ID= 'destroyResourcesNotificationButton';

const INCORRECTLY_DELETED_MESSAGE = 'Resource was incorrectly deleted. Task should be started from scratch. Please, abort the task and try again.';

let firstTempCreditsButton;
let secondTempCreditsButton;
let validationCreditsModal;
let validationCreditsModalCloseButton;
let executionCreditsModal;
let executionCreditsModalCloseButton;
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
let validationLinuxCreds;
let validationWindowsCreds;
let validationPowerShellCreds;
//let AISummarySwitch;
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
    validationLinuxCreds.innerText = generateLinuxEnvCommands(event);
    validationWindowsCreds.innerText = generateWindowsEnvCommands(event);
    validationPowerShellCreds.innerText = generatePowerShellEnvCommands(event);
    validationCreditsModal.show();
}


function createInnerAccordionItem(id, index, stepData) {
    const color = BG_DANGER_SUBTLE;
    const item = createAccordionButton(
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
    // Check that JSON is valid and parse back to have proper endlines instead of "\n"
    body.innerHTML = JSON.stringify(stepData, null, 2);
    collapse.appendChild(body);
    item.style.marginBottom = '1px';
    item.appendChild(collapse);

    return item;
}

function generateSREInnerAccordion(id, description) {
    try {
        const data = JSON.parse(JSON.stringify(description['rules']));
        const innerAccordionContainer = document.createElement('div');
        innerAccordionContainer.className = 'accordion';
        data.forEach((stepData, index) => {
            const item = createInnerAccordionItem(id, index, stepData);
            innerAccordionContainer.appendChild(item);
        });
        return innerAccordionContainer;
    } catch (error) {
        console.error("Error parsing JSON for inner accordion items:", error);
        return null;
    }
}

function itemToSREInnerAccordion(id, index, description) {
    try {
        const stepData = description;
        const item = createInnerAccordionItem(id, index, stepData);
        return item;
    } catch (error) {
        console.error("Error parsing JSON for inner accordion items:", error);
        return null;
    }
}


const buildSREAccordionItem = function (id, result, title, description) {
    const color = result === 'success' ? BG_SUCCESS_SUBTLE : BG_DANGER_SUBTLE;
    // for sre tasks title should be in format like: 'validation-*: some_issue_description
    const sre_title = title;
    const item = createAccordionButton(id, sre_title, color);
    const innerAccordionContent = generateSREInnerAccordion(id, description);
    const body = createAccordionBody(id, description, innerAccordionContent);
    item.appendChild(body);
    return item;
}


function handleOngoingTask(event){
    return;
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
    restartTask.classList.remove('d-none');
}


function handleVerifyStartJobFailedSucceeded(event){
    // we are here when (event.stage == VERIFY_START_JOB_STAGE)
    if (window.dynamicData && window.dynamicData.verify_params) {
        toggleDynamicData(DYNAMIC_VERIFY_PARAMETERS_ID,window.dynamicData.verify_params, 'disable');
    }
    if (event.event == SUCCEEDED_EVENT){
        verifyTaskButton.disabled = true;
        abortTaskButton.disabled = true;
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


function handleCleanStartJobSucceeded(event){
    taskValidationsFailed.classList.add('d-none');
    destroyToProceedNotification.classList.add('d-none');
    abortTaskButton.disabled = true;
    verifyTaskButton.disabled = true;
    destroymentLoader.classList.remove('d-none');
    scrollToBottom();
}


function handleCleanStartJobFailed(event){
    executorFailed.classList.remove('d-none');
    scrollToBottom();
}


function handleSetupSucceeded(event) {
    updatePlaceholders(TASK_DEFINITION_CONTENT_ID, event.data.definition.content);
    let container = taskValidations.querySelector(`#${TASK_VALIDATIONS_ACCORDION_ID}`);
    try {
        const steps = JSON.parse(event.data.validation).validation_steps;
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
    taskValidationForm.classList.remove('d-none');
    taskValidations.classList.remove('d-none');
    deploymentLoader.classList.add('d-none');
    abortTaskButton.disabled = true;
}


function handleEvalReady(event) {
    let spans1 = verifyTaskButton.querySelectorAll('span');
    spans1[0].classList.remove('spinner-border');
    spans1[1].innerText = VERIFY;
    let spans2 = abortTaskButton.querySelectorAll('span');
    spans2[0].classList.remove('spinner-border');
    spans2[1].innerText = ABORT;

    verifyTaskButton.disabled = false;
    abortTaskButton.disabled = false;
    if (window.dynamicData && window.dynamicData.verify_params) {
        toggleDynamicData(DYNAMIC_VERIFY_PARAMETERS_ID,window.dynamicData.verify_params, 'enable');
    }
}


function handleEvalBegan(event){
    return;
}


function handleEvalFailedSucceeded(event){
    let container = taskValidations.querySelector(`#${TASK_VALIDATIONS_ACCORDION_ID}`);
    let accordions = container.querySelectorAll('.accordion-item:not(.inner)');
    let steps = JSON.parse(event.data.validation).validation_steps;

    accordions.forEach(a => {
        const description = a.querySelector('.accordion-button').innerText;
        const externalAccordionButton = a.querySelector('.accordion-button');
        const externalAccordionBody = a.querySelector('.accordion');
        const stepsFromEvent = steps;
        externalAccordionButton.classList.remove(BG_DANGER_SUBTLE);
        externalAccordionButton.classList.remove(BG_SUCCESS_SUBTLE);
        let externalButtonColor = BG_SUCCESS_SUBTLE;

        if (stepsFromEvent || stepsFromEvent.length !== 0) {
            stepsFromEvent.forEach(step => {
                if (step.incorrectly_deleted) {
                    console.log('Incorrectly deleted');
                    externalAccordionBody.innerText = INCORRECTLY_DELETED_MESSAGE;
                    externalButtonColor = BG_DANGER_SUBTLE;
                    externalAccordionButton.classList.add(externalButtonColor);
                    return;
                  }
                if (description.includes(step.description)) {
                    externalButtonColor = BG_DANGER_SUBTLE;
                }
            });
        }
        externalAccordionButton.classList.add(externalButtonColor);

        const accordionItems = a.querySelectorAll('.accordion-item');
        accordionItems.forEach(item => {
            const button = item.querySelector('.accordion-button');
            const content = item.querySelector('.inner').innerText;
            button.classList.remove(BG_DANGER_SUBTLE);
            button.classList.remove(BG_SUCCESS_SUBTLE);
            if (ruleIsStored(description, content, steps)){
                button.classList.add(BG_DANGER_SUBTLE);
            } else {
                button.classList.add(BG_SUCCESS_SUBTLE);
            }
        })
    });

    // need to check if we have to create new top level accordion items in case
    // violations for new resources appeared
    steps = JSON.parse(event.data.validation).validation_steps;
    steps.forEach(stepData => {
        // we need to get all items after we added new accordion items
        accordions = container.querySelectorAll('.accordion-item:not(.inner)');
        const accordion = Array.from(accordions).find(accordion => {
            const description = accordion.querySelector('.accordion-button').innerText;
            return description.includes(stepData.description);
        });

        if (accordion) {
        // Check if an inner accordion with rules.article = "New violation article" exists
            const innerAccordions = accordion.querySelectorAll('.accordion-item.inner');
            let articleValues = Array.from(innerAccordions).map(innerAccordion => {
                const content = innerAccordion.querySelector('.inner').innerText;
                const ruleArticle = JSON.parse(content).article;
                return ruleArticle;
            });

            console.log(articleValues);
            const rules = stepData.meta.rules;
            rules.forEach(rule => {
              if (!articleValues.includes(rule.article)) {
                console.log(`Rule with article "${rule.article}" is not present in articleValues`);
                const index = articleValues.length;
                articleValues.push(rule.article);
                const element = accordion.querySelector('.accordion-collapse');
                const id = element.id;
                const title = rule.description;
                const color = BG_DANGER_SUBTLE;
                const item = createAccordionButton(id, title, color);
                const innerAccordionContent = itemToSREInnerAccordion(id, index, rule);
                accordion.querySelector('.accordion').appendChild(innerAccordionContent);
              }
            });
        } else {
            // Need to create new top level accordion item
            console.log(`${stepData.description} is not present in accordions`);
            const id = accordions.length+1;
            const title = stepData.description;
            const description = stepData.meta;
            const stepResult = 'failed';
            taskValidations.querySelector(`#${TASK_VALIDATIONS_ACCORDION_ID}`)
                .appendChild(buildSREAccordionItem(id, stepResult, title, description));
        }
    });

    // unlocking buttons
    let spans1 = verifyTaskButton.querySelectorAll('span');
    spans1[0].classList.remove('spinner-border');
    spans1[1].innerText = VERIFY;
    let spans2 = abortTaskButton.querySelectorAll('span');
    spans2[0].classList.remove('spinner-border');
    spans2[1].innerText = ABORT;
    abortTaskButton.disabled = true;
//    AISummarySwitch.disabled = false;
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
    abortTaskButton.disabled = false;
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
    destroymentLoader.classList.remove('d-none');
//    AISummarySwitch.disabled = true;
}


function handleCleanupStatus(event){
    return;
}


function handleCleanupFailed(event){
    verifyTaskButton.disabled = true;
    abortTaskButton.disabled = true;
    destroymentLoader.classList.add('d-none');
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
    destroymentLoader.classList.add('d-none');
    destroymentContent.innerHTML = SUCCESS_CLEANUP_MESSAGE;
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
    validationLinuxCreds = document.getElementById(VALIDATION_LINUX_CREDS_ID);
    validationWindowsCreds = document.getElementById(VALIDATION_WINDOWS_CREDS_ID);
    validationPowerShellCreds = document.getElementById(VALIDATION_POWERSHELL_CREDS_ID);
    syndicateUpdateCredentials = document.getElementById(SYNDICATE_UPDATE_CREDENTIALS_ID);
    executionCreditsModalCloseButton = document.getElementById(EXECUTION_CREDITS_MODAL_CLOSE_BUTTON_ID);

//    AISummarySwitch = document.getElementById(AI_SUMMARY_SWITCH_ID);
    AISummaryLoader = document.getElementById(AI_SUMMARY_LOADER_ID);
    AISummaryErrorAlertTemplate = document.getElementById(AI_SUMMARY_ERROR_ALERT_TEMPLATE_ID);
    AISummaryErrorAlertPlaceholder = document.getElementById(AI_SUMMARY_ERROR_ALERT_PLACEHOLDER_ID);
    AISummaryContent = document.getElementById(AI_SUMMARY_CONTENT_ID);
    AISummaryAccordion = document.getElementById(AI_SUMMARY_ACCORDION);
    AISummaryAccordionButton = document.getElementById(AI_SUMMARY_ACCORDION_BUTTON_ID);
    executorFailed = document.getElementById(EXECUTOR_FAILED_ID);
    taskValidationsFailed = document.getElementById(TASK_VALIDATIONS_FAILED_ID);
    taskValidationsFailedCloseButton = document.getElementById(TASK_VALIDATIONS_FAILED_CLOSE_BUTTON_ID);
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
        this.ws.send(body);
        taskStartForm.classList.add('d-none');
        deploymentLoader.classList.remove('d-none');
    });
    verifyTaskButton.addEventListener('click', async (e) => {
        e.preventDefault();
        let dynamicParameters;
        if (window.dynamicData && window.dynamicData.verify_params) {
          dynamicParameters = await gatherAndValidateValues(DYNAMIC_VERIFY_PARAMETERS_ID, window.dynamicData.verify_params);
          toggleDynamicData(DYNAMIC_VERIFY_PARAMETERS_ID,window.dynamicData.verify_params, 'disable');
        } else {
            dynamicParameters = {};
        }
        console.log('dynamicParameters: ', dynamicParameters);
        this.ws.send(buildBody('send_input', {
            type: VERIFY_START_JOB_STAGE,
            dynamic_parameters: dynamicParameters
        }));
        verifyTaskButton.disabled = true;
        abortTaskButton.disabled = true;
        let spans = verifyTaskButton.querySelectorAll('span');
        spans[0].classList.add('spinner-border');
        spans[1].innerText = VERIFYING;
        executorFailed.classList.add('d-none');
        taskValidationsFailed.classList.add('d-none');
    });
    abortTaskButton.addEventListener('click', (e) => {
        if (window.dynamicData && window.dynamicData.verify_params) {
            toggleDynamicData(DYNAMIC_VERIFY_PARAMETERS_ID,window.dynamicData.verify_params, 'disable');
        }
        abortTaskButton.disabled = true;
        verifyTaskButton.disabled = true;
        destroymentLoader.classList.remove('d-none');
        taskValidationsFailed.classList.add('d-none');
//        AISummarySwitch.disabled = true;
//        this.ws.send(buildBody('send_input', { 'type': 'abort' }));
        taskValidationsFailed.classList.add('d-none');
//        taskFeedback.querySelector('fieldset').disabled = false;
//        taskFeedback.classList.remove('d-none');
        scrollToBottom();
    });
    destroyResourcesNotificationButton.addEventListener('click', (e) => {
        destroyToProceedNotification.classList.add('d-none');
        destroymentLoader.classList.remove('d-none');
        this.ws.send(buildBody('send_input', { 'type': 'destroy_resources' }));
    });
//    AISummarySwitch.addEventListener('change', (e) => {
//        if (e.target.checked) {
//          console.log('Eda recommendations enabled');
//          this.ws.send(buildBody('get_ai_summary', {}));
//        } else {
//          console.log('Eda recommendations disabled');
//          AISummaryAccordion.classList.add('d-none')
//        }
//    });
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

console.log('sre js ended!');
console.log("Events fetched:", mock_events_sre_data);
setTimeout( () => replayEvents(mock_events_sre_data), 2000);
// if it wouldn't work can try next:
//window.handleEvalFailedSucceeded = function
//<script async defer src="{{ static('js/syndicate.js') }}"></script>
