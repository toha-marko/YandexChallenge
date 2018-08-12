document.addEventListener("DOMContentLoaded", function(event) { 
    console.log("We are here");
    const   ListaArowUp = document.getElementById("ListaArowUp"),
            ListArrowDown = document.getElementById("ListArrowDown"),
            Panel1Content = document.getElementById("Panel1Content"),
            Panel1ContentScroll = document.getElementById("Panel1ContentScroll"),
            Panel2Left = document.getElementById("Panel2Left"),
            Panel2Right = document.getElementById("Panel2Right"),
            Panel2Content = document.getElementById("Panel2Content"),
            Panel2ContentScroll = document.getElementById("Panel2ContentScroll"),
            Panel3Left = document.getElementById("Panel3Left"),
            Panel3Right = document.getElementById("Panel3Right"),
            Panel3Content = document.getElementById("Panel3Content"),
            FilterAll = document.getElementById("FilterAll"),
            FilterKitchen = document.getElementById("FilterKitchen"),
            FilterRoom = document.getElementById("FilterRoom"),
            FilterLamps = document.getElementById("FilterLamps"),
            FilterCameras = document.getElementById("FilterCameras"),
            popupBox = document.getElementById("popupBox"),
            buttonOk = document.getElementById("buttonOk"),
            buttonClose = document.getElementById("buttonClose"),
            popupContainer = document.getElementById("popup");
            
    var tweakPanels = function () {

        ListaArowUp.classList.add("hide");
        ListArrowDown.classList.add("hide");
        Panel2Left.classList.remove('svg-list-active');
        Panel2Right.classList.remove('svg-list-active');
        Panel3Left.classList.remove('svg-list-active');
        Panel3Right.classList.remove('svg-list-active');


        // -- Tweak Panel 1 scroll

        Panel1ContentScroll.addEventListener("scroll", function () {
            if (Panel1ContentScroll.scrollTop > 40) {
                ListaArowUp.classList.remove("hide");
            } else {
                ListaArowUp.classList.add("hide");
            }
        });

        if (Panel1Content.childElementCount > 2) {
            ListArrowDown.classList.remove("hide");
        }

        ListaArowUp.addEventListener("click", function () {
            scrollTo(Panel1ContentScroll, (Panel1ContentScroll.scrollTop - 120), 300, true);
        });

        ListArrowDown.addEventListener("click", function () {
            scrollTo(Panel1ContentScroll, (Panel1ContentScroll.scrollTop + 120), 300, true);
        });

        // -- Tweak Panel 2 scroll

        while ((Panel2Content.offsetTop + 331) < (Panel2Content.lastElementChild.offsetTop + 100)) {
            var widthOffset = 215 - Panel2Content.offsetWidth % 215;
            Panel2Content.style.width = (Panel2Content.offsetWidth + widthOffset).toString() + "px";
        }

        if (Panel2ContentScroll.offsetWidth < Panel2Content.offsetWidth) {
            if (!Panel2Right.classList.contains('svg-list-active')) {
                Panel2Right.classList.add('svg-list-active');
            }
        }


        Panel2Left.addEventListener("click", function () {
            if (this.classList.contains('svg-list-active')) {
                scrollTo(Panel2ContentScroll, (Panel2ContentScroll.scrollLeft - 200), 300, false);
                setTimeout(function () {
                    if (Panel2ContentScroll.scrollLeft < 1) {
                        Panel2Left.classList.remove('svg-list-active');
                    }
                }, 300); 
            }        
        });

        Panel2Right.addEventListener("click", function () {
            if (this.classList.contains('svg-list-active')) {
                scrollTo(Panel2ContentScroll, (Panel2ContentScroll.scrollLeft + 200), 300, false);
                
                if (!Panel2Left.classList.contains('svg-list-active')) {
                    Panel2Left.classList.add('svg-list-active');
                }
            }   
        });

        // -- Tweak Panel 3 scroll

        if (Panel3Content.offsetWidth < (Panel3Content.lastElementChild.offsetLeft + Panel3Content.lastElementChild.offsetWidth)) {
            Panel3Right.classList.add('svg-list-active');
        }

        Panel3Left.addEventListener("click", function () {
            if (this.classList.contains('svg-list-active')) {
                scrollTo(Panel3Content, (Panel3Content.scrollLeft - 200), 300, false);
                setTimeout(function () { 
                    if (Panel3Content.scrollLeft < 1) {
                        Panel3Left.classList.remove('svg-list-active');
                    } 
                }, 300); 
            }        
        });

        Panel3Right.addEventListener("click", function () {
            if (this.classList.contains('svg-list-active')) {
                scrollTo(Panel3Content, (Panel3Content.scrollLeft + 200), 300, false);
                if (!Panel3Left.classList.contains('svg-list-active')) {
                    Panel3Left.classList.add('svg-list-active');
                }
                Panel3Right.blur();
            }   
        });
    };

    // -- Utils

    function scrollTo(element, to, duration, directionV) {
        var start = directionV ? element.scrollTop : element.scrollLeft,
            change = to - start,
            currentTime = 0,
            increment = 20;
            
        var animateScroll = function(){        
            currentTime += increment;
            var val = Math.easeInOutQuad(currentTime, start, change, duration);
            if (directionV) {
                element.scrollTop = val;
            } else {
                element.scrollLeft = val;
            }
            if(currentTime < duration) {
                setTimeout(animateScroll, increment);
            }
        };
        animateScroll();
    }

    Math.easeInOutQuad = function (t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    };

    // -- Panel 3 Filters

    function setFilterActiveOnly (button, alwaysOn) {
        if ((button.classList.contains("panel3-filter-active"))&&(alwaysOn == false)) {
            button.classList.remove("panel3-filter-active");
        } else {
            button.classList.add("panel3-filter-active");
            
            var sibling = button.nextElementSibling;
            while (sibling !== null) {
                sibling.classList.remove("panel3-filter-active");
                sibling = sibling.nextElementSibling;
            }
            sibling = button.previousElementSibling;
            while (sibling !== null) {
                sibling.classList.remove("panel3-filter-active");
                sibling = sibling.previousElementSibling;
            }
        }
    }

    FilterAll.addEventListener("click", function() {
        setFilterActiveOnly(this, false);
    });
    FilterKitchen.addEventListener("click", function() {
        if (this.classList.contains("panel3-filter-active")) {
            this.classList.remove("panel3-filter-active");
        } else {
            this.classList.add("panel3-filter-active");
        }
    });
    FilterRoom.addEventListener("click", function() {
        if (this.classList.contains("panel3-filter-active")) {
            this.classList.remove("panel3-filter-active");
        } else {
            this.classList.add("panel3-filter-active");
        }
    });
    FilterLamps.addEventListener("click", function() {
        if (this.classList.contains("panel3-filter-active")) {
            this.classList.remove("panel3-filter-active");
        } else {
            this.classList.add("panel3-filter-active");
        }
    });
    FilterCameras.addEventListener("click", function() {
        if (this.classList.contains("panel3-filter-active")) {
            this.classList.remove("panel3-filter-active");
        } else {
            this.classList.add("panel3-filter-active");
        }
    });

    var currentBox;
    var createPopups = function () {
        var elements = [].slice.call(document.getElementsByClassName("box")),

            eventPopupListener = function (event) {
                popupContainer.classList.remove("popup-container-visible");  
                setTimeout(
                    function () {
                        popupBox.removeChild(popupBox.firstChild);
                        popupContainer.classList.add("hide");  
                        popupBox.classList.remove('popup-container-box-show');   

                        buttonOk.classList.remove("button-visible");
                        buttonClose.classList.remove("button-visible");
                        buttonOk.classList.add("hide");
                        buttonClose.classList.add("hide");

                        window.removeEventListener("click", eventPopupListener);   
                    }, 300
                );
            },

            eventPopupOkListener = function (event) {
                eventPopupListener();
            };

        buttonClose.addEventListener("click", eventPopupListener); 
        buttonOk.addEventListener("click", eventPopupOkListener);

        elements.forEach( function(element) {
            element.addEventListener("click", function () {

                currentBox = element;

                var rect = element.getBoundingClientRect(),
                    popup = element.cloneNode(true),
                    type = element.getAttribute("boxtype"),
                    control, controlId;

                switch (type) {
                    case "temp":
                        controlId = "templateTemp";
                        break;
                    case "light":
                        controlId = "templateLight";
                        break;
                    case "time": 
                        controlId = "templateLight";
                        break;
                    default: console.log("Error there");
                }
                control = document.getElementById(controlId).cloneNode(true);
                control.classList.remove("hide");
                
                popupContainer.classList.remove("hide");
                buttonOk.classList.remove("hide");
                buttonClose.classList.remove("hide");

                popupBox.insertBefore(popup, popupBox.firstChild);
                popupBox.querySelector(".box-content").appendChild(control);
                
                activatePopupSlider(popupBox.querySelector(".gradientTouch"));

                var popups = [].slice.call(document.getElementsByClassName("popup-controlls")),
                    activePopup;
                popups.forEach(function (element) {
                    if (!element.classList.contains("hide")) {
                        activePopup = element;
                    }
                });

                var popupFilters = [].slice.call(activePopup.getElementsByTagName("li"));
                popupFilters.forEach(function (element) {
                    element.addEventListener("click", function () {

                        setFilterActiveOnly(element, false);
                        var changes, isChanges = true;
                        switch (element.getAttribute("typeid")) {
                            case "lightDay":
                                changes = "80%";
                                break;
                            case "LightEvening":
                                changes = "40%";
                                break;
                            case "LightEarly":
                                changes = "30%";
                                break;
                            case "FilterNotOk":
                                changes = "20%";
                                break;
                            case "FilterOk":
                                changes = "60%";
                                break;
                            case "FilterXXX":
                                changes = "80%";
                                break;
                            default:
                                isChanges = false;
                        }
                        if (isChanges) {
                            setElementTemplatePosition(popupBox.querySelector(".gradientTouch"), changes);
                        }
                    });
                });

                popupBox.style.left = rect.left.toString() + "px";
                popupBox.style.height = rect.height.toString() + "px";
                popupBox.style.top = rect.top.toString() + "px";

                setTimeout(
                    function () {
                        popupContainer.classList.add("popup-container-visible"); 
                        popupBox.style.left = "calc(50% - 315px)";
                        popupBox.style.height = "auto";
                        popupBox.style.top = "calc(50% - 160px)";  
                        popupBox.classList.add('popup-container-box-show');
                        popupBox.firstChild.style.flexDirection = "column";
                        popupBox.firstChild.style.backgroundColor = "#FFFFFF";
                        
                        popupBox.querySelector(".box-content").style.padding = "25px";
                        var title = popupBox.querySelector("h3");
                        title.style.fontSize = "27px";
                        title.style.maxWidth = "90%";
                        title.style.marginTop = "0";
                        title.nextElementSibling.style.fontSize = "14px";
                        popupBox.querySelectorAll('.svg-boxIcon').forEach(function (element) {
                            element.classList.add("popup-container-box-svg");
                        });
                        
                        window.addEventListener("click", eventPopupListener);    

                        setTimeout(function () {
                            buttonOk.classList.add("button-visible");
                            buttonClose.classList.add("button-visible");
                            control.classList.add("popup-controlls-visible");
                        }, 300);
                    }, 300
                )
            });
        });
    };

    function dragElementX(elmnt) {

        var filter = elmnt.parentElement.previousElementSibling.children[0];

        var pos1 = 0, pos2 = 0;
        elmnt.onmousedown = dragMouseDown;
        elmnt.ontouchstart = dragTouchStart;

        function dragMouseDown(e) {
            e = e || window.event;
            // get the mouse cursor position at startup:
            pos2 = e.clientX;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            // calculate the new cursor position:
            if (isMobileView) {
                pos1 = pos2 - e.clientY;
                pos2 = e.clientY;
                // set the element's new position:
                var dest = checkMoveBorders((elmnt.offsetTop + pos1));
                elmnt.style.top = dest + "px";
            } else {            
                pos1 = pos2 - e.clientX;
                pos2 = e.clientX;
                // set the element's new position:
                var dest = checkMoveBorders((elmnt.offsetLeft - pos1));
                elmnt.style.left = dest + "px";
            }
        }

        function closeDragElement() {
            /* stop moving when mouse button is released:*/
            document.onmouseup = null;
            document.onmousemove = null;
        }

        function dragTouchStart(e) {
            e = e || window.event;
            
            if (isMobileView) {
                pos2 = e.changedTouches[0].clientY;
            } else {
                pos2 = e.changedTouches[0].clientX;
            }

            elmnt.ontouchend =  closeTouchDragElement;
            elmnt.ontouchmove = elementTouchDrag;
        }

        function elementTouchDrag(e) {
            e = e || window.event;
            // calculate the new cursor position:
            if (isMobileView) {
                
                pos1 = pos2 - e.changedTouches[0].clientY;
                pos2 = e.changedTouches[0].clientY;
    
                // set the element's new position:
                var dest = checkMoveBorders((elmnt.offsetLeft + pos1));
                console.log(dest);
                elmnt.style.left = dest + "px";
            } else {

                pos1 = pos2 - e.changedTouches[0].clientX;
                pos2 = e.changedTouches[0].clientX;
    
                // set the element's new position:
                var dest = checkMoveBorders((elmnt.offsetLeft - pos1));
                elmnt.style.left = dest + "px";
            }
        }

        function closeTouchDragElement() {
            elmnt.ontouchend = null;
            elmnt.ontouchmove = null;
        }

        function checkMoveBorders(posX) {

            var maxX = popupBox.querySelector('.gradient').offsetWidth;
            var pos = posX + 60;
            if (pos >= maxX) {
                return maxX - 60;
            } else if (pos <= 60) {
                return 0;
            }

            setFilterActiveOnly(filter, true);
            return posX;
        }
    }

    function setElementTemplatePosition(elmnt, pos) {s
        elmnt.style.left = pos;
    }

    function activatePopupSlider (element) {
        dragElementX(element);
    }

    tweakPanels();
    createPopups();
    
    popupBox.addEventListener("click", function(event) {
        event.stopPropagation();
    });

    var isMobileView = window.innerWidth > 640 ? false : true;
    window.addEventListener("resize", function() {
        if (window.innerWidth > 640) {
            tweakPanels();
        } else {
            isMobileView = true;
        }
    }, true);
});