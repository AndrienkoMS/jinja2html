function createLabelElement(id, label) {
    const labelElem = document.createElement('label');
    labelElem.setAttribute('for', id);
    labelElem.className = 'form-label';
    labelElem.textContent = label;
    return labelElem;
}

function createNoteElement(description) {
    const descriptionElem = document.createElement('small');
    descriptionElem.className = 'form-text text-muted';
    descriptionElem.innerHTML = description;
    return descriptionElem;
}

function appendChildElements(parentElementId, jsonData) {
    console.log(parentElementId, ' Adding dynamic fields from data: ', jsonData);
    const parentElement = document.getElementById(parentElementId);

    for (let id in jsonData) {
        const data = jsonData[id];

        if (data.label) {
            const labelElem = createLabelElement(parentElementId + id, data.label);
            parentElement.appendChild(labelElem);
        }

        const elem = document.createElement(data.tag);
        elem.id = parentElementId + id;

        for (let attr in data.attributes) {
            elem.setAttribute(attr, data.attributes[attr]);
        }

        if (data.tag === 'select' && data.allowed_values) {
            for (let i = 0; i < data.allowed_values.length; i++) {
                const option = document.createElement('option');
                option.value = data.allowed_values[i];
                option.text = data.allowed_values[i];
                // Set the first option as selected
                if (i === 0) {
                    option.selected = true;
                }
                elem.appendChild(option);
            }
        } else if (data.tag === 'input' && data.attributes.type === 'checkbox') {
            elem.setAttribute('value', 'true');
            elem.checked = data.checked || false;
        }

        const wrapperDiv = document.createElement('div');
        wrapperDiv.appendChild(elem);
        parentElement.appendChild(wrapperDiv);

        if (data.note) {
            const noteElem = createNoteElement(data.note);
            const noteWrapperDiv = document.createElement('div');
            noteWrapperDiv.appendChild(noteElem);
            parentElement.appendChild(noteWrapperDiv);
        }
    }
}

async function gatherAndValidateValues(parentElementId, jsonData) {
  const parentElement = document.getElementById(parentElementId);
  const parameters = {};

  const promises = [];

  for (let id in jsonData) {
    const data = jsonData[id];
    const elem = parentElement.querySelector('#' + parentElementId + id);

    if (data.required && (!elem.value || elem.value.trim() === '')) {
      const errorMessage = 'Required field ' + id + ' is empty';
      console.log('Validation Error:', errorMessage);
      return errorMessage;
    }

    if (data.tag === 'input' && data.attributes.type === 'file') {
      const file = elem.files[0];
      if (file) {
        const reader = new FileReader();
        const readPromise = new Promise((resolve, reject) => {
          reader.onload = function (event) {
             try {
              parameters[id] = JSON.parse(reader.result);
              resolve();
            } catch (error) {
              const errorMessage = 'Error parsing JSON: ' + id + ' ' + error.message;
              console.error(errorMessage);
              reject(errorMessage);
              return errorMessage;
            }
          };
          reader.onerror = function (event) {
            const errorMessage = 'Error reading file: ' + id + ' ' + event.target.error;
            console.error('Error reading file:', errorMessage);
            reject(errorMessage);
            return errorMessage;
          };
          reader.readAsText(file);
        });

        promises.push(readPromise);

      } else {
        console.error('No file selected.', id);
      }
    } else if (data.tag === 'input' && data.attributes.type === 'checkbox'){
      parameters[id] = elem.checked;
    } else {
      parameters[id] = elem.value;
    }
  }

  await Promise.all(promises);

  console.log('Gathered parameters', parameters);
  return parameters;
}

function updateElements(updateSourceData,
                        updateTargetData,
                        sourceParentElementId,
                        targetParentElementId) {

  const sourceParentElement = document.getElementById(sourceParentElementId);
  const targetParentElement = document.getElementById(targetParentElementId);

  for (let id in updateSourceData) {
    const sourceElement = updateSourceData[id];
    const targetElement = updateTargetData[id];

    if (targetElement) {
      console.log('updating Element', id);
      const sourceElem = sourceParentElement.querySelector('#' + sourceParentElementId + id);
      const targetElem = targetParentElement.querySelector('#' + targetParentElementId + id);
      console.log('sourceElem', sourceElem);
      console.log('targetElem', targetElem);
       if (sourceElem && targetElem) {
        if (targetElem.tagName === 'INPUT') {
          targetElem.value = sourceElem.value || '';
        } else if (targetElem.tagName === 'SELECT') {
          const options = targetElem.options;
          for (let i = 0; i < options.length; i++) {
            if (options[i].value === sourceElem.value) {
              options[i].selected = true;
              break;
            }
          }
        }
      }
    }
  }

  console.log('Elements updated');
}

/**
 * Checks if an item is stored in sessionStorage. If not, stores the item and returns false.
 * If the item is already stored, returns true.
 */
function checkAndStoreItem(key, value) {
  let collection = JSON.parse(sessionStorage.getItem(key)) || [];

  const isItemExists = collection.some((item) => {
    return JSON.stringify(item) === JSON.stringify(value);
  });

  if (isItemExists) {
    return true;
  } else {
    collection.push(value);
    sessionStorage.setItem(key, JSON.stringify(collection));
    return false;
  }
}

function storeItem(key, value) {
    console.log('TTT storing item to sessionStorage: ', value);
    let collection = JSON.parse(sessionStorage.getItem(key)) || [];
    const task = collection.find((item) => item.taskName === value.taskName);

    if (task) {
        task.validation_steps = task.validation_steps.concat(value.validation_steps);
    } else {
        collection.push({
            "taskName": value.taskName,
            "validation_steps": value.validation_steps,
        });
    }

    sessionStorage.setItem(key, JSON.stringify(collection));
}

function clearItemByTaskName(key, taskName) {
    let collection = JSON.parse(sessionStorage.getItem(key)) || [];
    const index = collection.findIndex((item) => item.taskName === taskName);

    if (index >= 0) {
        collection.splice(index, 1);
        sessionStorage.setItem(key, JSON.stringify(collection));
    }
}

function isStored(description, ruleText, stepsFromEvent){
    let result = false;

    stepsFromEvent.forEach((step) => {
        if (description.includes(step.description)) {
            step.meta.rules.forEach((rule) =>{
                delete rule.description;
                if (JSON.stringify(rule, null, 2) === ruleText){
                    result = true;
                    console.log('Match found:', rule);
                }
            });
        }
    });

    return result;
}

console.log('helpers.js loaded')