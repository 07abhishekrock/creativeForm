import FormWrapper from "./classes/FormWrapper.js";
const mainForm = new FormWrapper({
  formID : 'main-form',
  inputWrapperClass : 'form-body__input-group',
  resetButton : 'reset-btn',
  inputArray : [
    {
      fieldName : 'first-name',
      defaultValue : '',
      isValid : (value)=>{
        if(value.trim().length === 0){
          return {
            error : 'First Name cannot be empty'
          }
        }
        else if(value.split(' ').length > 1){
          return {
            error : 'First Name cannot have whitespaces'
          } 
        }
        return {
          error : null
        } 
      }
    },
    {
      fieldName : 'last-name',
      defaultValue : '',
      isValid : (value)=>{
        if(value.trim().length === 0){
          return {
            error : 'Last Name cannot be empty'
          }
        }
        else if(value.split(' ').length > 1){
          return {
            error : 'Last Name cannot have whitespaces'
          } 
        }
        return {
          error : null
        } 
      }
    },
    {
      fieldName : 'marital-status',
      defaultValue : '',
      isValid : (value='')=>{
        if(value.trim().length === 0){
          return {
            error : 'Marital Status has to be selected'
          }
        }
        return {error : null}
      }
    },
    {
      fieldName : 'gender',
      defaultValue : '',
      isValid : (value='')=>{
        if(value.trim().length === 0){
          return {
            error : 'Gender has to be selected'
          }
        }
        return {error : null}
      }
    },
    {
      fieldName : 'spouse',
      defaultValue : '',
      enabledIf : {
        'marital-status' : 'married'
      },
      isValid : (value)=>{
        if(value.trim().length === 0){
          return {
            error : 'Spouse Name cannot be empty'
          }
        }
        else if(value.split(' ').length > 1){
          return {
            error : 'Spouse Name cannot have whitespaces'
          } 
        }
        return {
          error : null
        } 
      }
    },
    {
      fieldName : 'other-details',
      defaultValue : '',
      isValid : ()=>{return {error : null}}
    }
  ]
})
console.log(mainForm);