/********************************************************************************
	File: 		System/Events.js
	Version: 	1.0.0
	Date:		2003-03-24

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

	Foundation for the f(m) Common Event System.
**********************************************************************************/
var Events = {} ;
Events.Listener = function() {
	var handlers = [] ;
	var me = this ; 
	this.Invoke = function(e) {
		if (typeof(e) == "undefined") var e = { type : "Unknown" } ;
		var t = [] ;
		for (var i = 0; i < handlers.length; i++) t.push(handlers[i]) ;
		while (t.length > 0) {
			var h = t[t.length - 1] ;
			(h.GetHandler())(this, new (h.GetArgsClass())(e)) ;	// invoke the event handler
			if (h.RunOnce) me.Remove(h) ;
			t.pop() ;
		}
	} ;
	this.Add = this.Invoke.Add = function(fn) {
		if (fn.IsInstanceOf(Function)) fn = new Events.EventHandler(fn) ;
		handlers.push(fn) ; 
	} ;	
	this.Remove = this.Invoke.Remove = function(fn) {
		if (fn.IsSubTypeOf(Events.EventHandler)) fn = fn.GetHandler() ;
		var idx = -1 ;
		for (var i = 0; i < handlers.length; i++) {
			if (handlers[i].GetHandler() == fn) { idx = i ; break ; }
		}
		return handlers.splice(idx,1) ;
	} ;
	this.Reset = this.Invoke.Reset = function() { handlers = [] ; }
} ;
Events.EventArgs= function(e) {
	this.TimeStamp = new Date() ;
	this.EventType = e.type ;
} ;
Events.EventHandler = function(fn, ac) {
	var func = (fn)?fn:null ;
	var argClass = (ac)?ac:Events.EventArgs ;
	this.GetHandler = function() { return func ; } ;
	this.GetArgsClass = function() { return argClass ; } ;
	this.RunOnce = false ;
} ;
