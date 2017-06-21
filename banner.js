var Banner = function () {
    this.bannerElm = $('.banner');
    this.banner_img = $('.banner_img li');
    this.banner_select = $('.banner_select');
    this.W = window.innerWidth;
    this.init();
}

Banner.prototype = {
    constructor: Banner,

    init: function () {
        this.length = this.banner_img.length;
        if (this.length > 1) {
            this.timer = null;
            this.timerAnimate = null;
            this.isAnimate = true;
            this.isTouch = true;

            this.initSelectItem();
            this.initImgItem(0);

            this.touch();
        }

        //this.click();
    },

    initSelectItem: function () {
        var li = '';

        for (var i = 0; i < this.length; i++) {
            li += '<li></li>';
        }
        this.banner_select.html(li);
        this.banner_select_li = this.banner_select.find('li');
        this.banner_select_li.eq(0).addClass('on');

        var w = this.banner_select.width();
        var left = (this.W - w) / 2;
        this.banner_select.css('left', left + 'px');
    },

    initImgItem: function (index) {
        for (var i = 0; i < this.length; i++) {
            this.banner_img.eq(i).css('left', this.W * (i - index) + 'px');
        }
    },

    getIndex: function () {
        var index;
        for (var i = 0; i < this.banner_select_li.length; i++) {
            if (this.banner_select_li.eq(i).hasClass('on')) {
                index = i;
                break;
            }
        }

        return index;
    },

    animate: function (index, fn, distance) {
        if (!this.isAnimate) return;
        this.isAnimate = false;
        var left = (index - this.getIndex()) * this.W - (distance || 0);
        var _this = this;
        _this.timer = setInterval(function () {
            var speed = left / 10;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            var surplus = left - speed;
            if (surplus > 0 && surplus <= 1 || surplus < 0 && surplus >= -1) {
                _this.initImgItem(index);
                clearInterval(_this.timer);
                _this.banner_select_li.removeClass('on');
                _this.banner_select_li.eq(index).addClass('on');
                _this.isAnimate = true;
                fn && fn();
            }

            left -= speed;

            _this.banner_img.each(function () {
                var leftNow = parseInt($(this).css('left'));
                $(this).css('left', leftNow - speed + 'px');
            })
        }, 16);
    },

    nextLimit: function (distant) {
        var left = parseInt(this.banner_img.eq(this.length - 1).css('left')) + this.W;
        this.banner_img.eq(0).css('left', left + 'px');
        var _this = this;
        this.animate(this.length, function () {
            _this.banner_select_li.removeClass('on');
            _this.banner_select_li.eq(0).addClass('on');
            _this.initImgItem(0);
        }, distant)
    },

    preLimit: function (distant) {
        var left = parseInt(this.banner_img.eq(0).css('left')) - this.W;
        this.banner_img.eq(length - 1).css('left', left + 'px');
        var _this = this;
        this.animate(-1, function () {
            _this.banner_select_li.removeClass('on');
            _this.banner_select_li.eq(_this.length - 1).addClass('on');
            _this.initImgItem(_this.length - 1);
        }, distant)
    },

    click: function () {
        var _this = this;
        this.banner_select_li.each(function (i) {
            $(this).on('touchstart', function () {
                _this.animate(i);
            })
        });
    },

    touch: function () {
        var _this = this;

        this.bannerElm.on('touchstart', function (e) {
            if (_this.isAnimate) {
                _this.isTouch = true;
                _this.start = e.originalEvent.changedTouches[0].clientX;
            }
        });

        this.bannerElm.on('touchmove', function (e) {
            if (_this.isTouch && _this.isAnimate) {
                var index = _this.getIndex();

                _this.move = e.originalEvent.changedTouches[0].clientX;
                var distant = _this.start - _this.move;

                if (Math.abs(distant) >= _this.W) {
                    distant = distant > 0 ? _this.W : -_this.W;
                }

                if (index === 0) {
                    _this.banner_img.each(function (i) {
                        if (i === _this.length - 1 && distant < 0) {
                            var left = (-1 * _this.W) - distant;
                        }
                        else {
                            var left = ((i - index) * _this.W) - distant;
                        }

                        $(this).css('left', left + 'px');
                    })
                }
                else if (index === _this.length - 1) {
                    _this.banner_img.each(function (i) {
                        if (i === 0 && distant > 0) {
                            var left = _this.W - distant;
                        }
                        else {
                            var left = ((i - index) * _this.W) - distant;
                        }

                        $(this).css('left', left + 'px');
                    })
                }
                else {
                    _this.banner_img.each(function (i) {
                        var left = ((i - index) * _this.W) - distant;

                        $(this).css('left', left + 'px');
                    })
                }
            }
        });

        this.bannerElm.on('touchend', function (e) {
            if (_this.isTouch && _this.isAnimate) {
                _this.isTouch = false;

                var index = _this.getIndex();

                _this.move = e.originalEvent.changedTouches[0].clientX;
                var distant = _this.start - _this.move;

                if (Math.abs(distant) >= _this.W) {
                    distant = distant > 0 ? _this.W : -_this.W;
                }

                if (distant > _this.W / 2) {
                    index + 1 >= _this.length ? _this.nextLimit(distant) : _this.animate(index + 1, null, distant);
                    
                }
                else if (distant < -_this.W / 2) {
                    index - 1 < 0 ? _this.preLimit(distant) : _this.animate(index - 1, null, distant);
                }
                else{
                    _this.animate(index, null, distant);
                }

            }
        });
    }
}

$(function () {
    window.banner = new Banner();
})
