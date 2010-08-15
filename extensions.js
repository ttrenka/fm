/********************************************************************************
	File: 		Extensions.js
	Version: 	1.0.0
	Date:		2003-01-18

	f(m) Base Class Library
	A ECMAScript library to serve as the foundation 
	for ECMAScript-hosted application development.
	Copyright (C) 2003 Thomas R. Trenka, Ph.D.

	This library is free software; you can redistribute it and/or
	modify it under the terms of the GNU Lesser General Public
	License as published by the Free Software Foundation; either
	version 2.1 of the License, or any later version.

	This library is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
	Lesser General Public License for more details.

	You should have received a copy of the GNU Lesser General Public
	License along with this library; if not, write to the Free Software
	Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA

	Extension definitions to the core objects of the ECMAScript system.
	Most Date and String extensions courtesy of Aaron Boodman's Client Validation
	Tools:  http://www.youngpup.net/?request=/snippets/client-validation.xml 

	Additional Math functions by 
		Dan Pupius http://pupius.net
		Scott Andrew LePera http://www.scottandrew.com
	Object.TypeExists / Object.CreateFromType originally 
		from David Schontzler http://www.stilleye.com
**********************************************************************************/
Array.prototype.Add = function(o){ this.push(o) } ;
Array.prototype.BinarySearch = function(key, fn) {
	var arr = ([].concat(this)).sort((fn?fn:'')) ;
	var low = -1 ;
	var high = arr.length ;
	var i ;
	while ((high - low) > 1) {
		i = ((low + high) >>> 1) ;
		if (key <= arr[i]) high = i ;
		else low = i ;
	}
	if (key == arr[high]) return high ;
	return -1 ;
} ;
Array.prototype.Clear = function() { this.splice(0, this.length) ; } ;
Array.prototype.Contains = function(o) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == o) return true ;
	}
	return false ;
} ;
Array.prototype.IndexOf = function(o) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == o) return i ;
	}
	return -1 ;
} ;
Array.prototype.Insert = function(i, o) { this.splice(i,0,o) ; } ;
Array.prototype.Item = function(k){ return this[k] ; } ;
Array.prototype.Remove = function(o) {
	var i = this.IndexOf(o) ;
	if (i >= 0) this.splice(i,1) ;
} ;
Array.prototype.RemoveAt = function(i) { this.splice(i,1) ; } ;

Date.FormatTypes = { ShortDate:0, LongDate:1, ShortEuroDate:2, LongEuroDate:3, Numeric:4, NumericEuro:5, Time:6, TimeMilitary:7, ODBC:8, XSD:9 } ; 
Date.prototype.GetDayOfWeekName = function() { return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][this.getDay()] ; }
Date.prototype.GetDayOfWeekShortName = function() { return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][this.getDay()] ; }
Date.prototype.GetMonthName = function() { return ["January","February","March","April","May","June","July","August", "September","October","November","December"][this.getMonth()] ; } ;
Date.prototype.GetMonthShortName = function() { return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug", "Sep","Oct","Nov","Dec"][this.getMonth()] ; } ;
Date.prototype.GetHumanDateString = function() { return this.getMonthName() + " " + this.getDate() + ", " + this.getFullYear() ; } ;
Date.prototype.GetShortHumanDateString = function(delim) { 
	if (!delim) var delim = "-" ; 
	return this.getMonthShortName() + delim + this.getDate() + delim + this.getYear() ; 
} ;
Date.prototype.GetShortDateString = function(delim) {
	if (!delim) var delim = "-" ; 
	return (this.getMonth()+1) + delim + this.getDate() + delim + this.getYear() ; 
} ;
Date.prototype.GetHumanTimeString = function() {
	var h = this.getHours() ;
	var m = "00" + this.getMinutes() ;
	var t = h >= 12 ? "pm" : "am" ;
	if (h == 0) h = 24 ;
	if (h > 12) h -= 12 ;
	return h + ":" + m.substr(-2,2) + " " + t ;
} ;
Date.prototype.Format = function(FormatType) {
	switch (FormatType) {
		case Date.FormatTypes.ShortDate : return this.GetShortHumanDateString() ;
		case Date.FormatTypes.LongDate : return this.GetHumanDateString() ;
		case Date.FormatTypes.ShortEuroDate : return this.getDate() + "-" + this.GetMonthShortName() + "-" + this.getYear() ;
		case Date.FormatTypes.LongEuroDate : return this.getDate() + " " + this.GetMonthName() + " " + this.getFullYear() ;
		case Date.FormatTypes.Numeric : return (this.getMonth()+1) + "-" + this.getDate() + "-" + this.getYear() ;
		case Date.FormatTypes.NumericEuro : return this.getDate() + "-" + (this.getMonth()+1) + "-" + this.getYear() ;
		case Date.FormatTypes.Time : return this.GetHumanTimeString() ;
		case Date.FormatTypes.TimeMilitary : {
			var h = '00' + this.getHours() ;
			var m = '00' + this.getMinutes() ;
			return h.substr(-2,2) + ':' + m.substr(-2,2) ;
		}
		case Date.FormatTypes.ODBC : {
			var m = '00' + (this.getMonth() + 1) ;
			var d = '00' + this.getDate() ;
			var h = '00' + this.getHours() ;
			var mn = '00' + this.getMinutes() ;
			var s = '00' + this.getSeconds() ;
			return this.getFullYear() + '-' + m.substr(-2,2) + '-' + d.substr(-2,2) + ' ' + h.substr(-2,2) + ':' + mn.substr(-2,2) + ':' + s.substr(-2,2) ;
		}
		case Date.FormatTypes.XSD : {
			var m = '00' + (this.getUTCMonth() + 1) ;
			var d = '00' + this.getUTCDate() ;
			var h = '00' + this.getUTCHours() ;
			var mn = '00' + this.getUTCMinutes() ;
			var s = '00' + this.getUTCSeconds() ;
			return this.getUTCFullYear() + '-' + m.substr(-2,2) + '-' + d.substr(-2,2) + ' ' + h.substr(-2,2) + ':' + mn.substr(-2,2) + ':' + s.substr(-2,2) + 'Z' ;
		} 
		default : return this.toString() ;
	}
} ;
Date.CompareTypes = { Default:0, Date:1, Time:2 } ;
Date.prototype.Compare = function(dateToCompareTo, options) {
	if (!dateToCompareTo) var dateToCompareTo = new Date() ;
	if (!options) var options = Date.CompareTypes.Date | Date.CompareTypes.Time ;
	var d1 = new Date(
		((options & Date.CompareTypes.Date)?(this.getFullYear()):(new Date().getFullYear())) , 
		((options & Date.CompareTypes.Date)?(this.getMonth()):(new Date().getMonth())) , 
		((options & Date.CompareTypes.Date)?(this.getDate()):(new Date().getDate())) , 
		((options & Date.CompareTypes.Time)?(this.getHours()):0) , 
		((options & Date.CompareTypes.Time)?(this.getMinutes()):0) , 
		((options & Date.CompareTypes.Time)?(this.getSeconds()):0)
	) ;
	var d2 = new Date(
		((options & Date.CompareTypes.Date)?(dateToCompareTo.getFullYear()):(new Date().getFullYear())) , 
		((options & Date.CompareTypes.Date)?(dateToCompareTo.getMonth()):(new Date().getMonth())) , 
		((options & Date.CompareTypes.Date)?(dateToCompareTo.getDate()):(new Date().getDate())) , 
		((options & Date.CompareTypes.Time)?(dateToCompareTo.getHours()):0) , 
		((options & Date.CompareTypes.Time)?(dateToCompareTo.getMinutes()):0) , 
		((options & Date.CompareTypes.Time)?(dateToCompareTo.getSeconds()):0)
	) ;
	if (d1.getTime() > d2.getTime()) return 1 ;
	if (d1.getTime() < d2.getTime()) return -1 ;
	return 0 ;
} ;
Date.AddUnits = { Year:0,Month:1,Day:2,Hour:3,Minute:4,Second:5,Millisecond:6 } ;
Date.prototype.Add = function(unit, n) {
	if (!unit) throw new Error("Date.Add(): you must specify the unit you wish to use for addition.") ;
	if (!n) var n = 1 ;
	switch (unit) {
		case Date.AddUnits.Year : return new Date(this.getFullYear()+n, this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds()) ;
		case Date.AddUnits.Month : return new Date(this.getFullYear(), this.getMonth()+n, this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds()) ;
		case Date.AddUnits.Day : return new Date(this.getFullYear(), this.getMonth(), this.getDate()+n, this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds()) ;
		case Date.AddUnits.Hour : return new Date(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours()+n, this.getMinutes(), this.getSeconds(), this.getMilliseconds()) ;
		case Date.AddUnits.Minute : return new Date(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes()+n, this.getSeconds(), this.getMilliseconds()) ;
		case Date.AddUnits.Second : return new Date(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds()+n, this.getMilliseconds()) ;
		case Date.AddUnits.Millisecond : return new Date(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds()+n) ;
		default : return new Date(this.getFullYear(), this.getMonth(), this.getDate()+n, this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds()) ;
	}
} ;

Function.prototype.Parse = function() {
	var o = {}, s = this.toString() ;
	o.Parameters = ((s.substring(s.indexOf('(')+1, s.indexOf(')'))).replace(/\s+/g, "")).split(",") ;
	o.Body = (s.substring(s.indexOf('{')+1, s.lastIndexOf('}'))).replace(/(^\s*)|(\s*$)/g, "") ;
	return o ;
} ;

Math.RoundToPlaces = function(n, p) { return Math.round(n*Math.pow(10,p))/Math.pow(10,p) ; } ;
Math.DegreesToRadians = function(x) { return (x * Math.PI) / 180 ; } ;
Math.RadiansToDegrees = function(x) { return (x * 180) / Math.PI ; } ;
Math.Factorial = function(n) {
	if(n < 1) return 0;
	var retVal = 1;
	for (var i = 1; i <= n; i++) retVal *= i ;
	return retVal ;
} ;
Math.Permutations = function(n, k) {
	if(n == 0 || k == 0) return 1 ;
	return (Math.Factorial(n) / Math.Factorial(n - k)) ;
} ;
Math.Combinations = function(n, r) {
	if( n==0 || r==0 ) return 1 ;
	return (Math.Factorial(n) / (Math.Factorial(n - r) * Math.Factorial(r))) ;
} ;
Math.Bernstein = function (t, n, i) {
	return (Math.combinations(n, i) * Math.pow(t, i) * Math.pow(1 - t, n - i)) ;
} ;
Math.Random = function(maximum, minimum, floating) {
	var M, m, r;
	m = minimum || 0;
	M = maximum - m;
	r = Math.random()*M + m;
	if(floating) r = r>maximum ? maximum : r;
	else r = Math.round(r);
	return r;
} ;
Math.InPolygon = function(poly, px, py) {
	 var npoints = poly.length ;
	 var xnew, ynew, xold, yold, x1, y1, x2, y2 ;
	 var inside = false ;

	 if (npoints/2 < 3) return false;
	 xold = poly[npoints - 2] ;
	 yold = poly[npoints - 1] ;
	 
	 for (var i = 0 ; i < npoints ; i = i + 2) {
		  xnew=poly[i] ;
		  ynew=poly[i + 1] ;
		  if (xnew > xold) {
			   x1 = xold ;
			   x2 = xnew ;
			   y1 = yold ;
			   y2 = ynew ;
		  } else {
			   x1 = xnew ;
			   x2 = xold ;
			   y1 = ynew ;
			   y2 = yold ;
		  }
		  if ((xnew < px) == (px <= xold) && ((py-y1)*(x2-x1) < (y2-y1)*(px-x1))) inside = !inside ;
		  xold = xnew ;
		  yold = ynew ;
	 }
	 return inside;		
} ;

Object.Comparator = {} ;
Object.TypeExists = function(s) {
	var parts = s.split("."), i = 0, obj = Environment.GetHost() ; 
	do { obj = obj[parts[i++]] ; } while (i < parts.length && obj) ; 
	return (obj && obj != Environment.GetHost()) ;
} ;
Object.CreateFromType = function(s, args) { 
	if (!Object.TypeExists(s)) {
		throw new Exception("Object.CreateFromType('" + s + "'): Type does not exist.") ;
	}
	var parts = s.split("."), i = 0, obj = Environment.GetHost() ; 
	do { obj = obj[parts[i++]] ; } while (i < parts.length && obj) ; 
	var o = {} ;
	obj.apply(o, args) ;
	return o ;
} ;
Object.GetFieldsFromType = function(s) { return (Object.CreateFromType(s)).GetFields() ; } ;
Object.GetPropertiesFromType = function(s) { return (Object.CreateFromType(s)).GetProperties() ; } ;
Object.GetMethodsFromType = function(s) { return (Object.CreateFromType(s)).GetMethods() ; } ;
Object.prototype.Type = "Object" ;
Object.prototype.GetType = function() { return this.constructor ; } ;
Object.prototype.GetFields = function() {
	var arr = [] ;
	for (var p in this) { if (typeof(Object.Comparator[p]) == "undefined") arr[arr.length] = p ; }
	return arr ;
} ;
Object.prototype.GetProperties = function() {
	var arr = [] ;
	for (var p in this) { if (typeof(Object.Comparator[p]) == "undefined" && !this[p].IsInstanceOf(Function)) arr[arr.length] = p ; }
	return arr ;
} ;
Object.prototype.GetMethods = function() {
	var arr = [] ;
	for (var p in this) { if (typeof(Object.Comparator[p]) == "undefined" && this[p].IsInstanceOf(Function)) arr[arr.length] = p ; }
	return arr ;
} ;
Object.prototype.Implements = function(o) {
	if (this.IsSubTypeOf(o)) return false ;
	var fields = new (o)().GetFields() ;
	for (var i = 0; i < fields.length; i++) { if (typeof(this[(fields[i])]) == "undefined") return false ; }
	return true ;
} ;
Object.prototype.IsInstanceOf = function(o) { return (this.GetType() == o) ; } ;
Object.prototype.IsSubTypeOf = function(o) { return (this instanceof o) ; } ;
Object.prototype.IsBaseTypeOf = function(o) { return (o instanceof this) ; } ;

//	The base object for exceptions.
function Exception(msg){
	this.Source = this.TargetSite = null ;
	this.Message = msg ;
}
Exception.prototype = new Error ;
Exception.prototype.constructor = Exception ;

var ArgumentException = function(msg) {
	Exception.call(this, msg) ;
} ;
ArgumentException.prototype = new Exception ;
ArgumentException.prototype.constructor = ArgumentException ;

var NetException = function(msg) {
	Exception.call(this, msg) ;
} ;
NetException.prototype = new Exception ;
NetException.prototype.constructor = NetException ;

String.FormatTypes = { Date:0, DateTime:1, ShortDate:2, Time:3, PostalCode:4, Phone:5, Currency:6, Email:7 } ;
String.EscapeTypes = { Database:0 , URI:1 , Script:2, URIComponent:3 } ;
String.prototype.Trim = function() { return this.replace(/(^\s*)|(\s*$)/g, ""); } ;
String.prototype.IsEmpty = function() { return (this.Trim() == '' || this.Trim() == null) ; } ;
String.prototype.Contains = function(arr) {
	if (!arr) arr = ["'",'"','\\'] ;
	for (var i = 0; i < this.length; i++) {
		var c = this.charAt(i) ;
		for (var j = 0; j < arr.length; j++) {
			if (c == arr[j])  return true ;
		}
	}
	return false ;
} ;
String.prototype.In = function(arr) {
	for (var i = 0; i < arr.length; i++) {
		if (this.Trim() == arr[i]) return true ;
	}
	return false ;
} ;
String.prototype.EndsWith = function(arr) {
	for (var i = 0; i < arr.length; i++) {
		if (this.indexOf(arr[i]) == this.length - arr[i].length) return true ;
	}
	return false ;
} ;
String.prototype.Escape = function(EscapeType) {
	switch (EscapeType) {
		case String.EscapeTypes.Database		: return this.replace(/[\']/g, "''") ; 
		case String.EscapeTypes.Script			: return this.replace(/([\'\"])/g,"\\$1") ;
		case String.EscapeTypes.URI				: return encodeURI(this) ;
		case String.EscapeTypes.URIComponent	: return encodeURIComponent(this) ;
		default									: return escape(this) ;
	}
} ;
String.prototype.Unescape = function(EscapeType) {
	switch (EscapeType) {
		case String.EscapeTypes.Script			: return this.replace(/\\\'/g,"'").replace(/\\\"/g,'"') ;
		case String.EscapeTypes.URI				: return decodeURI(this) ;
		case String.EscapeTypes.URIComponent	: return decodeURIComponent(this) ;
		default									: return unescape(this) ;
	}
} ;
String.prototype.ParseCurrency = function() { return parseFloat(this.replace(/[\s\$,]/g,"")) ; } ;
String.prototype.Format = function(FormatType) {
	var s = this.Trim() ;
	switch (FormatType) {
		case String.FormatTypes.Date : {
			var d = new Date(this) ;
			if (!isNaN(d)) {
				if (this.search(/\d{3}/) == -1) d.setYear(Math.floor((new Date()).getFullYear() / 100) * 100 + d.getFullYear() % 100);
				s = d.GetHumanDateString() ;
			}
			break ;
		}
		case String.FormatTypes.ShortDate : {
			var d = new Date(this) ;
			if (!isNaN(d)) {
				if (this.search(/\d{3}/) == -1) d.setYear(Math.floor((new Date()).getFullYear() / 100) * 100 + d.getFullYear() % 100);
				s = d.GetShortDateString() ;
			}
			break ;
		}
		case String.FormatTypes.Time : {
			var t = new Date(this) ;
			if (!isNaN(t)) s = t.GetHumanTimeString() ;
			break ;
		}
		case String.FormatTypes.PostalCode : {
			var temp = this.replace(/\D/g, "") ;
			if (temp.length == 5 || temp.length == 9) { 
				if (temp.length == 5) s = temp ;
				else s = temp.substring(0,5) + "-" + temp.substring(5,9) ;
			}
			break ;
		}
		case String.FormatTypes.Phone : {
			var temp = this.replace(/\D/g, "") ;
			if (temp.length > 9 && temp.length < 26) {
				if (temp.length == 10) {
					s = "(" + temp.substring(0,3) + ") " ;
					s += temp.substring(3,6) + "-" + temp.substring(6,10) ;
				}
			}
			break ;
		}
		case String.FormatTypes.Currency : {
			if (s.Validate(FormatType)) {
				var numplaces = 2 ;
				var neg = false ;
				var temp = this.ParseCurrency() ;
				if (temp < 0) {
					neg = true ;
					temp = Math.abs(temp) ;
				}
				temp = Math.round(temp*Math.pow(10,numplaces))/Math.pow(10,numplaces) ;
				temp = String(temp) ;
				if (temp.indexOf('.') == -1) temp += '.00' ;
				temp = temp.split('.') ;
				if (temp[1].length < 2) temp[1] += '0' ;
				if (temp[0].length > 3) {
					var arr = [] ;
					for (var i=0;i<temp[0].length;i++) arr[arr.length] = temp[0].charAt(i) ;
					arr = arr.reverse() ;
					arr2 = [] ;
					for (var i=0;i<arr.length;i++) {
						arr2[arr2.length] = arr[i] ;
						if ((i+1)%3==0) arr2[arr2.length] = ',' ;
					}
					arr = arr2.reverse() ;
					temp[0] = '' ;
					if (arr[0] == ',') arr.shift() ;
					for (var i=0;i<arr.length;i++) temp[0] += arr[i] ;
				}
				s = ((neg?'-':'')) + '$' + temp.join('.') ;
			}
			break ;
		}
		default : { break ; }
	} ;
	return s ;	
} ;
String.prototype.Validate = function(FormatType) {
	switch (FormatType) {
		case String.FormatTypes.DateTime : 
		case String.FormatTypes.Date : 
		case String.FormatTypes.Time : {
			return !isNaN(new Date(this.Trim())) ;
		}
		case String.FormatTypes.Phone : {
			var temp = this.replace(/\D/g, "") ;
			return temp.length > 9 && temp.length < 26 ;
		}
		case String.FormatTypes.PostalCode : {
			var temp = this.replace(/\D/g, "") ;
			return temp.match(/^\d{5}$|^\d{9}$/) != null ;
		}
		case String.FormatTypes.Email : {
			var temp = this.replace(/\s/g, "") ;
			return (temp.match(/^[\w\.\-]+\x40[\w\.\-]+\.\w{3}$/)) && temp.charAt(0) != "." && !(temp.match(/\.\./)) ;
		}
		case String.FormatTypes.Currency : {
			var temp = this.replace(/\s/g, "") ;
			if (!temp.IsEmpty()) {
				if (temp.indexOf(',') > -1) b = temp.match(/\$?(\d{0,3}(,\d{3})*)(\.\d{0,4})?/) != null ;
				return temp.match(/\$?\d*(\.\d{0,4})?/) != null ;
			} else return false ;
		}
		default : { break ; }
	}
	return true ;
} ;

