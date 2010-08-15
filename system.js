/********************************************************************************
	File: 		System.js
	Version: 	XHTML 1.2.0
	Date:		2003-03-17
	Modified:	2004-01-15

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
**********************************************************************************
	Core system file for the f(m) BCL.  This is the only file that needs
	to be included using the <script> tag.  Includes Import and Environment
	definitions.
**********************************************************************************
	NOTE:
	If you want to change the default path for this system, make sure the 
	first thing you do is set the Environment.LibraryPath variable *before*
	using Import.
**********************************************************************************
	History:
	v.1.0: Initial release.
	v.1.1: Fixes to Import (namespaces now load in order, uses document.write)
	v.1.2: Added core object extensions directly to this file; removed Import
			statements; added GetKeys to Environment (thanks Yuri).
		   Import is now case sensitive.
**********************************************************************************/
window["FM-XHTML"] = {
	Version : "1.2.0" ,
	Authors : ["Thomas R. Trenka, Ph.D."]
} ;

var HTMLAgents = {
	Applications : { Unknown:0, InternetExplorer:1, Mozilla:2, Safari:3, Opera:4, Netscape:5, Konqueror:6, OmniWeb:7, iCab:8, Galeon:9 } ,
	OperatingSystems : { Unknown : 0, Windows : 1, Macintosh : 2, Linux : 3, UNIX : 4 }
} ;

function Import(ns) {
	if (!ns) throw new Error("Import(): namespace is null.  Please use a valid namespace before continuing.") ;

	//	get the parentage to make sure they are loaded.
	var packages = ns.split(".") ;
	var toLoad = [] ;
	var tmp = "" ;
	for (var i = 0; i < packages.length; i++) {
		if (i > 0) tmp += "." ;
		tmp += packages[i] ;
		var b = false ;
		for (var j = 0; j < Import.__loaded__.length; j++) { 
			if (Import.__loaded__[j] == tmp) {
				b = true ;
				break ;
			}
		}
		if (!b) toLoad.push(tmp) ;
	}
	if (toLoad.length == 0) return ;

	//	Inclusions take the form of [dir0].[dir1]...[dirN].[file] ;
	var fullPath = "http://" + Environment.Host 
		+ (Environment.Port!=80?":"+Environment.Port:"")
		+ "/"
		+ Environment.ApplicationPath 
		+ Environment.LibraryPath ;

	for (var i = 0; i < toLoad.length; i++) {
		if (toLoad[i].indexOf(".") > -1) {
			var pkg = fullPath + (toLoad[i].split(".")).join("/") + ".js" ;
			document.write('<script type="text/javascript" src="' + pkg + '"></script>\n') ;
			Import.__loaded__.push(toLoad[i]) ;
		}
	}
}
Import.__loaded__ = [ ] ;

window["fm-xhtml-environment"] = function(){
	var env = window.location ;
	if (Environment) return Environment ;
	var environment = this ;
	this.Host = env.hostname ;
	this.Port = (env.port)?env.port:80 ;
	this.Path = (env.pathname && env.pathname != "") ? env.pathname.substr(1, env.href.lastIndexOf("/") + 1) : "" ;
	this.ApplicationPath = (this.Path.lastIndexOf("/")==this.Path.length-1) ? this.Path : this.Path.substring(0, this.Path.lastIndexOf("/")) + "/" ;
	if (this.ApplicationPath == "/") this.ApplicationPath = "" ;
	this.LibraryPath = "fm/" ;		//	change this if you do something different.
	this.QueryString = {} ;
	this.Agent = new HTMLAgent(navigator) ;
	this.Registry = new HTMLRegistry() ;
	this.Display = {
		AvailableSize : { Width: window.screen.availWidth, Height: window.screen.availHeight } ,
		ColorDepth : window.screen.colorDepth 
	} ;
	this.GetAgentNamespace = function(){ return HTMLAgents; } ;
	this.GetHost = function() { return window ; } ;
	this.GetEventObject = function() { return window.event ; } ;	//	fucking Internet Explorer!
	this.GetCanvas = function() {
		var width = 0 ;
		var height = 0 ;
		var left = 0 ;
		var top = 0 ;
	
		if (document.documentElement && document.documentElement.clientWidth) width = document.documentElement.clientWidth;
		else if (document.body && document.body.clientWidth) width = document.body.clientWidth;
		else if (window.innerWidth) width = window.innerWidth - 18;

		if (document.documentElement && document.documentElement.clientHeight) height = document.documentElement.clientHeight;
		else if (document.body && document.body.clientHeight) height = document.body.clientHeight;
		else if (window.innerHeight) height = window.innerHeight - 18;

		if (document.documentElement && document.documentElement.scrollLeft) left = document.documentElement.scrollLeft;
		else if (document.body && document.body.scrollLeft) left = document.body.scrollLeft;
		else if (window.pageXOffset) left = window.pageXOffset;
		else if (window.scrollX) left = window.scrollX;

		if (document.documentElement && document.documentElement.scrollTop) top = document.documentElement.scrollTop;
		else if (document.body && document.body.scrollTop) top = document.body.scrollTop;
		else if (window.pageYOffset) top = window.pageYOffset;
		else if (window.scrollY) top = window.scrollY;

		var o = {} ;	//	Note that this has the property sig of System.Drawing.Drawing2D.Rectangle, but is NOT one.
		o.Size = {} ;
		o.Width = o.Size.Width = width ;
		o.Height = o.Size.Height = height ;
		o.Location = {} ;
		o.Left = o.X = o.Location.X = left ;
		o.Top = o.Y = o.Location.Y = top ;
		o.Right = left + width ;
		o.Bottom = top + height ;
		return o ;
	} ;

	//	Populate QueryString
	if (env.search && env.search.length > 0) {
		var tmp = env.search.substr(1, env.search.length) ;
		if (tmp.indexOf("&") > -1) {
			tmp = tmp.split("&") ;
			for (var i = 0; i < tmp.length; i++) {
				var t = tmp[i].split("=") ;
				this.QueryString[(t[0])] = t[1] ;
			}
		} else {
			tmp = tmp.split("=") ;
			this.QueryString[(tmp[0])] = tmp[1] ;
		}
	}

	function HTMLRegistry() {
		var session = this ;
		function SessionVar(name, val, exp, path, dn, b) {
			this.Key = (name) ? name : null ;
			this.Value = (val) ? val : null ;
			this.Expires = (exp) ? new Date(exp) : null ;
			this.Path = (path) ? path : "/" ;
			this.Domain = (dn) ? dn : environment.Host ;
			this.IsSecure = (b) ? b : false ;
		}

		function getVar(key) {
			var re = new RegExp("\\b" + key + "\\b\s*=\s*([^;]+)");
			var cookie = document.cookie.match(re);
			var value = cookie ? cookie[1] : null;
			session.Set(key, unescape(value)) ;
			return unescape(value) ;
		}
		function saveVar(sessionvar, dur) {
			if (typeof(dur) == "number") {
				var d = new Date() ;
				var expires = new Date(d.getTime()+(dur*24*60*60*1000)).toUTCString() ;
			}
			document.cookie = sessionvar.Key + "=" + escape(sessionvar.Value) + ";expires=" + expires + "; path=" + sessionvar.Path ;
			sessionvar.Expires = expires ;
		}
		function killVar(key) { saveVar(session.Data[key], -365) ; }

		this.Data = {} ;
		this.GetKeys = function() { return this.Data.GetFields() ; } ;
		this.Get = function(key) { return this.Data[key].Value ; } ;
		this.Set = function(key, value) { 
			if (key instanceof SessionVar) this.Data[key.Key] = key ;
			else this.Data[key] = new SessionVar(key, value) ; 
		} ;
		this.Delete = function(key) {
			if (this.Data[key]) {
				killVar(this.Data[key]) ;
				delete this.Data[key] ;
			}
		} ;
		this.RetrieveFromStore = function() {
			this.Data = {} ;	//	reset the Session
			if (document.cookie.length > 0) {
				var c = document.cookie.split(";") ;
				var i = 0 ;
				var sv = null ;
				while (c.length > i) {
					if (c[i]) {
						if (c[i].indexOf("path") > -1
								|| c[i].indexOf("expires") > -1
								|| c[i].indexOf("domain") > -1
								|| c[i].indexOf("secure") > -1) {
							if (c[i].indexOf("secure") > -1) sv.IsSecure = true ;
							else {
								var t = c[i].split("=") ;
								if (t[0].indexOf("expires") > -1) sv.Expires = new Date(t[1]) ;
								if (t[0].indexOf("path") > -1) sv.Path = t[1] ;
								if (t[0].indexOf("domain") > -1) sv.Domain = t[1] ;
							}
						} else {
							if (sv) session.Set(sv) ;
							var t = c[i].split("=") ;
							sv = new SessionVar(
									t[0].replace(/(^\s*)|(\s*$)/g, ""), 
									String(unescape(t[1])).replace(/(^\s*)|(\s*$)/g, "")
								 ) ;
						}
					}
					i++ ;
				}
				if (sv) session.Set(sv) ;
			}
		} ;
		this.PersistToStore = function() {
			for (var k in this.Data) saveVar(this.Data[k], 7) ;
		} ;
		this.DeleteStore = function() { for (var k in this.Data) killVar(k) ; } ;
		this.RetrieveFromStore() ;
	}

	function HTMLAgent(n){
		this.Application = HTMLAgents.Applications.Unknown ;
		this.Version = n.appVersion ;
		this.OS = HTMLAgents.OperatingSystems.Unknown ;
		this.AgentString = n.userAgent ;

		//	The following are the really important ones.
		this.IsDom2Compliant = false ;
		this.IsSupported = Boolean(Object.isPrototypeOf && Function.apply && Function.call) ;	

		//	Sniff.
		var u = n.userAgent.toLowerCase() ;
		if (u.indexOf("safari") > -1) this.Application = HTMLAgents.Applications.Safari ;
		if (u.indexOf("opera") > -1) this.Application = HTMLAgents.Applications.Opera ;
		if (this.Application != HTMLAgents.Applications.Safari
				&& this.Application != HTMLAgents.Applications.Opera
				&& n.appName == "Netscape") this.Application = HTMLAgents.Applications.Netscape ;
		if (this.Application != HTMLAgents.Applications.Opera
				&& n.appName == "Microsoft Internet Explorer") this.Application = HTMLAgents.Applications.InternetExplorer ;
		if (u.indexOf("gecko") > -1) this.Application = HTMLAgents.Applications.Mozilla ;
		if (u.indexOf("konqueror") > -1) this.Application = HTMLAgents.Applications.Konqueror ;
		if (u.indexOf("omniweb") > -1) this.Application = HTMLAgents.Applications.OmniWeb ;
		if (u.indexOf("icab") > -1) this.Application = HTMLAgents.Applications.iCab ;
		if (u.indexOf("galeon") > -1) this.Application = HTMLAgents.Applications.Galeon ;

		switch (this.Application) {
			case HTMLAgents.Applications.InternetExplorer : {
				if (this.Version.indexOf("MSIE 4") > 0) this.Version = 4.0 ;
				if (this.Version.indexOf("MSIE 5") > 0) this.Version = 5.0 ;
				if (this.Version.indexOf("MSIE 5.5") > 0) this.Version = 5.5 ;
				if (this.Version.indexOf("MSIE 6") > 0) this.Version = 6.0 ;
				break ;
			} 
			case HTMLAgents.Applications.Opera : {
				this.Version = parseFloat(u.substr(u.indexOf("opera") + 6, 2)) ;
				break ;
			}
			default : this.Version = (!isNaN(parseFloat(this.Version))) ? parseFloat(this.Version) : 0.0 ;
		}

		if (u.indexOf("win") > -1) this.OS = HTMLAgents.OperatingSystems.Windows ;
		else if (u.indexOf("mac") > -1) this.OS = HTMLAgents.OperatingSystems.Macintosh ;
		else if (u.indexOf("linux") > -1) this.OS = HTMLAgents.OperatingSystems.Linux ;
		else {
			var unix = ["freebsd","openbsd","solaris","unix","irix","sunos","hp-ux","sco","aix","vms"] ;
			for (var i = 0; i < unix.length; i++) {
				if (u.indexOf(unix[i]) > -1) {
					this.OS = HTMLAgents.OperatingSystems.UNIX ;
					break ;
				}
			}
		}

		try {
			var head = document.getElementsByTagName("head")[0] ;
			var test = document.createElement("meta") ;
			head.appendChild(test) ;
			test.setAttribute("something", "somethingelse") ;
			head.removeChild(test) ;
			head = test = null ;
			this.IsDom2Compliant = true ;
		} catch (e) { }
	}
}
var Environment = new (window["fm-xhtml-environment"])() ;

/*************************************************************************
	System Extensions.
	Added methods to the core ECMAScript objects, to enable Reflection,
	add the three core Exception types, and add convenience methods
	to Array, Date, and String.
**************************************************************************/

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
