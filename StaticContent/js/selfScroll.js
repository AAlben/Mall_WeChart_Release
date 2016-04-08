var myScroll,
    pullDownEl, pullDownOffset,
    pullUpEl, pullUpOffset,
    generatedCount = 0;

function ScrollRefreshF() {
    myScroll.refresh();
}

function pullDownAction(vDeferred, vFun) {
    // setTimeout(function() { // <-- Simulate network congestion, remove setTimeout from production!
    var el, li, i;
    el = document.getElementById('thelist');

    //注册事件
    vDeferred.done(ScrollRefreshF);

    //执行
    vFun(vDeferred);

    return false;

    for (i = 0; i < 3; i++) {
        li = document.createElement('li');
        li.innerText = 'Generated row ' + (++generatedCount);
        el.insertBefore(li, el.childNodes[0]);
    }

    myScroll.refresh(); // Remember to refresh when contents are loaded (ie: on ajax completion)
    // }, 1000); // <-- Simulate network congestion, remove setTimeout from production!
}

function pullUpAction(vDeferred, vFun) {
    // setTimeout(function() { // <-- Simulate network congestion, remove setTimeout from production!
    var el, li, i;
    el = document.getElementById('thelist');

    //注册事件
    vDeferred.done(ScrollRefreshF);

    //执行
    vFun(vDeferred);

    return false;

    for (i = 0; i < 3; i++) {
        li = document.createElement('li');
        li.innerText = 'Generated row ' + (++generatedCount);
        el.appendChild(li, el.childNodes[0]);
    }

    myScroll.refresh(); // Remember to refresh when contents are loaded (ie: on ajax completion)
    // }, 1000); // <-- Simulate network congestion, remove setTimeout from production!
}

function loaded(type, vDeferred, vFunNa, vFunNb) {

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
        onRefresh: function () {
            if (downFlag && pullDownEl.className.match('loading')) {
                pullDownEl.className = '';
                pullDownEl.querySelector('.pullDownLabel').innerText = '下拉刷新';
            } else if (upFlag && pullUpEl.className.match('loading')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerText = '上拉加载更多';
            }
        },
        onScrollMove: function () {
            if (downFlag && this.y > 5 && !pullDownEl.className.match('flip')) {
                pullDownEl.className = 'flip';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '向上松手刷新';
                this.minScrollY = 0;
            } else if (downFlag && this.y < 5 && pullDownEl.className.match('flip')) {
                pullDownEl.className = '';
                pullDownEl.querySelector('.pullDownLabel').innerText = '下拉刷新';
                this.minScrollY = -pullDownOffset;
            } else if (upFlag && this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                pullUpEl.className = 'flip';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '向下松手加载';
                this.maxScrollY = this.maxScrollY;
            } else if (upFlag && this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerText = '上拉加载更多';
                this.maxScrollY = pullUpOffset;
            }
        },
        onScrollEnd: function () {
            if (downFlag && pullDownEl.className.match('flip')) {
                pullDownEl.className = 'loading';
                pullDownEl.querySelector('.pullDownLabel').innerText = '加载中';
                pullDownAction(vDeferred, vFunNa); // Execute custom function (ajax call?)
            } else if (upFlag && pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerText = '加载中';
                pullUpAction(vDeferred, vFunNb); // Execute custom function (ajax call?)
            }
        }
    });

    // setTimeout(function() {
    document.getElementById('wrapper').style.left = '0';
    // }, 800);
}
