/*
author:bill.kang
date:4/7/2013
description : calendar object
 */

(function(window, undefined) {

	// constructor
	function Calendar(options) {
		if (this.constructor != Calendar.prototype.constructor) {
			return new Calendar(options);
		}

		this.options = $.extend({
			animation : 'slide',
			duration : 0.5
		}, options);

		// set today's info
		var today = new Date();
		this.todayYear = today.getFullYear();
		this.todayMonth = today.getMonth();
		this.todayDay = today.getDate();

		// get the year and month
		if (this.options && this.options.date
				&& toString.call(this.options.date) == '[object Date]') {
			this.year = this.options.date.getFullYear();
			this.month = this.options.date.getMonth();
			this.day = this.options.date.getDate();
		} else {
			var date = new Date();
			this.year = date.getFullYear();
			this.month = date.getMonth();
			this.day = date.getDate();
		}

		// get the rootElement which contain the calendar
		if (this.options && this.options.rootElement) {
			if (toString.call(this.options.rootElement) == '[object String]') {
				this.rootElement = $(this.options.rootElement);
			} else {
				this.rootElement = this.options.rootElement;
			}
		} else {
			this.rootElement = $("<div id='lunarCalendar' style='width:100%;'></div>");
			this.rootElement.appendTo($('body'));
		}
		this.rootElement.css({
			position : 'relative'
		});

		var self = this;
		// add swipe left/right event for rootElement
		$("#content").bind('swiperight', function() {
			self.prevMonthAction();
		}).bind('swipeleft', function() {
			self.nextMonthAction();
		});

		// store 3 months info,
		// this.data[0] represent previous month
		// this.data[1] represent current month
		// this.data[2] represent next month
		this.data = [];

		// if prev/next action
		this.isPrevAction = false;
		this.isNextAction = false;
		
		//if rendering the html
		this.isRendering=false;

		// init calendar data
		this.initData();
		// render calendar
		this.render();
	}

	Calendar.prototype = {
		// init calendar data
		initData : function() {

			/* ----- init calendar data info start ----- */

			// get prev/next month date
			var prevMonth = this.getPrevMonth();
			var nextMonth = this.getNextMonth();

			// first time init calendar, any data is null, neither prev nor next
			// action
			// need init all calendar data
			if ((this.data[0] == null || this.data[1] == null || this.data[2] == null)
					|| (!this.isPrevAction && !this.isNextAction)) {

				/* ----- init previous month data start ----- */

				// get the first day of previous month
				this.data[0] = [];
				this.data[0].selectedDay = prevMonth.getDate();
				this.data[0][0] = new Lunar(new Date(prevMonth.getFullYear(),
						prevMonth.getMonth(), 1));
				// get the total days of special year and month
				this.data[0].length = this.data[0][0].gregorianMonthDays;

				// init every day in special year and month
				for ( var i = 1; i < this.data[0].length; i++) {
					this.data[0][i] = new Lunar(new Date(prevMonth
							.getFullYear(), prevMonth.getMonth(), i + 1));
				}

				/* ----- init previous month data end ----- */

				/* ----- init selected month data start ----- */

				// get the first day of previous month
				this.data[1] = [];
				this.data[1].selectedDay = this.day;
				this.data[1][0] = new Lunar(new Date(this.year, this.month, 1));
				// get the total days of special year and month
				this.data[1].length = this.data[1][0].gregorianMonthDays;

				// init every day in special year and month
				for ( var i = 1; i < this.data[1].length; i++) {
					this.data[1][i] = new Lunar(new Date(this.year, this.month,
							i + 1));
				}

				/* ----- init selected month data end ----- */

				/* ----- init next month data start ----- */

				// get the first day of previous month
				this.data[2] = [];
				this.data[2].selectedDay = nextMonth.getDate();
				this.data[2][0] = new Lunar(new Date(nextMonth.getFullYear(),
						nextMonth.getMonth(), 1));
				// get the total days of special year and month
				this.data[2].length = this.data[2][0].gregorianMonthDays;

				// init every day in special year and month
				for ( var i = 1; i < this.data[2].length; i++) {
					this.data[2][i] = new Lunar(new Date(nextMonth
							.getFullYear(), nextMonth.getMonth(), i + 1));
				}

				/* ----- init next month data end ----- */

			}
			// prev month action
			else if (this.isPrevAction) {
				this.data[2] = this.data[1];
				this.data[1] = this.data[0];

				/* ----- init previous month data start ----- */

				// get the first day of previous month
				this.data[0].selectedDay = prevMonth.getDate();
				this.data[0][0] = new Lunar(new Date(prevMonth.getFullYear(),
						prevMonth.getMonth(), 1));
				// get the total days of special year and month
				this.data[0].length = this.data[0][0].gregorianMonthDays;

				// init every day in special year and month
				for ( var i = 1; i < this.data[0].length; i++) {
					this.data[0][i] = new Lunar(new Date(prevMonth
							.getFullYear(), prevMonth.getMonth(), i + 1));
				}

				/* ----- init previous month data end ----- */
			}
			// next month action
			else if (this.isNextAction) {
				this.data[0] = this.data[1];
				this.data[1] = this.data[2];

				/* ----- init next month data start ----- */

				// get the first day of previous month
				this.data[2].selectedDay = nextMonth.getDate();
				this.data[2][0] = new Lunar(new Date(nextMonth.getFullYear(),
						nextMonth.getMonth(), 1));
				// get the total days of special year and month
				this.data[2].length = this.data[2][0].gregorianMonthDays;

				// init every day in special year and month
				for ( var i = 1; i < this.data[2].length; i++) {
					this.data[2][i] = new Lunar(new Date(nextMonth
							.getFullYear(), nextMonth.getMonth(), i + 1));
				}

				/* ----- init next month data end ----- */
			}

			/* ----- init calendar data info end ----- */
		},
		// render calendar
		render : function() {
			//if rendering the html, return
			//prevent repeated drawing
			if(this.isRendering){
				return;
			}
			
			//set isRendering true, prevent repeated drawing
			this.isRendering = true;
			
			// get all calendar-container
			var $container = this.rootElement.find(".calendar-container");

			// if $container is null or less than 3
			// empty this.rootElement's children
			if (!$container || $container.length < 3) {
				this.rootElement.children().remove();
			}

			var screenWidth = this.rootElement.width();

			var prevMonth = this.getPrevMonth();
			var nextMonth = this.getNextMonth();

			this.rootElement.css({
				'-webkit-perspective' : screenWidth * 4 + 'px'
			});

			if (this.isPrevAction) {
				// remove the last calendar-container
				this.rootElement.find(".calendar-container").eq(2).remove();
				// add new calendar-container as the first calendar-container
				this.rootElement.prepend(this.getCalendarHtml(this.data[0],
						false));

				// hide the current calendar-container, and show the prev one
				if (this.options.animation == 'slide') {
					this.rootElement.find(".calendar-container").eq(2).animate(
							{
								left : screenWidth + 'px'
							}, this.options.duration * 1000, function() {
								$(this).css({
									left : '0px',
									display : 'none'
								});
							});
					this.rootElement.find(".calendar-container").eq(1).css({
						left : -screenWidth + 'px',
						display : 'block'
					}).animate({
						left : '0px'
					}, this.options.duration * 1000);
				} else {
					this.rootElement.find(".calendar-container").eq(2).css({
						'-webkit-transform' : 'rotateY( 180deg )'
					});
					this.rootElement.find(".calendar-container").eq(1).css({
						'-webkit-transform' : 'rotateY( 0deg )'
					});
				}
			} else if (this.isNextAction) {
				// remove the last calendar-container
				this.rootElement.find(".calendar-container").eq(0).remove();
				// add new calendar-container as the last calendar-container
				this.rootElement.append(this.getCalendarHtml(this.data[2],
						false));

				// hide the current calendar-container, and show the next one
				if (this.options.animation == 'slide') {
					this.rootElement.find(".calendar-container").eq(0).animate(
							{
								left : -screenWidth + 'px'
							}, this.options.duration * 1000, function() {
								$(this).css({
									left : '0px',
									display : 'none'
								});
							});
					this.rootElement.find(".calendar-container").eq(1).css({
						left : screenWidth,
						display : 'block'
					}).animate({
						left : '0px'
					}, this.options.duration * 1000);
				} else {
					this.rootElement.find(".calendar-container").eq(0).css({
						'-webkit-transform' : 'rotateY( 180deg )'
					});
					this.rootElement.find(".calendar-container").eq(1).css({
						'-webkit-transform' : 'rotateY( 0deg )',
						display : 'block'
					});
				}
			} else {
				// add calendar html to rootElement
				this.rootElement.append(this.getCalendarHtml(this.data[0],
						false));
				this.rootElement.append(this
						.getCalendarHtml(this.data[1], true));
				this.rootElement.append(this.getCalendarHtml(this.data[2],
						false));
			}

			// add event listener
			this.addCalendarItemsEventListener();

			// reset isPrevAction and isNextAction to false
			this.isPrevAction = false;
			this.isNextAction = false;
			
			//set isRendering false
			var self = this;
			setTimeout(function(){
				self.isRendering = false;
			}, this.options.duration * 1000);
		},
		// get calendar html string
		getCalendarHtml : function(data, display) {

			// create container
			var html = '';
			if (this.options.animation == 'slide') {
				if (display) {
					html = "<div class='calendar-container' style='display:block;'>";
				} else {
					html = "<div class='calendar-container' style='display:none;'>";
				}
			} else {
				if (display) {
					html = "<div class='calendar-container' style='-webkit-transform:rotateY(0deg); -webkit-transition:-webkit-transform " + this.options.duration + "s; -webkit-backface-visibility:hidden;'>";
				} else {
					html = "<div class='calendar-container' style='-webkit-transform:rotateY(180deg); -webkit-transition:-webkit-transform " + this.options.duration + "s; -webkit-backface-visibility:hidden;'>";
				}
			}

			// create header, add year-month info
			html += "<div class='container-header'>";
			html += "<a class='prev-btn'><</a>";
			html += data[0].year + "年" + (data[0].month + 1) + "月&nbsp;";
			html += data[0].lunarYearEraName + "【" + data[0].chineseZodiac
					+ "】年" + data[0].lunarMonthEraName + "月";
			html += "<a class='next-btn'>></a>";
			html += "</div>";

			// create calendar body
			html += "<div class='container-body'>";
			// create week header info
			html += "<ul class='week-header'>";
			html += "<li>日</td>";
			html += "<li>一</li>";
			html += "<li>二</li>";
			html += "<li>三</li>";
			html += "<li>四</li>";
			html += "<li>五</li>";
			html += "<li>六</li>";
			html += "</ul>";

			// create calendar items, display daily info
			html += "<ul class='calendar-items'>";
			// add empty li
			for ( var i = 0; i < data[0].weekday; i++) {
				html += "<li class='empty'></li>";
			}
			// add daily info
			for ( var i = 0; i < data.length; i++) {
				// display gregotian info
				// display today's info
				if (this.todayYear == data[i].year
						&& this.todayMonth == data[i].month
						&& this.todayDay == (i + 1)) {
					html += "<li class='today' data-item='" + i + "'>";
				}
				// display selected day's info
				else if (data.selectedDay == (i + 1)) {
					html += "<li class='selected' data-item='" + i + "'>";
				} else {
					html += "<li data-item='" + i + "'>";
				}

				if (data[i].weekday == 0 || data[i].weekday == 6) {
					html += "<span class='gregorian yellow'>" + data[i].day
							+ "</span>";
				} else {
					html += "<span class='gregorian'>" + data[i].day
							+ "</span>";
				}

				// display lunar info
				var lunarInfo = '';
				// default display lunar daily info
				if (data[i].lunarDay == 1) {
					lunarInfo = (data[i].isLunarLeap ? "闰" : "")
							+ data[i].lunarMonth + "月"
							+ (data.monthDays == 29 ? "小" : "大");
				} else {
					lunarInfo = data[i].chineseLunarDay;
				}
				// if has lunar festival, display it instand of lunar daily info
				if (data[i].solarTerms) {
					lunarInfo = data[i].solarTerms;
				}
				// if has lunar festival, display it instand of lunar daily info
				if (data[i].lunarFestival && data[i].lunarFestival.length <= 3) {
					lunarInfo = data[i].lunarFestival;
				}
				html += "<span class='lunar'>" + lunarInfo + "</span></li>";
			}
			// add empty li
			for ( var i = 0; i < 6 - data[data.length - 1].weekday; i++) {
				html += "<li class='empty'></li>";
			}
			html += "</ul>";
			html += "</div>";

			return html;
		},
		// add event listener for calendar-items
		addCalendarItemsEventListener : function() {
			var self = this;

			// add click event for prev/next btn
			this.rootElement.find(".container-header").undelegate('a', 'click');
			this.rootElement.find(".container-header").eq(1).delegate('a',
					'click', function(e) {
						if (this.className == 'prev-btn') {
							self.prevMonthAction();
						} else if (this.className == 'next-btn') {
							self.nextMonthAction();
						}
					});

			// add touch event listener for calendar's item
			// enter the detail page
			this.rootElement.find(".calendar-items").undelegate('li', 'click');
			this.rootElement.find(".calendar-items").eq(1).delegate(
					'li',
					'click',
					function(e) {
						if (this.dataset["item"]) {
							var selectedDay = Number(this.dataset["item"]) + 1;
							SUIT.modalSelectDate(new Date(self.data[1][0].year,
									self.data[1][0].month, selectedDay));
						}
					});
		},
		// get previous month date
		getPrevMonth : function() {
			var _year = this.year;
			var _month = this.month - 1;
			var _day = this.day;

			if (_month < 0) {
				_month = 11;
				_year--;
			}
			if (_year < 1900) {
				_month = 0;
				_year = 1900;
			}

			// get the total num of days
			var monthDays = lunarConvertTool.getGregorianMonthDays(_year,
					_month);
			if (_day > monthDays) {
				_day = monthDays;
			}

			return new Date(_year, _month, _day);
		},
		// get next month date
		getNextMonth : function() {
			var _year = this.year;
			var _month = this.month + 1;
			var _day = this.day;

			if (_month > 11) {
				_month = 0;
				_year++;
			}
			if (_year > 2100) {
				_month = 11;
				_year = 2100;
			}

			// get the total num of days
			var monthDays = lunarConvertTool.getGregorianMonthDays(_year,
					_month);
			if (_day > monthDays) {
				_day = monthDays;
			}

			return new Date(_year, _month, _day);
		},
		// change the date
		changeDate : function(date) {
			// set year and month
			this.year = date.getFullYear();
			this.month = date.getMonth();
			this.day = date.getDate();

			// recreate the calendar
			this.initData();
			this.render();
		},
		// prev month action
		prevMonthAction : function() {
			this.isPrevAction = true;
			this.isNextAction = false;

			this.changeDate(this.getPrevMonth());
		},
		// next month action
		nextMonthAction : function() {
			this.isPrevAction = false;
			this.isNextAction = true;

			this.changeDate(this.getNextMonth());
		}
	};

	Calendar.prototype.constructor = Calendar;

	window.Calendar = Calendar;
})(this);