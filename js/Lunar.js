/*
author:bill.kang
date:4/2/2013
description : chinese lunar object.
 */

//get lunar obj:year, month(start by 1), day and isLunarLeapMonth

(function(window,undefined){
	
/* ---------- private variable start ---------- */
	
	//store the lunar info from 1900 to 2100
	//every item express one year, it's a Hexadecimal number
	var lunarInfo = [
		0x4bd8, 0x4ae0, 0xa570, 0x54d5, 0xd260, 0xd950, 0x5554, 0x56af, 0x9ad0, 0x55d2,
		0x4ae0, 0xa5b6, 0xa4d0, 0xd250, 0xd255, 0xb54f, 0xd6a0, 0xada2, 0x95b0, 0x4977,
		0x497f, 0xa4b0, 0xb4b5, 0x6a50, 0x6d40, 0xab54, 0x2b6f, 0x9570, 0x52f2, 0x4970,
		0x6566, 0xd4a0, 0xea50, 0x6a95, 0x5adf, 0x2b60, 0x86e3, 0x92ef, 0xc8d7, 0xc95f,
		0xd4a0, 0xd8a6, 0xb55f, 0x56a0, 0xa5b4, 0x25df, 0x92d0, 0xd2b2, 0xa950, 0xb557,
		0x6ca0, 0xb550, 0x5355, 0x4daf, 0xa5b0, 0x4573, 0x52bf, 0xa9a8, 0xe950, 0x6aa0,
		0xaea6, 0xab50, 0x4b60, 0xaae4, 0xa570, 0x5260, 0xf263, 0xd950, 0x5b57, 0x56a0,
		0x96d0, 0x4dd5, 0x4ad0, 0xa4d0, 0xd4d4, 0xd250, 0xd558, 0xb540, 0xb6a0, 0x95a6,
		0x95bf, 0x49b0, 0xa974, 0xa4b0, 0xb27a, 0x6a50, 0x6d40, 0xaf46, 0xab60, 0x9570,
		0x4af5, 0x4970, 0x64b0, 0x74a3, 0xea50, 0x6b58, 0x5ac0, 0xab60, 0x96d5, 0x92e0,
		0xc960, 0xd954, 0xd4a0, 0xda50, 0x7552, 0x56a0, 0xabb7, 0x25d0, 0x92d0, 0xcab5,
		0xa950, 0xb4a0, 0xbaa4, 0xad50, 0x55d9, 0x4ba0, 0xa5b0, 0x5176, 0x52bf, 0xa930,
		0x7954, 0x6aa0, 0xad50, 0x5b52, 0x4b60, 0xa6e6, 0xa4e0, 0xd260, 0xea65, 0xd530,
		0x5aa0, 0x76a3, 0x96d0, 0x4afb, 0x4ad0, 0xa4d0, 0xd0b6, 0xd25f, 0xd520, 0xdd45,
		0xb5a0, 0x56d0, 0x55b2, 0x49b0, 0xa577, 0xa4b0, 0xaa50, 0xb255, 0x6d2f, 0xada0,
		0x4b63, 0x937f, 0x49f8, 0x4970, 0x64b0, 0x68a6, 0xea5f, 0x6b20, 0xa6c4, 0xaaef,
		0x92e0, 0xd2e3, 0xc960, 0xd557, 0xd4a0, 0xda50, 0x5d55, 0x56a0, 0xa6d0, 0x55d4,
		0x52d0, 0xa9b8, 0xa950, 0xb4a0, 0xb6a6, 0xad50, 0x55a0, 0xaba4, 0xa5b0, 0x52b0,
		0xb273, 0x6930, 0x7337, 0x6aa0, 0xad50, 0x4b55, 0x4b6f, 0xa570, 0x54e4, 0xd260,
		0xe968, 0xd520, 0xdaa0, 0x6aa6, 0x56df, 0x4ae0, 0xa9d4, 0xa4d0, 0xd150, 0xf252,
		0xd520
	];
	
	//chinese era array
	var gan=["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
	var zhi=["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
	
	//chinses zodiac array
	var animals=["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
	
	//chinese solar terms
	var solarTerms = ["小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至",
	                  "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"];
	var solarTermsInfo = [0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693,
	                      263343, 285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758];
	
	////chinese lunar month
	var chineseMonth = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '腊'];
	//chinese lunar day
	var chineseDay1 = ['日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
	var chineseDay2 = ['初', '十', '廿', '卅', ' '];
	
	
	//the number of days in every month
	var gregorianMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	//gregorian festival
	var gregorianFestival = [
		"0101*元旦",
		"0106  中国13亿人口日",
		"0110  中国110宣传日",
		
		"0202  世界湿地日",
		"0204  世界抗癌症日",
		"0210  世界气象日",
		"0214  情人节",
		"0221  国际母语日",
		"0207  国际声援南非日",
		
		"0303  全国爱耳日",
		"0308  妇女节",
		"0312  植树节 孙中山逝世纪念日",
		"0315  消费者权益保护日",
		"0321  世界森林日",
		"0322  世界水日",
		"0323  世界气象日",
		"0324  世界防治结核病日",
		
		"0401  愚人节",
		"0407  世界卫生日",
		"0422  世界地球日",
		
		"0501*国际劳动节",
		"0504  中国青年节",
		"0505  全国碘缺乏病日",
		"0508  世界红十字日",
		"0512  国际护士节",
		"0515  国际家庭日",
		"0517  世界电信日",
		"0518  国际博物馆日",
		"0519  中国汶川地震哀悼日 全国助残日",
		"0520  全国学生营养日",
		"0522  国际生物多样性日",
		"0523  国际牛奶日",
		"0531  世界无烟日",
		
		"0601  国际儿童节",
		"0605  世界环境日",
		"0606  全国爱眼日",
		"0617  防治荒漠化和干旱日",
		"0623  国际奥林匹克日",
		"0625  全国土地日",
		"0626  国际反毒品日",
		
		"0701  建党节 香港回归纪念日",
		"0707  抗日战争纪念日",
		"0711  世界人口日",
		
		"0801  八一建军节",
		"0815  日本正式宣布无条件投降日",
		
		"0908  国际扫盲日",
		"0909  毛泽东逝世纪念日",
		"0910  教师节",
		"0916  国际臭氧层保护日",
		"0917  国际和平日",
		"0918  九·一八事变纪念日",
		"0920  国际爱牙日",
		"0927  世界旅游日",
		"0928  孔子诞辰",
		
		"1001*国庆节 国际音乐节 国际老人节",
		"1002  国际减轻自然灾害日",
		"1004  世界动物日",
		"1007  国际住房日",
		"1008  世界视觉日 全国高血压日",
		"1009  世界邮政日",
		"1010  辛亥革命纪念日 世界精神卫生日",
		"1015  国际盲人节",
		"1016  世界粮食节",
		"1017  世界消除贫困日",
		"1022  世界传统医药日",
		"1024  联合国日",
		"1025  人类天花绝迹日",
		"1026  足球诞生日",
		"1031  万圣节",
		
		"1107  十月社会主义革命纪念日",
		"1108  中国记者日",
		"1109  消防宣传日",
		"1110  世界青年节",
		"1112  孙中山诞辰",
		"1114  世界糖尿病日",
		"1117  国际大学生节",
		
		"1201  世界艾滋病日",
		"1203  世界残疾人日",
		"1209  世界足球日",
		"1210  世界人权日",
		"1212  西安事变纪念日",
		"1213  南京大屠杀",
		"1220  澳门回归纪念日",
		"1221  国际篮球日",
		"1224  平安夜",
		"1225  圣诞节 世界强化免疫日",
		"1226  毛泽东诞辰"
	];

	//the festival depend on the month and week
	var gregorianFestivalByMonthAndWeek = [
		"0110 黑人日",
		"0150 世界麻风日",
		"0520 国际母亲节",
		"0530 全国助残日",
		"0630 父亲节",
		"0911 劳动节",
		"0932 国际和平日",
		"0940 国际聋人节 世界儿童日",
		"0950 世界海事日",
		"1011 国际住房日",
		"1013 国际减轻自然灾害日(减灾日)",
		"1144 感恩节"
	];
	
	//lunar festival
	var lunarFestival = [
			"0101*春节",
			"0102*年初二",
			"0103*年初三",
			"0115 元宵节",
			"0202 龙抬头",
			"0219 观世音圣诞",
			"0404 寒食节",
			"0408 佛诞节 ",
			"0505*端午节",
			"0606 天贶节 姑姑节",
			"0707 七夕",
			"0714 鬼节",
			"0715 盂兰节",
			"0730 地藏节",
			"0815*中秋节",
			"0909 重阳节",
			"1001 祭祖节",
			"1208 腊八节",
			"1223 过小年",
			"0100*除夕"
		];
	
	/* ---------- private variable end ---------- */

	
	/* ---------- public tool function start ---------- */
	
	var lunarConvertTool = {
			//the private root object
			//get the total number of days of lunar year
			getLunarYearDays : function(year){
				var i,sum=348;
	
				for(i=0x8000;i>0x8;i>>=1){
					sum += (lunarInfo[year-1900] & i) ? 1 : 0;
				}
	
				return sum + this.getLunarLeapDays(year);
			},
			//get the total number of days of leap month in lunar year
			getLunarLeapDays : function(year){
				if(this.getLunarLeapMonth(year)){
					return (lunarInfo[year - 1899] & 0xf) == 0xf ? 30 : 29;
				}else{
					return 0;
				}
			},
			//get leap month of lunar year,between 1 to 12,
			//if don't have, return 0
			getLunarLeapMonth : function(year){
				var month = lunarInfo[year-1900] & 0xf;
				return (month==0xf) ? 0 : month;
			},
			//get the total number of days in special lunar year and special month
			getLunarMonthDays : function(year,month){
				return (lunarInfo[year-1900] & (0x10000>>month)) ? 30 : 29;
			},
			//get the total number of days in special year and month (start from 0)
			getGregorianMonthDays : function(year, month){
				if(month==1){
					return ((year%4 == 0) && (year%100 != 0) || (year%400 == 0)) ? 29 : 28;
				}else{
					return gregorianMonth[month];
				}
			},
			//get chinese era
			getChineseEra : function(num){
				return gan[num%10]+zhi[num%12];
			},
			//get the offset days from the first day  in lunar year to No. X solar terms
			//start from '小寒'
			getOffsetOfSolarTerms : function(year,num){
				var offDate = new Date((31556925974.7*(year-1900) + solarTermsInfo[num]*60000) + Date.UTC(1900,0,6,2,5));
				return(offDate.getUTCDate());
			}
		};
	
	/* ---------- public tool function end ---------- */
	
	
	function /**
	 * @author cnbkang
	 *
	 */
	Lunar(date){
		var i,leap=0,temp=0;
		
		//the gregorian year
		this.year=date.getFullYear();
		//the gregorian month (start from 0)
		this.month=date.getMonth();
		//the gregorian day
		this.day=date.getDate();
		//get the weekday
		this.weekday=date.getDay();
		//get the current date
		this.date = date;

		//get the offset days from 1900/1/31 to test day
		var offset = (Date.UTC(this.year, this.month, this.day)-Date.UTC(1900,0,31))/86400000;
	
		for(i=1900;i<2100 && offset>0;i++){
			temp = lunarConvertTool.getLunarYearDays(i);
			offset-=temp;
		}
		
		if(offset<0){
			offset+=temp;
			i--;
		}
		
		//get lunar year
		this.lunarYear=i;
		
		leap = lunarConvertTool.getLunarLeapMonth(i);
		
		//if this month is lunar leap month
		this.isLunarLeapMonth=false;
		
		for(i=1;i<13 && offset>0;i++){
			if(leap>0 && i==(leap+1) && this.isLunarLeapMonth==false){
				--i;
				this.isLunarLeapMonth=true;
				temp = lunarConvertTool.getLunarLeapDays(this.lunarYear);
			}else{
				temp = lunarConvertTool.getLunarMonthDays(this.lunarYear,i);
			}
			
			if(this.isLunarLeapMonth==true && i==(leap+1)){
				this.isLunarLeapMonth=false;
			}
			
			offset-=temp;
		}
		
		if(offset==0 && leap>0 && i==(leap+1)){
			if(this.isLunarLeapMonth){
				this.isLunarLeapMonth=false;
			}else{
				this.isLunarLeapMonth=true;
				--i;
			}
		}
		
		if(offset<0){
			offset+=temp;
			--i;
		}
		
		//get the month
		this.lunarMonth=i;
		//get the day
		this.lunarDay=offset+1;
		
		//get lunar year chinese era name
		this.lunarYearEraName=this.getLunarYearEraName();
		//get lunar month chinese era name
		this.lunarMonthEraName=this.getLunarMonthEraName();
		//get lunar day chinese era name
		this.lunarDayEraName=this.getLunarDayEraName();
		
		//get chinese capital lunar month
		this.chineseLunarMonth=this.getChineseLunarMonth();
		//get chinese capital lunar day
		this.chineseLunarDay=this.getChineseLunarDay();
		
		//get lunar leap month
		this.lunarLeapMonth=lunarConvertTool.getLunarLeapMonth(this.lunarYear);
		//get the total days of special lunar year and month
		this.lunarMonthDays=this.getLunarMonthDays();
		//get the total days of special gregorian year and month
		this.gregorianMonthDays=lunarConvertTool.getGregorianMonthDays(this.year, this.month);

		//get Chinese zodiac
		this.chineseZodiac=this.getChineseZodiac();
		//solar terms
		this.solarTerms=this.getSolarTerms();
		//get lunar festival
		this.lunarFestival=this.getLunarFestival();
		//gregorian festival
		this.gregorianFestival=this.getGregorianFestival();
	}
	
	//prototype object
	Lunar.prototype={
		//get previous lunar day
		getPrevDay : function(){
			var _year = this.year;
			var _month = this.month;
			var _day = this.day - 1 ;

			if(_day < 0){
				_month--;
				if (_month < 0) {
					_month = 11;
					_year--;
				}
				if (_year < 1900) {
					_month = 0;
					_year = 1900;
				}
				_day = lunarConvertTool.getGregorianMonthDays(_year, _month);
			}
			
			return new Lunar(new Date(_year, _month, _day));
		},
		//get next lunar day
		getNextDay : function(){
			var _year = this.year;
			var _month = this.month;
			var _day = this.day + 1 ;

			var monthDays = lunarConvertTool.getGregorianMonthDays(_year, _month);
			
			if(_day > monthDays){
				_month++;
				_day = 1;
				if (_month > 11) {
					_month = 0;
					_year++;
				}
				if (_year > 2100) {
					_year = 2100;
					_month = 11;
					_day = lunarConvertTool.getGregorianMonthDays(_year, _month);
				}
			}
			
			return new Lunar(new Date(_year, _month, _day));
		},
		//get the lunar year chinese era name
		getLunarYearEraName : function(){
			var name='';
			if(this.month<2){
				name = lunarConvertTool.getChineseEra(this.year-1900+36-1);
			}else{
				name = lunarConvertTool.getChineseEra(this.year-1900+36);
			}
			
			//get the date of '立春'
			var term = lunarConvertTool.getOffsetOfSolarTerms(this.year,2);

			//adjust lunar year of 2td month depend on solar terms
			if(this.month==1 && this.day >= term){
				name = lunarConvertTool.getChineseEra(this.year-1900+36);
			}
			
			return name;
		},
		//get the lunar month chinese era name
		getLunarMonthEraName : function(){
			var name=lunarConvertTool.getChineseEra((this.year-1900)*12 + this.month + 12);
			
			//get the start day of this month's first solar terms
			var startDay = lunarConvertTool.getOffsetOfSolarTerms(this.year, 2*this.month);
			//adjust lunar month depend on solar terms
			if(this.day >= startDay){
				name=lunarConvertTool.getChineseEra((this.year-1900)*12 + this.month + 13);
			}
			
			return name;
		},
		//get the lunar day chinese era name
		getLunarDayEraName : function(){
			//first we need get the offset days, from 1900/1/1 to 1th day of this month in lunar
			//the offset from 1900/1/1 to 1970/1/1 is 25567, and the lunar day name of 1900/1/1 is '甲戌', 11th in chinese era
			var offsetDays = Date.UTC(this.year, this.month, 1)/86400000 + 25567 + 10;
			return lunarConvertTool.getChineseEra(offsetDays + this.day - 1);
		},
		//get real lunar month days, it's depend on if this month is lunar leap month
		getLunarMonthDays : function(){
			//if this month is lunar leap month
			if(this.isLunarLeapMonth){
				return lunarConvertTool.getLunarLeapDays(this.lunarYear);
			}else{
				return lunarConvertTool.getLunarMonthDays(this.lunarYear, this.lunarMonth);
			}
		},
		//get chinese capital lunar month
		getChineseLunarMonth:function(){
		    return chineseMonth[this.lunarMonth-1];
		},
		//get chinese capital lunar day
		getChineseLunarDay:function(){
			var str;

		    switch (this.lunarDay) {
		        case  10:
		        	str = '初十';  break;
		        case  20:
		        	str = '二十';  break;
		            break;
		        case  30:
		        	str = '三十';  break;
		            break;
		        default  :
		        	str = chineseDay2[Math.floor(this.lunarDay / 10)];
		        	str += chineseDay1[this.lunarDay % 10];
		    }
		    return str;
		},
		//get Solar Terms
		getSolarTerms : function(){
			var solar='';
			
			var offset1=lunarConvertTool.getOffsetOfSolarTerms(this.year, this.month*2),
				offset2=lunarConvertTool.getOffsetOfSolarTerms(this.year, this.month*2+1);
			if(this.day == offset1){
				solar = solarTerms[this.month*2];
			}else if(this.day == offset2){
				solar = solarTerms[this.month*2+1];
			}
			
			return solar;
		},
		//get Chinese Zodiac 
		getChineseZodiac : function(){
			return animals[(this.lunarYear-4) % 12];
		},
		//get lunar festival
		getLunarFestival : function(){
			var festival='';
			
			//get lunar festival
			for(i in lunarFestival){
				if(lunarFestival[i].match(/^(\d{2})(.{2})([\s\*])(.+)$/)){
					//month and day both equal or the last day of the month (New Year's eve)
					if((Number(RegExp.$1) == this.lunarMonth && Number(RegExp.$2) == this.lunarDay)
							|| (Number(RegExp.$1) == 1 && Number(RegExp.$2) == 0 && this.lunarMonth == 12 && this.getLunarMonthDays() == this.lunarDay)){
						festival += RegExp.$4 + ' ';
					}
				}
			}
	
			return festival.replace(/(^\s*)|(\s*$)/g,"");
		},
		//get gregorian festival
		getGregorianFestival : function(){
			var festival='';
			
			//get the total number of days
			var lengthOfDays = lunarConvertTool.getGregorianMonthDays(this.year, this.month);
			//get the weekday of the first day in this month
			var firstWeek= new Date(this.year, this.month, 1).getDay();
			
			//get gregorian festival
			for(i in gregorianFestival){
				if(gregorianFestival[i].match(/^(\d{2})(\d{2})([\s\*])(.+)$/)){
					if(Number(RegExp.$1) == (this.month+1) && Number(RegExp.$2) == this.day){
						festival += RegExp.$4 + ' ';
					}
				}
			}
			
			//get gregorian festival depend on month and week
			for(i in gregorianFestivalByMonthAndWeek){
				if(gregorianFestivalByMonthAndWeek[i].match(/^(\d{2})(\d)(\d)([\s\*])(.+)$/)){
					if(Number(RegExp.$1) == (this.month+1)){
						var tmp1=Number(RegExp.$2),
							tmp2=Number(RegExp.$3),
							tmp3=0,festDay=0;
						if(tmp1<5){
							festDay = (firstWeek>tmp2 ? 7 : 0) + 7*(tmp1-1) +tmp2 -firstWeek;
						}else{
							tmp1-=5;
							tmp3=(firstWeek + lengthOfDays - 1)%7;
							festDay=lengthOfDays - tmp3 - 7*tmp1 + tmp2 - (tmp2>tmp3?7:0) - 1;
						}
						
						if(this.day == festDay){
							festival += RegExp.$5 + ' ';
						}
					}
				}
			}
			
			return festival.replace(/(^\s*)|(\s*$)/g,"");
		}
	};
	
	Lunar.prototype.constructor=Lunar;
	
	window.Lunar=Lunar;
	window.lunarConvertTool=lunarConvertTool;
}(this));