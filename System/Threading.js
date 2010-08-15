/********************************************************************************
	File: 		System/Threading.js
	Version: 	1.0.0
	Date:		2003-05-15

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

	Simple threading library.  Provides facilities for a Timer, as well as
		a simplistic Thread/ThreadPool construct for background processing
		tasks.
**********************************************************************************/
Import('System.Events') ;

if (!Environment) throw new Exception("f(m).System.Threading requires the Environment object.") ;

var Threading = { } ;
Threading.ThreadState = { Unstarted:-1, Stopped:0, Pending:1, Running:2, Suspended:3, Waiting:4, Finished:5 } ;
Threading.ThreadPriority = { Lowest:1, BelowNormal:2, Normal:3, AboveNormal:4, Highest:5 } ;
Threading.Timer = function() {
	var timer = null ;
	var interval = 1000 ;
	function bounce(src, ea) { src.Stop(); src.Start() ; }
	this.Status = Threading.ThreadState.Unstarted ;
	this.GetTick = function() { return interval ; } ;
	this.SetTick = function(n) { 
		if (Math.abs(parseInt(n)) < 10) 
			throw new ArgumentException("Threading.Timer.SetTick(" + n + "): value must be >= 10 (ms).") ;
		interval = Math.abs(parseInt(n)) ; 
		if (this.Status == Threading.ThreadState.Running) {
			var eh = new Events.EventHandler(bounce) ;
			eh.RunOnce = true ;
			tick.Add(eh) ;
		}
	} ;
	var tick = this.OnTick = new Events.Listener().Invoke ;
	this.OnStart 	= new Events.Listener().Invoke ;
	this.OnSuspend 	= new Events.Listener().Invoke ;
	this.OnResume 	= new Events.Listener().Invoke ;
	this.OnStop 	= new Events.Listener().Invoke ;
	this.Start = function() { 
		if (this.OnStart) this.OnStart({ type:"onStart" }) ;
		this.Status = Threading.ThreadState.Running ;
		timer = (Environment.GetHost()).setInterval(tick, interval) ;
	} ;
	this.Stop = function() { 
		if (this.OnStop) this.OnStop({ type:"onStop" }) ;
		this.Status = Threading.ThreadState.Stopped ;
		(Environment.GetHost()).clearInterval(timer) ;
	} ;
	this.Suspend = function() { 
		if (this.OnSuspend) this.OnSuspend({ type:"onSuspend" }) ;
		this.Status = Threading.ThreadState.Suspended ;
		(Environment.GetHost()).clearInterval(timer) ;
	} ;
	this.Resume = function() {
		if (this.OnResume) this.OnResume({ type:"onResume" }) ;
		this.Status = Threading.ThreadState.Running ;
		timer = (Environment.GetHost()).setInterval(tick, interval) ;
	} ;
	this.Reset = function() { 
		this.Status = Threading.ThreadState.Unstarted ;
		interval = 1000 ;
		this.OnStart.Reset() ;
		this.OnTick.Reset() ;
		this.OnSuspend.Reset() ;
		this.OnResume.Reset() ;
		this.OnStop.Reset() ;
	} ;
} ;

Threading.Thread = function(fn) {
	if (!fn) 
		throw new ArgumentException("Threading.Thread(): you must supply the function for this Thread.") ;
	if (!fn.IsInstanceOf(Function)) 
		throw new ArgumentException("Threading.Thread(): the argument you supplied is not a Function.") ;

	var func = fn ;
	this.ThreadState = Threading.ThreadState.Unstarted ;
	this.Priority = Threading.ThreadPriority.Normal ;
	this.LastException = null ;
	this.Execute = function() { 
		this.ThreadState = Threading.ThreadState.Running ;
		try {
			func(this) ; 
		} catch (ex) { 
			this.LastException = ex ;
		} finally {
			this.ThreadState = Threading.ThreadState.Finished ;
		}
	} ;
} ;

Threading.ThreadPool = function(mxthrs, intvl){
	if (this.IsInstanceOf(Threading.ThreadPool) && Threading.ThreadPool.Instantiated) 
		throw new Exception("Threading.ThreadPool(): only one ThreadPool may be instantiated.") ;

	var maxThreads = (mxthrs) ? parseInt(mxthrs) : 16 ;
	var availableThreads = maxThreads ;
	var interval = (intvl) ? parseInt(intvl) : 60000;
	var fireInterval = Math.floor((interval / 2) / maxThreads) ;
	if (fireInterval < 100) 
		throw new ArgumentException(
			"Threading.ThreadPool(): (interval[==" 
			+ interval 
			+ "]/2)/maxThreads[==" 
			+ maxThreads 
			+ "] must be > 100ms (currently == " 
			+ Math.floor((interval/2)/maxThreads) 
			+ "ms."
		) ;

	var queue = [] ;
	var timers = new Array(maxThreads + 1) ;
	var timer = new Threading.Timer() ;
	var fire = function(src, ea) {
		var tracker = timers[0] = {} ;
		for (var i = 1; i < timers.length; i++) {
			(Environment.GetHost()).clearTimeout(timers[i]) ;
			var thread = queue.shift() ;
			if (typeof(thread) == "undefined") break ;
			tracker["thread-"+i] = thread ;
			timers[i] = (Environment.GetHost()).setTimeout(thread.Execute, (fireInterval * i)) ;
		}
		availableThreads = maxThreads - (i - 1) ;
	} ;

	this.GetMaxThreads = function() { return maxThreads ; }
	this.GetAvailableThreads = function() { return availableThreads ; } ;
	this.GetTickInterval = function() { return interval ; } ;
	this.QueueUserWorkItem = function(thr) {
		if (!thr.IsSubTypeOf(Threading.Thread)) 
			throw new ArgumentException(
				"Threading.ThreadPool.QueueUserWorkItem(): the passed argument is not a Thread object."
			) ;
		var idx = queue.length ;
		for (var i = 0; i < queue.length; i++) {
			if (queue[i].Priority < thr.Priority) { 
				idx = i ; 
				break ; 
			}
		}
		if (idx < queue.length) queue.splice(idx,0,thr) ;
		else queue.push(thr) ;
		return true ;
	} ;
	this.RemoveQueuedUserWorkItem = function(thr) {
		var idx = -1 ;
		for (var i = 0; i < queue.length; i++) {
			if (queue[i] == thr) { 
				idx = i ; 
				break ; 
			}
		}
		if (idx > -1) {
			queue.splice(idx,1) ;
			return true ;
		}
		return false ;
	} ;
	this.Start = function(){ timer.Start() ; } ;
	this.Stop = function(){ timer.Stop() ; } ;
	this.Abort = function() {
		this.Stop() ;
		for (var i = 1; i < timers.length; i++) { 
			if (timers[i]) 
				(Environment.GetHost()).clearTimeout(timers[i]) ; 
		}
		for (var thr in timers[0]) 
			this.QueueUserWorkItem(thr) ;
		timers[0] = {} ;
	} ;
	this.Reset = function() {
		this.Abort() ;
		queue = [] ;
	} ;
	this.Sleep = function(interval) {
		timer.Suspend() ;
		(Environment.GetHost()).setTimeout(timer.Resume, interval) ;
	} ;
	timer.OnTick.Add(new Events.EventHandler(fire)) ;

	//	set up the static properties
	Threading.ThreadPool.__Current__ = this ;
	Threading.ThreadPool.Instantiated = true ;
} ;
Threading.ThreadPool.Instantiated = false ;
Threading.ThreadPool.GetCurrent = function() {
	if (!Threading.ThreadPool.Instantiated) 
		Threading.ThreadPool.__Current__ = new Threading.ThreadPool() ;
	return Threading.ThreadPool.__Current__ ;
} ;
