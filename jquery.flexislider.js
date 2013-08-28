/**
 * jQuery wrapper for noUiSlider with additional, flexible new features
 * 
 * @author:
 * Dominique Moreno-Baltierra (baltierrad)
 * dbaltierra@usnews.com
 *
 */

(function ($) {
    "use strict";
    
    $.fn.flexiSlider = function (settings) {
        
        var defaults = {
            /* new options provided by this wrapper */
            measureLines: false,
            wrapSlider: false,
            selectBox: undefined,
            width: undefined,
            stepDivisible: undefined,
            onLoad: undefined
        }

        var selectMin,
        selectMax,
        previousContent,
        wrapSlider;
        
        if (typeof settings === "object") {
            /* If there is already non-slider content in this element, store it for later.  See settings.wrapSlider below for more info. */
            previousContent = this.contents();

            $.each(settings, function (settingName, settingValue) {
                /* Set defaults if settings are undefined */
                settings[settingName] = settingValue || defaults[settingName];
            });

            if (typeof settings.wrapSlider === "object") {
                if ((typeof settings.wrapSlider.wrapper === "object") && (typeof settings.wrapSlider.position === "string")) {
                        wrapSlider = true;
                        this.empty();
                }
            }

            if (settings.selectBox === undefined) {
                /* If the selectBox option is undefined, but there are actually select boxes present, find them and assign them to settings.selectBox */
                settings.selectBox = this.find('select');
            }

            if (settings.range === undefined && settings.selectBox) {
                /* If there are selection boxes provided, then use the value of the first option in the first select box as the value for range[0].  The value of the last option in the second select box will be range[1]. 
                 *
                 * The selection boxes are a fall-back for users who do not have Javascript enabled. */
                selectMin = parseInt(this.find('select').eq(0).find('option:first').text().replace(/[^\d.]/g,''));
                selectMax = parseInt(this.find('select').eq(1).find('option:last').text().replace(/[^\d.]/g,''));

                settings['range'] = [
                    (selectMin === 'NaN') ? settings.range[0] : selectMin,
                    (selectMax === 'NaN') ? settings.range[1] : selectMax
                ]

                if (settings.start === undefined) {
                    settings['start'] = Array(settings.range[0], settings.range[1]);
                }
            }

            if (typeof settings.width === "number") {
                /* Arbitrary width to set on the slider */
                this.css('width', settings.width);
            }


            if (typeof settings.stepDivisible === "number" && settings.step === undefined) {
                /* The range should be divided by the number in stepDivisible.  For example, if you have the range 20 - 50, and settings.stepDivisible is 5, then settings.step will be set to 6.  
                 * settings.step is the number that you want to increment the slider value by
                 * settings.stepDivisible is the actual number of steps you want in the slider 
                 * */
                settings.step = (settings.range[1] - settings.range[0])/settings.stepDivisible;
            }

            /* Call noUiSlider on this element */
            this.noUiSlider({
                range: settings.range,
                step: settings.step,
                start: settings.start,
                slide: settings.slide,
                handles: settings.handles,
                connect: settings.connect,
                orientation: settings.orientation,
                margin: settings.margin,
                serialization: settings.serialization
            });


            if(settings.measureLines) {
                /* Measurement lines for each step */
                var foreground = $('<span>').addClass('slider-foreground'),
                    amtOfLines = (settings.range[1] - settings.range[0])/settings.step,
                    currentUnit,
                    currentUnitHtml,
                    unitEvenOrOdd,
                    unitLeftDistance,
                    unitWidth;

                for (currentUnit = 1; currentUnit <= amtOfLines; currentUnit += 1) {
                    unitEvenOrOdd = (currentUnit % 2 === 0) ? 'even' : 'odd';
                    currentUnitHtml = $('<span>').addClass(unitEvenOrOdd);
                    unitWidth = (100 / amtOfLines);
                    unitLeftDistance = unitWidth * (currentUnit-1);
                    currentUnitHtml.css('left', unitLeftDistance + '%').css('width', unitWidth + '%');
                    if (currentUnit === amtOfLines) {
                        currentUnitHtml.addClass('last');
                    }
                    foreground.append(currentUnitHtml);
                }
                this.append(foreground);
            }

            if (settings.selectBox) {
                /* If settings.selectBox contains select boxes, remove those sliders from the DOM. The selection boxes are only needed for settings.range and settings.start, and will only remain in the DOM if a user has Javascript disabled. They are basically a fall-back in case a user does not have Javascript enabled.  */
                settings.selectBox.remove();
            }

            if (wrapSlider) {
                /* The wrapSlider setting is for cases when you call flexiSlider on an element ("A") that already contains elements within it.  The regular noUiSlider plugin will overwrite any previous content that you have within "A".  With this setting, you can choose to have the previousContent re-added outside of "A".
                 *
                 * This is useful in cases where you are given a block of HTML with content, and you can't modify that HTML, but you need to call noUiSlider on the outermost parent of that HTML.  This way you can seamlessly add noUiSlider either before or after the previous, non-slider content. 
                 * */  

                /* Wrap the slider with the provided wrapper element */
                this.wrap(settings.wrapSlider.wrapper);

                /* Depending on the value of position, either place the old, non-slider content before or after the actual slider */
                if (settings.wrapSlider.position.toLowerCase() === "before") {
                    this.before(previousContent);
                }

                else if (settings.wrapSlider.position.toLowerCase() === "after") {
                    this.after(previousContent);
                }
            }

            if (typeof settings.onLoad === "function") {
                /* Function to call once after flexiSlider has loaded */
                settings.onLoad.call(this);
            }

            return this;
        }
    }
}(jQuery));