var myScroll,
    pullDownEl, pullDownOffset,
    pullUpEl, pullUpOffset,
    generatedCount = 0;

function pullDownAction() {
    // setTimeout(function() { // <-- Simulate network congestion, remove setTimeout from production!
    var el, li, i;
    el = document.getElementById('thelist');

    myScroll.refresh();
    return false;

    for (i = 0; i < 3; i++) {
        li = document.createElement('li');
        li.innerText = 'Generated row ' + (++generatedCount);
        el.insertBefore(li, el.childNodes[0]);
    }

    myScroll.refresh(); // Remember to refresh when contents are loaded (ie: on ajax completion)
    // }, 1000); // <-- Simulate network congestion, remove setTimeout from production!
}

function pullUpAction() {
    // setTimeout(function() { // <-- Simulate network congestion, remove setTimeout from production!
    var el, li, i;
    el = document.getElementById('thelist');

    myScroll.refresh();
    return false;

    for (i = 0; i < 3; i++) {
        li = document.createElement('li');
        li.innerText = 'Generated row ' + (++generatedCount);
        el.appendChild(li, el.childNodes[0]);
    }

    myScroll.refresh(); // Remember to refresh when contents are loaded (ie: on ajax completion)
    // }, 1000); // <-- Simulate network congestion, remove setTimeout from production!
}

function loaded(type) {

    var upFlag = false;
    var downFlag = false;

    switch (type) {
        case 'up':
            upFlag = true;
            break;

        case 'down':
            downFlag = true;
            break;

        case 'updown':
            upFlag = true;
            downFlag = true;
            break;

        default:
            upFlag = true;
            downFlag = true;
            break;
    }

    pullDownEl = document.getElementById('pullDown');
    if (downFlag) { pullDownOffset = pullDownEl.offsetHeight; }
    pullUpEl = document.getElementById('pullUp');
    if (upFlag) { pullUpOffset = pullUpEl.offsetHeight; }

    myScroll = new iScroll('wrapper', {
        useTransition: true,
        topOffset: pullDownOffset,
        onRefresh: function() {
            if (downFlag && pullDownEl.className.match('loading')) {
                pullDownEl.className = '';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
            } else if (upFlag && pullUpEl.className.match('loading')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
            }
        },
        onScrollMove: function() {
            if (downFlag && this.y > 5 && !pullDownEl.className.match('flip')) {
                pullDownEl.className = 'flip';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Release to refresh...';
                this.minScrollY = 0;
            } else if (downFlag && this.y < 5 && pullDownEl.className.match('flip')) {
                pullDownEl.className = '';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
                this.minScrollY = -pullDownOffset;
            } else if (upFlag && this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                pullUpEl.className = 'flip';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Release to refresh...';
                this.maxScrollY = this.maxScrollY;
            } else if (upFlag && this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
                this.maxScrollY = pullUpOffset;
            }
        },
        onScrollEnd: function() {
            if (downFlag && pullDownEl.className.match('flip')) {
                pullDownEl.className = 'loading';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';
                pullDownAction(); // Execute custom function (ajax call?)
            } else if (upFlag && pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Loading...';
                pullUpAction(); // Execute custom function (ajax call?)
            }
        }
    });

    // setTimeout(function() {
    document.getElementById('wrapper').style.left = '0';
    // }, 800);
}
