class Message{
     static instance = null;
     constructor(messageID, timeout=2000){
       this.messageDom = document.getElementById(messageID);
       this.timeout = timeout;
     }
     fadeDialog(){
       setTimeout(()=>{
         this.messageDom.removeAttribute('type');
       }, this.timeout)
     }
     showError(error){
       this.messageDom.setAttribute('type' , 'error');
       this.messageDom.children[1].innerText = error;
       this.fadeDialog();
     }
     showInfo(info){
       this.messageDom.setAttribute('type' , 'default');
       this.messageDom.children[1].innerText = info;
       this.fadeDialog();
     }
}

const getMessageInstance = ()=>{
     if(!Message.instance){
          //create new instance
          Message.instance = new Message('message');
     }
     return Message.instance;
}

export default getMessageInstance;