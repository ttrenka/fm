/********************************************************************************
	File: 		HTMLAgents/Events.js
	Version: 	XHTML 1.0.0
	Date:		2003-03-29

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

	Events namespace extension for HTML Agents.  Includes natural wrappers
		for both major browser event systems.
**********************************************************************************/
Import("System.Events") ;

Events.MutationTypes = { None : 0, Modification : 1, Addition : 2, Removal : 3 } ;
Events.MouseButtons = { None : 0, Left : 1, Right : 2, Middle : 4 } ;
Events.ControlKeys = { None : 0, Shift : 1, Control : 2, Alt : 4 } ;
Events.Keys = { 
	Backspace : 8, Tab : 9, Enter : 13, Shift : 16, Control : 17, Alt : 18, Pause : 19, CapsLock : 20, Escape : 27, Space : 32, NumLock : 144, ScrollLock : 145,  
	Home : 36, PageUp : 33, PageDown : 34, End : 35, Insert : 45, Delete : 46, LeftArrow : 37, UpArrow : 38, RightArrow : 39, DownArrow : 40, 
	D0 : 48, D1 : 49, D2 : 50, D3 : 51, D4 : 52, D5 : 53, D6 : 54, D7 : 55, D8 : 56, D9 : 57, 
	A : 65, B : 66, C : 67, D : 68, E : 69, F : 70, G : 71, H : 72, I : 73, J : 74, K : 75, L : 76, M : 77, N : 78, O : 79, P : 80, Q : 81, R : 82, S : 83, T : 84, U : 85, V : 86, W : 87, X : 88, Y : 89, Z : 90, 
	LeftApplication : 91, RightApplication : 92,  Context : 93,
	Num0 : 96, Num1 : 97, Num2 : 98, Num3 : 99, Num4 : 100, Num5 : 101, Num6 : 102, Num7 : 103, Num8 : 104, Num9 : 105,
	DecimalPoint : 110, Multiply : 106, Plus : 107, Minus : 109, Divide : 111, 
	F1 : 112, F2 : 113, F3 : 114, F4 : 115, F5 : 116, F6 : 117, F7 : 118, F8 : 119, F9 : 120, F10 : 121, F11 : 122, F12 : 123, 
	SemiColon : 186, Equals : 187, Comma : 188, EnDash : 189, Period : 190, Slash : 191, LeftApostrophe : 192, OpenBracket : 219, BackSlash : 220, CloseBracket : 221, Apostrophe : 222,
	Moz_SemiColon: 59, Moz_Equals : 61,
	GetFromCode : function(code, mods) {
		for (var k in this) {
			if (!k.IsInstanceOf(Function)) {
				if (this[k] == code) {
					if (code < 91 && code > 64) {
						if (Events.ControlKeys.Shift & mods) return k;
						else return (k).toLowerCase() ;
					} else if (code < 58 && code > 47) {
						switch (code) {
							case 48 : return (Events.ControlKeys.Shift & mods)?')':'0' ;
							case 49 : return (Events.ControlKeys.Shift & mods)?'!':'1' ;
							case 50 : return (Events.ControlKeys.Shift & mods)?'@':'2' ;
							case 51 : return (Events.ControlKeys.Shift & mods)?'#':'3' ;
							case 52 : return (Events.ControlKeys.Shift & mods)?'$':'4' ;
							case 53 : return (Events.ControlKeys.Shift & mods)?'%':'5' ;
							case 54 : return (Events.ControlKeys.Shift & mods)?'^':'6' ;
							case 55 : return (Events.ControlKeys.Shift & mods)?'&amp;':'7' ;
							case 56 : return (Events.ControlKeys.Shift & mods)?'*':'8' ;
							case 57 : return (Events.ControlKeys.Shift & mods)?'(':'9' ;
							default : return k ;
						}
					} else if (code < 192 && code > 185) {
 						switch (code) {
							case 186 : return (Events.ControlKeys.Shift & mods)?':':';';
							case 187 : return (Events.ControlKeys.Shift & mods)?'+':'=';
							case 188 : return (Events.ControlKeys.Shift & mods)?'&lt;':',';
							case 189 : return (Events.ControlKeys.Shift & mods)?'_':'-';
							case 190 : return (Events.ControlKeys.Shift & mods)?'&gt;':'.';
							case 191 : return (Events.ControlKeys.Shift & mods)?'?':'/';
							default : return k ;
						}
					} else if (code < 223 && code > 218) {
 						switch (code) {
							case 219 : return (Events.ControlKeys.Shift & mods)?'{':'[';
							case 220 : return (Events.ControlKeys.Shift & mods)?'|':'\\';
							case 221 : return (Events.ControlKeys.Shift & mods)?'}':']';
							case 222 : return (Events.ControlKeys.Shift & mods)?'&quot;':'&apos;';
							default : return k ;
						}
					} else if (code == 192) return (Events.ControlKeys.Shift & mods)?"~":"`" ;
					else if (code == 59 && !Object.Host.event) return (Events.ControlKeys.Shift & mods)?":":";" ;
					else if (code == 61 && !Object.Host.event) return (Events.ControlKeys.Shift & mods)?"+":"=" ;
					else if (code == 109 && !Object.Host.event) return (Events.ControlKeys.Shift & mods)?"_":"-" ;
					else return k ;
				}
			}
		}
		return "Unknown" ;
	}
} ;

Events.UIEventArgs = function(e) {
	var b = false ;
	//	fix for IE
	if (!e && Environment.GetEventObject()) {
		var e = Environment.GetEventObject() ;
		b = true ;
	}
	Events.EventArgs.call(this, e) ;
	this.View = Environment.GetHost() ;
	if (!e) {
		this.Cancel = function(){ } ;
		this.PreventDefault = function(){ } ;
		this.Target = null ;
	} else {
		if (b) {
			this.Cancel = function(){ return Environment.GetHost().event.cancelBubble = true ; } ;
			this.PreventDefault = function(){ return Environment.GetHost().event.returnValue = false ; } ;
			this.Target = e.srcElement ;
		} else {
			this.Cancel = e.stopPropagation ;
			this.PreventDefault = e.preventDefault ;
			this.Target = e.target ;
		}
	}
} ;
Events.UIEventArgs.prototype = new Events.EventArgs ;
Events.UIEventArgs.prototype.constructor = Events.UIEventArgs ;

Events.MouseEventArgs = function(e) {
	if (e == null) var e = Environment.GetEventObject() ;
	Events.UIEventArgs.call(this, e) ;
	this.Clicks = -1 ;
	this.Button = Events.MouseButtons.None ;
	this.X=this.Y=this.OffsetX=this.OffsetY=this.ClientX=this.ClientY=this.ScreenX=this.ScreenY = -1 ;
	this.From = null ;
	this.To = null ;
	this.Delta = -1 ;
	this.ControlKeys = Events.ControlKeys.None ;
	if (e){
		this.Clicks = (this.EventType.indexOf("double") > -1) ? 2 : 1 ; 
		this.Delta = (e.wheelDelta)?e.wheelDelta:-1 ;
		this.X = e.x ;
		this.Y = e.y ;
		this.ClientX = e.clientX ;
		this.ClientY = e.clientY ;
		this.ScreenX = e.screenX ;
		this.ScreenY = e.screenY ;
		this.ControlKeys = Events.ControlKeys.None ;
		if (e.shiftKey) this.ControlKeys |= Events.ControlKeys.Shift ;
		if (e.ctrlKey) this.ControlKeys |= Events.ControlKeys.Control ;
		if (e.altKey) this.ControlKeys |= Events.ControlKeys.Alt ;
		if (Environment.GetHost().event) {
			this.Button = e.button ;
			this.OffsetX = e.offsetX ;
			this.OffsetY = e.offsetY ;
			this.From = e.fromElement ;
			this.To = e.toElement ;
		} else {
			this.Button = (this.EventType.indexOf("context") > -1) ? Events.MouseButtons.Right : Events.MouseButtons.Left ;
			this.OffsetX = e.layerX ;
			this.OffsetY = e.layerY ;
			this.From = (e.relatedTarget && e.type == "mouseover") ? e.relatedTarget : null ;
			this.To = (e.relatedTarget && e.type == "mouseout") ? e.relatedTarget : null ;
		}
	}
} ;
Events.MouseEventArgs.prototype = new Events.UIEventArgs ;
Events.MouseEventArgs.prototype.constructor = Events.MouseEventArgs ;

Events.KeyEventArgs = function(e) {
	if (e == null) var e = Environment.GetEventObject() ;
	Events.UIEventArgs.call(this, e) ;
	this.ControlKeys = Events.ControlKeys.None ;
	if (e) {
		this.KeyCode = e.keyCode ;
		this.ControlKeys = Events.ControlKeys.None ;
		if (e.shiftKey) this.ControlKeys |= Events.ControlKeys.Shift ;
		if (e.ctrlKey) this.ControlKeys |= Events.ControlKeys.Control ;
		if (e.altKey) this.ControlKeys |= Events.ControlKeys.Alt ;
		if (this.EventType == 'keypress') this.KeyValue = String.fromCharCode(this.KeyCode) ;
		else this.KeyValue = Events.Keys.GetFromCode(this.KeyCode, this.ControlKeys) ;
	}
} ;
Events.KeyEventArgs.prototype = new Events.UIEventArgs ;
Events.KeyEventArgs.prototype.constructor = Events.KeyEventArgs ;

Events.UIEventHandler = function(fn, ac) { Events.EventHandler.call(this, fn, (ac?ac:Events.UIEventArgs)) ; } ;
Events.UIEventHandler.prototype = new Events.EventHandler ;
Events.UIEventHandler.prototype.constructor = Events.UIEventHandler ;

Events.MutationEventHandler = function(fn, ac) { Events.EventHandler.call(this, fn, (ac?ac:Events.MutationEventArgs)) ; } ;
Events.MutationEventHandler.prototype = new Events.EventHandler ;
Events.MutationEventHandler.prototype.constructor = Events.MutationEventHandler ;

Events.MouseEventHandler = function(fn, ac) { Events.UIEventHandler.call(this, fn, (ac?ac:Events.MouseEventArgs)) ; } ;
Events.MouseEventHandler.prototype = new Events.UIEventHandler ;
Events.MouseEventHandler.prototype.constructor = Events.MouseEventHandler ;

Events.KeyEventHandler = function(fn) { Events.UIEventHandler.call(this, fn, Events.KeyEventArgs) ; } ;
Events.KeyEventHandler.prototype = new Events.UIEventHandler ;
Events.KeyEventHandler.prototype.constructor = Events.KeyEventHandler ;
