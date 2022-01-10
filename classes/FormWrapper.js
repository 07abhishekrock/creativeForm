import FormError from "./FormError.js";
import getMessageInstance from './Message.js';

export default class FormWrapper{
     constructor({
          formID,
          inputArray,
          resetButton,
          inputWrapperClass,
          errorAlert,
          infoAlert
     }={
          formID : null,
          inputArray : [
               {
                    fieldName,
                    isValid : ()=>true,
                    enabledIf : {},
                    defaultValue : ''
               }
          ],
          resetButton : null,
          inputWrapperClass : null,
          errorAlert : null,
          infoAlert : null
     }){

          this.formElement = formID ? document.getElementById(formID) : null,
          this.inputArray = inputArray;
          this.resetButton = resetButton ? document.getElementById(resetButton) : null,
          this.allWrappers = Array.from(document.getElementsByClassName(inputWrapperClass));
          this.errorAlert = errorAlert;
          this.infoAlert = infoAlert;
          this.initialFormState = this.getCurrentFormState();

          this.attachEventListeners();
          this.attachErrorObjects();
          this.resetForm({message : false});

     }


     enableOrDisableElement(name , enable){
          const targetElements = Array.from(document.getElementsByName(name));
          if(targetElements.length > 0){
               targetElements.forEach((single)=>{
                    !enable ? single.setAttribute('disabled','')
                    : single.removeAttribute('disabled');
               })
          }
     }

     shiftFocusToElement(target_element){
          if(target_element){
            target_element.scrollIntoView(false);
            target_element.focus();
          }
     }
     
     getCurrentFormState(){
          const formData = new FormData(this.formElement);
          const form_array = [...formData.entries()];
          return form_array.reduce((result_object , [name , value])=>{
               return {...result_object , [name] : value}
          },{})
     }

     checkDependentElements(changed_element_name){

          const currentFormState = this.getCurrentFormState();

          this.inputArray.forEach(({enabledIf , fieldName})=>{
               for(let controllerName in enabledIf){

                    const controllerTargetValue = enabledIf && enabledIf[controllerName];
                    
                    if(controllerName !== changed_element_name) continue;
                    
                    if(controllerTargetValue === currentFormState[controllerName]){
                         this.enableOrDisableElement(fieldName , true);
                    }
                    else this.enableOrDisableElement(fieldName , false);

               }
          })
     }

     attachEventListeners(){
          if(this.inputArray.length === 0) return;

          this.formElement.addEventListener('submit',(e)=>{
               e.preventDefault();
               this.submitForm();
          })

          this.resetButton && this.resetButton.addEventListener('click',()=>{
               this.resetForm();
          })

          this.formElement.addEventListener('change',(e)=>{
               const eventElement = e.target;

               //disable or enable dependent elements
               this.checkDependentElements(eventElement.name);    
          })

     }

     attachErrorObjects(){

          if(this.allWrappers.length === 0) return;

          this.inputArray = this.inputArray.map((input,index)=>{
               const fieldFormErrorObject = new FormError();

               this.allWrappers[index].insertAdjacentElement('beforeend',fieldFormErrorObject.domRef.parent);

               return {
                    ...input,
                    errorObject : fieldFormErrorObject
               }
          })
     }

     submitForm(){
          const currentFormState = this.getCurrentFormState();
          const errorFields = [];
          this.inputArray.forEach(({fieldName , isValid , errorObject})=>{
               const errorInField = isValid(currentFormState[fieldName] || '');
               const isFieldDisabled = document.getElementsByName(fieldName)[0].disabled;

               if(errorInField.error && !isFieldDisabled){
                    if(errorObject) errorObject.markError(errorInField.error);
                    errorFields.push(fieldName);
               }
               else{
                    if(errorObject) errorObject.setToDefault();
               }
          })

          if(errorFields.length > 0){
               //there is error in form
               const first_element_with_error = Array.from(document.getElementsByName(errorFields[0]))[0];
               const messageInstance = getMessageInstance();

               this.shiftFocusToElement(first_element_with_error);
               messageInstance && messageInstance.showError('You have some errors in your form');

          }

     }
     
     resetForm({message}={message : true}){
          const messageInstance = getMessageInstance();
          let firstElement = null;

          this.formElement.reset();

          this.inputArray.forEach(({fieldName , enabledIf , errorObject} , index)=>{
               if(index === 0){
                    firstElement = document.getElementsByName(fieldName) && document.getElementsByName(fieldName)[0];
               }
               if(errorObject){
                    errorObject.setToDefault();
               }
               if(!enabledIf) return;
               for(let controllerName in enabledIf){
                    const controllerTargetValue = enabledIf[controllerName];
                    if(this.initialFormState[controllerName] === controllerTargetValue){
                         this.enableOrDisableElement(fieldName , true);
                    }
                    else{
                         this.enableOrDisableElement(fieldName , false);
                    }
               }
          })

          if(firstElement) this.shiftFocusToElement(firstElement);
          if(message) messageInstance.showInfo('Form has been reset');
     }

}