$.fn.multislider = function (option) {
  option = jQuery.extend({
    fromTo: true,
    checkbox: false,
    minVal: 0,
    maxVal: 100,
    toolText: '',
    changeImmediately: false
  }, option);
  var format = function (num) {
    num = num.toString();
    numSize = num.length;
    var i = num.length - 3;
    var j = 0;
    var text = [];
    if (i > 0) {
      while (i >= 0) {
        text[j] = num.substr(i, 3);
        if (i - 3 < 0) {
          j++;
          text[j] = num.substr(0, i)
        }
        j++;
        i = i - 3
      }
      num = '';
      for (var i = j - 1; i >= 0; i--) {
        num += i == 0 ? text[i] : text[i] + ' '
      }
    }
    return num
  };

  var getTouches = function (e) {
    var originalEvent = e.originalEvent;

    if (originalEvent) {
      if (originalEvent.touches && originalEvent.touches.length) {
        return originalEvent.touches;
      } else if (originalEvent.changedTouches && originalEvent.changedTouches.length) {
        return originalEvent.changedTouches;
      }
    }
    return false;
  };

  $(this).each(function () {
    var elBox = $(this);
    var sCode = '<div class="multi-slider-box">' + '<div class="slider-box"><div class="slider-spc-1"><div class="slider-spc-2"><div class="slide-place"><div class="selected-area"></div></div></div></div></div>' + '<div class="slider1"><a href="#" class="slider"><span></span></a></div><div class="tool-tip1"><div class="tip-spc"><span></span></div></div>' + '<div class="slider2"><a href="#" class="slider"><span></span></a></div><div class="tool-tip2"><div class="tip-spc"><span></span></div></div>' + '</div>';
    $(this).wrapInner('<div class="inner-wrap"></div>').append(sCode);
    if (option.fromTo == true) {
      $('.inner-wrap :text:eq(0)', this).addClass('from');
      $('.inner-wrap :text:eq(1)', this).addClass('to');
      var minVal = option.minVal;
      var maxVal = option.maxVal;
      var partSum = [1, 5, 10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000];
      var maxStep = 100;
      var stepSumHelp = 1000000;
      for (var i = 0; i < partSum.length; i++) {
        var stepDel = (((maxVal - minVal) / partSum[i]) / maxStep) - 1;
        stepDel = stepDel < 0 ? stepDel * (-1) : stepDel;
        if (stepDel < stepSumHelp) {
          stepSumHelp = stepDel;
          var stepSum = partSum[i]
        }
      }
      minVal = Math.floor(minVal / stepSum) * stepSum;
      maxVal = Math.ceil(maxVal / stepSum) * stepSum;
      var partVal = (maxVal - minVal) / stepSum;
      var minActualVal = $('input.from', this).val();
      minActualVal = Math.floor(minActualVal / stepSum) * stepSum;
      var maxActualVal = $('input.to', this).val();
      maxActualVal = Math.ceil(maxActualVal / stepSum) * stepSum;
      var toolText = option.toolText
    }
    if (option.checkbox == true) {
      var arrVal = [];
      var i = 0;
      $(':checkbox', elBox).each(function () {
        if (this.parentNode.tagName == 'LABEL') {
          arrVal[i] = $(this).parent().text()
        } else if ($('label[for="' + $(this).attr('id') + '"]').attr('for') == $(this).attr('id')) {
          arrVal[i] = $('label[for="' + $(this).attr('id') + '"]').text()
        } else {
          arrVal[i] = ''
        }
        i++
      });
      var minVal = 0;
      var maxVal = $(':checkbox', elBox).size() - 1;
      var minActualVal = $(':checkbox', elBox).index($(':checkbox:checked', elBox).filter(':first'));
      var maxActualVal = $(':checkbox', elBox).index($(':checkbox:checked', elBox).filter(':last'));
      maxActualVal = maxActualVal == -1 ? 0 : maxActualVal;
      for (var i = minActualVal; i <= maxActualVal; i++) {
        $(':checkbox:eq(' + i + ')', elBox).attr('checked', true)
      }
      partVal = maxVal;
      stepSum = 1
    }
    $('.multi-slider-box', this).each(function () {
      var el = $(this);
      var bLeft = this.offsetLeft;
      var sWidth = $('a.slider', this).outerWidth();
      var sWidthHalf = sWidth / 2;
      var sMinLeft = $('.slider1', this)[0].offsetLeft;
      var sMaxLeft = $('.slider2', this)[0].offsetLeft;
      var actualPosition = 0;
      var startSelect = $('.selected-area', this)[0].offsetLeft;
      var startWidth = sMaxLeft - sMinLeft;
      var areaPart = (startWidth / partVal);
      var startLeftS = Math.round(((minActualVal - minVal) / stepSum) * areaPart) + sMinLeft;
      var startRightS = Math.round(((maxActualVal - minVal) / stepSum) * areaPart) + sMinLeft;
      if (minVal < minActualVal && minActualVal < maxVal) {
        $('.slider1', this).css('left', startLeftS + 'px')
      }
      if (maxVal > maxActualVal && maxActualVal > minVal) {
        $('.slider2', this).css('left', startRightS + 'px')
      }
      var sliderOpen = false;
      var targetSlider = null;
      if (option.fromTo == true) {
        $('.slider1 span', this).text(minVal < minActualVal && minActualVal < maxVal ? format(minActualVal) : format(minVal)).after(' ' + toolText + ' ')/*.before('od ')*/;
        $('.slider2 span', this).text(maxVal > maxActualVal && maxActualVal > minVal ? format(maxActualVal) : format(maxVal)).after(' ' + toolText)
        /*.before('do ')*/
      } else if (option.checkbox == true) {
        $('.slider1 span', this).text(minVal < minActualVal && minActualVal < maxVal ? arrVal[minActualVal] : arrVal[minVal]);
        $('.slider2 span', this).text(maxVal > maxActualVal && maxActualVal > minVal ? arrVal[maxActualVal] : arrVal[maxVal])
      }
      var selectedArea = function () {
        if ($('.slider2', el)[0].offsetLeft > $('.slider1', el)[0].offsetLeft) {
          $('.selected-area', el).css({
            'width': ($('.slider2', el)[0].offsetLeft + sWidthHalf) - ($('.slider1', el)[0].offsetLeft + sWidthHalf) + 'px',
            'left': $('.slider1', el)[0].offsetLeft + sWidthHalf + 'px'
          })
        } else {
          $('.selected-area', el).css({
            'width': ($('.slider1', el)[0].offsetLeft + sWidthHalf) - ($('.slider2', el)[0].offsetLeft + sWidthHalf) + 'px',
            'left': $('.slider2', el)[0].offsetLeft + sWidthHalf + 'px'
          })
        }
      };
      selectedArea();
      var toolTip = function () {
        if (option.fromTo == true) {
          var selectedArea = $(targetSlider)[0].offsetLeft - sMinLeft;
          var actualPart = Math.round(selectedArea / areaPart);
          var actualNumber = (actualPart * stepSum) + minVal < minVal ? minVal : (actualPart * stepSum) + minVal;
          // HACK by mr.pohoda (skypicker.com)
          // we need to observe when value is changed
          // mtruneck: Checking first if there is .fromText input out there. Not aplying the HACK otherwise
          if ($('.fromText', $(elBox).parent().parent())) {
            if ($(targetSlider).hasClass('slider1')) {
              $('.fromText', $(elBox).parent()).val(format(actualNumber)).trigger('change');
            }
            else {
              $('.toText', $(elBox).parent()).val(format(actualNumber)).trigger('change');
            }
          }
          if (option.changeImmediately) { changeInput(); }
          $(targetSlider).find('span').empty().text(format(actualNumber))
        } else if (option.checkbox == true) {
          var selectedArea = $(targetSlider)[0].offsetLeft - sMinLeft;
          var actualPart = Math.round(selectedArea / areaPart);
          var actualNumber = actualPart;
          $(targetSlider).next('div').find('span').empty().text(arrVal[actualNumber])
        }
      };
      function changeInput() {
        if (option.fromTo == true) {
          var text1 = $('.slider1 span', el).text();
          text1 = text1.replace(/\s/g, '');
          text1 = parseInt(text1);
          var text2 = $('.slider2 span', el).text();
          text2 = text2.replace(/\s/g, '');
          text2 = parseInt(text2);
          var max = Math.max(text1, text2);
          var min = Math.min(text1, text2);
          $('input.to', elBox).val(max).trigger('change');
          $('input.from', elBox).val(min).trigger('change');
        } else if (option.checkbox == true) {
          var s1Pos = Math.round(($('.slider1', el)[0].offsetLeft - sMinLeft) / areaPart);
          var s2Pos = Math.round(($('.slider2', el)[0].offsetLeft - sMinLeft) / areaPart);
          $(':checkbox', elBox).attr('checked', false).trigger('change');
          for (var i = Math.min(s1Pos, s2Pos); i <= Math.max(s1Pos, s2Pos); i++) {
            $(':checkbox:eq(' + i + ')', elBox).attr('checked', true)
          }
        }
      };
      $(document).bind('mousemove mouseup touchmove touchend', function (e) {
        e = e || window.event;
        var touches = getTouches(e);

        if ((e.type == 'mousemove' || e.type == 'touchmove') && sliderOpen == true) {

          var clientX = touches ? touches[0].clientX : e.clientX;

          var position = $(targetSlider)[0].offsetLeft + (clientX - actualPosition);
          position = position < sMinLeft ? sMinLeft : position;
          position = position > sMaxLeft ? sMaxLeft : position;
          actualPosition = clientX;
          if ($(targetSlider).is('.slider1') && position <= $('.slider2', elBox)[0].offsetLeft - sWidth + 30) {
            $(targetSlider).css('left', position + 'px')
          } else if ($(targetSlider).is('.slider2') && position >= $('.slider1', elBox)[0].offsetLeft + sWidth - 30) {
            $(targetSlider).css('left', position + 'px')
          }
          selectedArea();
          toolTip();
          return false
        }
        if ((e.type == 'mouseup' || e.type == 'touchend') && sliderOpen == true) {
          sliderOpen = false;
          changeInput()
        }
      });

      $('a.slider, .tool-tip', this).bind('click mousedown mouseup touchstart touchend', function (e) {
        e = e || window.event;
        if (e.type == 'mousedown' || e.type == 'touchstart') {
          var touches = getTouches(e);

          sliderOpen = true;
          actualPosition = touches ? touches[0].clientX : e.clientX;
          targetSlider = $(this).parent();
          e.preventDefault();
          return false
        }
        if (e.type == 'mouseup' || e.type == 'touchend') {
          sliderOpen = false;
          changeInput()
        }
        if (e.type == 'click') {
          return false
        }
      })
    })
  })
};