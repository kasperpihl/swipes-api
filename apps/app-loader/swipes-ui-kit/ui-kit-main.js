$(document).ready(function(){console.log("thisshit"),$.swButtonFullHover=function(){$(".swipes-button.hover-full").mouseenter(function(){var borderColor=$(this).css("border-color");$(this).css("background-color",borderColor),$(this).css("color","white")}).mouseleave(function(){var borderColor=$(this).css("border-color");$(this).css("background-color","transparent"),$(this).css("color",borderColor)})},$.swButtonLightenHover=function(){$(".hover-lighten").mouseenter(function(){var bgColorRGBA=$(this).css("background-color").replace(")",", 0.75)").replace("rgb","rgba");$(this).css("background-color",bgColorRGBA)}).mouseleave(function(){var bgColor=$(this).css("background-color"),bgColorRGBA=bgColor.split(","),backTo=bgColorRGBA.slice(0,3),changeTo=backTo.toString(),backToRGB=changeTo.replace("rgba","rgb"),fullRGB=backToRGB+")";$(this).css("background-color",fullRGB)})},$.swFloatingLabelInput=function(){var floatSizeW=$(".swipes-floating-label").children("input").width(),floatSizeH=$(".swipes-floating-label").children("input").height();$(".swipes-floating-label").css("width",floatSizeW),$(".swipes-floating-label").css("height",floatSizeH),$(".swipes-floating-input").on("focus",function(){$(this).next("label").addClass("active")}),$(".swipes-floating-input").on("blur",function(){var floatingInputVal=$(".swipes-floating-input").val();floatingInputVal.length>0||$(this).next("label").removeClass("active")})},$.swDropdown=function(){var swipesDropdown=$(".swipes-dropdown"),swipesDropdownInit=$(".swipes-dropdown").find(".init").text(),swipesDropdownFirst=swipesDropdown.find(".selected").text();swipesDropdownInit.length>0||$(".init").html(swipesDropdownFirst),swipesDropdown.on("click",".init",function(){$(this).closest("ul").children("li:not(.init)").toggle()});var allOptions=swipesDropdown.children("li:not(.init)");swipesDropdown.on("click","li:not(.init)",function(){allOptions.removeClass("selected"),$(this).addClass("selected"),$("ul").children(".init").html($(this).html()),allOptions.toggle()})},$.swInputRange=function(){$(".swipes-slider").mouseup(function(){$(this).blur();var sliderVal=$(this).val();$(this).parent().append('<div class="swipes-ripple-range"></div>'),$(this).siblings(".swipes-ripple-range").css("left","calc("+sliderVal+"% - 30px)").delay(310).queue(function(){$(this).remove().dequeue()})})},$.swInputCheckBox=function(){$(".swipes-checkbox").on("click",function(){var $el=$(this).find(".swipes-input-checkbox");$el.click()}),$(".swipes-input-checkbox").change(function(){$(this).is(":checked")?$(this).parent().addClass("checked"):$(this).parent().removeClass("checked")})},$.swInputRadio=function(){$(".swipes-radio").on("click",function(){var $el=$(this).find(".swipes-input-radio"),name=$el.attr("name");$(".swipes-input-radio[name='"+name+"']").each(function(){$(this).prop("checked",!1),$(this).parent().removeClass("checked")}),$(this).addClass("checked"),$el.prop("checked",!0)})},$.swContextMenu=function(){var swipesContextBTN=$(".swipes-context-btn");swipesContextBTN.on("click",function(){$(this).toggleClass("open"),$(this).children(".swipes-context").toggleClass("open"),$(this).children(".swipes-context").children(".context-ripple").toggleClass("open"),$(this).children(".swipes-context").children(".swipes-context-list").toggleClass("open")})}});
