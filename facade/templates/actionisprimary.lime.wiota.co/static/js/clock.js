function clockHand (center, l, angle) {
  var angle = this.degToRadian(angle);
  var x = center[0] + (l*Math.cos(Math.PI/2 - angle));
  var y = center[1] - (l*Math.sin(Math.PI/2 - angle));
  return [x, y]
}

function degToRadian (d) {
  return d/180*Math.PI;
}

function minutesToMinuteHandAngle (m) {
  return m/60 * 360;
}

function minutesToHourHandAngle (h, m) {
  return (h/12 + m/720) * 360;
}

function renderClock (m, secondHandCoor) {
  centerCoor = [60, 60];
  minuteHandLength = 40;
  hourHandLength = 20;

  centerCoor = [60, 60];

  secondAngle = Math.round(m*60)*6;
  minAngle = m*6;
  hourAngle = m/2;

  secondHandCoor = clockHand(centerCoor, minuteHandLength, secondAngle);
  minuteHandCoor = clockHand(centerCoor, minuteHandLength, minAngle);
  hourHandCoor = clockHand(centerCoor, hourHandLength, hourAngle);

  $('#clock').html(
    '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 120 120">' +
    '<circle fill="#FFFFFF" stroke="#000000" stroke-width="9" stroke-miterlimit="10" cx="60" cy="60" r="50"/>' +
    '<circle fill="#000000" stroke="#000000" stroke-width="1" stroke-miterlimit="10" cx="60" cy="60" r="5"/>' +
    '<line fill="none" stroke="#444444" stroke-width="2" stroke-miterlimit="10" x1="60" y1="60" x2="'+secondHandCoor[0]+'" y2="'+secondHandCoor[1]+'"/>' +
    '<line fill="none" stroke="#000000" stroke-width="5" stroke-miterlimit="10" x1="60" y1="60" x2="'+minuteHandCoor[0]+'" y2="'+minuteHandCoor[1]+'"/>' +
    '<line fill="none" stroke="#000000" stroke-width="10" stroke-miterlimit="10" x1="60" y1="60" x2="'+hourHandCoor[0]+'" y2="'+hourHandCoor[1]+'"/>' +
    '</svg>'
  );
}

function windClock () {
  var minutes = 0;
  var speed = 5;
  secondHandCoor = clockHand([60,60], 40, 0);
  var renderLoop = setInterval( function () {
    renderClock(minutes, secondHandCoor);
    minutes += speed;
    if(minutes >= 720){
      minutes -= 720;
    }
    // 195
    speed = Math.max(Math.abs(195 - minutes)/10, .001);

  }, 50);
}

$(document).ready( function () {
  windClock();
})


