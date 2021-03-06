/* TABS */
function TabManager() {

}

TabManager.prototype.init = function() {
   var divs = document.getElementsByTagName("DIV");
   for (var i=0;i<divs.length;i++) {
      if (( divs[i].className=="tabOn")|| ( divs[i].className=="tabOff"))  {
         // passes clicks from the div's themselves down into the link inside. This makes the tabs behave in a manner more consistent with application tabs. 
         if ( divs[i].className=="tabOff") {
            // a note on this click() method.   If you should find, on some new release of Mozilla, that anchorElements or other elements dont seem to have a click method or are throwing errors, then this might mean that a certain patch for mozilla's DOM has stopped working. (The patch in question concerns the fact that Mozilla does not currently give link elements a click method and that one must be then created for it.)
            divs[i].onclick = function() {this.childNodes[0].click();};
         }

         // min-width and min-height css doesnt work on ie6, so this goes in and does it by hand. 
         // note that there is currently an assumption that the second level tab divs are the IMMEDIATE children of the "secondaryTabSet" div. 
         if (document.all) {
            
            if (divs[i].parentNode.className=="secondaryTabSet") {
               if (divs[i].className == "tabOn") {
                  if (divs[i].offsetWidth < 83) divs[i].style.width = "85px";
               }
               else if (divs[i].className == "tabOff") {
                    if (divs[i].offsetWidth < 85) divs[i].style.width = "83px";
               }
            }
            else {
               if (divs[i].className == "tabOn") {
                  if (divs[i].offsetWidth < 111) divs[i].style.width = "115px";
               }
               else if (divs[i].className == "tabOff") {
                   if (divs[i].offsetWidth < 113) divs[i].style.width = "113px";
               }
            }
         }
      }
   }
}


function ButtonManager() {

}


ButtonManager.prototype.getWrapperReference = function(btnWrapperObj) {
   var   ob = btnWrapperObj;
   var className = ob.className;
   while (className.indexOf("bWrapper")==-1) {
      ob = ob.parentNode;
      className = ob.className;
   }
   return ob;
}

ButtonManager.prototype.hpButtonOver = function(btnWrapperObj) {
   if (!this.getButtonChild(btnWrapperObj).disabled) {
      var ob = this.getWrapperReference(btnWrapperObj);
      if (ob.className.indexOf("bEmphasized")!=-1) {
         ob.className = "bWrapperOver bEmphasized";
      }
      else {
         ob.className = "bWrapperOver";
      }
   }
}

ButtonManager.prototype.hpButtonUp = function(btnWrapperObj) {
   if (!this.getButtonChild(btnWrapperObj).disabled) {
      var ob = this.getWrapperReference(btnWrapperObj);
      if (ob.className.indexOf("bEmphasized")!=-1) {
         ob.className = "bWrapperUp bEmphasized";
      }
      else {
         ob.className = "bWrapperUp";
      }

   }
}

ButtonManager.prototype.hpButtonDown = function(btnWrapperObj) {
   var ob = this.getWrapperReference(btnWrapperObj);
   var childButton = this.getButtonChild(btnWrapperObj);
   if (!childButton.disabled) {
      if (ob.className.indexOf("bEmphasized")!=-1) {
         ob.className = "bWrapperDown bEmphasized";
      }
      else {
         ob.className = "bWrapperDown";
      }
      childButton.focus();
   }
}

ButtonManager.prototype.disableButton = function(btnObj) {
   btnObj.disabled = true;
   var wrapper = this.getWrapperReference(btnObj);
   var wrapper = this.getWrapperReference(btnObj);
   wrapper.onmousedown= null;
   wrapper.onmouseup=  null;
   wrapper.onmouseover=  null;
   wrapper.onmouseout=  null;
   if (wrapper.className.indexOf("bEmphasized")!=-1) {
      wrapper.className = "bWrapperDisabled bEmphasized";
   }
   else {
      wrapper.className = "bWrapperDisabled";
   }
}
ButtonManager.prototype.enableButton = function(btnObj) {
   btnObj.disabled = false;
   var wrapper = this.getWrapperReference(btnObj);
   if (wrapper.className.indexOf("bEmphasized")!=-1) {
      wrapper.className = "bWrapperUp bEmphasized";
   }
   else {
      wrapper.className = "bWrapperUp";
   }
   var wrapper = this.getWrapperReference(btnObj);
   wrapper.onmousedown= function() {ourButtonManager.hpButtonDown(this);}
   wrapper.onmouseup= function() {ourButtonManager.hpButtonOver(this);}
   wrapper.onmouseover= function() {ourButtonManager.hpButtonOver(this);}
   wrapper.onmouseout= function() {ourButtonManager.hpButtonUp(this);}
}
ButtonManager.prototype.disableButtonById = function(btnId) {
   var btnObj = document.getElementById(btnId)
   this.disableButton(btnObj);
}
ButtonManager.prototype.enableButtonById = function(btnId) {
   var btnObj = document.getElementById(btnId)
   this.enableButton(btnObj);
}
ButtonManager.prototype.getButtonChild = function(divObj) {
   var obj = divObj
   while ((obj.childNodes[0]!=null) && ((obj.tagName!="BUTTON") && (obj.tagName!="INPUT"))  &&  (obj.tagName!="A") && (obj.tagName!="SUBMIT") ) {
      obj = obj.childNodes[0];   
   }
   return obj;
}


ButtonManager.prototype.init  = function() {
   var divs = document.getElementsByTagName("DIV");
   var agt=navigator.userAgent.toLowerCase();
   var is_gecko = (agt.indexOf('gecko') != -1);

   for (var i=0;i<divs.length;i++) {
      
      if (divs[i].className.indexOf("bWrapper")!=-1) {
            
         // some button styles might have two nested divs, making a 2px border, or three.  therefore we have to be careful when we look down inside the divs looking for the buttons. 
         var button = this.getButtonChild(divs[i]);

         // looking up to see if we're in a vertical button set. 
         var lookingForVerticalButtonSet = divs[i];
         while ((lookingForVerticalButtonSet) && (lookingForVerticalButtonSet.className!="verticalButtonSet")) {
            lookingForVerticalButtonSet = lookingForVerticalButtonSet.parentNode;
         }
         if (lookingForVerticalButtonSet) {
            button.style.width = "100%";
         }
         else if (!button.getAttribute("disableminimumwidth")){
            
            
            // setting widths based on which size button this is to be. 
            // tempting to use CSS property min-width and  accept that it only works on mozilla. However mozilla forces align left in this case, which does more harm than good to the design. 
            if (button.className.indexOf("hpButtonSmall")!=-1) {  

               if (!is_gecko && button.offsetWidth < 47 && button.offsetWidth > 20) button.style.width = "24px";
               if (!is_gecko && button.offsetWidth < 20) button.style.width = "16px";
               
            }
            else if (button.className.indexOf("hpButton")!=-1) {  

                button.style.width = "95px";
              
            }
            else if (button.className.indexOf("hpStdButtonLarge")!=-1) {  
                     button.style.width = "186px";              
            }
            else if (button.className.indexOf("hpStdButton")!=-1) {  
                     button.style.width = "86px";    
                               
            }
            
            else if (!is_gecko && button.className.indexOf("hpButtonVerySmall")!=-1) {
               // these are tiny buttons with no minimum width, like the help button on the pagetitle bar. 
            }

            // catchall 
            //  This line causes some mozilla problems with the vertical buttons btw, although it is no longer used by them. 
            else if (!is_gecko && button.offsetWidth < 83) button.style.width = "83px";
            
         }

         if (!button.disabled) {
            divs[i].onmousedown= function() {ourButtonManager.hpButtonDown(this);}
            divs[i].onmouseup= function() {ourButtonManager.hpButtonOver(this);}
            divs[i].onmouseover= function() {ourButtonManager.hpButtonOver(this);}
            divs[i].onmouseout= function() {ourButtonManager.hpButtonUp(this);}
            


            // this effectively transfers the onclick up to the level of the div. 
            // this makes the entire div+button structure effectively into the 'button', and moreover covers cases when the user clicks only one of the the right or bottom borders. 
            if (button.onclick) {   
               eval("divs[i].onclick = function() {var hardCodedFunction = "+button.onclick+" ;return hardCodedFunction();};");
               button.onclick = function(event) {};
            }
            

            var buttonChildren = divs[i].getElementsByTagName("BUTTON");
            var inputChildren = divs[i].getElementsByTagName("INPUT");
            for (var j=0;j<buttonChildren.length;j++) {

               buttonChildren[j].onfocus = function() {ourButtonManager.hpButtonDown(this);}
               buttonChildren[j].onblur = function() {ourButtonManager.hpButtonUp(this);}
            }
            for (var j=0;j<inputChildren.length;j++) {
               inputChildren[j].onfocus = function() {ourButtonManager.hpButtonDown(this);}
               inputChildren[j].onblur = function() {ourButtonManager.hpButtonUp(this);}
            }
         }
         else {
            if (divs[i].className.indexOf("bEmphasized")!=-1) {
               divs[i].className = "bWrapperDisabled bEmphasized";
            }
            else {
               divs[i].className = "bWrapperDisabled";
            }
         }
      }
   }
}
