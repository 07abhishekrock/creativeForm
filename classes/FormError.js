import { INFO_ICON , ERROR_ICON } from "./constants.js";

export default class FormError{
     constructor(){
          this.domRef = {
               parent : null,
               icon : null,
               text : null
          }
          this.createElementInstance();
     }
     createElementInstance(){
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

          this.domRef = {
          parent : info_element,
          icon : info_icon,
          text : info_text
          }
     }
     setToDefault(){
          this.domRef.text.innerText = '';
          this.domRef.icon.innerHTML = '';
          this.domRef.parent.setAttribute('type','default');
     }
     markError(error){
          if(!this.domRef.parent) return;
          this.setToDefault();
          this.domRef.parent.setAttribute('type','error');
          this.domRef.text.innerText = error;
          this.domRef.icon.innerHTML = ERROR_ICON;
     }
     markInfo(info){
          if(!this.domRef.parent) return;
          this.setToDefault();
          this.domRef.parent.setAttribute('type','info');
          this.domRef.text.innerText = info;
          this.domRef.icon.innerHTML = INFO_ICON;
     }
}