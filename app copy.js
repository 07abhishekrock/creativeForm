const ERROR_ICON = '!';
const INFO_ICON = '';


class FormStructure{
  constructor(form_id , form_name , submit_btn , reset_btn , message_id ,  validation){
    this.FORM_ELEMENT = document.getElementById(form_id);
    this.FORM_NAME  = form_name;
    this.RESET_BUTTON = document.getElementById(reset_btn);
    this.SUBMIT_BUTTON = document.getElementById(submit_btn);
    this.MESSAGE_OBJECT = new MessageObject(message_id);
    this.input_items = [];
    this.validation_object = validation;

    this[Symbol.iterator] = ()=>{
      let item_index = 0;
      return { 
        next : ()=>{
          if(item_index < this.input_items.length){
            return {done : false , value : this.input_items[item_index++]};
          }
          else{
            return {done : true , value : undefined};
          }
        }
      } 
    }
  }
  shiftFocusToInput(name){
    const target_element = document.querySelector(`[name="${name}"]`);
    if(target_element){
      target_element.scrollIntoView(false);
      target_element.focus();
    }
  }
  populateInputItems(){
    const FORM_CHILDREN = Array.from(this.FORM_ELEMENT.querySelectorAll('input , textarea'));
    const FORM_DIRECT_CHILDREN = Array.from(this.FORM_ELEMENT.querySelectorAll('div.form-body__input-group'));
    FORM_CHILDREN.forEach((child)=>{
      const type = child.type;
      let input_object = {};
      const current_length = this.input_items.length;
      switch(type){
        case 'text' : 
          input_object = {
            name : child.name,
            value : '',
            infoObject : new FormErrorObject()
          }
          FORM_DIRECT_CHILDREN[current_length].insertAdjacentElement('beforeend' , input_object.infoObject.initialise());
          this.input_items.push(input_object);
          break;
        case 'radio' : 
          const existing_input_object = this.input_items.filter((input_item)=>{
            return input_item.name === child.name;
          });
          if(existing_input_object.length === 0){
            input_object = {
              name : child.name,   
              value : child.checked ? child.value : '',
              infoObject : new FormErrorObject(),
              enableEdit : child.getAttribute('enableEdit'),
              compareWithToEdit : child.value
            }
            FORM_DIRECT_CHILDREN[current_length].insertAdjacentElement('beforeend' , input_object.infoObject.initialise());
            this.input_items.push(input_object);

            if(child.getAttribute('enableEdit')){
              const element_to_edit = document.querySelector(`[name="${child.getAttribute('enableEdit')}"]`);
              if(element_to_edit && !child.checked){
                element_to_edit.setAttribute('disabled' , '');
              }
            }
          }
          else{
            const existing_input_object_item = existing_input_object[0];
            if(existing_input_object_item.name === child.name){
              input_object = {
                ...existing_input_object_item,
                enableEdit : child.getAttribute('enableEdit'),
                value : child.checked ? child.value : existing_input_object_item.value,
                compareWithToEdit : child.value
              }
            }
            if(child.getAttribute('enableEdit')){
              const element_to_edit = document.querySelector(`[name="${child.getAttribute('enableEdit')}"]`);
              if(element_to_edit && !child.checked){
                element_to_edit.setAttribute('disabled' , '');
              }
            }

            this.input_items = this.input_items.map((input_item)=>{
              if(input_item.name === input_object.name){
                return input_object;
              }
              return input_item;
            })

          }
          break;
        case 'textarea' : 
          input_object = {
            name : child.name,
            value : '',
            infoObject : new FormErrorObject()
          }
          FORM_DIRECT_CHILDREN[current_length].insertAdjacentElement('beforeend' , input_object.infoObject.initialise());
          this.input_items.push(input_object);
          break;
      }
    });
  }
  attachEventListeners(){
    this.FORM_ELEMENT.addEventListener('submit', (e)=>{
      e.preventDefault();
      this.submit();
    })
    this.RESET_BUTTON.addEventListener('click',()=>this.reset());
  }
  attachOnChangeCallback(){
    this.FORM_ELEMENT.addEventListener('change',(e)=>{
      const new_value = e.target.value;
      this.input_items = this.input_items.map((input_item)=>{
        if(input_item.name === e.target.name){
          if(input_item.enableEdit){
            const element = document.querySelector(`[name="${input_item.enableEdit}"]`);
            if(new_value === input_item.compareWithToEdit){
              element.removeAttribute('disabled');
            }
            else{
              element.setAttribute('disabled' , '');
            }
          }
          return {
            ...input_item , 
            value : new_value
          }
        }
        return input_item;
      })
    });
  }
  init(){
    
    this.attachEventListeners();
    this.populateInputItems();    
    this.attachOnChangeCallback();
    
  }
  submit(){
    let errorFields = [];
    this.input_items.every(({value , name , infoObject})=>{
      const input_element = document.querySelector(`[name="${name}"]`);
      if(validation[name]){
        const error = validation[name](value).error 
        if(error && !input_element.disabled){
          infoObject.markError(error); 
          errorFields.push(name);
        }
        else{
          infoObject.setToDefault();
        }
      }
      return true;
    })

    if(errorFields.length === 0){
      this.MESSAGE_OBJECT.showInfo('Form has been submitted. Thankyou');
    }
    else{
      this.shiftFocusToInput(errorFields[0]);
      this.MESSAGE_OBJECT.showError('Please Fix All Errors in your form');
    }
  }
  reset(){
    if(this.input_items.length === 0) return;
    this.input_items = Array.from(this).map((input_item , index)=>{

      input_item.infoObject.setToDefault();

      const input_elements_for_name = Array.from(document.querySelectorAll(`[name="${input_item.name}"]`));
      input_elements_for_name.forEach((element , element_index)=>{
        if(index === 0 && element_index === 0){
          element.scrollIntoView(false);
        }
        if(element.type === 'radio'){
          if(input_item.enableEdit){
            const enableEdit_element = document.querySelector(`[name="${input_item.enableEdit}"]`);
            enableEdit_element.setAttribute('disabled' , '');
          }
          element.checked = false;
        }
        else{
          element.value = '';
        }
      })
      return {
        ...input_item,
        value : ''
      }
    })

    this.MESSAGE_OBJECT.showInfo('Form has been reset.')
  }
}

class FormErrorObject{
  constructor(){
    this.dom_ref = {
      parent : null,
      icon : null,
      text : null
    }
  }
  initialise(){
    let constructor_class = "form-body__input-group__info";
    const info_element = document.createElement('div');
    const info_icon = document.createElement('i');
    const info_text = document.createElement('span');

    info_element.classList.add(constructor_class);
    info_element.setAttribute("type" , "default");

    info_icon.setAttribute('data-info-icon','');

    info_text.classList.add('input-group__info-text');
    info_text.setAttribute('data-info-text','');

    info_element.appendChild(info_icon);
    info_element.appendChild(info_text);

    this.dom_ref = {
      parent : info_element,
      icon : info_icon,
      text : info_text
    }
    return this.dom_ref.parent;
  }
  setToDefault(){
    this.dom_ref.text.innerText = '';
    this.dom_ref.icon.innerHTML = '';
    this.dom_ref.parent.setAttribute('type','default');
  }
  markError(error){
    if(!this.dom_ref.parent) return;
    this.setToDefault();
    this.dom_ref.parent.setAttribute('type','error');
    this.dom_ref.text.innerText = error;
    this.dom_ref.icon.innerHTML = ERROR_ICON;
  }
  markInfo(info){
    if(!this.dom_ref.parent) return;
    this.setToDefault();
    this.dom_ref.parent.setAttribute('type','info');
    this.dom_ref.text.innerText = info;
    this.dom_ref.icon.innerHTML = INFO_ICON;
  }
}

class MessageObject{
  constructor(message_id, timeout=2000){
    this.message_dom = document.getElementById(message_id);
    this.timeout = timeout;
  }
  fadeDialog(){
    setTimeout(()=>{
      this.message_dom.removeAttribute('type');
    }, this.timeout)
  }
  showError(error){
    this.message_dom.setAttribute('type' , 'error');
    this.message_dom.children[1].innerText = error;
    this.fadeDialog();
  }
  showInfo(info){
    this.message_dom.setAttribute('type' , 'default');
    this.message_dom.children[1].innerText = info;
    this.fadeDialog();
  }
}

const validation = {
  'first-name' : (value)=>{
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
  },
  'last-name' : (value)=>{
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
  },
  'marital-status' : (value)=>{
    if(value.trim().length === 0){
      return {
        error : 'Marital Status has to be selected'
      }
    }
    return {error : null}
  },
  'gender' : (value)=>{
    if(value.trim().length === 0){
      return {
        error : 'Gender has to be selected'
      }
    }
    return {error : null}
  },
  'spouse' : (value)=>{
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
  },
}
const form = new FormStructure('main-form','User Form','submit-btn','reset-btn' ,'message' ,  validation);
form.init();
