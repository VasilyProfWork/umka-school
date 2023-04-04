(() => {
    var __webpack_modules__ = {
        90: module => {
            (function(window, factory) {
                var lazySizes = factory(window, window.document, Date);
                window.lazySizes = lazySizes;
                if (true && module.exports) module.exports = lazySizes;
            })("undefined" != typeof window ? window : {}, (function l(window, document, Date) {
                "use strict";
                var lazysizes, lazySizesCfg;
                (function() {
                    var prop;
                    var lazySizesDefaults = {
                        lazyClass: "lazyload",
                        loadedClass: "lazyloaded",
                        loadingClass: "lazyloading",
                        preloadClass: "lazypreload",
                        errorClass: "lazyerror",
                        autosizesClass: "lazyautosizes",
                        fastLoadedClass: "ls-is-cached",
                        iframeLoadMode: 0,
                        srcAttr: "data-src",
                        srcsetAttr: "data-srcset",
                        sizesAttr: "data-sizes",
                        minSize: 40,
                        customMedia: {},
                        init: true,
                        expFactor: 1.5,
                        hFac: .8,
                        loadMode: 2,
                        loadHidden: true,
                        ricTimeout: 0,
                        throttleDelay: 125
                    };
                    lazySizesCfg = window.lazySizesConfig || window.lazysizesConfig || {};
                    for (prop in lazySizesDefaults) if (!(prop in lazySizesCfg)) lazySizesCfg[prop] = lazySizesDefaults[prop];
                })();
                if (!document || !document.getElementsByClassName) return {
                    init: function() {},
                    cfg: lazySizesCfg,
                    noSupport: true
                };
                var docElem = document.documentElement;
                var supportPicture = window.HTMLPictureElement;
                var _addEventListener = "addEventListener";
                var _getAttribute = "getAttribute";
                var addEventListener = window[_addEventListener].bind(window);
                var setTimeout = window.setTimeout;
                var requestAnimationFrame = window.requestAnimationFrame || setTimeout;
                var requestIdleCallback = window.requestIdleCallback;
                var regPicture = /^picture$/i;
                var loadEvents = [ "load", "error", "lazyincluded", "_lazyloaded" ];
                var regClassCache = {};
                var forEach = Array.prototype.forEach;
                var hasClass = function(ele, cls) {
                    if (!regClassCache[cls]) regClassCache[cls] = new RegExp("(\\s|^)" + cls + "(\\s|$)");
                    return regClassCache[cls].test(ele[_getAttribute]("class") || "") && regClassCache[cls];
                };
                var addClass = function(ele, cls) {
                    if (!hasClass(ele, cls)) ele.setAttribute("class", (ele[_getAttribute]("class") || "").trim() + " " + cls);
                };
                var removeClass = function(ele, cls) {
                    var reg;
                    if (reg = hasClass(ele, cls)) ele.setAttribute("class", (ele[_getAttribute]("class") || "").replace(reg, " "));
                };
                var addRemoveLoadEvents = function(dom, fn, add) {
                    var action = add ? _addEventListener : "removeEventListener";
                    if (add) addRemoveLoadEvents(dom, fn);
                    loadEvents.forEach((function(evt) {
                        dom[action](evt, fn);
                    }));
                };
                var triggerEvent = function(elem, name, detail, noBubbles, noCancelable) {
                    var event = document.createEvent("Event");
                    if (!detail) detail = {};
                    detail.instance = lazysizes;
                    event.initEvent(name, !noBubbles, !noCancelable);
                    event.detail = detail;
                    elem.dispatchEvent(event);
                    return event;
                };
                var updatePolyfill = function(el, full) {
                    var polyfill;
                    if (!supportPicture && (polyfill = window.picturefill || lazySizesCfg.pf)) {
                        if (full && full.src && !el[_getAttribute]("srcset")) el.setAttribute("srcset", full.src);
                        polyfill({
                            reevaluate: true,
                            elements: [ el ]
                        });
                    } else if (full && full.src) el.src = full.src;
                };
                var getCSS = function(elem, style) {
                    return (getComputedStyle(elem, null) || {})[style];
                };
                var getWidth = function(elem, parent, width) {
                    width = width || elem.offsetWidth;
                    while (width < lazySizesCfg.minSize && parent && !elem._lazysizesWidth) {
                        width = parent.offsetWidth;
                        parent = parent.parentNode;
                    }
                    return width;
                };
                var rAF = function() {
                    var running, waiting;
                    var firstFns = [];
                    var secondFns = [];
                    var fns = firstFns;
                    var run = function() {
                        var runFns = fns;
                        fns = firstFns.length ? secondFns : firstFns;
                        running = true;
                        waiting = false;
                        while (runFns.length) runFns.shift()();
                        running = false;
                    };
                    var rafBatch = function(fn, queue) {
                        if (running && !queue) fn.apply(this, arguments); else {
                            fns.push(fn);
                            if (!waiting) {
                                waiting = true;
                                (document.hidden ? setTimeout : requestAnimationFrame)(run);
                            }
                        }
                    };
                    rafBatch._lsFlush = run;
                    return rafBatch;
                }();
                var rAFIt = function(fn, simple) {
                    return simple ? function() {
                        rAF(fn);
                    } : function() {
                        var that = this;
                        var args = arguments;
                        rAF((function() {
                            fn.apply(that, args);
                        }));
                    };
                };
                var throttle = function(fn) {
                    var running;
                    var lastTime = 0;
                    var gDelay = lazySizesCfg.throttleDelay;
                    var rICTimeout = lazySizesCfg.ricTimeout;
                    var run = function() {
                        running = false;
                        lastTime = Date.now();
                        fn();
                    };
                    var idleCallback = requestIdleCallback && rICTimeout > 49 ? function() {
                        requestIdleCallback(run, {
                            timeout: rICTimeout
                        });
                        if (rICTimeout !== lazySizesCfg.ricTimeout) rICTimeout = lazySizesCfg.ricTimeout;
                    } : rAFIt((function() {
                        setTimeout(run);
                    }), true);
                    return function(isPriority) {
                        var delay;
                        if (isPriority = true === isPriority) rICTimeout = 33;
                        if (running) return;
                        running = true;
                        delay = gDelay - (Date.now() - lastTime);
                        if (delay < 0) delay = 0;
                        if (isPriority || delay < 9) idleCallback(); else setTimeout(idleCallback, delay);
                    };
                };
                var debounce = function(func) {
                    var timeout, timestamp;
                    var wait = 99;
                    var run = function() {
                        timeout = null;
                        func();
                    };
                    var later = function() {
                        var last = Date.now() - timestamp;
                        if (last < wait) setTimeout(later, wait - last); else (requestIdleCallback || run)(run);
                    };
                    return function() {
                        timestamp = Date.now();
                        if (!timeout) timeout = setTimeout(later, wait);
                    };
                };
                var loader = function() {
                    var preloadElems, isCompleted, resetPreloadingTimer, loadMode, started;
                    var eLvW, elvH, eLtop, eLleft, eLright, eLbottom, isBodyHidden;
                    var regImg = /^img$/i;
                    var regIframe = /^iframe$/i;
                    var supportScroll = "onscroll" in window && !/(gle|ing)bot/.test(navigator.userAgent);
                    var shrinkExpand = 0;
                    var currentExpand = 0;
                    var isLoading = 0;
                    var lowRuns = -1;
                    var resetPreloading = function(e) {
                        isLoading--;
                        if (!e || isLoading < 0 || !e.target) isLoading = 0;
                    };
                    var isVisible = function(elem) {
                        if (null == isBodyHidden) isBodyHidden = "hidden" == getCSS(document.body, "visibility");
                        return isBodyHidden || !("hidden" == getCSS(elem.parentNode, "visibility") && "hidden" == getCSS(elem, "visibility"));
                    };
                    var isNestedVisible = function(elem, elemExpand) {
                        var outerRect;
                        var parent = elem;
                        var visible = isVisible(elem);
                        eLtop -= elemExpand;
                        eLbottom += elemExpand;
                        eLleft -= elemExpand;
                        eLright += elemExpand;
                        while (visible && (parent = parent.offsetParent) && parent != document.body && parent != docElem) {
                            visible = (getCSS(parent, "opacity") || 1) > 0;
                            if (visible && "visible" != getCSS(parent, "overflow")) {
                                outerRect = parent.getBoundingClientRect();
                                visible = eLright > outerRect.left && eLleft < outerRect.right && eLbottom > outerRect.top - 1 && eLtop < outerRect.bottom + 1;
                            }
                        }
                        return visible;
                    };
                    var checkElements = function() {
                        var eLlen, i, rect, autoLoadElem, loadedSomething, elemExpand, elemNegativeExpand, elemExpandVal, beforeExpandVal, defaultExpand, preloadExpand, hFac;
                        var lazyloadElems = lazysizes.elements;
                        if ((loadMode = lazySizesCfg.loadMode) && isLoading < 8 && (eLlen = lazyloadElems.length)) {
                            i = 0;
                            lowRuns++;
                            for (;i < eLlen; i++) {
                                if (!lazyloadElems[i] || lazyloadElems[i]._lazyRace) continue;
                                if (!supportScroll || lazysizes.prematureUnveil && lazysizes.prematureUnveil(lazyloadElems[i])) {
                                    unveilElement(lazyloadElems[i]);
                                    continue;
                                }
                                if (!(elemExpandVal = lazyloadElems[i][_getAttribute]("data-expand")) || !(elemExpand = 1 * elemExpandVal)) elemExpand = currentExpand;
                                if (!defaultExpand) {
                                    defaultExpand = !lazySizesCfg.expand || lazySizesCfg.expand < 1 ? docElem.clientHeight > 500 && docElem.clientWidth > 500 ? 500 : 370 : lazySizesCfg.expand;
                                    lazysizes._defEx = defaultExpand;
                                    preloadExpand = defaultExpand * lazySizesCfg.expFactor;
                                    hFac = lazySizesCfg.hFac;
                                    isBodyHidden = null;
                                    if (currentExpand < preloadExpand && isLoading < 1 && lowRuns > 2 && loadMode > 2 && !document.hidden) {
                                        currentExpand = preloadExpand;
                                        lowRuns = 0;
                                    } else if (loadMode > 1 && lowRuns > 1 && isLoading < 6) currentExpand = defaultExpand; else currentExpand = shrinkExpand;
                                }
                                if (beforeExpandVal !== elemExpand) {
                                    eLvW = innerWidth + elemExpand * hFac;
                                    elvH = innerHeight + elemExpand;
                                    elemNegativeExpand = -1 * elemExpand;
                                    beforeExpandVal = elemExpand;
                                }
                                rect = lazyloadElems[i].getBoundingClientRect();
                                if ((eLbottom = rect.bottom) >= elemNegativeExpand && (eLtop = rect.top) <= elvH && (eLright = rect.right) >= elemNegativeExpand * hFac && (eLleft = rect.left) <= eLvW && (eLbottom || eLright || eLleft || eLtop) && (lazySizesCfg.loadHidden || isVisible(lazyloadElems[i])) && (isCompleted && isLoading < 3 && !elemExpandVal && (loadMode < 3 || lowRuns < 4) || isNestedVisible(lazyloadElems[i], elemExpand))) {
                                    unveilElement(lazyloadElems[i]);
                                    loadedSomething = true;
                                    if (isLoading > 9) break;
                                } else if (!loadedSomething && isCompleted && !autoLoadElem && isLoading < 4 && lowRuns < 4 && loadMode > 2 && (preloadElems[0] || lazySizesCfg.preloadAfterLoad) && (preloadElems[0] || !elemExpandVal && (eLbottom || eLright || eLleft || eLtop || "auto" != lazyloadElems[i][_getAttribute](lazySizesCfg.sizesAttr)))) autoLoadElem = preloadElems[0] || lazyloadElems[i];
                            }
                            if (autoLoadElem && !loadedSomething) unveilElement(autoLoadElem);
                        }
                    };
                    var throttledCheckElements = throttle(checkElements);
                    var switchLoadingClass = function(e) {
                        var elem = e.target;
                        if (elem._lazyCache) {
                            delete elem._lazyCache;
                            return;
                        }
                        resetPreloading(e);
                        addClass(elem, lazySizesCfg.loadedClass);
                        removeClass(elem, lazySizesCfg.loadingClass);
                        addRemoveLoadEvents(elem, rafSwitchLoadingClass);
                        triggerEvent(elem, "lazyloaded");
                    };
                    var rafedSwitchLoadingClass = rAFIt(switchLoadingClass);
                    var rafSwitchLoadingClass = function(e) {
                        rafedSwitchLoadingClass({
                            target: e.target
                        });
                    };
                    var changeIframeSrc = function(elem, src) {
                        var loadMode = elem.getAttribute("data-load-mode") || lazySizesCfg.iframeLoadMode;
                        if (0 == loadMode) elem.contentWindow.location.replace(src); else if (1 == loadMode) elem.src = src;
                    };
                    var handleSources = function(source) {
                        var customMedia;
                        var sourceSrcset = source[_getAttribute](lazySizesCfg.srcsetAttr);
                        if (customMedia = lazySizesCfg.customMedia[source[_getAttribute]("data-media") || source[_getAttribute]("media")]) source.setAttribute("media", customMedia);
                        if (sourceSrcset) source.setAttribute("srcset", sourceSrcset);
                    };
                    var lazyUnveil = rAFIt((function(elem, detail, isAuto, sizes, isImg) {
                        var src, srcset, parent, isPicture, event, firesLoad;
                        if (!(event = triggerEvent(elem, "lazybeforeunveil", detail)).defaultPrevented) {
                            if (sizes) if (isAuto) addClass(elem, lazySizesCfg.autosizesClass); else elem.setAttribute("sizes", sizes);
                            srcset = elem[_getAttribute](lazySizesCfg.srcsetAttr);
                            src = elem[_getAttribute](lazySizesCfg.srcAttr);
                            if (isImg) {
                                parent = elem.parentNode;
                                isPicture = parent && regPicture.test(parent.nodeName || "");
                            }
                            firesLoad = detail.firesLoad || "src" in elem && (srcset || src || isPicture);
                            event = {
                                target: elem
                            };
                            addClass(elem, lazySizesCfg.loadingClass);
                            if (firesLoad) {
                                clearTimeout(resetPreloadingTimer);
                                resetPreloadingTimer = setTimeout(resetPreloading, 2500);
                                addRemoveLoadEvents(elem, rafSwitchLoadingClass, true);
                            }
                            if (isPicture) forEach.call(parent.getElementsByTagName("source"), handleSources);
                            if (srcset) elem.setAttribute("srcset", srcset); else if (src && !isPicture) if (regIframe.test(elem.nodeName)) changeIframeSrc(elem, src); else elem.src = src;
                            if (isImg && (srcset || isPicture)) updatePolyfill(elem, {
                                src
                            });
                        }
                        if (elem._lazyRace) delete elem._lazyRace;
                        removeClass(elem, lazySizesCfg.lazyClass);
                        rAF((function() {
                            var isLoaded = elem.complete && elem.naturalWidth > 1;
                            if (!firesLoad || isLoaded) {
                                if (isLoaded) addClass(elem, lazySizesCfg.fastLoadedClass);
                                switchLoadingClass(event);
                                elem._lazyCache = true;
                                setTimeout((function() {
                                    if ("_lazyCache" in elem) delete elem._lazyCache;
                                }), 9);
                            }
                            if ("lazy" == elem.loading) isLoading--;
                        }), true);
                    }));
                    var unveilElement = function(elem) {
                        if (elem._lazyRace) return;
                        var detail;
                        var isImg = regImg.test(elem.nodeName);
                        var sizes = isImg && (elem[_getAttribute](lazySizesCfg.sizesAttr) || elem[_getAttribute]("sizes"));
                        var isAuto = "auto" == sizes;
                        if ((isAuto || !isCompleted) && isImg && (elem[_getAttribute]("src") || elem.srcset) && !elem.complete && !hasClass(elem, lazySizesCfg.errorClass) && hasClass(elem, lazySizesCfg.lazyClass)) return;
                        detail = triggerEvent(elem, "lazyunveilread").detail;
                        if (isAuto) autoSizer.updateElem(elem, true, elem.offsetWidth);
                        elem._lazyRace = true;
                        isLoading++;
                        lazyUnveil(elem, detail, isAuto, sizes, isImg);
                    };
                    var afterScroll = debounce((function() {
                        lazySizesCfg.loadMode = 3;
                        throttledCheckElements();
                    }));
                    var altLoadmodeScrollListner = function() {
                        if (3 == lazySizesCfg.loadMode) lazySizesCfg.loadMode = 2;
                        afterScroll();
                    };
                    var onload = function() {
                        if (isCompleted) return;
                        if (Date.now() - started < 999) {
                            setTimeout(onload, 999);
                            return;
                        }
                        isCompleted = true;
                        lazySizesCfg.loadMode = 3;
                        throttledCheckElements();
                        addEventListener("scroll", altLoadmodeScrollListner, true);
                    };
                    return {
                        _: function() {
                            started = Date.now();
                            lazysizes.elements = document.getElementsByClassName(lazySizesCfg.lazyClass);
                            preloadElems = document.getElementsByClassName(lazySizesCfg.lazyClass + " " + lazySizesCfg.preloadClass);
                            addEventListener("scroll", throttledCheckElements, true);
                            addEventListener("resize", throttledCheckElements, true);
                            addEventListener("pageshow", (function(e) {
                                if (e.persisted) {
                                    var loadingElements = document.querySelectorAll("." + lazySizesCfg.loadingClass);
                                    if (loadingElements.length && loadingElements.forEach) requestAnimationFrame((function() {
                                        loadingElements.forEach((function(img) {
                                            if (img.complete) unveilElement(img);
                                        }));
                                    }));
                                }
                            }));
                            if (window.MutationObserver) new MutationObserver(throttledCheckElements).observe(docElem, {
                                childList: true,
                                subtree: true,
                                attributes: true
                            }); else {
                                docElem[_addEventListener]("DOMNodeInserted", throttledCheckElements, true);
                                docElem[_addEventListener]("DOMAttrModified", throttledCheckElements, true);
                                setInterval(throttledCheckElements, 999);
                            }
                            addEventListener("hashchange", throttledCheckElements, true);
                            [ "focus", "mouseover", "click", "load", "transitionend", "animationend" ].forEach((function(name) {
                                document[_addEventListener](name, throttledCheckElements, true);
                            }));
                            if (/d$|^c/.test(document.readyState)) onload(); else {
                                addEventListener("load", onload);
                                document[_addEventListener]("DOMContentLoaded", throttledCheckElements);
                                setTimeout(onload, 2e4);
                            }
                            if (lazysizes.elements.length) {
                                checkElements();
                                rAF._lsFlush();
                            } else throttledCheckElements();
                        },
                        checkElems: throttledCheckElements,
                        unveil: unveilElement,
                        _aLSL: altLoadmodeScrollListner
                    };
                }();
                var autoSizer = function() {
                    var autosizesElems;
                    var sizeElement = rAFIt((function(elem, parent, event, width) {
                        var sources, i, len;
                        elem._lazysizesWidth = width;
                        width += "px";
                        elem.setAttribute("sizes", width);
                        if (regPicture.test(parent.nodeName || "")) {
                            sources = parent.getElementsByTagName("source");
                            for (i = 0, len = sources.length; i < len; i++) sources[i].setAttribute("sizes", width);
                        }
                        if (!event.detail.dataAttr) updatePolyfill(elem, event.detail);
                    }));
                    var getSizeElement = function(elem, dataAttr, width) {
                        var event;
                        var parent = elem.parentNode;
                        if (parent) {
                            width = getWidth(elem, parent, width);
                            event = triggerEvent(elem, "lazybeforesizes", {
                                width,
                                dataAttr: !!dataAttr
                            });
                            if (!event.defaultPrevented) {
                                width = event.detail.width;
                                if (width && width !== elem._lazysizesWidth) sizeElement(elem, parent, event, width);
                            }
                        }
                    };
                    var updateElementsSizes = function() {
                        var i;
                        var len = autosizesElems.length;
                        if (len) {
                            i = 0;
                            for (;i < len; i++) getSizeElement(autosizesElems[i]);
                        }
                    };
                    var debouncedUpdateElementsSizes = debounce(updateElementsSizes);
                    return {
                        _: function() {
                            autosizesElems = document.getElementsByClassName(lazySizesCfg.autosizesClass);
                            addEventListener("resize", debouncedUpdateElementsSizes);
                        },
                        checkElems: debouncedUpdateElementsSizes,
                        updateElem: getSizeElement
                    };
                }();
                var init = function() {
                    if (!init.i && document.getElementsByClassName) {
                        init.i = true;
                        autoSizer._();
                        loader._();
                    }
                };
                setTimeout((function() {
                    if (lazySizesCfg.init) init();
                }));
                lazysizes = {
                    cfg: lazySizesCfg,
                    autoSizer,
                    loader,
                    init,
                    uP: updatePolyfill,
                    aC: addClass,
                    rC: removeClass,
                    hC: hasClass,
                    fire: triggerEvent,
                    gW: getWidth,
                    rAF
                };
                return lazysizes;
            }));
        }
    };
    var __webpack_module_cache__ = {};
    function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (void 0 !== cachedModule) return cachedModule.exports;
        var module = __webpack_module_cache__[moduleId] = {
            exports: {}
        };
        __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
        return module.exports;
    }
    (() => {
        "use strict";
        function isWebp() {
            function testWebP(callback) {
                let webP = new Image;
                webP.onload = webP.onerror = function() {
                    callback(2 == webP.height);
                };
                webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
            }
            testWebP((function(support) {
                let className = true === support ? "webp" : "no-webp";
                document.documentElement.classList.add(className);
            }));
        }
        function functions_getHash() {
            if (location.hash) return location.hash.replace("#", "");
        }
        function setHash(hash) {
            hash = hash ? `#${hash}` : window.location.href.split("#")[0];
            history.pushState("", "", hash);
        }
        let _slideUp = (target, duration = 500, showmore = 0) => {
            if (!target.classList.contains("_slide")) {
                target.classList.add("_slide");
                target.style.transitionProperty = "height, margin, padding";
                target.style.transitionDuration = duration + "ms";
                target.style.height = `${target.offsetHeight}px`;
                target.offsetHeight;
                target.style.overflow = "hidden";
                target.style.height = showmore ? `${showmore}px` : `0px`;
                target.style.paddingTop = 0;
                target.style.paddingBottom = 0;
                target.style.marginTop = 0;
                target.style.marginBottom = 0;
                window.setTimeout((() => {
                    target.hidden = !showmore ? true : false;
                    !showmore ? target.style.removeProperty("height") : null;
                    target.style.removeProperty("padding-top");
                    target.style.removeProperty("padding-bottom");
                    target.style.removeProperty("margin-top");
                    target.style.removeProperty("margin-bottom");
                    !showmore ? target.style.removeProperty("overflow") : null;
                    target.style.removeProperty("transition-duration");
                    target.style.removeProperty("transition-property");
                    target.classList.remove("_slide");
                    document.dispatchEvent(new CustomEvent("slideUpDone", {
                        detail: {
                            target
                        }
                    }));
                }), duration);
            }
        };
        let _slideDown = (target, duration = 500, showmore = 0) => {
            if (!target.classList.contains("_slide")) {
                target.classList.add("_slide");
                target.hidden = target.hidden ? false : null;
                showmore ? target.style.removeProperty("height") : null;
                let height = target.offsetHeight;
                target.style.overflow = "hidden";
                target.style.height = showmore ? `${showmore}px` : `0px`;
                target.style.paddingTop = 0;
                target.style.paddingBottom = 0;
                target.style.marginTop = 0;
                target.style.marginBottom = 0;
                target.offsetHeight;
                target.style.transitionProperty = "height, margin, padding";
                target.style.transitionDuration = duration + "ms";
                target.style.height = height + "px";
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                window.setTimeout((() => {
                    target.style.removeProperty("height");
                    target.style.removeProperty("overflow");
                    target.style.removeProperty("transition-duration");
                    target.style.removeProperty("transition-property");
                    target.classList.remove("_slide");
                    document.dispatchEvent(new CustomEvent("slideDownDone", {
                        detail: {
                            target
                        }
                    }));
                }), duration);
            }
        };
        let bodyLockStatus = true;
        let bodyLockToggle = (delay = 500) => {
            if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
        };
        let bodyUnlock = (delay = 500) => {
            let body = document.querySelector("body");
            if (bodyLockStatus) {
                let lock_padding = document.querySelectorAll("[data-lp]");
                setTimeout((() => {
                    for (let index = 0; index < lock_padding.length; index++) {
                        const el = lock_padding[index];
                        el.style.paddingRight = "0px";
                    }
                    body.style.paddingRight = "0px";
                    document.documentElement.classList.remove("lock");
                }), delay);
                bodyLockStatus = false;
                setTimeout((function() {
                    bodyLockStatus = true;
                }), delay);
            }
        };
        let bodyLock = (delay = 500) => {
            let body = document.querySelector("body");
            if (bodyLockStatus) {
                let lock_padding = document.querySelectorAll("[data-lp]");
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
                }
                body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
                document.documentElement.classList.add("lock");
                bodyLockStatus = false;
                setTimeout((function() {
                    bodyLockStatus = true;
                }), delay);
            }
        };
        function tabs() {
            const tabs = document.querySelectorAll("[data-tabs]");
            let tabsActiveHash = [];
            if (tabs.length > 0) {
                const hash = functions_getHash();
                if (hash && hash.startsWith("tab-")) tabsActiveHash = hash.replace("tab-", "").split("-");
                tabs.forEach(((tabsBlock, index) => {
                    tabsBlock.classList.add("_tab-init");
                    tabsBlock.setAttribute("data-tabs-index", index);
                    tabsBlock.addEventListener("click", setTabsAction);
                    initTabs(tabsBlock);
                }));
                let mdQueriesArray = dataMediaQueries(tabs, "tabs");
                if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                    mdQueriesItem.matchMedia.addEventListener("change", (function() {
                        setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                    }));
                    setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
            }
            function setTitlePosition(tabsMediaArray, matchMedia) {
                tabsMediaArray.forEach((tabsMediaItem => {
                    tabsMediaItem = tabsMediaItem.item;
                    let tabsTitles = tabsMediaItem.querySelector("[data-tabs-titles]");
                    let tabsTitleItems = tabsMediaItem.querySelectorAll("[data-tabs-title]");
                    let tabsContent = tabsMediaItem.querySelector("[data-tabs-body]");
                    let tabsContentItems = tabsMediaItem.querySelectorAll("[data-tabs-item]");
                    tabsTitleItems = Array.from(tabsTitleItems).filter((item => item.closest("[data-tabs]") === tabsMediaItem));
                    tabsContentItems = Array.from(tabsContentItems).filter((item => item.closest("[data-tabs]") === tabsMediaItem));
                    tabsContentItems.forEach(((tabsContentItem, index) => {
                        if (matchMedia.matches) {
                            tabsContent.append(tabsTitleItems[index]);
                            tabsContent.append(tabsContentItem);
                            tabsMediaItem.classList.add("_tab-spoller");
                        } else {
                            tabsTitles.append(tabsTitleItems[index]);
                            tabsMediaItem.classList.remove("_tab-spoller");
                        }
                    }));
                }));
            }
            function initTabs(tabsBlock) {
                let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-titles]>*");
                let tabsContent = tabsBlock.querySelectorAll("[data-tabs-body]>*");
                const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
                const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;
                if (tabsActiveHashBlock) {
                    const tabsActiveTitle = tabsBlock.querySelector("[data-tabs-titles]>._tab-active");
                    tabsActiveTitle ? tabsActiveTitle.classList.remove("_tab-active") : null;
                }
                if (tabsContent.length) {
                    tabsContent = Array.from(tabsContent).filter((item => item.closest("[data-tabs]") === tabsBlock));
                    tabsTitles = Array.from(tabsTitles).filter((item => item.closest("[data-tabs]") === tabsBlock));
                    tabsContent.forEach(((tabsContentItem, index) => {
                        tabsTitles[index].setAttribute("data-tabs-title", "");
                        tabsContentItem.setAttribute("data-tabs-item", "");
                        if (tabsActiveHashBlock && index == tabsActiveHash[1]) tabsTitles[index].classList.add("_tab-active");
                        tabsContentItem.hidden = !tabsTitles[index].classList.contains("_tab-active");
                    }));
                }
            }
            function setTabsStatus(tabsBlock) {
                let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-title]");
                let tabsContent = tabsBlock.querySelectorAll("[data-tabs-item]");
                const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
                function isTabsAnamate(tabsBlock) {
                    if (tabsBlock.hasAttribute("data-tabs-animate")) return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
                }
                const tabsBlockAnimate = isTabsAnamate(tabsBlock);
                if (tabsContent.length > 0) {
                    const isHash = tabsBlock.hasAttribute("data-tabs-hash");
                    tabsContent = Array.from(tabsContent).filter((item => item.closest("[data-tabs]") === tabsBlock));
                    tabsTitles = Array.from(tabsTitles).filter((item => item.closest("[data-tabs]") === tabsBlock));
                    tabsContent.forEach(((tabsContentItem, index) => {
                        if (tabsTitles[index].classList.contains("_tab-active")) {
                            if (tabsBlockAnimate) _slideDown(tabsContentItem, tabsBlockAnimate); else tabsContentItem.hidden = false;
                            if (isHash && !tabsContentItem.closest(".popup")) setHash(`tab-${tabsBlockIndex}-${index}`);
                        } else if (tabsBlockAnimate) _slideUp(tabsContentItem, tabsBlockAnimate); else tabsContentItem.hidden = true;
                    }));
                }
            }
            function setTabsAction(e) {
                const el = e.target;
                if (el.closest("[data-tabs-title]")) {
                    const tabTitle = el.closest("[data-tabs-title]");
                    const tabsBlock = tabTitle.closest("[data-tabs]");
                    if (!tabTitle.classList.contains("_tab-active") && !tabsBlock.querySelector("._slide")) {
                        let tabActiveTitle = tabsBlock.querySelectorAll("[data-tabs-title]._tab-active");
                        tabActiveTitle.length ? tabActiveTitle = Array.from(tabActiveTitle).filter((item => item.closest("[data-tabs]") === tabsBlock)) : null;
                        tabActiveTitle.length ? tabActiveTitle[0].classList.remove("_tab-active") : null;
                        tabTitle.classList.add("_tab-active");
                        setTabsStatus(tabsBlock);
                    }
                    e.preventDefault();
                }
            }
        }
        function menuInit() {
            if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
                if (bodyLockStatus && e.target.closest(".icon-menu")) {
                    bodyLockToggle();
                    document.documentElement.classList.toggle("menu-open");
                }
            }));
        }
        function uniqArray(array) {
            return array.filter((function(item, index, self) {
                return self.indexOf(item) === index;
            }));
        }
        function dataMediaQueries(array, dataSetValue) {
            const media = Array.from(array).filter((function(item, index, self) {
                if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
            }));
            if (media.length) {
                const breakpointsArray = [];
                media.forEach((item => {
                    const params = item.dataset[dataSetValue];
                    const breakpoint = {};
                    const paramsArray = params.split(",");
                    breakpoint.value = paramsArray[0];
                    breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                    breakpoint.item = item;
                    breakpointsArray.push(breakpoint);
                }));
                let mdQueries = breakpointsArray.map((function(item) {
                    return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
                }));
                mdQueries = uniqArray(mdQueries);
                const mdQueriesArray = [];
                if (mdQueries.length) {
                    mdQueries.forEach((breakpoint => {
                        const paramsArray = breakpoint.split(",");
                        const mediaBreakpoint = paramsArray[1];
                        const mediaType = paramsArray[2];
                        const matchMedia = window.matchMedia(paramsArray[0]);
                        const itemsArray = breakpointsArray.filter((function(item) {
                            if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                        }));
                        mdQueriesArray.push({
                            itemsArray,
                            matchMedia
                        });
                    }));
                    return mdQueriesArray;
                }
            }
        }
        let addWindowScrollEvent = false;
        setTimeout((() => {
            if (addWindowScrollEvent) {
                let windowScroll = new Event("windowScroll");
                window.addEventListener("scroll", (function(e) {
                    document.dispatchEvent(windowScroll);
                }));
            }
        }), 0);
        function DynamicAdapt(type) {
            this.type = type;
        }
        DynamicAdapt.prototype.init = function() {
            const _this = this;
            this.оbjects = [];
            this.daClassname = "_dynamic_adapt_";
            this.nodes = document.querySelectorAll("[data-da]");
            for (let i = 0; i < this.nodes.length; i++) {
                const node = this.nodes[i];
                const data = node.dataset.da.trim();
                const dataArray = data.split(",");
                const оbject = {};
                оbject.element = node;
                оbject.parent = node.parentNode;
                оbject.destination = document.querySelector(dataArray[0].trim());
                оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
                оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.оbjects.push(оbject);
            }
            this.arraySort(this.оbjects);
            this.mediaQueries = Array.prototype.map.call(this.оbjects, (function(item) {
                return "(" + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
            }), this);
            this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, (function(item, index, self) {
                return Array.prototype.indexOf.call(self, item) === index;
            }));
            for (let i = 0; i < this.mediaQueries.length; i++) {
                const media = this.mediaQueries[i];
                const mediaSplit = String.prototype.split.call(media, ",");
                const matchMedia = window.matchMedia(mediaSplit[0]);
                const mediaBreakpoint = mediaSplit[1];
                const оbjectsFilter = Array.prototype.filter.call(this.оbjects, (function(item) {
                    return item.breakpoint === mediaBreakpoint;
                }));
                matchMedia.addListener((function() {
                    _this.mediaHandler(matchMedia, оbjectsFilter);
                }));
                this.mediaHandler(matchMedia, оbjectsFilter);
            }
        };
        DynamicAdapt.prototype.mediaHandler = function(matchMedia, оbjects) {
            if (matchMedia.matches) for (let i = 0; i < оbjects.length; i++) {
                const оbject = оbjects[i];
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            } else for (let i = оbjects.length - 1; i >= 0; i--) {
                const оbject = оbjects[i];
                if (оbject.element.classList.contains(this.daClassname)) this.moveBack(оbject.parent, оbject.element, оbject.index);
            }
        };
        DynamicAdapt.prototype.moveTo = function(place, element, destination) {
            element.classList.add(this.daClassname);
            if ("last" === place || place >= destination.children.length) {
                destination.insertAdjacentElement("beforeend", element);
                return;
            }
            if ("first" === place) {
                destination.insertAdjacentElement("afterbegin", element);
                return;
            }
            destination.children[place].insertAdjacentElement("beforebegin", element);
        };
        DynamicAdapt.prototype.moveBack = function(parent, element, index) {
            element.classList.remove(this.daClassname);
            if (void 0 !== parent.children[index]) parent.children[index].insertAdjacentElement("beforebegin", element); else parent.insertAdjacentElement("beforeend", element);
        };
        DynamicAdapt.prototype.indexInParent = function(parent, element) {
            const array = Array.prototype.slice.call(parent.children);
            return Array.prototype.indexOf.call(array, element);
        };
        DynamicAdapt.prototype.arraySort = function(arr) {
            if ("min" === this.type) Array.prototype.sort.call(arr, (function(a, b) {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if ("first" === a.place || "last" === b.place) return -1;
                    if ("last" === a.place || "first" === b.place) return 1;
                    return a.place - b.place;
                }
                return a.breakpoint - b.breakpoint;
            })); else {
                Array.prototype.sort.call(arr, (function(a, b) {
                    if (a.breakpoint === b.breakpoint) {
                        if (a.place === b.place) return 0;
                        if ("first" === a.place || "last" === b.place) return 1;
                        if ("last" === a.place || "first" === b.place) return -1;
                        return b.place - a.place;
                    }
                    return b.breakpoint - a.breakpoint;
                }));
                return;
            }
        };
        const da = new DynamicAdapt("max");
        da.init();
        function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        function _createClass(Constructor, protoProps, staticProps) {
            if (protoProps) _defineProperties(Constructor.prototype, protoProps);
            if (staticProps) _defineProperties(Constructor, staticProps);
            Object.defineProperty(Constructor, "prototype", {
                writable: false
            });
            return Constructor;
        }
        /*!
 * Splide.js
 * Version  : 4.1.4
 * License  : MIT
 * Copyright: 2022 Naotoshi Fujita
 */        var MEDIA_PREFERS_REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
        var CREATED = 1;
        var MOUNTED = 2;
        var IDLE = 3;
        var MOVING = 4;
        var SCROLLING = 5;
        var DRAGGING = 6;
        var DESTROYED = 7;
        var STATES = {
            CREATED,
            MOUNTED,
            IDLE,
            MOVING,
            SCROLLING,
            DRAGGING,
            DESTROYED
        };
        function empty(array) {
            array.length = 0;
        }
        function slice(arrayLike, start, end) {
            return Array.prototype.slice.call(arrayLike, start, end);
        }
        function apply(func) {
            return func.bind.apply(func, [ null ].concat(slice(arguments, 1)));
        }
        var nextTick = setTimeout;
        var noop = function noop() {};
        function raf(func) {
            return requestAnimationFrame(func);
        }
        function typeOf(type, subject) {
            return typeof subject === type;
        }
        function isObject(subject) {
            return !isNull(subject) && typeOf("object", subject);
        }
        var isArray = Array.isArray;
        var isFunction = apply(typeOf, "function");
        var isString = apply(typeOf, "string");
        var isUndefined = apply(typeOf, "undefined");
        function isNull(subject) {
            return null === subject;
        }
        function isHTMLElement(subject) {
            try {
                return subject instanceof (subject.ownerDocument.defaultView || window).HTMLElement;
            } catch (e) {
                return false;
            }
        }
        function toArray(value) {
            return isArray(value) ? value : [ value ];
        }
        function forEach(values, iteratee) {
            toArray(values).forEach(iteratee);
        }
        function includes(array, value) {
            return array.indexOf(value) > -1;
        }
        function push(array, items) {
            array.push.apply(array, toArray(items));
            return array;
        }
        function toggleClass(elm, classes, add) {
            if (elm) forEach(classes, (function(name) {
                if (name) elm.classList[add ? "add" : "remove"](name);
            }));
        }
        function addClass(elm, classes) {
            toggleClass(elm, isString(classes) ? classes.split(" ") : classes, true);
        }
        function append(parent, children) {
            forEach(children, parent.appendChild.bind(parent));
        }
        function before(nodes, ref) {
            forEach(nodes, (function(node) {
                var parent = (ref || node).parentNode;
                if (parent) parent.insertBefore(node, ref);
            }));
        }
        function matches(elm, selector) {
            return isHTMLElement(elm) && (elm["msMatchesSelector"] || elm.matches).call(elm, selector);
        }
        function children(parent, selector) {
            var children2 = parent ? slice(parent.children) : [];
            return selector ? children2.filter((function(child) {
                return matches(child, selector);
            })) : children2;
        }
        function child(parent, selector) {
            return selector ? children(parent, selector)[0] : parent.firstElementChild;
        }
        var ownKeys = Object.keys;
        function forOwn(object, iteratee, right) {
            if (object) (right ? ownKeys(object).reverse() : ownKeys(object)).forEach((function(key) {
                "__proto__" !== key && iteratee(object[key], key);
            }));
            return object;
        }
        function splide_esm_assign(object) {
            slice(arguments, 1).forEach((function(source) {
                forOwn(source, (function(value, key) {
                    object[key] = source[key];
                }));
            }));
            return object;
        }
        function merge(object) {
            slice(arguments, 1).forEach((function(source) {
                forOwn(source, (function(value, key) {
                    if (isArray(value)) object[key] = value.slice(); else if (isObject(value)) object[key] = merge({}, isObject(object[key]) ? object[key] : {}, value); else object[key] = value;
                }));
            }));
            return object;
        }
        function omit(object, keys) {
            forEach(keys || ownKeys(object), (function(key) {
                delete object[key];
            }));
        }
        function removeAttribute(elms, attrs) {
            forEach(elms, (function(elm) {
                forEach(attrs, (function(attr) {
                    elm && elm.removeAttribute(attr);
                }));
            }));
        }
        function setAttribute(elms, attrs, value) {
            if (isObject(attrs)) forOwn(attrs, (function(value2, name) {
                setAttribute(elms, name, value2);
            })); else forEach(elms, (function(elm) {
                isNull(value) || "" === value ? removeAttribute(elm, attrs) : elm.setAttribute(attrs, String(value));
            }));
        }
        function create(tag, attrs, parent) {
            var elm = document.createElement(tag);
            if (attrs) isString(attrs) ? addClass(elm, attrs) : setAttribute(elm, attrs);
            parent && append(parent, elm);
            return elm;
        }
        function style(elm, prop, value) {
            if (isUndefined(value)) return getComputedStyle(elm)[prop];
            if (!isNull(value)) elm.style[prop] = "" + value;
        }
        function display(elm, display2) {
            style(elm, "display", display2);
        }
        function splide_esm_focus(elm) {
            elm["setActive"] && elm["setActive"]() || elm.focus({
                preventScroll: true
            });
        }
        function getAttribute(elm, attr) {
            return elm.getAttribute(attr);
        }
        function hasClass(elm, className) {
            return elm && elm.classList.contains(className);
        }
        function rect(target) {
            return target.getBoundingClientRect();
        }
        function remove(nodes) {
            forEach(nodes, (function(node) {
                if (node && node.parentNode) node.parentNode.removeChild(node);
            }));
        }
        function parseHtml(html) {
            return child((new DOMParser).parseFromString(html, "text/html").body);
        }
        function prevent(e, stopPropagation) {
            e.preventDefault();
            if (stopPropagation) {
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        }
        function query(parent, selector) {
            return parent && parent.querySelector(selector);
        }
        function queryAll(parent, selector) {
            return selector ? slice(parent.querySelectorAll(selector)) : [];
        }
        function removeClass(elm, classes) {
            toggleClass(elm, classes, false);
        }
        function timeOf(e) {
            return e.timeStamp;
        }
        function unit(value) {
            return isString(value) ? value : value ? value + "px" : "";
        }
        var PROJECT_CODE = "splide";
        var DATA_ATTRIBUTE = "data-" + PROJECT_CODE;
        function assert(condition, message) {
            if (!condition) throw new Error("[" + PROJECT_CODE + "] " + (message || ""));
        }
        var min = Math.min, max = Math.max, floor = Math.floor, ceil = Math.ceil, abs = Math.abs;
        function approximatelyEqual(x, y, epsilon) {
            return abs(x - y) < epsilon;
        }
        function between(number, x, y, exclusive) {
            var minimum = min(x, y);
            var maximum = max(x, y);
            return exclusive ? minimum < number && number < maximum : minimum <= number && number <= maximum;
        }
        function clamp(number, x, y) {
            var minimum = min(x, y);
            var maximum = max(x, y);
            return min(max(minimum, number), maximum);
        }
        function sign(x) {
            return +(x > 0) - +(x < 0);
        }
        function camelToKebab(string) {
            return string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
        }
        function format(string, replacements) {
            forEach(replacements, (function(replacement) {
                string = string.replace("%s", "" + replacement);
            }));
            return string;
        }
        function pad(number) {
            return number < 10 ? "0" + number : "" + number;
        }
        var ids = {};
        function uniqueId(prefix) {
            return "" + prefix + pad(ids[prefix] = (ids[prefix] || 0) + 1);
        }
        function EventBinder() {
            var listeners = [];
            function bind(targets, events, callback, options) {
                forEachEvent(targets, events, (function(target, event, namespace) {
                    var isEventTarget = "addEventListener" in target;
                    var remover = isEventTarget ? target.removeEventListener.bind(target, event, callback, options) : target["removeListener"].bind(target, callback);
                    isEventTarget ? target.addEventListener(event, callback, options) : target["addListener"](callback);
                    listeners.push([ target, event, namespace, callback, remover ]);
                }));
            }
            function unbind(targets, events, callback) {
                forEachEvent(targets, events, (function(target, event, namespace) {
                    listeners = listeners.filter((function(listener) {
                        if (listener[0] === target && listener[1] === event && listener[2] === namespace && (!callback || listener[3] === callback)) {
                            listener[4]();
                            return false;
                        }
                        return true;
                    }));
                }));
            }
            function dispatch(target, type, detail) {
                var e;
                var bubbles = true;
                if ("function" === typeof CustomEvent) e = new CustomEvent(type, {
                    bubbles,
                    detail
                }); else {
                    e = document.createEvent("CustomEvent");
                    e.initCustomEvent(type, bubbles, false, detail);
                }
                target.dispatchEvent(e);
                return e;
            }
            function forEachEvent(targets, events, iteratee) {
                forEach(targets, (function(target) {
                    target && forEach(events, (function(events2) {
                        events2.split(" ").forEach((function(eventNS) {
                            var fragment = eventNS.split(".");
                            iteratee(target, fragment[0], fragment[1]);
                        }));
                    }));
                }));
            }
            function destroy() {
                listeners.forEach((function(data) {
                    data[4]();
                }));
                empty(listeners);
            }
            return {
                bind,
                unbind,
                dispatch,
                destroy
            };
        }
        var EVENT_MOUNTED = "mounted";
        var EVENT_READY = "ready";
        var EVENT_MOVE = "move";
        var EVENT_MOVED = "moved";
        var EVENT_CLICK = "click";
        var EVENT_ACTIVE = "active";
        var EVENT_INACTIVE = "inactive";
        var EVENT_VISIBLE = "visible";
        var EVENT_HIDDEN = "hidden";
        var EVENT_REFRESH = "refresh";
        var EVENT_UPDATED = "updated";
        var EVENT_RESIZE = "resize";
        var EVENT_RESIZED = "resized";
        var EVENT_DRAG = "drag";
        var EVENT_DRAGGING = "dragging";
        var EVENT_DRAGGED = "dragged";
        var EVENT_SCROLL = "scroll";
        var EVENT_SCROLLED = "scrolled";
        var EVENT_OVERFLOW = "overflow";
        var EVENT_DESTROY = "destroy";
        var EVENT_ARROWS_MOUNTED = "arrows:mounted";
        var EVENT_ARROWS_UPDATED = "arrows:updated";
        var EVENT_PAGINATION_MOUNTED = "pagination:mounted";
        var EVENT_PAGINATION_UPDATED = "pagination:updated";
        var EVENT_NAVIGATION_MOUNTED = "navigation:mounted";
        var EVENT_AUTOPLAY_PLAY = "autoplay:play";
        var EVENT_AUTOPLAY_PLAYING = "autoplay:playing";
        var EVENT_AUTOPLAY_PAUSE = "autoplay:pause";
        var EVENT_LAZYLOAD_LOADED = "lazyload:loaded";
        var EVENT_SLIDE_KEYDOWN = "sk";
        var EVENT_SHIFTED = "sh";
        var EVENT_END_INDEX_CHANGED = "ei";
        function EventInterface(Splide2) {
            var bus = Splide2 ? Splide2.event.bus : document.createDocumentFragment();
            var binder = EventBinder();
            function on(events, callback) {
                binder.bind(bus, toArray(events).join(" "), (function(e) {
                    callback.apply(callback, isArray(e.detail) ? e.detail : []);
                }));
            }
            function emit(event) {
                binder.dispatch(bus, event, slice(arguments, 1));
            }
            if (Splide2) Splide2.event.on(EVENT_DESTROY, binder.destroy);
            return splide_esm_assign(binder, {
                bus,
                on,
                off: apply(binder.unbind, bus),
                emit
            });
        }
        function RequestInterval(interval, onInterval, onUpdate, limit) {
            var now = Date.now;
            var startTime;
            var rate = 0;
            var id;
            var paused = true;
            var count = 0;
            function update() {
                if (!paused) {
                    rate = interval ? min((now() - startTime) / interval, 1) : 1;
                    onUpdate && onUpdate(rate);
                    if (rate >= 1) {
                        onInterval();
                        startTime = now();
                        if (limit && ++count >= limit) return pause();
                    }
                    id = raf(update);
                }
            }
            function start(resume) {
                resume || cancel();
                startTime = now() - (resume ? rate * interval : 0);
                paused = false;
                id = raf(update);
            }
            function pause() {
                paused = true;
            }
            function rewind() {
                startTime = now();
                rate = 0;
                if (onUpdate) onUpdate(rate);
            }
            function cancel() {
                id && cancelAnimationFrame(id);
                rate = 0;
                id = 0;
                paused = true;
            }
            function set(time) {
                interval = time;
            }
            function isPaused() {
                return paused;
            }
            return {
                start,
                rewind,
                pause,
                cancel,
                set,
                isPaused
            };
        }
        function State(initialState) {
            var state = initialState;
            function set(value) {
                state = value;
            }
            function is(states) {
                return includes(toArray(states), state);
            }
            return {
                set,
                is
            };
        }
        function Throttle(func, duration) {
            var interval = RequestInterval(duration || 0, func, null, 1);
            return function() {
                interval.isPaused() && interval.start();
            };
        }
        function Media(Splide2, Components2, options) {
            var state = Splide2.state;
            var breakpoints = options.breakpoints || {};
            var reducedMotion = options.reducedMotion || {};
            var binder = EventBinder();
            var queries = [];
            function setup() {
                var isMin = "min" === options.mediaQuery;
                ownKeys(breakpoints).sort((function(n, m) {
                    return isMin ? +n - +m : +m - +n;
                })).forEach((function(key) {
                    register(breakpoints[key], "(" + (isMin ? "min" : "max") + "-width:" + key + "px)");
                }));
                register(reducedMotion, MEDIA_PREFERS_REDUCED_MOTION);
                update();
            }
            function destroy(completely) {
                if (completely) binder.destroy();
            }
            function register(options2, query) {
                var queryList = matchMedia(query);
                binder.bind(queryList, "change", update);
                queries.push([ options2, queryList ]);
            }
            function update() {
                var destroyed = state.is(DESTROYED);
                var direction = options.direction;
                var merged = queries.reduce((function(merged2, entry) {
                    return merge(merged2, entry[1].matches ? entry[0] : {});
                }), {});
                omit(options);
                set(merged);
                if (options.destroy) Splide2.destroy("completely" === options.destroy); else if (destroyed) {
                    destroy(true);
                    Splide2.mount();
                } else direction !== options.direction && Splide2.refresh();
            }
            function reduce(enable) {
                if (matchMedia(MEDIA_PREFERS_REDUCED_MOTION).matches) enable ? merge(options, reducedMotion) : omit(options, ownKeys(reducedMotion));
            }
            function set(opts, base, notify) {
                merge(options, opts);
                base && merge(Object.getPrototypeOf(options), opts);
                if (notify || !state.is(CREATED)) Splide2.emit(EVENT_UPDATED, options);
            }
            return {
                setup,
                destroy,
                reduce,
                set
            };
        }
        var ARROW = "Arrow";
        var ARROW_LEFT = ARROW + "Left";
        var ARROW_RIGHT = ARROW + "Right";
        var ARROW_UP = ARROW + "Up";
        var ARROW_DOWN = ARROW + "Down";
        var RTL = "rtl";
        var TTB = "ttb";
        var ORIENTATION_MAP = {
            width: [ "height" ],
            left: [ "top", "right" ],
            right: [ "bottom", "left" ],
            x: [ "y" ],
            X: [ "Y" ],
            Y: [ "X" ],
            ArrowLeft: [ ARROW_UP, ARROW_RIGHT ],
            ArrowRight: [ ARROW_DOWN, ARROW_LEFT ]
        };
        function Direction(Splide2, Components2, options) {
            function resolve(prop, axisOnly, direction) {
                direction = direction || options.direction;
                var index = direction === RTL && !axisOnly ? 1 : direction === TTB ? 0 : -1;
                return ORIENTATION_MAP[prop] && ORIENTATION_MAP[prop][index] || prop.replace(/width|left|right/i, (function(match, offset) {
                    var replacement = ORIENTATION_MAP[match.toLowerCase()][index] || match;
                    return offset > 0 ? replacement.charAt(0).toUpperCase() + replacement.slice(1) : replacement;
                }));
            }
            function orient(value) {
                return value * (options.direction === RTL ? 1 : -1);
            }
            return {
                resolve,
                orient
            };
        }
        var ROLE = "role";
        var TAB_INDEX = "tabindex";
        var DISABLED = "disabled";
        var ARIA_PREFIX = "aria-";
        var ARIA_CONTROLS = ARIA_PREFIX + "controls";
        var ARIA_CURRENT = ARIA_PREFIX + "current";
        var ARIA_SELECTED = ARIA_PREFIX + "selected";
        var ARIA_LABEL = ARIA_PREFIX + "label";
        var ARIA_LABELLEDBY = ARIA_PREFIX + "labelledby";
        var ARIA_HIDDEN = ARIA_PREFIX + "hidden";
        var ARIA_ORIENTATION = ARIA_PREFIX + "orientation";
        var ARIA_ROLEDESCRIPTION = ARIA_PREFIX + "roledescription";
        var ARIA_LIVE = ARIA_PREFIX + "live";
        var ARIA_BUSY = ARIA_PREFIX + "busy";
        var ARIA_ATOMIC = ARIA_PREFIX + "atomic";
        var ALL_ATTRIBUTES = [ ROLE, TAB_INDEX, DISABLED, ARIA_CONTROLS, ARIA_CURRENT, ARIA_LABEL, ARIA_LABELLEDBY, ARIA_HIDDEN, ARIA_ORIENTATION, ARIA_ROLEDESCRIPTION ];
        var CLASS_PREFIX = PROJECT_CODE + "__";
        var STATUS_CLASS_PREFIX = "is-";
        var CLASS_ROOT = PROJECT_CODE;
        var CLASS_TRACK = CLASS_PREFIX + "track";
        var CLASS_LIST = CLASS_PREFIX + "list";
        var CLASS_SLIDE = CLASS_PREFIX + "slide";
        var CLASS_CLONE = CLASS_SLIDE + "--clone";
        var CLASS_CONTAINER = CLASS_SLIDE + "__container";
        var CLASS_ARROWS = CLASS_PREFIX + "arrows";
        var CLASS_ARROW = CLASS_PREFIX + "arrow";
        var CLASS_ARROW_PREV = CLASS_ARROW + "--prev";
        var CLASS_ARROW_NEXT = CLASS_ARROW + "--next";
        var CLASS_PAGINATION = CLASS_PREFIX + "pagination";
        var CLASS_PAGINATION_PAGE = CLASS_PAGINATION + "__page";
        var CLASS_PROGRESS = CLASS_PREFIX + "progress";
        var CLASS_PROGRESS_BAR = CLASS_PROGRESS + "__bar";
        var CLASS_TOGGLE = CLASS_PREFIX + "toggle";
        var CLASS_SPINNER = CLASS_PREFIX + "spinner";
        var CLASS_SR = CLASS_PREFIX + "sr";
        var CLASS_INITIALIZED = STATUS_CLASS_PREFIX + "initialized";
        var CLASS_ACTIVE = STATUS_CLASS_PREFIX + "active";
        var CLASS_PREV = STATUS_CLASS_PREFIX + "prev";
        var CLASS_NEXT = STATUS_CLASS_PREFIX + "next";
        var CLASS_VISIBLE = STATUS_CLASS_PREFIX + "visible";
        var CLASS_LOADING = STATUS_CLASS_PREFIX + "loading";
        var CLASS_FOCUS_IN = STATUS_CLASS_PREFIX + "focus-in";
        var CLASS_OVERFLOW = STATUS_CLASS_PREFIX + "overflow";
        var STATUS_CLASSES = [ CLASS_ACTIVE, CLASS_VISIBLE, CLASS_PREV, CLASS_NEXT, CLASS_LOADING, CLASS_FOCUS_IN, CLASS_OVERFLOW ];
        var CLASSES = {
            slide: CLASS_SLIDE,
            clone: CLASS_CLONE,
            arrows: CLASS_ARROWS,
            arrow: CLASS_ARROW,
            prev: CLASS_ARROW_PREV,
            next: CLASS_ARROW_NEXT,
            pagination: CLASS_PAGINATION,
            page: CLASS_PAGINATION_PAGE,
            spinner: CLASS_SPINNER
        };
        function closest(from, selector) {
            if (isFunction(from.closest)) return from.closest(selector);
            var elm = from;
            while (elm && 1 === elm.nodeType) {
                if (matches(elm, selector)) break;
                elm = elm.parentElement;
            }
            return elm;
        }
        var FRICTION = 5;
        var LOG_INTERVAL = 200;
        var POINTER_DOWN_EVENTS = "touchstart mousedown";
        var POINTER_MOVE_EVENTS = "touchmove mousemove";
        var POINTER_UP_EVENTS = "touchend touchcancel mouseup click";
        function Elements(Splide2, Components2, options) {
            var _EventInterface = EventInterface(Splide2), on = _EventInterface.on, bind = _EventInterface.bind;
            var root = Splide2.root;
            var i18n = options.i18n;
            var elements = {};
            var slides = [];
            var rootClasses = [];
            var trackClasses = [];
            var track;
            var list;
            var isUsingKey;
            function setup() {
                collect();
                init();
                update();
            }
            function mount() {
                on(EVENT_REFRESH, destroy);
                on(EVENT_REFRESH, setup);
                on(EVENT_UPDATED, update);
                bind(document, POINTER_DOWN_EVENTS + " keydown", (function(e) {
                    isUsingKey = "keydown" === e.type;
                }), {
                    capture: true
                });
                bind(root, "focusin", (function() {
                    toggleClass(root, CLASS_FOCUS_IN, !!isUsingKey);
                }));
            }
            function destroy(completely) {
                var attrs = ALL_ATTRIBUTES.concat("style");
                empty(slides);
                removeClass(root, rootClasses);
                removeClass(track, trackClasses);
                removeAttribute([ track, list ], attrs);
                removeAttribute(root, completely ? attrs : [ "style", ARIA_ROLEDESCRIPTION ]);
            }
            function update() {
                removeClass(root, rootClasses);
                removeClass(track, trackClasses);
                rootClasses = getClasses(CLASS_ROOT);
                trackClasses = getClasses(CLASS_TRACK);
                addClass(root, rootClasses);
                addClass(track, trackClasses);
                setAttribute(root, ARIA_LABEL, options.label);
                setAttribute(root, ARIA_LABELLEDBY, options.labelledby);
            }
            function collect() {
                track = find("." + CLASS_TRACK);
                list = child(track, "." + CLASS_LIST);
                assert(track && list, "A track/list element is missing.");
                push(slides, children(list, "." + CLASS_SLIDE + ":not(." + CLASS_CLONE + ")"));
                forOwn({
                    arrows: CLASS_ARROWS,
                    pagination: CLASS_PAGINATION,
                    prev: CLASS_ARROW_PREV,
                    next: CLASS_ARROW_NEXT,
                    bar: CLASS_PROGRESS_BAR,
                    toggle: CLASS_TOGGLE
                }, (function(className, key) {
                    elements[key] = find("." + className);
                }));
                splide_esm_assign(elements, {
                    root,
                    track,
                    list,
                    slides
                });
            }
            function init() {
                var id = root.id || uniqueId(PROJECT_CODE);
                var role = options.role;
                root.id = id;
                track.id = track.id || id + "-track";
                list.id = list.id || id + "-list";
                if (!getAttribute(root, ROLE) && "SECTION" !== root.tagName && role) setAttribute(root, ROLE, role);
                setAttribute(root, ARIA_ROLEDESCRIPTION, i18n.carousel);
                setAttribute(list, ROLE, "presentation");
            }
            function find(selector) {
                var elm = query(root, selector);
                return elm && closest(elm, "." + CLASS_ROOT) === root ? elm : void 0;
            }
            function getClasses(base) {
                return [ base + "--" + options.type, base + "--" + options.direction, options.drag && base + "--draggable", options.isNavigation && base + "--nav", base === CLASS_ROOT && CLASS_ACTIVE ];
            }
            return splide_esm_assign(elements, {
                setup,
                mount,
                destroy
            });
        }
        var SLIDE = "slide";
        var LOOP = "loop";
        var FADE = "fade";
        function Slide$1(Splide2, index, slideIndex, slide) {
            var event = EventInterface(Splide2);
            var on = event.on, emit = event.emit, bind = event.bind;
            var Components = Splide2.Components, root = Splide2.root, options = Splide2.options;
            var isNavigation = options.isNavigation, updateOnMove = options.updateOnMove, i18n = options.i18n, pagination = options.pagination, slideFocus = options.slideFocus;
            var resolve = Components.Direction.resolve;
            var styles = getAttribute(slide, "style");
            var label = getAttribute(slide, ARIA_LABEL);
            var isClone = slideIndex > -1;
            var container = child(slide, "." + CLASS_CONTAINER);
            var destroyed;
            function mount() {
                if (!isClone) {
                    slide.id = root.id + "-slide" + pad(index + 1);
                    setAttribute(slide, ROLE, pagination ? "tabpanel" : "group");
                    setAttribute(slide, ARIA_ROLEDESCRIPTION, i18n.slide);
                    setAttribute(slide, ARIA_LABEL, label || format(i18n.slideLabel, [ index + 1, Splide2.length ]));
                }
                listen();
            }
            function listen() {
                bind(slide, "click", apply(emit, EVENT_CLICK, self));
                bind(slide, "keydown", apply(emit, EVENT_SLIDE_KEYDOWN, self));
                on([ EVENT_MOVED, EVENT_SHIFTED, EVENT_SCROLLED ], update);
                on(EVENT_NAVIGATION_MOUNTED, initNavigation);
                if (updateOnMove) on(EVENT_MOVE, onMove);
            }
            function destroy() {
                destroyed = true;
                event.destroy();
                removeClass(slide, STATUS_CLASSES);
                removeAttribute(slide, ALL_ATTRIBUTES);
                setAttribute(slide, "style", styles);
                setAttribute(slide, ARIA_LABEL, label || "");
            }
            function initNavigation() {
                var controls = Splide2.splides.map((function(target) {
                    var Slide2 = target.splide.Components.Slides.getAt(index);
                    return Slide2 ? Slide2.slide.id : "";
                })).join(" ");
                setAttribute(slide, ARIA_LABEL, format(i18n.slideX, (isClone ? slideIndex : index) + 1));
                setAttribute(slide, ARIA_CONTROLS, controls);
                setAttribute(slide, ROLE, slideFocus ? "button" : "");
                slideFocus && removeAttribute(slide, ARIA_ROLEDESCRIPTION);
            }
            function onMove() {
                if (!destroyed) update();
            }
            function update() {
                if (!destroyed) {
                    var curr = Splide2.index;
                    updateActivity();
                    updateVisibility();
                    toggleClass(slide, CLASS_PREV, index === curr - 1);
                    toggleClass(slide, CLASS_NEXT, index === curr + 1);
                }
            }
            function updateActivity() {
                var active = isActive();
                if (active !== hasClass(slide, CLASS_ACTIVE)) {
                    toggleClass(slide, CLASS_ACTIVE, active);
                    setAttribute(slide, ARIA_CURRENT, isNavigation && active || "");
                    emit(active ? EVENT_ACTIVE : EVENT_INACTIVE, self);
                }
            }
            function updateVisibility() {
                var visible = isVisible();
                var hidden = !visible && (!isActive() || isClone);
                if (!Splide2.state.is([ MOVING, SCROLLING ])) setAttribute(slide, ARIA_HIDDEN, hidden || "");
                setAttribute(queryAll(slide, options.focusableNodes || ""), TAB_INDEX, hidden ? -1 : "");
                if (slideFocus) setAttribute(slide, TAB_INDEX, hidden ? -1 : 0);
                if (visible !== hasClass(slide, CLASS_VISIBLE)) {
                    toggleClass(slide, CLASS_VISIBLE, visible);
                    emit(visible ? EVENT_VISIBLE : EVENT_HIDDEN, self);
                }
                if (!visible && document.activeElement === slide) {
                    var Slide2 = Components.Slides.getAt(Splide2.index);
                    Slide2 && splide_esm_focus(Slide2.slide);
                }
            }
            function style$1(prop, value, useContainer) {
                style(useContainer && container || slide, prop, value);
            }
            function isActive() {
                var curr = Splide2.index;
                return curr === index || options.cloneStatus && curr === slideIndex;
            }
            function isVisible() {
                if (Splide2.is(FADE)) return isActive();
                var trackRect = rect(Components.Elements.track);
                var slideRect = rect(slide);
                var left = resolve("left", true);
                var right = resolve("right", true);
                return floor(trackRect[left]) <= ceil(slideRect[left]) && floor(slideRect[right]) <= ceil(trackRect[right]);
            }
            function isWithin(from, distance) {
                var diff = abs(from - index);
                if (!isClone && (options.rewind || Splide2.is(LOOP))) diff = min(diff, Splide2.length - diff);
                return diff <= distance;
            }
            var self = {
                index,
                slideIndex,
                slide,
                container,
                isClone,
                mount,
                destroy,
                update,
                style: style$1,
                isWithin
            };
            return self;
        }
        function Slides(Splide2, Components2, options) {
            var _EventInterface2 = EventInterface(Splide2), on = _EventInterface2.on, emit = _EventInterface2.emit, bind = _EventInterface2.bind;
            var _Components2$Elements = Components2.Elements, slides = _Components2$Elements.slides, list = _Components2$Elements.list;
            var Slides2 = [];
            function mount() {
                init();
                on(EVENT_REFRESH, destroy);
                on(EVENT_REFRESH, init);
            }
            function init() {
                slides.forEach((function(slide, index) {
                    register(slide, index, -1);
                }));
            }
            function destroy() {
                forEach$1((function(Slide2) {
                    Slide2.destroy();
                }));
                empty(Slides2);
            }
            function update() {
                forEach$1((function(Slide2) {
                    Slide2.update();
                }));
            }
            function register(slide, index, slideIndex) {
                var object = Slide$1(Splide2, index, slideIndex, slide);
                object.mount();
                Slides2.push(object);
                Slides2.sort((function(Slide1, Slide2) {
                    return Slide1.index - Slide2.index;
                }));
            }
            function get(excludeClones) {
                return excludeClones ? filter((function(Slide2) {
                    return !Slide2.isClone;
                })) : Slides2;
            }
            function getIn(page) {
                var Controller = Components2.Controller;
                var index = Controller.toIndex(page);
                var max = Controller.hasFocus() ? 1 : options.perPage;
                return filter((function(Slide2) {
                    return between(Slide2.index, index, index + max - 1);
                }));
            }
            function getAt(index) {
                return filter(index)[0];
            }
            function add(items, index) {
                forEach(items, (function(slide) {
                    if (isString(slide)) slide = parseHtml(slide);
                    if (isHTMLElement(slide)) {
                        var ref = slides[index];
                        ref ? before(slide, ref) : append(list, slide);
                        addClass(slide, options.classes.slide);
                        observeImages(slide, apply(emit, EVENT_RESIZE));
                    }
                }));
                emit(EVENT_REFRESH);
            }
            function remove$1(matcher) {
                remove(filter(matcher).map((function(Slide2) {
                    return Slide2.slide;
                })));
                emit(EVENT_REFRESH);
            }
            function forEach$1(iteratee, excludeClones) {
                get(excludeClones).forEach(iteratee);
            }
            function filter(matcher) {
                return Slides2.filter(isFunction(matcher) ? matcher : function(Slide2) {
                    return isString(matcher) ? matches(Slide2.slide, matcher) : includes(toArray(matcher), Slide2.index);
                });
            }
            function style(prop, value, useContainer) {
                forEach$1((function(Slide2) {
                    Slide2.style(prop, value, useContainer);
                }));
            }
            function observeImages(elm, callback) {
                var images = queryAll(elm, "img");
                var length = images.length;
                if (length) images.forEach((function(img) {
                    bind(img, "load error", (function() {
                        if (!--length) callback();
                    }));
                })); else callback();
            }
            function getLength(excludeClones) {
                return excludeClones ? slides.length : Slides2.length;
            }
            function isEnough() {
                return Slides2.length > options.perPage;
            }
            return {
                mount,
                destroy,
                update,
                register,
                get,
                getIn,
                getAt,
                add,
                remove: remove$1,
                forEach: forEach$1,
                filter,
                style,
                getLength,
                isEnough
            };
        }
        function Layout(Splide2, Components2, options) {
            var _EventInterface3 = EventInterface(Splide2), on = _EventInterface3.on, bind = _EventInterface3.bind, emit = _EventInterface3.emit;
            var Slides = Components2.Slides;
            var resolve = Components2.Direction.resolve;
            var _Components2$Elements2 = Components2.Elements, root = _Components2$Elements2.root, track = _Components2$Elements2.track, list = _Components2$Elements2.list;
            var getAt = Slides.getAt, styleSlides = Slides.style;
            var vertical;
            var rootRect;
            var overflow;
            function mount() {
                init();
                bind(window, "resize load", Throttle(apply(emit, EVENT_RESIZE)));
                on([ EVENT_UPDATED, EVENT_REFRESH ], init);
                on(EVENT_RESIZE, resize);
            }
            function init() {
                vertical = options.direction === TTB;
                style(root, "maxWidth", unit(options.width));
                style(track, resolve("paddingLeft"), cssPadding(false));
                style(track, resolve("paddingRight"), cssPadding(true));
                resize(true);
            }
            function resize(force) {
                var newRect = rect(root);
                if (force || rootRect.width !== newRect.width || rootRect.height !== newRect.height) {
                    style(track, "height", cssTrackHeight());
                    styleSlides(resolve("marginRight"), unit(options.gap));
                    styleSlides("width", cssSlideWidth());
                    styleSlides("height", cssSlideHeight(), true);
                    rootRect = newRect;
                    emit(EVENT_RESIZED);
                    if (overflow !== (overflow = isOverflow())) {
                        toggleClass(root, CLASS_OVERFLOW, overflow);
                        emit(EVENT_OVERFLOW, overflow);
                    }
                }
            }
            function cssPadding(right) {
                var padding = options.padding;
                var prop = resolve(right ? "right" : "left");
                return padding && unit(padding[prop] || (isObject(padding) ? 0 : padding)) || "0px";
            }
            function cssTrackHeight() {
                var height = "";
                if (vertical) {
                    height = cssHeight();
                    assert(height, "height or heightRatio is missing.");
                    height = "calc(" + height + " - " + cssPadding(false) + " - " + cssPadding(true) + ")";
                }
                return height;
            }
            function cssHeight() {
                return unit(options.height || rect(list).width * options.heightRatio);
            }
            function cssSlideWidth() {
                return options.autoWidth ? null : unit(options.fixedWidth) || (vertical ? "" : cssSlideSize());
            }
            function cssSlideHeight() {
                return unit(options.fixedHeight) || (vertical ? options.autoHeight ? null : cssSlideSize() : cssHeight());
            }
            function cssSlideSize() {
                var gap = unit(options.gap);
                return "calc((100%" + (gap && " + " + gap) + ")/" + (options.perPage || 1) + (gap && " - " + gap) + ")";
            }
            function listSize() {
                return rect(list)[resolve("width")];
            }
            function slideSize(index, withoutGap) {
                var Slide = getAt(index || 0);
                return Slide ? rect(Slide.slide)[resolve("width")] + (withoutGap ? 0 : getGap()) : 0;
            }
            function totalSize(index, withoutGap) {
                var Slide = getAt(index);
                if (Slide) {
                    var right = rect(Slide.slide)[resolve("right")];
                    var left = rect(list)[resolve("left")];
                    return abs(right - left) + (withoutGap ? 0 : getGap());
                }
                return 0;
            }
            function sliderSize(withoutGap) {
                return totalSize(Splide2.length - 1) - totalSize(0) + slideSize(0, withoutGap);
            }
            function getGap() {
                var Slide = getAt(0);
                return Slide && parseFloat(style(Slide.slide, resolve("marginRight"))) || 0;
            }
            function getPadding(right) {
                return parseFloat(style(track, resolve("padding" + (right ? "Right" : "Left")))) || 0;
            }
            function isOverflow() {
                return Splide2.is(FADE) || sliderSize(true) > listSize();
            }
            return {
                mount,
                resize,
                listSize,
                slideSize,
                sliderSize,
                totalSize,
                getPadding,
                isOverflow
            };
        }
        var MULTIPLIER = 2;
        function Clones(Splide2, Components2, options) {
            var event = EventInterface(Splide2);
            var on = event.on;
            var Elements = Components2.Elements, Slides = Components2.Slides;
            var resolve = Components2.Direction.resolve;
            var clones = [];
            var cloneCount;
            function mount() {
                on(EVENT_REFRESH, remount);
                on([ EVENT_UPDATED, EVENT_RESIZE ], observe);
                if (cloneCount = computeCloneCount()) {
                    generate(cloneCount);
                    Components2.Layout.resize(true);
                }
            }
            function remount() {
                destroy();
                mount();
            }
            function destroy() {
                remove(clones);
                empty(clones);
                event.destroy();
            }
            function observe() {
                var count = computeCloneCount();
                if (cloneCount !== count) if (cloneCount < count || !count) event.emit(EVENT_REFRESH);
            }
            function generate(count) {
                var slides = Slides.get().slice();
                var length = slides.length;
                if (length) {
                    while (slides.length < count) push(slides, slides);
                    push(slides.slice(-count), slides.slice(0, count)).forEach((function(Slide, index) {
                        var isHead = index < count;
                        var clone = cloneDeep(Slide.slide, index);
                        isHead ? before(clone, slides[0].slide) : append(Elements.list, clone);
                        push(clones, clone);
                        Slides.register(clone, index - count + (isHead ? 0 : length), Slide.index);
                    }));
                }
            }
            function cloneDeep(elm, index) {
                var clone = elm.cloneNode(true);
                addClass(clone, options.classes.clone);
                clone.id = Splide2.root.id + "-clone" + pad(index + 1);
                return clone;
            }
            function computeCloneCount() {
                var clones2 = options.clones;
                if (!Splide2.is(LOOP)) clones2 = 0; else if (isUndefined(clones2)) {
                    var fixedSize = options[resolve("fixedWidth")] && Components2.Layout.slideSize(0);
                    var fixedCount = fixedSize && ceil(rect(Elements.track)[resolve("width")] / fixedSize);
                    clones2 = fixedCount || options[resolve("autoWidth")] && Splide2.length || options.perPage * MULTIPLIER;
                }
                return clones2;
            }
            return {
                mount,
                destroy
            };
        }
        function Move(Splide2, Components2, options) {
            var _EventInterface4 = EventInterface(Splide2), on = _EventInterface4.on, emit = _EventInterface4.emit;
            var set = Splide2.state.set;
            var _Components2$Layout = Components2.Layout, slideSize = _Components2$Layout.slideSize, getPadding = _Components2$Layout.getPadding, totalSize = _Components2$Layout.totalSize, listSize = _Components2$Layout.listSize, sliderSize = _Components2$Layout.sliderSize;
            var _Components2$Directio = Components2.Direction, resolve = _Components2$Directio.resolve, orient = _Components2$Directio.orient;
            var _Components2$Elements3 = Components2.Elements, list = _Components2$Elements3.list, track = _Components2$Elements3.track;
            var Transition;
            function mount() {
                Transition = Components2.Transition;
                on([ EVENT_MOUNTED, EVENT_RESIZED, EVENT_UPDATED, EVENT_REFRESH ], reposition);
            }
            function reposition() {
                if (!Components2.Controller.isBusy()) {
                    Components2.Scroll.cancel();
                    jump(Splide2.index);
                    Components2.Slides.update();
                }
            }
            function move(dest, index, prev, callback) {
                if (dest !== index && canShift(dest > prev)) {
                    cancel();
                    translate(shift(getPosition(), dest > prev), true);
                }
                set(MOVING);
                emit(EVENT_MOVE, index, prev, dest);
                Transition.start(index, (function() {
                    set(IDLE);
                    emit(EVENT_MOVED, index, prev, dest);
                    callback && callback();
                }));
            }
            function jump(index) {
                translate(toPosition(index, true));
            }
            function translate(position, preventLoop) {
                if (!Splide2.is(FADE)) {
                    var destination = preventLoop ? position : loop(position);
                    style(list, "transform", "translate" + resolve("X") + "(" + destination + "px)");
                    position !== destination && emit(EVENT_SHIFTED);
                }
            }
            function loop(position) {
                if (Splide2.is(LOOP)) {
                    var index = toIndex(position);
                    var exceededMax = index > Components2.Controller.getEnd();
                    var exceededMin = index < 0;
                    if (exceededMin || exceededMax) position = shift(position, exceededMax);
                }
                return position;
            }
            function shift(position, backwards) {
                var excess = position - getLimit(backwards);
                var size = sliderSize();
                position -= orient(size * (ceil(abs(excess) / size) || 1)) * (backwards ? 1 : -1);
                return position;
            }
            function cancel() {
                translate(getPosition(), true);
                Transition.cancel();
            }
            function toIndex(position) {
                var Slides = Components2.Slides.get();
                var index = 0;
                var minDistance = 1 / 0;
                for (var i = 0; i < Slides.length; i++) {
                    var slideIndex = Slides[i].index;
                    var distance = abs(toPosition(slideIndex, true) - position);
                    if (distance <= minDistance) {
                        minDistance = distance;
                        index = slideIndex;
                    } else break;
                }
                return index;
            }
            function toPosition(index, trimming) {
                var position = orient(totalSize(index - 1) - offset(index));
                return trimming ? trim(position) : position;
            }
            function getPosition() {
                var left = resolve("left");
                return rect(list)[left] - rect(track)[left] + orient(getPadding(false));
            }
            function trim(position) {
                if (options.trimSpace && Splide2.is(SLIDE)) position = clamp(position, 0, orient(sliderSize(true) - listSize()));
                return position;
            }
            function offset(index) {
                var focus = options.focus;
                return "center" === focus ? (listSize() - slideSize(index, true)) / 2 : +focus * slideSize(index) || 0;
            }
            function getLimit(max) {
                return toPosition(max ? Components2.Controller.getEnd() : 0, !!options.trimSpace);
            }
            function canShift(backwards) {
                var shifted = orient(shift(getPosition(), backwards));
                return backwards ? shifted >= 0 : shifted <= list[resolve("scrollWidth")] - rect(track)[resolve("width")];
            }
            function exceededLimit(max, position) {
                position = isUndefined(position) ? getPosition() : position;
                var exceededMin = true !== max && orient(position) < orient(getLimit(false));
                var exceededMax = false !== max && orient(position) > orient(getLimit(true));
                return exceededMin || exceededMax;
            }
            return {
                mount,
                move,
                jump,
                translate,
                shift,
                cancel,
                toIndex,
                toPosition,
                getPosition,
                getLimit,
                exceededLimit,
                reposition
            };
        }
        function Controller(Splide2, Components2, options) {
            var _EventInterface5 = EventInterface(Splide2), on = _EventInterface5.on, emit = _EventInterface5.emit;
            var Move = Components2.Move;
            var getPosition = Move.getPosition, getLimit = Move.getLimit, toPosition = Move.toPosition;
            var _Components2$Slides = Components2.Slides, isEnough = _Components2$Slides.isEnough, getLength = _Components2$Slides.getLength;
            var omitEnd = options.omitEnd;
            var isLoop = Splide2.is(LOOP);
            var isSlide = Splide2.is(SLIDE);
            var getNext = apply(getAdjacent, false);
            var getPrev = apply(getAdjacent, true);
            var currIndex = options.start || 0;
            var endIndex;
            var prevIndex = currIndex;
            var slideCount;
            var perMove;
            var perPage;
            function mount() {
                init();
                on([ EVENT_UPDATED, EVENT_REFRESH, EVENT_END_INDEX_CHANGED ], init);
                on(EVENT_RESIZED, onResized);
            }
            function init() {
                slideCount = getLength(true);
                perMove = options.perMove;
                perPage = options.perPage;
                endIndex = getEnd();
                var index = clamp(currIndex, 0, omitEnd ? endIndex : slideCount - 1);
                if (index !== currIndex) {
                    currIndex = index;
                    Move.reposition();
                }
            }
            function onResized() {
                if (endIndex !== getEnd()) emit(EVENT_END_INDEX_CHANGED);
            }
            function go(control, allowSameIndex, callback) {
                if (!isBusy()) {
                    var dest = parse(control);
                    var index = loop(dest);
                    if (index > -1 && (allowSameIndex || index !== currIndex)) {
                        setIndex(index);
                        Move.move(dest, index, prevIndex, callback);
                    }
                }
            }
            function scroll(destination, duration, snap, callback) {
                Components2.Scroll.scroll(destination, duration, snap, (function() {
                    var index = loop(Move.toIndex(getPosition()));
                    setIndex(omitEnd ? min(index, endIndex) : index);
                    callback && callback();
                }));
            }
            function parse(control) {
                var index = currIndex;
                if (isString(control)) {
                    var _ref = control.match(/([+\-<>])(\d+)?/) || [], indicator = _ref[1], number = _ref[2];
                    if ("+" === indicator || "-" === indicator) index = computeDestIndex(currIndex + +("" + indicator + (+number || 1)), currIndex); else if (">" === indicator) index = number ? toIndex(+number) : getNext(true); else if ("<" === indicator) index = getPrev(true);
                } else index = isLoop ? control : clamp(control, 0, endIndex);
                return index;
            }
            function getAdjacent(prev, destination) {
                var number = perMove || (hasFocus() ? 1 : perPage);
                var dest = computeDestIndex(currIndex + number * (prev ? -1 : 1), currIndex, !(perMove || hasFocus()));
                if (-1 === dest && isSlide) if (!approximatelyEqual(getPosition(), getLimit(!prev), 1)) return prev ? 0 : endIndex;
                return destination ? dest : loop(dest);
            }
            function computeDestIndex(dest, from, snapPage) {
                if (isEnough() || hasFocus()) {
                    var index = computeMovableDestIndex(dest);
                    if (index !== dest) {
                        from = dest;
                        dest = index;
                        snapPage = false;
                    }
                    if (dest < 0 || dest > endIndex) if (!perMove && (between(0, dest, from, true) || between(endIndex, from, dest, true))) dest = toIndex(toPage(dest)); else if (isLoop) dest = snapPage ? dest < 0 ? -(slideCount % perPage || perPage) : slideCount : dest; else if (options.rewind) dest = dest < 0 ? endIndex : 0; else dest = -1; else if (snapPage && dest !== from) dest = toIndex(toPage(from) + (dest < from ? -1 : 1));
                } else dest = -1;
                return dest;
            }
            function computeMovableDestIndex(dest) {
                if (isSlide && "move" === options.trimSpace && dest !== currIndex) {
                    var position = getPosition();
                    while (position === toPosition(dest, true) && between(dest, 0, Splide2.length - 1, !options.rewind)) dest < currIndex ? --dest : ++dest;
                }
                return dest;
            }
            function loop(index) {
                return isLoop ? (index + slideCount) % slideCount || 0 : index;
            }
            function getEnd() {
                var end = slideCount - (hasFocus() || isLoop && perMove ? 1 : perPage);
                while (omitEnd && end-- > 0) if (toPosition(slideCount - 1, true) !== toPosition(end, true)) {
                    end++;
                    break;
                }
                return clamp(end, 0, slideCount - 1);
            }
            function toIndex(page) {
                return clamp(hasFocus() ? page : perPage * page, 0, endIndex);
            }
            function toPage(index) {
                return hasFocus() ? min(index, endIndex) : floor((index >= endIndex ? slideCount - 1 : index) / perPage);
            }
            function toDest(destination) {
                var closest = Move.toIndex(destination);
                return isSlide ? clamp(closest, 0, endIndex) : closest;
            }
            function setIndex(index) {
                if (index !== currIndex) {
                    prevIndex = currIndex;
                    currIndex = index;
                }
            }
            function getIndex(prev) {
                return prev ? prevIndex : currIndex;
            }
            function hasFocus() {
                return !isUndefined(options.focus) || options.isNavigation;
            }
            function isBusy() {
                return Splide2.state.is([ MOVING, SCROLLING ]) && !!options.waitForTransition;
            }
            return {
                mount,
                go,
                scroll,
                getNext,
                getPrev,
                getAdjacent,
                getEnd,
                setIndex,
                getIndex,
                toIndex,
                toPage,
                toDest,
                hasFocus,
                isBusy
            };
        }
        var XML_NAME_SPACE = "http://www.w3.org/2000/svg";
        var PATH = "m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z";
        var SIZE = 40;
        function Arrows(Splide2, Components2, options) {
            var event = EventInterface(Splide2);
            var on = event.on, bind = event.bind, emit = event.emit;
            var classes = options.classes, i18n = options.i18n;
            var Elements = Components2.Elements, Controller = Components2.Controller;
            var placeholder = Elements.arrows, track = Elements.track;
            var wrapper = placeholder;
            var prev = Elements.prev;
            var next = Elements.next;
            var created;
            var wrapperClasses;
            var arrows = {};
            function mount() {
                init();
                on(EVENT_UPDATED, remount);
            }
            function remount() {
                destroy();
                mount();
            }
            function init() {
                var enabled = options.arrows;
                if (enabled && !(prev && next)) createArrows();
                if (prev && next) {
                    splide_esm_assign(arrows, {
                        prev,
                        next
                    });
                    display(wrapper, enabled ? "" : "none");
                    addClass(wrapper, wrapperClasses = CLASS_ARROWS + "--" + options.direction);
                    if (enabled) {
                        listen();
                        update();
                        setAttribute([ prev, next ], ARIA_CONTROLS, track.id);
                        emit(EVENT_ARROWS_MOUNTED, prev, next);
                    }
                }
            }
            function destroy() {
                event.destroy();
                removeClass(wrapper, wrapperClasses);
                if (created) {
                    remove(placeholder ? [ prev, next ] : wrapper);
                    prev = next = null;
                } else removeAttribute([ prev, next ], ALL_ATTRIBUTES);
            }
            function listen() {
                on([ EVENT_MOUNTED, EVENT_MOVED, EVENT_REFRESH, EVENT_SCROLLED, EVENT_END_INDEX_CHANGED ], update);
                bind(next, "click", apply(go, ">"));
                bind(prev, "click", apply(go, "<"));
            }
            function go(control) {
                Controller.go(control, true);
            }
            function createArrows() {
                wrapper = placeholder || create("div", classes.arrows);
                prev = createArrow(true);
                next = createArrow(false);
                created = true;
                append(wrapper, [ prev, next ]);
                !placeholder && before(wrapper, track);
            }
            function createArrow(prev2) {
                var arrow = '<button class="' + classes.arrow + " " + (prev2 ? classes.prev : classes.next) + '" type="button"><svg xmlns="' + XML_NAME_SPACE + '" viewBox="0 0 ' + SIZE + " " + SIZE + '" width="' + SIZE + '" height="' + SIZE + '" focusable="false"><path d="' + (options.arrowPath || PATH) + '" />';
                return parseHtml(arrow);
            }
            function update() {
                if (prev && next) {
                    var index = Splide2.index;
                    var prevIndex = Controller.getPrev();
                    var nextIndex = Controller.getNext();
                    var prevLabel = prevIndex > -1 && index < prevIndex ? i18n.last : i18n.prev;
                    var nextLabel = nextIndex > -1 && index > nextIndex ? i18n.first : i18n.next;
                    prev.disabled = prevIndex < 0;
                    next.disabled = nextIndex < 0;
                    setAttribute(prev, ARIA_LABEL, prevLabel);
                    setAttribute(next, ARIA_LABEL, nextLabel);
                    emit(EVENT_ARROWS_UPDATED, prev, next, prevIndex, nextIndex);
                }
            }
            return {
                arrows,
                mount,
                destroy,
                update
            };
        }
        var INTERVAL_DATA_ATTRIBUTE = DATA_ATTRIBUTE + "-interval";
        function Autoplay(Splide2, Components2, options) {
            var _EventInterface6 = EventInterface(Splide2), on = _EventInterface6.on, bind = _EventInterface6.bind, emit = _EventInterface6.emit;
            var interval = RequestInterval(options.interval, Splide2.go.bind(Splide2, ">"), onAnimationFrame);
            var isPaused = interval.isPaused;
            var Elements = Components2.Elements, _Components2$Elements4 = Components2.Elements, root = _Components2$Elements4.root, toggle = _Components2$Elements4.toggle;
            var autoplay = options.autoplay;
            var hovered;
            var focused;
            var stopped = "pause" === autoplay;
            function mount() {
                if (autoplay) {
                    listen();
                    toggle && setAttribute(toggle, ARIA_CONTROLS, Elements.track.id);
                    stopped || play();
                    update();
                }
            }
            function listen() {
                if (options.pauseOnHover) bind(root, "mouseenter mouseleave", (function(e) {
                    hovered = "mouseenter" === e.type;
                    autoToggle();
                }));
                if (options.pauseOnFocus) bind(root, "focusin focusout", (function(e) {
                    focused = "focusin" === e.type;
                    autoToggle();
                }));
                if (toggle) bind(toggle, "click", (function() {
                    stopped ? play() : pause(true);
                }));
                on([ EVENT_MOVE, EVENT_SCROLL, EVENT_REFRESH ], interval.rewind);
                on(EVENT_MOVE, onMove);
            }
            function play() {
                if (isPaused() && Components2.Slides.isEnough()) {
                    interval.start(!options.resetProgress);
                    focused = hovered = stopped = false;
                    update();
                    emit(EVENT_AUTOPLAY_PLAY);
                }
            }
            function pause(stop) {
                if (void 0 === stop) stop = true;
                stopped = !!stop;
                update();
                if (!isPaused()) {
                    interval.pause();
                    emit(EVENT_AUTOPLAY_PAUSE);
                }
            }
            function autoToggle() {
                if (!stopped) hovered || focused ? pause(false) : play();
            }
            function update() {
                if (toggle) {
                    toggleClass(toggle, CLASS_ACTIVE, !stopped);
                    setAttribute(toggle, ARIA_LABEL, options.i18n[stopped ? "play" : "pause"]);
                }
            }
            function onAnimationFrame(rate) {
                var bar = Elements.bar;
                bar && style(bar, "width", 100 * rate + "%");
                emit(EVENT_AUTOPLAY_PLAYING, rate);
            }
            function onMove(index) {
                var Slide = Components2.Slides.getAt(index);
                interval.set(Slide && +getAttribute(Slide.slide, INTERVAL_DATA_ATTRIBUTE) || options.interval);
            }
            return {
                mount,
                destroy: interval.cancel,
                play,
                pause,
                isPaused
            };
        }
        function Cover(Splide2, Components2, options) {
            var _EventInterface7 = EventInterface(Splide2), on = _EventInterface7.on;
            function mount() {
                if (options.cover) {
                    on(EVENT_LAZYLOAD_LOADED, apply(toggle, true));
                    on([ EVENT_MOUNTED, EVENT_UPDATED, EVENT_REFRESH ], apply(cover, true));
                }
            }
            function cover(cover2) {
                Components2.Slides.forEach((function(Slide) {
                    var img = child(Slide.container || Slide.slide, "img");
                    if (img && img.src) toggle(cover2, img, Slide);
                }));
            }
            function toggle(cover2, img, Slide) {
                Slide.style("background", cover2 ? 'center/cover no-repeat url("' + img.src + '")' : "", true);
                display(img, cover2 ? "none" : "");
            }
            return {
                mount,
                destroy: apply(cover, false)
            };
        }
        var BOUNCE_DIFF_THRESHOLD = 10;
        var BOUNCE_DURATION = 600;
        var FRICTION_FACTOR = .6;
        var BASE_VELOCITY = 1.5;
        var MIN_DURATION = 800;
        function Scroll(Splide2, Components2, options) {
            var _EventInterface8 = EventInterface(Splide2), on = _EventInterface8.on, emit = _EventInterface8.emit;
            var set = Splide2.state.set;
            var Move = Components2.Move;
            var getPosition = Move.getPosition, getLimit = Move.getLimit, exceededLimit = Move.exceededLimit, translate = Move.translate;
            var isSlide = Splide2.is(SLIDE);
            var interval;
            var callback;
            var friction = 1;
            function mount() {
                on(EVENT_MOVE, clear);
                on([ EVENT_UPDATED, EVENT_REFRESH ], cancel);
            }
            function scroll(destination, duration, snap, onScrolled, noConstrain) {
                var from = getPosition();
                clear();
                if (snap && (!isSlide || !exceededLimit())) {
                    var size = Components2.Layout.sliderSize();
                    var offset = sign(destination) * size * floor(abs(destination) / size) || 0;
                    destination = Move.toPosition(Components2.Controller.toDest(destination % size)) + offset;
                }
                var noDistance = approximatelyEqual(from, destination, 1);
                friction = 1;
                duration = noDistance ? 0 : duration || max(abs(destination - from) / BASE_VELOCITY, MIN_DURATION);
                callback = onScrolled;
                interval = RequestInterval(duration, onEnd, apply(update, from, destination, noConstrain), 1);
                set(SCROLLING);
                emit(EVENT_SCROLL);
                interval.start();
            }
            function onEnd() {
                set(IDLE);
                callback && callback();
                emit(EVENT_SCROLLED);
            }
            function update(from, to, noConstrain, rate) {
                var position = getPosition();
                var target = from + (to - from) * easing(rate);
                var diff = (target - position) * friction;
                translate(position + diff);
                if (isSlide && !noConstrain && exceededLimit()) {
                    friction *= FRICTION_FACTOR;
                    if (abs(diff) < BOUNCE_DIFF_THRESHOLD) scroll(getLimit(exceededLimit(true)), BOUNCE_DURATION, false, callback, true);
                }
            }
            function clear() {
                if (interval) interval.cancel();
            }
            function cancel() {
                if (interval && !interval.isPaused()) {
                    clear();
                    onEnd();
                }
            }
            function easing(t) {
                var easingFunc = options.easingFunc;
                return easingFunc ? easingFunc(t) : 1 - Math.pow(1 - t, 4);
            }
            return {
                mount,
                destroy: clear,
                scroll,
                cancel
            };
        }
        var SCROLL_LISTENER_OPTIONS = {
            passive: false,
            capture: true
        };
        function Drag(Splide2, Components2, options) {
            var _EventInterface9 = EventInterface(Splide2), on = _EventInterface9.on, emit = _EventInterface9.emit, bind = _EventInterface9.bind, unbind = _EventInterface9.unbind;
            var state = Splide2.state;
            var Move = Components2.Move, Scroll = Components2.Scroll, Controller = Components2.Controller, track = Components2.Elements.track, reduce = Components2.Media.reduce;
            var _Components2$Directio2 = Components2.Direction, resolve = _Components2$Directio2.resolve, orient = _Components2$Directio2.orient;
            var getPosition = Move.getPosition, exceededLimit = Move.exceededLimit;
            var basePosition;
            var baseEvent;
            var prevBaseEvent;
            var isFree;
            var dragging;
            var exceeded = false;
            var clickPrevented;
            var disabled;
            var target;
            function mount() {
                bind(track, POINTER_MOVE_EVENTS, noop, SCROLL_LISTENER_OPTIONS);
                bind(track, POINTER_UP_EVENTS, noop, SCROLL_LISTENER_OPTIONS);
                bind(track, POINTER_DOWN_EVENTS, onPointerDown, SCROLL_LISTENER_OPTIONS);
                bind(track, "click", onClick, {
                    capture: true
                });
                bind(track, "dragstart", prevent);
                on([ EVENT_MOUNTED, EVENT_UPDATED ], init);
            }
            function init() {
                var drag = options.drag;
                disable(!drag);
                isFree = "free" === drag;
            }
            function onPointerDown(e) {
                clickPrevented = false;
                if (!disabled) {
                    var isTouch = isTouchEvent(e);
                    if (isDraggable(e.target) && (isTouch || !e.button)) if (!Controller.isBusy()) {
                        target = isTouch ? track : window;
                        dragging = state.is([ MOVING, SCROLLING ]);
                        prevBaseEvent = null;
                        bind(target, POINTER_MOVE_EVENTS, onPointerMove, SCROLL_LISTENER_OPTIONS);
                        bind(target, POINTER_UP_EVENTS, onPointerUp, SCROLL_LISTENER_OPTIONS);
                        Move.cancel();
                        Scroll.cancel();
                        save(e);
                    } else prevent(e, true);
                }
            }
            function onPointerMove(e) {
                if (!state.is(DRAGGING)) {
                    state.set(DRAGGING);
                    emit(EVENT_DRAG);
                }
                if (e.cancelable) if (dragging) {
                    Move.translate(basePosition + constrain(diffCoord(e)));
                    var expired = diffTime(e) > LOG_INTERVAL;
                    var hasExceeded = exceeded !== (exceeded = exceededLimit());
                    if (expired || hasExceeded) save(e);
                    clickPrevented = true;
                    emit(EVENT_DRAGGING);
                    prevent(e);
                } else if (isSliderDirection(e)) {
                    dragging = shouldStart(e);
                    prevent(e);
                }
            }
            function onPointerUp(e) {
                if (state.is(DRAGGING)) {
                    state.set(IDLE);
                    emit(EVENT_DRAGGED);
                }
                if (dragging) {
                    move(e);
                    prevent(e);
                }
                unbind(target, POINTER_MOVE_EVENTS, onPointerMove);
                unbind(target, POINTER_UP_EVENTS, onPointerUp);
                dragging = false;
            }
            function onClick(e) {
                if (!disabled && clickPrevented) prevent(e, true);
            }
            function save(e) {
                prevBaseEvent = baseEvent;
                baseEvent = e;
                basePosition = getPosition();
            }
            function move(e) {
                var velocity = computeVelocity(e);
                var destination = computeDestination(velocity);
                var rewind = options.rewind && options.rewindByDrag;
                reduce(false);
                if (isFree) Controller.scroll(destination, 0, options.snap); else if (Splide2.is(FADE)) Controller.go(orient(sign(velocity)) < 0 ? rewind ? "<" : "-" : rewind ? ">" : "+"); else if (Splide2.is(SLIDE) && exceeded && rewind) Controller.go(exceededLimit(true) ? ">" : "<"); else Controller.go(Controller.toDest(destination), true);
                reduce(true);
            }
            function shouldStart(e) {
                var thresholds = options.dragMinThreshold;
                var isObj = isObject(thresholds);
                var mouse = isObj && thresholds.mouse || 0;
                var touch = (isObj ? thresholds.touch : +thresholds) || 10;
                return abs(diffCoord(e)) > (isTouchEvent(e) ? touch : mouse);
            }
            function isSliderDirection(e) {
                return abs(diffCoord(e)) > abs(diffCoord(e, true));
            }
            function computeVelocity(e) {
                if (Splide2.is(LOOP) || !exceeded) {
                    var time = diffTime(e);
                    if (time && time < LOG_INTERVAL) return diffCoord(e) / time;
                }
                return 0;
            }
            function computeDestination(velocity) {
                return getPosition() + sign(velocity) * min(abs(velocity) * (options.flickPower || 600), isFree ? 1 / 0 : Components2.Layout.listSize() * (options.flickMaxPages || 1));
            }
            function diffCoord(e, orthogonal) {
                return coordOf(e, orthogonal) - coordOf(getBaseEvent(e), orthogonal);
            }
            function diffTime(e) {
                return timeOf(e) - timeOf(getBaseEvent(e));
            }
            function getBaseEvent(e) {
                return baseEvent === e && prevBaseEvent || baseEvent;
            }
            function coordOf(e, orthogonal) {
                return (isTouchEvent(e) ? e.changedTouches[0] : e)["page" + resolve(orthogonal ? "Y" : "X")];
            }
            function constrain(diff) {
                return diff / (exceeded && Splide2.is(SLIDE) ? FRICTION : 1);
            }
            function isDraggable(target2) {
                var noDrag = options.noDrag;
                return !matches(target2, "." + CLASS_PAGINATION_PAGE + ", ." + CLASS_ARROW) && (!noDrag || !matches(target2, noDrag));
            }
            function isTouchEvent(e) {
                return "undefined" !== typeof TouchEvent && e instanceof TouchEvent;
            }
            function isDragging() {
                return dragging;
            }
            function disable(value) {
                disabled = value;
            }
            return {
                mount,
                disable,
                isDragging
            };
        }
        var NORMALIZATION_MAP = {
            Spacebar: " ",
            Right: ARROW_RIGHT,
            Left: ARROW_LEFT,
            Up: ARROW_UP,
            Down: ARROW_DOWN
        };
        function normalizeKey(key) {
            key = isString(key) ? key : key.key;
            return NORMALIZATION_MAP[key] || key;
        }
        var KEYBOARD_EVENT = "keydown";
        function Keyboard(Splide2, Components2, options) {
            var _EventInterface10 = EventInterface(Splide2), on = _EventInterface10.on, bind = _EventInterface10.bind, unbind = _EventInterface10.unbind;
            var root = Splide2.root;
            var resolve = Components2.Direction.resolve;
            var target;
            var disabled;
            function mount() {
                init();
                on(EVENT_UPDATED, destroy);
                on(EVENT_UPDATED, init);
                on(EVENT_MOVE, onMove);
            }
            function init() {
                var keyboard = options.keyboard;
                if (keyboard) {
                    target = "global" === keyboard ? window : root;
                    bind(target, KEYBOARD_EVENT, onKeydown);
                }
            }
            function destroy() {
                unbind(target, KEYBOARD_EVENT);
            }
            function disable(value) {
                disabled = value;
            }
            function onMove() {
                var _disabled = disabled;
                disabled = true;
                nextTick((function() {
                    disabled = _disabled;
                }));
            }
            function onKeydown(e) {
                if (!disabled) {
                    var key = normalizeKey(e);
                    if (key === resolve(ARROW_LEFT)) Splide2.go("<"); else if (key === resolve(ARROW_RIGHT)) Splide2.go(">");
                }
            }
            return {
                mount,
                destroy,
                disable
            };
        }
        var SRC_DATA_ATTRIBUTE = DATA_ATTRIBUTE + "-lazy";
        var SRCSET_DATA_ATTRIBUTE = SRC_DATA_ATTRIBUTE + "-srcset";
        var IMAGE_SELECTOR = "[" + SRC_DATA_ATTRIBUTE + "], [" + SRCSET_DATA_ATTRIBUTE + "]";
        function LazyLoad(Splide2, Components2, options) {
            var _EventInterface11 = EventInterface(Splide2), on = _EventInterface11.on, off = _EventInterface11.off, bind = _EventInterface11.bind, emit = _EventInterface11.emit;
            var isSequential = "sequential" === options.lazyLoad;
            var events = [ EVENT_MOVED, EVENT_SCROLLED ];
            var entries = [];
            function mount() {
                if (options.lazyLoad) {
                    init();
                    on(EVENT_REFRESH, init);
                }
            }
            function init() {
                empty(entries);
                register();
                if (isSequential) loadNext(); else {
                    off(events);
                    on(events, check);
                    check();
                }
            }
            function register() {
                Components2.Slides.forEach((function(Slide) {
                    queryAll(Slide.slide, IMAGE_SELECTOR).forEach((function(img) {
                        var src = getAttribute(img, SRC_DATA_ATTRIBUTE);
                        var srcset = getAttribute(img, SRCSET_DATA_ATTRIBUTE);
                        if (src !== img.src || srcset !== img.srcset) {
                            var className = options.classes.spinner;
                            var parent = img.parentElement;
                            var spinner = child(parent, "." + className) || create("span", className, parent);
                            entries.push([ img, Slide, spinner ]);
                            img.src || display(img, "none");
                        }
                    }));
                }));
            }
            function check() {
                entries = entries.filter((function(data) {
                    var distance = options.perPage * ((options.preloadPages || 1) + 1) - 1;
                    return data[1].isWithin(Splide2.index, distance) ? load(data) : true;
                }));
                entries.length || off(events);
            }
            function load(data) {
                var img = data[0];
                addClass(data[1].slide, CLASS_LOADING);
                bind(img, "load error", apply(onLoad, data));
                setAttribute(img, "src", getAttribute(img, SRC_DATA_ATTRIBUTE));
                setAttribute(img, "srcset", getAttribute(img, SRCSET_DATA_ATTRIBUTE));
                removeAttribute(img, SRC_DATA_ATTRIBUTE);
                removeAttribute(img, SRCSET_DATA_ATTRIBUTE);
            }
            function onLoad(data, e) {
                var img = data[0], Slide = data[1];
                removeClass(Slide.slide, CLASS_LOADING);
                if ("error" !== e.type) {
                    remove(data[2]);
                    display(img, "");
                    emit(EVENT_LAZYLOAD_LOADED, img, Slide);
                    emit(EVENT_RESIZE);
                }
                isSequential && loadNext();
            }
            function loadNext() {
                entries.length && load(entries.shift());
            }
            return {
                mount,
                destroy: apply(empty, entries),
                check
            };
        }
        function Pagination(Splide2, Components2, options) {
            var event = EventInterface(Splide2);
            var on = event.on, emit = event.emit, bind = event.bind;
            var Slides = Components2.Slides, Elements = Components2.Elements, Controller = Components2.Controller;
            var hasFocus = Controller.hasFocus, getIndex = Controller.getIndex, go = Controller.go;
            var resolve = Components2.Direction.resolve;
            var placeholder = Elements.pagination;
            var items = [];
            var list;
            var paginationClasses;
            function mount() {
                destroy();
                on([ EVENT_UPDATED, EVENT_REFRESH, EVENT_END_INDEX_CHANGED ], mount);
                var enabled = options.pagination;
                placeholder && display(placeholder, enabled ? "" : "none");
                if (enabled) {
                    on([ EVENT_MOVE, EVENT_SCROLL, EVENT_SCROLLED ], update);
                    createPagination();
                    update();
                    emit(EVENT_PAGINATION_MOUNTED, {
                        list,
                        items
                    }, getAt(Splide2.index));
                }
            }
            function destroy() {
                if (list) {
                    remove(placeholder ? slice(list.children) : list);
                    removeClass(list, paginationClasses);
                    empty(items);
                    list = null;
                }
                event.destroy();
            }
            function createPagination() {
                var length = Splide2.length;
                var classes = options.classes, i18n = options.i18n, perPage = options.perPage;
                var max = hasFocus() ? Controller.getEnd() + 1 : ceil(length / perPage);
                list = placeholder || create("ul", classes.pagination, Elements.track.parentElement);
                addClass(list, paginationClasses = CLASS_PAGINATION + "--" + getDirection());
                setAttribute(list, ROLE, "tablist");
                setAttribute(list, ARIA_LABEL, i18n.select);
                setAttribute(list, ARIA_ORIENTATION, getDirection() === TTB ? "vertical" : "");
                for (var i = 0; i < max; i++) {
                    var li = create("li", null, list);
                    var button = create("button", {
                        class: classes.page,
                        type: "button"
                    }, li);
                    var controls = Slides.getIn(i).map((function(Slide) {
                        return Slide.slide.id;
                    }));
                    var text = !hasFocus() && perPage > 1 ? i18n.pageX : i18n.slideX;
                    bind(button, "click", apply(onClick, i));
                    if (options.paginationKeyboard) bind(button, "keydown", apply(onKeydown, i));
                    setAttribute(li, ROLE, "presentation");
                    setAttribute(button, ROLE, "tab");
                    setAttribute(button, ARIA_CONTROLS, controls.join(" "));
                    setAttribute(button, ARIA_LABEL, format(text, i + 1));
                    setAttribute(button, TAB_INDEX, -1);
                    items.push({
                        li,
                        button,
                        page: i
                    });
                }
            }
            function onClick(page) {
                go(">" + page, true);
            }
            function onKeydown(page, e) {
                var length = items.length;
                var key = normalizeKey(e);
                var dir = getDirection();
                var nextPage = -1;
                if (key === resolve(ARROW_RIGHT, false, dir)) nextPage = ++page % length; else if (key === resolve(ARROW_LEFT, false, dir)) nextPage = (--page + length) % length; else if ("Home" === key) nextPage = 0; else if ("End" === key) nextPage = length - 1;
                var item = items[nextPage];
                if (item) {
                    splide_esm_focus(item.button);
                    go(">" + nextPage);
                    prevent(e, true);
                }
            }
            function getDirection() {
                return options.paginationDirection || options.direction;
            }
            function getAt(index) {
                return items[Controller.toPage(index)];
            }
            function update() {
                var prev = getAt(getIndex(true));
                var curr = getAt(getIndex());
                if (prev) {
                    var button = prev.button;
                    removeClass(button, CLASS_ACTIVE);
                    removeAttribute(button, ARIA_SELECTED);
                    setAttribute(button, TAB_INDEX, -1);
                }
                if (curr) {
                    var _button = curr.button;
                    addClass(_button, CLASS_ACTIVE);
                    setAttribute(_button, ARIA_SELECTED, true);
                    setAttribute(_button, TAB_INDEX, "");
                }
                emit(EVENT_PAGINATION_UPDATED, {
                    list,
                    items
                }, prev, curr);
            }
            return {
                items,
                mount,
                destroy,
                getAt,
                update
            };
        }
        var TRIGGER_KEYS = [ " ", "Enter" ];
        function Sync(Splide2, Components2, options) {
            var isNavigation = options.isNavigation, slideFocus = options.slideFocus;
            var events = [];
            function mount() {
                Splide2.splides.forEach((function(target) {
                    if (!target.isParent) {
                        sync(Splide2, target.splide);
                        sync(target.splide, Splide2);
                    }
                }));
                if (isNavigation) navigate();
            }
            function destroy() {
                events.forEach((function(event) {
                    event.destroy();
                }));
                empty(events);
            }
            function remount() {
                destroy();
                mount();
            }
            function sync(splide, target) {
                var event = EventInterface(splide);
                event.on(EVENT_MOVE, (function(index, prev, dest) {
                    target.go(target.is(LOOP) ? dest : index);
                }));
                events.push(event);
            }
            function navigate() {
                var event = EventInterface(Splide2);
                var on = event.on;
                on(EVENT_CLICK, onClick);
                on(EVENT_SLIDE_KEYDOWN, onKeydown);
                on([ EVENT_MOUNTED, EVENT_UPDATED ], update);
                events.push(event);
                event.emit(EVENT_NAVIGATION_MOUNTED, Splide2.splides);
            }
            function update() {
                setAttribute(Components2.Elements.list, ARIA_ORIENTATION, options.direction === TTB ? "vertical" : "");
            }
            function onClick(Slide) {
                Splide2.go(Slide.index);
            }
            function onKeydown(Slide, e) {
                if (includes(TRIGGER_KEYS, normalizeKey(e))) {
                    onClick(Slide);
                    prevent(e);
                }
            }
            return {
                setup: apply(Components2.Media.set, {
                    slideFocus: isUndefined(slideFocus) ? isNavigation : slideFocus
                }, true),
                mount,
                destroy,
                remount
            };
        }
        function Wheel(Splide2, Components2, options) {
            var _EventInterface12 = EventInterface(Splide2), bind = _EventInterface12.bind;
            var lastTime = 0;
            function mount() {
                if (options.wheel) bind(Components2.Elements.track, "wheel", onWheel, SCROLL_LISTENER_OPTIONS);
            }
            function onWheel(e) {
                if (e.cancelable) {
                    var deltaY = e.deltaY;
                    var backwards = deltaY < 0;
                    var timeStamp = timeOf(e);
                    var _min = options.wheelMinThreshold || 0;
                    var sleep = options.wheelSleep || 0;
                    if (abs(deltaY) > _min && timeStamp - lastTime > sleep) {
                        Splide2.go(backwards ? "<" : ">");
                        lastTime = timeStamp;
                    }
                    shouldPrevent(backwards) && prevent(e);
                }
            }
            function shouldPrevent(backwards) {
                return !options.releaseWheel || Splide2.state.is(MOVING) || -1 !== Components2.Controller.getAdjacent(backwards);
            }
            return {
                mount
            };
        }
        var SR_REMOVAL_DELAY = 90;
        function Live(Splide2, Components2, options) {
            var _EventInterface13 = EventInterface(Splide2), on = _EventInterface13.on;
            var track = Components2.Elements.track;
            var enabled = options.live && !options.isNavigation;
            var sr = create("span", CLASS_SR);
            var interval = RequestInterval(SR_REMOVAL_DELAY, apply(toggle, false));
            function mount() {
                if (enabled) {
                    disable(!Components2.Autoplay.isPaused());
                    setAttribute(track, ARIA_ATOMIC, true);
                    sr.textContent = "…";
                    on(EVENT_AUTOPLAY_PLAY, apply(disable, true));
                    on(EVENT_AUTOPLAY_PAUSE, apply(disable, false));
                    on([ EVENT_MOVED, EVENT_SCROLLED ], apply(toggle, true));
                }
            }
            function toggle(active) {
                setAttribute(track, ARIA_BUSY, active);
                if (active) {
                    append(track, sr);
                    interval.start();
                } else {
                    remove(sr);
                    interval.cancel();
                }
            }
            function destroy() {
                removeAttribute(track, [ ARIA_LIVE, ARIA_ATOMIC, ARIA_BUSY ]);
                remove(sr);
            }
            function disable(disabled) {
                if (enabled) setAttribute(track, ARIA_LIVE, disabled ? "off" : "polite");
            }
            return {
                mount,
                disable,
                destroy
            };
        }
        var ComponentConstructors = Object.freeze({
            __proto__: null,
            Media,
            Direction,
            Elements,
            Slides,
            Layout,
            Clones,
            Move,
            Controller,
            Arrows,
            Autoplay,
            Cover,
            Scroll,
            Drag,
            Keyboard,
            LazyLoad,
            Pagination,
            Sync,
            Wheel,
            Live
        });
        var I18N = {
            prev: "Previous slide",
            next: "Next slide",
            first: "Go to first slide",
            last: "Go to last slide",
            slideX: "Go to slide %s",
            pageX: "Go to page %s",
            play: "Start autoplay",
            pause: "Pause autoplay",
            carousel: "carousel",
            slide: "slide",
            select: "Select a slide to show",
            slideLabel: "%s of %s"
        };
        var DEFAULTS = {
            type: "slide",
            role: "region",
            speed: 400,
            perPage: 1,
            cloneStatus: true,
            arrows: true,
            pagination: true,
            paginationKeyboard: true,
            interval: 5e3,
            pauseOnHover: true,
            pauseOnFocus: true,
            resetProgress: true,
            easing: "cubic-bezier(0.25, 1, 0.5, 1)",
            drag: true,
            direction: "ltr",
            trimSpace: true,
            focusableNodes: "a, button, textarea, input, select, iframe",
            live: true,
            classes: CLASSES,
            i18n: I18N,
            reducedMotion: {
                speed: 0,
                rewindSpeed: 0,
                autoplay: "pause"
            }
        };
        function Fade(Splide2, Components2, options) {
            var Slides = Components2.Slides;
            function mount() {
                EventInterface(Splide2).on([ EVENT_MOUNTED, EVENT_REFRESH ], init);
            }
            function init() {
                Slides.forEach((function(Slide) {
                    Slide.style("transform", "translateX(-" + 100 * Slide.index + "%)");
                }));
            }
            function start(index, done) {
                Slides.style("transition", "opacity " + options.speed + "ms " + options.easing);
                nextTick(done);
            }
            return {
                mount,
                start,
                cancel: noop
            };
        }
        function Slide(Splide2, Components2, options) {
            var Move = Components2.Move, Controller = Components2.Controller, Scroll = Components2.Scroll;
            var list = Components2.Elements.list;
            var transition = apply(style, list, "transition");
            var endCallback;
            function mount() {
                EventInterface(Splide2).bind(list, "transitionend", (function(e) {
                    if (e.target === list && endCallback) {
                        cancel();
                        endCallback();
                    }
                }));
            }
            function start(index, done) {
                var destination = Move.toPosition(index, true);
                var position = Move.getPosition();
                var speed = getSpeed(index);
                if (abs(destination - position) >= 1 && speed >= 1) if (options.useScroll) Scroll.scroll(destination, speed, false, done); else {
                    transition("transform " + speed + "ms " + options.easing);
                    Move.translate(destination, true);
                    endCallback = done;
                } else {
                    Move.jump(index);
                    done();
                }
            }
            function cancel() {
                transition("");
                Scroll.cancel();
            }
            function getSpeed(index) {
                var rewindSpeed = options.rewindSpeed;
                if (Splide2.is(SLIDE) && rewindSpeed) {
                    var prev = Controller.getIndex(true);
                    var end = Controller.getEnd();
                    if (0 === prev && index >= end || prev >= end && 0 === index) return rewindSpeed;
                }
                return options.speed;
            }
            return {
                mount,
                start,
                cancel
            };
        }
        var _Splide = function() {
            function _Splide(target, options) {
                this.event = EventInterface();
                this.Components = {};
                this.state = State(CREATED);
                this.splides = [];
                this._o = {};
                this._E = {};
                var root = isString(target) ? query(document, target) : target;
                assert(root, root + " is invalid.");
                this.root = root;
                options = merge({
                    label: getAttribute(root, ARIA_LABEL) || "",
                    labelledby: getAttribute(root, ARIA_LABELLEDBY) || ""
                }, DEFAULTS, _Splide.defaults, options || {});
                try {
                    merge(options, JSON.parse(getAttribute(root, DATA_ATTRIBUTE)));
                } catch (e) {
                    assert(false, "Invalid JSON");
                }
                this._o = Object.create(merge({}, options));
            }
            var _proto = _Splide.prototype;
            _proto.mount = function mount(Extensions, Transition) {
                var _this = this;
                var state = this.state, Components2 = this.Components;
                assert(state.is([ CREATED, DESTROYED ]), "Already mounted!");
                state.set(CREATED);
                this._C = Components2;
                this._T = Transition || this._T || (this.is(FADE) ? Fade : Slide);
                this._E = Extensions || this._E;
                var Constructors = splide_esm_assign({}, ComponentConstructors, this._E, {
                    Transition: this._T
                });
                forOwn(Constructors, (function(Component, key) {
                    var component = Component(_this, Components2, _this._o);
                    Components2[key] = component;
                    component.setup && component.setup();
                }));
                forOwn(Components2, (function(component) {
                    component.mount && component.mount();
                }));
                this.emit(EVENT_MOUNTED);
                addClass(this.root, CLASS_INITIALIZED);
                state.set(IDLE);
                this.emit(EVENT_READY);
                return this;
            };
            _proto.sync = function sync(splide) {
                this.splides.push({
                    splide
                });
                splide.splides.push({
                    splide: this,
                    isParent: true
                });
                if (this.state.is(IDLE)) {
                    this._C.Sync.remount();
                    splide.Components.Sync.remount();
                }
                return this;
            };
            _proto.go = function go(control) {
                this._C.Controller.go(control);
                return this;
            };
            _proto.on = function on(events, callback) {
                this.event.on(events, callback);
                return this;
            };
            _proto.off = function off(events) {
                this.event.off(events);
                return this;
            };
            _proto.emit = function emit(event) {
                var _this$event;
                (_this$event = this.event).emit.apply(_this$event, [ event ].concat(slice(arguments, 1)));
                return this;
            };
            _proto.add = function add(slides, index) {
                this._C.Slides.add(slides, index);
                return this;
            };
            _proto.remove = function remove(matcher) {
                this._C.Slides.remove(matcher);
                return this;
            };
            _proto.is = function is(type) {
                return this._o.type === type;
            };
            _proto.refresh = function refresh() {
                this.emit(EVENT_REFRESH);
                return this;
            };
            _proto.destroy = function destroy(completely) {
                if (void 0 === completely) completely = true;
                var event = this.event, state = this.state;
                if (state.is(CREATED)) EventInterface(this).on(EVENT_READY, this.destroy.bind(this, completely)); else {
                    forOwn(this._C, (function(component) {
                        component.destroy && component.destroy(completely);
                    }), true);
                    event.emit(EVENT_DESTROY);
                    event.destroy();
                    completely && empty(this.splides);
                    state.set(DESTROYED);
                }
                return this;
            };
            _createClass(_Splide, [ {
                key: "options",
                get: function get() {
                    return this._o;
                },
                set: function set(options) {
                    this._C.Media.set(options, true, true);
                }
            }, {
                key: "length",
                get: function get() {
                    return this._C.Slides.getLength(true);
                }
            }, {
                key: "index",
                get: function get() {
                    return this._C.Controller.getIndex();
                }
            } ]);
            return _Splide;
        }();
        var Splide = _Splide;
        Splide.defaults = {};
        Splide.STATES = STATES;
        var CLASS_RENDERED = "is-rendered";
        var RENDERER_DEFAULT_CONFIG = {
            listTag: "ul",
            slideTag: "li"
        };
        var Style = null && function() {
            function Style(id, options) {
                this.styles = {};
                this.id = id;
                this.options = options;
            }
            var _proto2 = Style.prototype;
            _proto2.rule = function rule(selector, prop, value, breakpoint) {
                breakpoint = breakpoint || "default";
                var selectors = this.styles[breakpoint] = this.styles[breakpoint] || {};
                var styles = selectors[selector] = selectors[selector] || {};
                styles[prop] = value;
            };
            _proto2.build = function build() {
                var _this2 = this;
                var css = "";
                if (this.styles.default) css += this.buildSelectors(this.styles.default);
                Object.keys(this.styles).sort((function(n, m) {
                    return "min" === _this2.options.mediaQuery ? +n - +m : +m - +n;
                })).forEach((function(breakpoint) {
                    if ("default" !== breakpoint) {
                        css += "@media screen and (max-width: " + breakpoint + "px) {";
                        css += _this2.buildSelectors(_this2.styles[breakpoint]);
                        css += "}";
                    }
                }));
                return css;
            };
            _proto2.buildSelectors = function buildSelectors(selectors) {
                var _this3 = this;
                var css = "";
                forOwn(selectors, (function(styles, selector) {
                    selector = ("#" + _this3.id + " " + selector).trim();
                    css += selector + " {";
                    forOwn(styles, (function(value, prop) {
                        if (value || 0 === value) css += prop + ": " + value + ";";
                    }));
                    css += "}";
                }));
                return css;
            };
            return Style;
        }();
        null && function() {
            function SplideRenderer(contents, options, config, defaults) {
                this.slides = [];
                this.options = {};
                this.breakpoints = [];
                merge(DEFAULTS, defaults || {});
                merge(merge(this.options, DEFAULTS), options || {});
                this.contents = contents;
                this.config = splide_esm_assign({}, RENDERER_DEFAULT_CONFIG, config || {});
                this.id = this.config.id || uniqueId("splide");
                this.Style = new Style(this.id, this.options);
                this.Direction = Direction(null, null, this.options);
                assert(this.contents.length, "Provide at least 1 content.");
                this.init();
            }
            SplideRenderer.clean = function clean(splide) {
                var _EventInterface14 = EventInterface(splide), on = _EventInterface14.on;
                var root = splide.root;
                var clones = queryAll(root, "." + CLASS_CLONE);
                on(EVENT_MOUNTED, (function() {
                    remove(child(root, "style"));
                }));
                remove(clones);
            };
            var _proto3 = SplideRenderer.prototype;
            _proto3.init = function init() {
                this.parseBreakpoints();
                this.initSlides();
                this.registerRootStyles();
                this.registerTrackStyles();
                this.registerSlideStyles();
                this.registerListStyles();
            };
            _proto3.initSlides = function initSlides() {
                var _this4 = this;
                push(this.slides, this.contents.map((function(content, index) {
                    content = isString(content) ? {
                        html: content
                    } : content;
                    content.styles = content.styles || {};
                    content.attrs = content.attrs || {};
                    _this4.cover(content);
                    var classes = _this4.options.classes.slide + " " + (0 === index ? CLASS_ACTIVE : "");
                    splide_esm_assign(content.attrs, {
                        class: (classes + " " + (content.attrs.class || "")).trim(),
                        style: _this4.buildStyles(content.styles)
                    });
                    return content;
                })));
                if (this.isLoop()) this.generateClones(this.slides);
            };
            _proto3.registerRootStyles = function registerRootStyles() {
                var _this5 = this;
                this.breakpoints.forEach((function(_ref2) {
                    var width = _ref2[0], options = _ref2[1];
                    _this5.Style.rule(" ", "max-width", unit(options.width), width);
                }));
            };
            _proto3.registerTrackStyles = function registerTrackStyles() {
                var _this6 = this;
                var Style2 = this.Style;
                var selector = "." + CLASS_TRACK;
                this.breakpoints.forEach((function(_ref3) {
                    var width = _ref3[0], options = _ref3[1];
                    Style2.rule(selector, _this6.resolve("paddingLeft"), _this6.cssPadding(options, false), width);
                    Style2.rule(selector, _this6.resolve("paddingRight"), _this6.cssPadding(options, true), width);
                    Style2.rule(selector, "height", _this6.cssTrackHeight(options), width);
                }));
            };
            _proto3.registerListStyles = function registerListStyles() {
                var _this7 = this;
                var Style2 = this.Style;
                var selector = "." + CLASS_LIST;
                this.breakpoints.forEach((function(_ref4) {
                    var width = _ref4[0], options = _ref4[1];
                    Style2.rule(selector, "transform", _this7.buildTranslate(options), width);
                    if (!_this7.cssSlideHeight(options)) Style2.rule(selector, "aspect-ratio", _this7.cssAspectRatio(options), width);
                }));
            };
            _proto3.registerSlideStyles = function registerSlideStyles() {
                var _this8 = this;
                var Style2 = this.Style;
                var selector = "." + CLASS_SLIDE;
                this.breakpoints.forEach((function(_ref5) {
                    var width = _ref5[0], options = _ref5[1];
                    Style2.rule(selector, "width", _this8.cssSlideWidth(options), width);
                    Style2.rule(selector, "height", _this8.cssSlideHeight(options) || "100%", width);
                    Style2.rule(selector, _this8.resolve("marginRight"), unit(options.gap) || "0px", width);
                    Style2.rule(selector + " > img", "display", options.cover ? "none" : "inline", width);
                }));
            };
            _proto3.buildTranslate = function buildTranslate(options) {
                var _this$Direction = this.Direction, resolve = _this$Direction.resolve, orient = _this$Direction.orient;
                var values = [];
                values.push(this.cssOffsetClones(options));
                values.push(this.cssOffsetGaps(options));
                if (this.isCenter(options)) {
                    values.push(this.buildCssValue(orient(-50), "%"));
                    values.push.apply(values, this.cssOffsetCenter(options));
                }
                return values.filter(Boolean).map((function(value) {
                    return "translate" + resolve("X") + "(" + value + ")";
                })).join(" ");
            };
            _proto3.cssOffsetClones = function cssOffsetClones(options) {
                var _this$Direction2 = this.Direction, resolve = _this$Direction2.resolve, orient = _this$Direction2.orient;
                var cloneCount = this.getCloneCount();
                if (this.isFixedWidth(options)) {
                    var _this$parseCssValue = this.parseCssValue(options[resolve("fixedWidth")]), value = _this$parseCssValue.value, unit2 = _this$parseCssValue.unit;
                    return this.buildCssValue(orient(value) * cloneCount, unit2);
                }
                var percent = 100 * cloneCount / options.perPage;
                return orient(percent) + "%";
            };
            _proto3.cssOffsetCenter = function cssOffsetCenter(options) {
                var _this$Direction3 = this.Direction, resolve = _this$Direction3.resolve, orient = _this$Direction3.orient;
                if (this.isFixedWidth(options)) {
                    var _this$parseCssValue2 = this.parseCssValue(options[resolve("fixedWidth")]), value = _this$parseCssValue2.value, unit2 = _this$parseCssValue2.unit;
                    return [ this.buildCssValue(orient(value / 2), unit2) ];
                }
                var values = [];
                var perPage = options.perPage, gap = options.gap;
                values.push(orient(50 / perPage) + "%");
                if (gap) {
                    var _this$parseCssValue3 = this.parseCssValue(gap), _value = _this$parseCssValue3.value, _unit = _this$parseCssValue3.unit;
                    var gapOffset = (_value / perPage - _value) / 2;
                    values.push(this.buildCssValue(orient(gapOffset), _unit));
                }
                return values;
            };
            _proto3.cssOffsetGaps = function cssOffsetGaps(options) {
                var cloneCount = this.getCloneCount();
                if (cloneCount && options.gap) {
                    var orient = this.Direction.orient;
                    var _this$parseCssValue4 = this.parseCssValue(options.gap), value = _this$parseCssValue4.value, unit2 = _this$parseCssValue4.unit;
                    if (this.isFixedWidth(options)) return this.buildCssValue(orient(value * cloneCount), unit2);
                    var perPage = options.perPage;
                    var gaps = cloneCount / perPage;
                    return this.buildCssValue(orient(gaps * value), unit2);
                }
                return "";
            };
            _proto3.resolve = function resolve(prop) {
                return camelToKebab(this.Direction.resolve(prop));
            };
            _proto3.cssPadding = function cssPadding(options, right) {
                var padding = options.padding;
                var prop = this.Direction.resolve(right ? "right" : "left", true);
                return padding && unit(padding[prop] || (isObject(padding) ? 0 : padding)) || "0px";
            };
            _proto3.cssTrackHeight = function cssTrackHeight(options) {
                var height = "";
                if (this.isVertical()) {
                    height = this.cssHeight(options);
                    assert(height, '"height" is missing.');
                    height = "calc(" + height + " - " + this.cssPadding(options, false) + " - " + this.cssPadding(options, true) + ")";
                }
                return height;
            };
            _proto3.cssHeight = function cssHeight(options) {
                return unit(options.height);
            };
            _proto3.cssSlideWidth = function cssSlideWidth(options) {
                return options.autoWidth ? "" : unit(options.fixedWidth) || (this.isVertical() ? "" : this.cssSlideSize(options));
            };
            _proto3.cssSlideHeight = function cssSlideHeight(options) {
                return unit(options.fixedHeight) || (this.isVertical() ? options.autoHeight ? "" : this.cssSlideSize(options) : this.cssHeight(options));
            };
            _proto3.cssSlideSize = function cssSlideSize(options) {
                var gap = unit(options.gap);
                return "calc((100%" + (gap && " + " + gap) + ")/" + (options.perPage || 1) + (gap && " - " + gap) + ")";
            };
            _proto3.cssAspectRatio = function cssAspectRatio(options) {
                var heightRatio = options.heightRatio;
                return heightRatio ? "" + 1 / heightRatio : "";
            };
            _proto3.buildCssValue = function buildCssValue(value, unit2) {
                return "" + value + unit2;
            };
            _proto3.parseCssValue = function parseCssValue(value) {
                if (isString(value)) {
                    var number = parseFloat(value) || 0;
                    var unit2 = value.replace(/\d*(\.\d*)?/, "") || "px";
                    return {
                        value: number,
                        unit: unit2
                    };
                }
                return {
                    value,
                    unit: "px"
                };
            };
            _proto3.parseBreakpoints = function parseBreakpoints() {
                var _this9 = this;
                var breakpoints = this.options.breakpoints;
                this.breakpoints.push([ "default", this.options ]);
                if (breakpoints) forOwn(breakpoints, (function(options, width) {
                    _this9.breakpoints.push([ width, merge(merge({}, _this9.options), options) ]);
                }));
            };
            _proto3.isFixedWidth = function isFixedWidth(options) {
                return !!options[this.Direction.resolve("fixedWidth")];
            };
            _proto3.isLoop = function isLoop() {
                return this.options.type === LOOP;
            };
            _proto3.isCenter = function isCenter(options) {
                if ("center" === options.focus) {
                    if (this.isLoop()) return true;
                    if (this.options.type === SLIDE) return !this.options.trimSpace;
                }
                return false;
            };
            _proto3.isVertical = function isVertical() {
                return this.options.direction === TTB;
            };
            _proto3.buildClasses = function buildClasses() {
                var options = this.options;
                return [ CLASS_ROOT, CLASS_ROOT + "--" + options.type, CLASS_ROOT + "--" + options.direction, options.drag && CLASS_ROOT + "--draggable", options.isNavigation && CLASS_ROOT + "--nav", CLASS_ACTIVE, !this.config.hidden && CLASS_RENDERED ].filter(Boolean).join(" ");
            };
            _proto3.buildAttrs = function buildAttrs(attrs) {
                var attr = "";
                forOwn(attrs, (function(value, key) {
                    attr += value ? " " + camelToKebab(key) + '="' + value + '"' : "";
                }));
                return attr.trim();
            };
            _proto3.buildStyles = function buildStyles(styles) {
                var style = "";
                forOwn(styles, (function(value, key) {
                    style += " " + camelToKebab(key) + ":" + value + ";";
                }));
                return style.trim();
            };
            _proto3.renderSlides = function renderSlides() {
                var _this10 = this;
                var tag = this.config.slideTag;
                return this.slides.map((function(content) {
                    return "<" + tag + " " + _this10.buildAttrs(content.attrs) + ">" + (content.html || "") + "</" + tag + ">";
                })).join("");
            };
            _proto3.cover = function cover(content) {
                var styles = content.styles, _content$html = content.html, html = void 0 === _content$html ? "" : _content$html;
                if (this.options.cover && !this.options.lazyLoad) {
                    var src = html.match(/<img.*?src\s*=\s*(['"])(.+?)\1.*?>/);
                    if (src && src[2]) styles.background = "center/cover no-repeat url('" + src[2] + "')";
                }
            };
            _proto3.generateClones = function generateClones(contents) {
                var classes = this.options.classes;
                var count = this.getCloneCount();
                var slides = contents.slice();
                while (slides.length < count) push(slides, slides);
                push(slides.slice(-count).reverse(), slides.slice(0, count)).forEach((function(content, index) {
                    var attrs = splide_esm_assign({}, content.attrs, {
                        class: content.attrs.class + " " + classes.clone
                    });
                    var clone = splide_esm_assign({}, content, {
                        attrs
                    });
                    index < count ? contents.unshift(clone) : contents.push(clone);
                }));
            };
            _proto3.getCloneCount = function getCloneCount() {
                if (this.isLoop()) {
                    var options = this.options;
                    if (options.clones) return options.clones;
                    var perPage = max.apply(void 0, this.breakpoints.map((function(_ref6) {
                        var options2 = _ref6[1];
                        return options2.perPage;
                    })));
                    return perPage * ((options.flickMaxPages || 1) + 1);
                }
                return 0;
            };
            _proto3.renderArrows = function renderArrows() {
                var html = "";
                html += '<div class="' + this.options.classes.arrows + '">';
                html += this.renderArrow(true);
                html += this.renderArrow(false);
                html += "</div>";
                return html;
            };
            _proto3.renderArrow = function renderArrow(prev) {
                var _this$options = this.options, classes = _this$options.classes, i18n = _this$options.i18n;
                var attrs = {
                    class: classes.arrow + " " + (prev ? classes.prev : classes.next),
                    type: "button",
                    ariaLabel: prev ? i18n.prev : i18n.next
                };
                return "<button " + this.buildAttrs(attrs) + '><svg xmlns="' + XML_NAME_SPACE + '" viewBox="0 0 ' + SIZE + " " + SIZE + '" width="' + SIZE + '" height="' + SIZE + '"><path d="' + (this.options.arrowPath || PATH) + '" /></svg></button>';
            };
            _proto3.html = function html() {
                var _this$config = this.config, rootClass = _this$config.rootClass, listTag = _this$config.listTag, arrows = _this$config.arrows, beforeTrack = _this$config.beforeTrack, afterTrack = _this$config.afterTrack, slider = _this$config.slider, beforeSlider = _this$config.beforeSlider, afterSlider = _this$config.afterSlider;
                var html = "";
                html += '<div id="' + this.id + '" class="' + this.buildClasses() + " " + (rootClass || "") + '">';
                html += "<style>" + this.Style.build() + "</style>";
                if (slider) {
                    html += beforeSlider || "";
                    html += '<div class="splide__slider">';
                }
                html += beforeTrack || "";
                if (arrows) html += this.renderArrows();
                html += '<div class="splide__track">';
                html += "<" + listTag + ' class="splide__list">';
                html += this.renderSlides();
                html += "</" + listTag + ">";
                html += "</div>";
                html += afterTrack || "";
                if (slider) {
                    html += "</div>";
                    html += afterSlider || "";
                }
                html += "</div>";
                return html;
            };
        }();
        __webpack_require__(90);
        const t = t => "object" == typeof t && null !== t && t.constructor === Object && "[object Object]" === Object.prototype.toString.call(t), e = (...i) => {
            let s = !1;
            "boolean" == typeof i[0] && (s = i.shift());
            let o = i[0];
            if (!o || "object" != typeof o) throw new Error("extendee must be an object");
            const n = i.slice(1), a = n.length;
            for (let i = 0; i < a; i++) {
                const a = n[i];
                for (let i in a) if (a.hasOwnProperty(i)) {
                    const n = a[i];
                    if (s && (Array.isArray(n) || t(n))) {
                        const t = Array.isArray(n) ? [] : {};
                        o[i] = e(!0, o.hasOwnProperty(i) ? o[i] : t, n);
                    } else o[i] = n;
                }
            }
            return o;
        }, i = (t, e = 1e4) => (t = parseFloat(t) || 0, Math.round((t + Number.EPSILON) * e) / e), s = function(t) {
            return !!(t && "object" == typeof t && t instanceof Element && t !== document.body) && !t.__Panzoom && (function(t) {
                const e = getComputedStyle(t)["overflow-y"], i = getComputedStyle(t)["overflow-x"], s = ("scroll" === e || "auto" === e) && Math.abs(t.scrollHeight - t.clientHeight) > 1, o = ("scroll" === i || "auto" === i) && Math.abs(t.scrollWidth - t.clientWidth) > 1;
                return s || o;
            }(t) ? t : s(t.parentNode));
        }, o = "undefined" != typeof window && window.ResizeObserver || class {
            constructor(t) {
                this.observables = [], this.boundCheck = this.check.bind(this), this.boundCheck(), 
                this.callback = t;
            }
            observe(t) {
                if (this.observables.some((e => e.el === t))) return;
                const e = {
                    el: t,
                    size: {
                        height: t.clientHeight,
                        width: t.clientWidth
                    }
                };
                this.observables.push(e);
            }
            unobserve(t) {
                this.observables = this.observables.filter((e => e.el !== t));
            }
            disconnect() {
                this.observables = [];
            }
            check() {
                const t = this.observables.filter((t => {
                    const e = t.el.clientHeight, i = t.el.clientWidth;
                    if (t.size.height !== e || t.size.width !== i) return t.size.height = e, t.size.width = i, 
                    !0;
                })).map((t => t.el));
                t.length > 0 && this.callback(t), window.requestAnimationFrame(this.boundCheck);
            }
        };
        class n {
            constructor(t) {
                this.id = self.Touch && t instanceof Touch ? t.identifier : -1, this.pageX = t.pageX, 
                this.pageY = t.pageY, this.clientX = t.clientX, this.clientY = t.clientY;
            }
        }
        const a = (t, e) => e ? Math.sqrt((e.clientX - t.clientX) ** 2 + (e.clientY - t.clientY) ** 2) : 0, r = (t, e) => e ? {
            clientX: (t.clientX + e.clientX) / 2,
            clientY: (t.clientY + e.clientY) / 2
        } : t;
        class h {
            constructor(t, {start: e = (() => !0), move: i = (() => {}), end: s = (() => {})} = {}) {
                this._element = t, this.startPointers = [], this.currentPointers = [], this._pointerStart = t => {
                    if (t.buttons > 0 && 0 !== t.button) return;
                    const e = new n(t);
                    this.currentPointers.some((t => t.id === e.id)) || this._triggerPointerStart(e, t) && (window.addEventListener("mousemove", this._move), 
                    window.addEventListener("mouseup", this._pointerEnd));
                }, this._touchStart = t => {
                    for (const e of Array.from(t.changedTouches || [])) this._triggerPointerStart(new n(e), t);
                }, this._move = t => {
                    const e = this.currentPointers.slice(), i = (t => "changedTouches" in t)(t) ? Array.from(t.changedTouches).map((t => new n(t))) : [ new n(t) ];
                    for (const t of i) {
                        const e = this.currentPointers.findIndex((e => e.id === t.id));
                        e < 0 || (this.currentPointers[e] = t);
                    }
                    this._moveCallback(e, this.currentPointers.slice(), t);
                }, this._triggerPointerEnd = (t, e) => {
                    const i = this.currentPointers.findIndex((e => e.id === t.id));
                    return !(i < 0) && (this.currentPointers.splice(i, 1), this.startPointers.splice(i, 1), 
                    this._endCallback(t, e), !0);
                }, this._pointerEnd = t => {
                    t.buttons > 0 && 0 !== t.button || this._triggerPointerEnd(new n(t), t) && (window.removeEventListener("mousemove", this._move, {
                        passive: !1
                    }), window.removeEventListener("mouseup", this._pointerEnd, {
                        passive: !1
                    }));
                }, this._touchEnd = t => {
                    for (const e of Array.from(t.changedTouches || [])) this._triggerPointerEnd(new n(e), t);
                }, this._startCallback = e, this._moveCallback = i, this._endCallback = s, this._element.addEventListener("mousedown", this._pointerStart, {
                    passive: !1
                }), this._element.addEventListener("touchstart", this._touchStart, {
                    passive: !1
                }), this._element.addEventListener("touchmove", this._move, {
                    passive: !1
                }), this._element.addEventListener("touchend", this._touchEnd), this._element.addEventListener("touchcancel", this._touchEnd);
            }
            stop() {
                this._element.removeEventListener("mousedown", this._pointerStart, {
                    passive: !1
                }), this._element.removeEventListener("touchstart", this._touchStart, {
                    passive: !1
                }), this._element.removeEventListener("touchmove", this._move, {
                    passive: !1
                }), this._element.removeEventListener("touchend", this._touchEnd), this._element.removeEventListener("touchcancel", this._touchEnd), 
                window.removeEventListener("mousemove", this._move), window.removeEventListener("mouseup", this._pointerEnd);
            }
            _triggerPointerStart(t, e) {
                return !!this._startCallback(t, e) && (this.currentPointers.push(t), this.startPointers.push(t), 
                !0);
            }
        }
        class l {
            constructor(t = {}) {
                this.options = e(!0, {}, t), this.plugins = [], this.events = {};
                for (const t of [ "on", "once" ]) for (const e of Object.entries(this.options[t] || {})) this[t](...e);
            }
            option(t, e, ...i) {
                t = String(t);
                let s = (o = t, n = this.options, o.split(".").reduce((function(t, e) {
                    return t && t[e];
                }), n));
                var o, n;
                return "function" == typeof s && (s = s.call(this, this, ...i)), void 0 === s ? e : s;
            }
            localize(t, e = []) {
                return t = (t = String(t).replace(/\{\{(\w+).?(\w+)?\}\}/g, ((t, i, s) => {
                    let o = "";
                    s ? o = this.option(`${i[0] + i.toLowerCase().substring(1)}.l10n.${s}`) : i && (o = this.option(`l10n.${i}`)), 
                    o || (o = t);
                    for (let t = 0; t < e.length; t++) o = o.split(e[t][0]).join(e[t][1]);
                    return o;
                }))).replace(/\{\{(.*)\}\}/, ((t, e) => e));
            }
            on(e, i) {
                if (t(e)) {
                    for (const t of Object.entries(e)) this.on(...t);
                    return this;
                }
                return String(e).split(" ").forEach((t => {
                    const e = this.events[t] = this.events[t] || [];
                    -1 == e.indexOf(i) && e.push(i);
                })), this;
            }
            once(e, i) {
                if (t(e)) {
                    for (const t of Object.entries(e)) this.once(...t);
                    return this;
                }
                return String(e).split(" ").forEach((t => {
                    const e = (...s) => {
                        this.off(t, e), i.call(this, this, ...s);
                    };
                    e._ = i, this.on(t, e);
                })), this;
            }
            off(e, i) {
                if (!t(e)) return e.split(" ").forEach((t => {
                    const e = this.events[t];
                    if (!e || !e.length) return this;
                    let s = -1;
                    for (let t = 0, o = e.length; t < o; t++) {
                        const o = e[t];
                        if (o && (o === i || o._ === i)) {
                            s = t;
                            break;
                        }
                    }
                    -1 != s && e.splice(s, 1);
                })), this;
                for (const t of Object.entries(e)) this.off(...t);
            }
            trigger(t, ...e) {
                for (const i of [ ...this.events[t] || [] ].slice()) if (i && !1 === i.call(this, this, ...e)) return !1;
                for (const i of [ ...this.events["*"] || [] ].slice()) if (i && !1 === i.call(this, t, this, ...e)) return !1;
                return !0;
            }
            attachPlugins(t) {
                const i = {};
                for (const [s, o] of Object.entries(t || {})) !1 === this.options[s] || this.plugins[s] || (this.options[s] = e({}, o.defaults || {}, this.options[s]), 
                i[s] = new o(this));
                for (const [t, e] of Object.entries(i)) e.attach(this);
                return this.plugins = Object.assign({}, this.plugins, i), this;
            }
            detachPlugins() {
                for (const t in this.plugins) {
                    let e;
                    (e = this.plugins[t]) && "function" == typeof e.detach && e.detach(this);
                }
                return this.plugins = {}, this;
            }
        }
        const c = {
            touch: !0,
            zoom: !0,
            pinchToZoom: !0,
            panOnlyZoomed: !1,
            lockAxis: !1,
            friction: .64,
            decelFriction: .88,
            zoomFriction: .74,
            bounceForce: .2,
            baseScale: 1,
            minScale: 1,
            maxScale: 2,
            step: .5,
            textSelection: !1,
            click: "toggleZoom",
            wheel: "zoom",
            wheelFactor: 42,
            wheelLimit: 5,
            draggableClass: "is-draggable",
            draggingClass: "is-dragging",
            ratio: 1
        };
        class d extends l {
            constructor(t, i = {}) {
                super(e(!0, {}, c, i)), this.state = "init", this.$container = t;
                for (const t of [ "onLoad", "onWheel", "onClick" ]) this[t] = this[t].bind(this);
                this.initLayout(), this.resetValues(), this.attachPlugins(d.Plugins), this.trigger("init"), 
                this.updateMetrics(), this.attachEvents(), this.trigger("ready"), !1 === this.option("centerOnStart") ? this.state = "ready" : this.panTo({
                    friction: 0
                }), t.__Panzoom = this;
            }
            initLayout() {
                const t = this.$container;
                if (!(t instanceof HTMLElement)) throw new Error("Panzoom: Container not found");
                const e = this.option("content") || t.querySelector(".panzoom__content");
                if (!e) throw new Error("Panzoom: Content not found");
                this.$content = e;
                let i = this.option("viewport") || t.querySelector(".panzoom__viewport");
                i || !1 === this.option("wrapInner") || (i = document.createElement("div"), i.classList.add("panzoom__viewport"), 
                i.append(...t.childNodes), t.appendChild(i)), this.$viewport = i || e.parentNode;
            }
            resetValues() {
                this.updateRate = this.option("updateRate", /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 250 : 24), 
                this.container = {
                    width: 0,
                    height: 0
                }, this.viewport = {
                    width: 0,
                    height: 0
                }, this.content = {
                    origWidth: 0,
                    origHeight: 0,
                    width: 0,
                    height: 0,
                    x: this.option("x", 0),
                    y: this.option("y", 0),
                    scale: this.option("baseScale")
                }, this.transform = {
                    x: 0,
                    y: 0,
                    scale: 1
                }, this.resetDragPosition();
            }
            onLoad(t) {
                this.updateMetrics(), this.panTo({
                    scale: this.option("baseScale"),
                    friction: 0
                }), this.trigger("load", t);
            }
            onClick(t) {
                if (t.defaultPrevented) return;
                if (document.activeElement && document.activeElement.closest("[contenteditable]")) return;
                if (this.option("textSelection") && window.getSelection().toString().length && (!t.target || !t.target.hasAttribute("data-fancybox-close"))) return void t.stopPropagation();
                const e = this.$content.getClientRects()[0];
                if ("ready" !== this.state && (this.dragPosition.midPoint || Math.abs(e.top - this.dragStart.rect.top) > 1 || Math.abs(e.left - this.dragStart.rect.left) > 1)) return t.preventDefault(), 
                void t.stopPropagation();
                !1 !== this.trigger("click", t) && this.option("zoom") && "toggleZoom" === this.option("click") && (t.preventDefault(), 
                t.stopPropagation(), this.zoomWithClick(t));
            }
            onWheel(t) {
                !1 !== this.trigger("wheel", t) && this.option("zoom") && this.option("wheel") && this.zoomWithWheel(t);
            }
            zoomWithWheel(t) {
                void 0 === this.changedDelta && (this.changedDelta = 0);
                const e = Math.max(-1, Math.min(1, -t.deltaY || -t.deltaX || t.wheelDelta || -t.detail)), i = this.content.scale;
                let s = i * (100 + e * this.option("wheelFactor")) / 100;
                if (e < 0 && Math.abs(i - this.option("minScale")) < .01 || e > 0 && Math.abs(i - this.option("maxScale")) < .01 ? (this.changedDelta += Math.abs(e), 
                s = i) : (this.changedDelta = 0, s = Math.max(Math.min(s, this.option("maxScale")), this.option("minScale"))), 
                this.changedDelta > this.option("wheelLimit")) return;
                if (t.preventDefault(), s === i) return;
                const o = this.$content.getBoundingClientRect(), n = t.clientX - o.left, a = t.clientY - o.top;
                this.zoomTo(s, {
                    x: n,
                    y: a
                });
            }
            zoomWithClick(t) {
                const e = this.$content.getClientRects()[0], i = t.clientX - e.left, s = t.clientY - e.top;
                this.toggleZoom({
                    x: i,
                    y: s
                });
            }
            attachEvents() {
                this.$content.addEventListener("load", this.onLoad), this.$container.addEventListener("wheel", this.onWheel, {
                    passive: !1
                }), this.$container.addEventListener("click", this.onClick, {
                    passive: !1
                }), this.initObserver();
                const t = new h(this.$container, {
                    start: (e, i) => {
                        if (!this.option("touch")) return !1;
                        if (this.velocity.scale < 0) return !1;
                        const o = i.composedPath()[0];
                        if (!t.currentPointers.length) {
                            if (-1 !== [ "BUTTON", "TEXTAREA", "OPTION", "INPUT", "SELECT", "VIDEO" ].indexOf(o.nodeName)) return !1;
                            if (this.option("textSelection") && ((t, e, i) => {
                                const s = t.childNodes, o = document.createRange();
                                for (let t = 0; t < s.length; t++) {
                                    const n = s[t];
                                    if (n.nodeType !== Node.TEXT_NODE) continue;
                                    o.selectNodeContents(n);
                                    const a = o.getBoundingClientRect();
                                    if (e >= a.left && i >= a.top && e <= a.right && i <= a.bottom) return n;
                                }
                                return !1;
                            })(o, e.clientX, e.clientY)) return !1;
                        }
                        return !s(o) && !1 !== this.trigger("touchStart", i) && ("mousedown" === i.type && i.preventDefault(), 
                        this.state = "pointerdown", this.resetDragPosition(), this.dragPosition.midPoint = null, 
                        this.dragPosition.time = Date.now(), !0);
                    },
                    move: (e, i, s) => {
                        if ("pointerdown" !== this.state) return;
                        if (!1 === this.trigger("touchMove", s)) return void s.preventDefault();
                        if (i.length < 2 && !0 === this.option("panOnlyZoomed") && this.content.width <= this.viewport.width && this.content.height <= this.viewport.height && this.transform.scale <= this.option("baseScale")) return;
                        if (i.length > 1 && (!this.option("zoom") || !1 === this.option("pinchToZoom"))) return;
                        const o = r(e[0], e[1]), n = r(i[0], i[1]), h = n.clientX - o.clientX, l = n.clientY - o.clientY, c = a(e[0], e[1]), d = a(i[0], i[1]), u = c && d ? d / c : 1;
                        this.dragOffset.x += h, this.dragOffset.y += l, this.dragOffset.scale *= u, this.dragOffset.time = Date.now() - this.dragPosition.time;
                        const f = 1 === this.dragStart.scale && this.option("lockAxis");
                        if (f && !this.lockAxis) {
                            if (Math.abs(this.dragOffset.x) < 6 && Math.abs(this.dragOffset.y) < 6) return void s.preventDefault();
                            const t = Math.abs(180 * Math.atan2(this.dragOffset.y, this.dragOffset.x) / Math.PI);
                            this.lockAxis = t > 45 && t < 135 ? "y" : "x";
                        }
                        if ("xy" === f || "y" !== this.lockAxis) {
                            if (s.preventDefault(), s.stopPropagation(), s.stopImmediatePropagation(), this.lockAxis && (this.dragOffset["x" === this.lockAxis ? "y" : "x"] = 0), 
                            this.$container.classList.add(this.option("draggingClass")), this.transform.scale === this.option("baseScale") && "y" === this.lockAxis || (this.dragPosition.x = this.dragStart.x + this.dragOffset.x), 
                            this.transform.scale === this.option("baseScale") && "x" === this.lockAxis || (this.dragPosition.y = this.dragStart.y + this.dragOffset.y), 
                            this.dragPosition.scale = this.dragStart.scale * this.dragOffset.scale, i.length > 1) {
                                const e = r(t.startPointers[0], t.startPointers[1]), i = e.clientX - this.dragStart.rect.x, s = e.clientY - this.dragStart.rect.y, {deltaX: o, deltaY: a} = this.getZoomDelta(this.content.scale * this.dragOffset.scale, i, s);
                                this.dragPosition.x -= o, this.dragPosition.y -= a, this.dragPosition.midPoint = n;
                            } else this.setDragResistance();
                            this.transform = {
                                x: this.dragPosition.x,
                                y: this.dragPosition.y,
                                scale: this.dragPosition.scale
                            }, this.startAnimation();
                        }
                    },
                    end: (e, i) => {
                        if ("pointerdown" !== this.state) return;
                        if (this._dragOffset = {
                            ...this.dragOffset
                        }, t.currentPointers.length) return void this.resetDragPosition();
                        if (this.state = "decel", this.friction = this.option("decelFriction"), this.recalculateTransform(), 
                        this.$container.classList.remove(this.option("draggingClass")), !1 === this.trigger("touchEnd", i)) return;
                        if ("decel" !== this.state) return;
                        const s = this.option("minScale");
                        if (this.transform.scale < s) return void this.zoomTo(s, {
                            friction: .64
                        });
                        const o = this.option("maxScale");
                        if (this.transform.scale - o > .01) {
                            const t = this.dragPosition.midPoint || e, i = this.$content.getClientRects()[0];
                            this.zoomTo(o, {
                                friction: .64,
                                x: t.clientX - i.left,
                                y: t.clientY - i.top
                            });
                        }
                    }
                });
                this.pointerTracker = t;
            }
            initObserver() {
                this.resizeObserver || (this.resizeObserver = new o((() => {
                    this.updateTimer || (this.updateTimer = setTimeout((() => {
                        const t = this.$container.getBoundingClientRect();
                        t.width && t.height ? ((Math.abs(t.width - this.container.width) > 1 || Math.abs(t.height - this.container.height) > 1) && (this.isAnimating() && this.endAnimation(!0), 
                        this.updateMetrics(), this.panTo({
                            x: this.content.x,
                            y: this.content.y,
                            scale: this.option("baseScale"),
                            friction: 0
                        })), this.updateTimer = null) : this.updateTimer = null;
                    }), this.updateRate));
                })), this.resizeObserver.observe(this.$container));
            }
            resetDragPosition() {
                this.lockAxis = null, this.friction = this.option("friction"), this.velocity = {
                    x: 0,
                    y: 0,
                    scale: 0
                };
                const {x: t, y: e, scale: i} = this.content;
                this.dragStart = {
                    rect: this.$content.getBoundingClientRect(),
                    x: t,
                    y: e,
                    scale: i
                }, this.dragPosition = {
                    ...this.dragPosition,
                    x: t,
                    y: e,
                    scale: i
                }, this.dragOffset = {
                    x: 0,
                    y: 0,
                    scale: 1,
                    time: 0
                };
            }
            updateMetrics(t) {
                !0 !== t && this.trigger("beforeUpdate");
                const e = this.$container, s = this.$content, o = this.$viewport, n = s instanceof HTMLImageElement, a = this.option("zoom"), r = this.option("resizeParent", a);
                let h = this.option("width"), l = this.option("height"), c = h || (d = s, Math.max(parseFloat(d.naturalWidth || 0), parseFloat(d.width && d.width.baseVal && d.width.baseVal.value || 0), parseFloat(d.offsetWidth || 0), parseFloat(d.scrollWidth || 0)));
                var d;
                let u = l || (t => Math.max(parseFloat(t.naturalHeight || 0), parseFloat(t.height && t.height.baseVal && t.height.baseVal.value || 0), parseFloat(t.offsetHeight || 0), parseFloat(t.scrollHeight || 0)))(s);
                Object.assign(s.style, {
                    width: h ? `${h}px` : "",
                    height: l ? `${l}px` : "",
                    maxWidth: "",
                    maxHeight: ""
                }), r && Object.assign(o.style, {
                    width: "",
                    height: ""
                });
                const f = this.option("ratio");
                c = i(c * f), u = i(u * f), h = c, l = u;
                const g = s.getBoundingClientRect(), p = o.getBoundingClientRect(), m = o == e ? p : e.getBoundingClientRect();
                let y = Math.max(o.offsetWidth, i(p.width)), v = Math.max(o.offsetHeight, i(p.height)), b = window.getComputedStyle(o);
                if (y -= parseFloat(b.paddingLeft) + parseFloat(b.paddingRight), v -= parseFloat(b.paddingTop) + parseFloat(b.paddingBottom), 
                this.viewport.width = y, this.viewport.height = v, a) {
                    if (Math.abs(c - g.width) > .1 || Math.abs(u - g.height) > .1) {
                        const t = ((t, e, i, s) => {
                            const o = Math.min(i / t || 0, s / e);
                            return {
                                width: t * o || 0,
                                height: e * o || 0
                            };
                        })(c, u, Math.min(c, g.width), Math.min(u, g.height));
                        h = i(t.width), l = i(t.height);
                    }
                    Object.assign(s.style, {
                        width: `${h}px`,
                        height: `${l}px`,
                        transform: ""
                    });
                }
                if (r && (Object.assign(o.style, {
                    width: `${h}px`,
                    height: `${l}px`
                }), this.viewport = {
                    ...this.viewport,
                    width: h,
                    height: l
                }), n && a && "function" != typeof this.options.maxScale) {
                    const t = this.option("maxScale");
                    this.options.maxScale = function() {
                        return this.content.origWidth > 0 && this.content.fitWidth > 0 ? this.content.origWidth / this.content.fitWidth : t;
                    };
                }
                this.content = {
                    ...this.content,
                    origWidth: c,
                    origHeight: u,
                    fitWidth: h,
                    fitHeight: l,
                    width: h,
                    height: l,
                    scale: 1,
                    isZoomable: a
                }, this.container = {
                    width: m.width,
                    height: m.height
                }, !0 !== t && this.trigger("afterUpdate");
            }
            zoomIn(t) {
                this.zoomTo(this.content.scale + (t || this.option("step")));
            }
            zoomOut(t) {
                this.zoomTo(this.content.scale - (t || this.option("step")));
            }
            toggleZoom(t = {}) {
                const e = this.option("maxScale"), i = this.option("baseScale"), s = this.content.scale > i + .5 * (e - i) ? i : e;
                this.zoomTo(s, t);
            }
            zoomTo(t = this.option("baseScale"), {x: e = null, y: s = null} = {}) {
                t = Math.max(Math.min(t, this.option("maxScale")), this.option("minScale"));
                const o = i(this.content.scale / (this.content.width / this.content.fitWidth), 1e7);
                null === e && (e = this.content.width * o * .5), null === s && (s = this.content.height * o * .5);
                const {deltaX: n, deltaY: a} = this.getZoomDelta(t, e, s);
                e = this.content.x - n, s = this.content.y - a, this.panTo({
                    x: e,
                    y: s,
                    scale: t,
                    friction: this.option("zoomFriction")
                });
            }
            getZoomDelta(t, e = 0, i = 0) {
                const s = this.content.fitWidth * this.content.scale, o = this.content.fitHeight * this.content.scale, n = e > 0 && s ? e / s : 0, a = i > 0 && o ? i / o : 0;
                return {
                    deltaX: (this.content.fitWidth * t - s) * n,
                    deltaY: (this.content.fitHeight * t - o) * a
                };
            }
            panTo({x: t = this.content.x, y: e = this.content.y, scale: i, friction: s = this.option("friction"), ignoreBounds: o = !1} = {}) {
                if (i = i || this.content.scale || 1, !o) {
                    const {boundX: s, boundY: o} = this.getBounds(i);
                    s && (t = Math.max(Math.min(t, s.to), s.from)), o && (e = Math.max(Math.min(e, o.to), o.from));
                }
                this.friction = s, this.transform = {
                    ...this.transform,
                    x: t,
                    y: e,
                    scale: i
                }, s ? (this.state = "panning", this.velocity = {
                    x: (1 / this.friction - 1) * (t - this.content.x),
                    y: (1 / this.friction - 1) * (e - this.content.y),
                    scale: (1 / this.friction - 1) * (i - this.content.scale)
                }, this.startAnimation()) : this.endAnimation();
            }
            startAnimation() {
                this.rAF ? cancelAnimationFrame(this.rAF) : this.trigger("startAnimation"), this.rAF = requestAnimationFrame((() => this.animate()));
            }
            animate() {
                if (this.setEdgeForce(), this.setDragForce(), this.velocity.x *= this.friction, 
                this.velocity.y *= this.friction, this.velocity.scale *= this.friction, this.content.x += this.velocity.x, 
                this.content.y += this.velocity.y, this.content.scale += this.velocity.scale, this.isAnimating()) this.setTransform(); else if ("pointerdown" !== this.state) return void this.endAnimation();
                this.rAF = requestAnimationFrame((() => this.animate()));
            }
            getBounds(t) {
                let e = this.boundX, s = this.boundY;
                if (void 0 !== e && void 0 !== s) return {
                    boundX: e,
                    boundY: s
                };
                e = {
                    from: 0,
                    to: 0
                }, s = {
                    from: 0,
                    to: 0
                }, t = t || this.transform.scale;
                const o = this.content.fitWidth * t, n = this.content.fitHeight * t, a = this.viewport.width, r = this.viewport.height;
                if (o < a) {
                    const t = i(.5 * (a - o));
                    e.from = t, e.to = t;
                } else e.from = i(a - o);
                if (n < r) {
                    const t = .5 * (r - n);
                    s.from = t, s.to = t;
                } else s.from = i(r - n);
                return {
                    boundX: e,
                    boundY: s
                };
            }
            setEdgeForce() {
                if ("decel" !== this.state) return;
                const t = this.option("bounceForce"), {boundX: e, boundY: i} = this.getBounds(Math.max(this.transform.scale, this.content.scale));
                let s, o, n, a;
                if (e && (s = this.content.x < e.from, o = this.content.x > e.to), i && (n = this.content.y < i.from, 
                a = this.content.y > i.to), s || o) {
                    let i = ((s ? e.from : e.to) - this.content.x) * t;
                    const o = this.content.x + (this.velocity.x + i) / this.friction;
                    o >= e.from && o <= e.to && (i += this.velocity.x), this.velocity.x = i, this.recalculateTransform();
                }
                if (n || a) {
                    let e = ((n ? i.from : i.to) - this.content.y) * t;
                    const s = this.content.y + (e + this.velocity.y) / this.friction;
                    s >= i.from && s <= i.to && (e += this.velocity.y), this.velocity.y = e, this.recalculateTransform();
                }
            }
            setDragResistance() {
                if ("pointerdown" !== this.state) return;
                const {boundX: t, boundY: e} = this.getBounds(this.dragPosition.scale);
                let i, s, o, n;
                if (t && (i = this.dragPosition.x < t.from, s = this.dragPosition.x > t.to), e && (o = this.dragPosition.y < e.from, 
                n = this.dragPosition.y > e.to), (i || s) && (!i || !s)) {
                    const e = i ? t.from : t.to, s = e - this.dragPosition.x;
                    this.dragPosition.x = e - .3 * s;
                }
                if ((o || n) && (!o || !n)) {
                    const t = o ? e.from : e.to, i = t - this.dragPosition.y;
                    this.dragPosition.y = t - .3 * i;
                }
            }
            setDragForce() {
                "pointerdown" === this.state && (this.velocity.x = this.dragPosition.x - this.content.x, 
                this.velocity.y = this.dragPosition.y - this.content.y, this.velocity.scale = this.dragPosition.scale - this.content.scale);
            }
            recalculateTransform() {
                this.transform.x = this.content.x + this.velocity.x / (1 / this.friction - 1), this.transform.y = this.content.y + this.velocity.y / (1 / this.friction - 1), 
                this.transform.scale = this.content.scale + this.velocity.scale / (1 / this.friction - 1);
            }
            isAnimating() {
                return !(!this.friction || !(Math.abs(this.velocity.x) > .05 || Math.abs(this.velocity.y) > .05 || Math.abs(this.velocity.scale) > .05));
            }
            setTransform(t) {
                let e, s, o;
                if (t ? (e = i(this.transform.x), s = i(this.transform.y), o = this.transform.scale, 
                this.content = {
                    ...this.content,
                    x: e,
                    y: s,
                    scale: o
                }) : (e = i(this.content.x), s = i(this.content.y), o = this.content.scale / (this.content.width / this.content.fitWidth), 
                this.content = {
                    ...this.content,
                    x: e,
                    y: s
                }), this.trigger("beforeTransform"), e = i(this.content.x), s = i(this.content.y), 
                t && this.option("zoom")) {
                    let t, n;
                    t = i(this.content.fitWidth * o), n = i(this.content.fitHeight * o), this.content.width = t, 
                    this.content.height = n, this.transform = {
                        ...this.transform,
                        width: t,
                        height: n,
                        scale: o
                    }, Object.assign(this.$content.style, {
                        width: `${t}px`,
                        height: `${n}px`,
                        maxWidth: "none",
                        maxHeight: "none",
                        transform: `translate3d(${e}px, ${s}px, 0) scale(1)`
                    });
                } else this.$content.style.transform = `translate3d(${e}px, ${s}px, 0) scale(${o})`;
                this.trigger("afterTransform");
            }
            endAnimation(t) {
                cancelAnimationFrame(this.rAF), this.rAF = null, this.velocity = {
                    x: 0,
                    y: 0,
                    scale: 0
                }, this.setTransform(!0), this.state = "ready", this.handleCursor(), !0 !== t && this.trigger("endAnimation");
            }
            handleCursor() {
                const t = this.option("draggableClass");
                t && this.option("touch") && (1 == this.option("panOnlyZoomed") && this.content.width <= this.viewport.width && this.content.height <= this.viewport.height && this.transform.scale <= this.option("baseScale") ? this.$container.classList.remove(t) : this.$container.classList.add(t));
            }
            detachEvents() {
                this.$content.removeEventListener("load", this.onLoad), this.$container.removeEventListener("wheel", this.onWheel, {
                    passive: !1
                }), this.$container.removeEventListener("click", this.onClick, {
                    passive: !1
                }), this.pointerTracker && (this.pointerTracker.stop(), this.pointerTracker = null), 
                this.resizeObserver && (this.resizeObserver.disconnect(), this.resizeObserver = null);
            }
            destroy() {
                "destroy" !== this.state && (this.state = "destroy", clearTimeout(this.updateTimer), 
                this.updateTimer = null, cancelAnimationFrame(this.rAF), this.rAF = null, this.detachEvents(), 
                this.detachPlugins(), this.resetDragPosition());
            }
        }
        d.version = "4.0.31", d.Plugins = {};
        const u = (t, e) => {
            let i = 0;
            return function(...s) {
                const o = (new Date).getTime();
                if (!(o - i < e)) return i = o, t(...s);
            };
        };
        class f {
            constructor(t) {
                this.$container = null, this.$prev = null, this.$next = null, this.carousel = t, 
                this.onRefresh = this.onRefresh.bind(this);
            }
            option(t) {
                return this.carousel.option(`Navigation.${t}`);
            }
            createButton(t) {
                const e = document.createElement("button");
                e.setAttribute("title", this.carousel.localize(`{{${t.toUpperCase()}}}`));
                const i = this.option("classNames.button") + " " + this.option(`classNames.${t}`);
                return e.classList.add(...i.split(" ")), e.setAttribute("tabindex", "0"), e.innerHTML = this.carousel.localize(this.option(`${t}Tpl`)), 
                e.addEventListener("click", (e => {
                    e.preventDefault(), e.stopPropagation(), this.carousel["slide" + ("next" === t ? "Next" : "Prev")]();
                })), e;
            }
            build() {
                this.$container || (this.$container = document.createElement("div"), this.$container.classList.add(...this.option("classNames.main").split(" ")), 
                this.carousel.$container.appendChild(this.$container)), this.$next || (this.$next = this.createButton("next"), 
                this.$container.appendChild(this.$next)), this.$prev || (this.$prev = this.createButton("prev"), 
                this.$container.appendChild(this.$prev));
            }
            onRefresh() {
                const t = this.carousel.pages.length;
                t <= 1 || t > 1 && this.carousel.elemDimWidth < this.carousel.wrapDimWidth && !Number.isInteger(this.carousel.option("slidesPerPage")) ? this.cleanup() : (this.build(), 
                this.$prev.removeAttribute("disabled"), this.$next.removeAttribute("disabled"), 
                this.carousel.option("infiniteX", this.carousel.option("infinite")) || (this.carousel.page <= 0 && this.$prev.setAttribute("disabled", ""), 
                this.carousel.page >= t - 1 && this.$next.setAttribute("disabled", "")));
            }
            cleanup() {
                this.$prev && this.$prev.remove(), this.$prev = null, this.$next && this.$next.remove(), 
                this.$next = null, this.$container && this.$container.remove(), this.$container = null;
            }
            attach() {
                this.carousel.on("refresh change", this.onRefresh);
            }
            detach() {
                this.carousel.off("refresh change", this.onRefresh), this.cleanup();
            }
        }
        f.defaults = {
            prevTpl: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M15 3l-9 9 9 9"/></svg>',
            nextTpl: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M9 3l9 9-9 9"/></svg>',
            classNames: {
                main: "carousel__nav",
                button: "carousel__button",
                next: "is-next",
                prev: "is-prev"
            }
        };
        class g {
            constructor(t) {
                this.carousel = t, this.selectedIndex = null, this.friction = 0, this.onNavReady = this.onNavReady.bind(this), 
                this.onNavClick = this.onNavClick.bind(this), this.onNavCreateSlide = this.onNavCreateSlide.bind(this), 
                this.onTargetChange = this.onTargetChange.bind(this);
            }
            addAsTargetFor(t) {
                this.target = this.carousel, this.nav = t, this.attachEvents();
            }
            addAsNavFor(t) {
                this.target = t, this.nav = this.carousel, this.attachEvents();
            }
            attachEvents() {
                this.nav.options.initialSlide = this.target.options.initialPage, this.nav.on("ready", this.onNavReady), 
                this.nav.on("createSlide", this.onNavCreateSlide), this.nav.on("Panzoom.click", this.onNavClick), 
                this.target.on("change", this.onTargetChange), this.target.on("Panzoom.afterUpdate", this.onTargetChange);
            }
            onNavReady() {
                this.onTargetChange(!0);
            }
            onNavClick(t, e, i) {
                const s = i.target.closest(".carousel__slide");
                if (!s) return;
                i.stopPropagation();
                const o = parseInt(s.dataset.index, 10), n = this.target.findPageForSlide(o);
                this.target.page !== n && this.target.slideTo(n, {
                    friction: this.friction
                }), this.markSelectedSlide(o);
            }
            onNavCreateSlide(t, e) {
                e.index === this.selectedIndex && this.markSelectedSlide(e.index);
            }
            onTargetChange() {
                const t = this.target.pages[this.target.page].indexes[0], e = this.nav.findPageForSlide(t);
                this.nav.slideTo(e), this.markSelectedSlide(t);
            }
            markSelectedSlide(t) {
                this.selectedIndex = t, [ ...this.nav.slides ].filter((t => t.$el && t.$el.classList.remove("is-nav-selected")));
                const e = this.nav.slides[t];
                e && e.$el && e.$el.classList.add("is-nav-selected");
            }
            attach(t) {
                const e = t.options.Sync;
                (e.target || e.nav) && (e.target ? this.addAsNavFor(e.target) : e.nav && this.addAsTargetFor(e.nav), 
                this.friction = e.friction);
            }
            detach() {
                this.nav && (this.nav.off("ready", this.onNavReady), this.nav.off("Panzoom.click", this.onNavClick), 
                this.nav.off("createSlide", this.onNavCreateSlide)), this.target && (this.target.off("Panzoom.afterUpdate", this.onTargetChange), 
                this.target.off("change", this.onTargetChange));
            }
        }
        g.defaults = {
            friction: .92
        };
        const p = {
            Navigation: f,
            Dots: class {
                constructor(t) {
                    this.carousel = t, this.$list = null, this.events = {
                        change: this.onChange.bind(this),
                        refresh: this.onRefresh.bind(this)
                    };
                }
                buildList() {
                    if (this.carousel.pages.length < this.carousel.option("Dots.minSlideCount")) return;
                    const t = document.createElement("ol");
                    return t.classList.add("carousel__dots"), t.addEventListener("click", (t => {
                        if (!("page" in t.target.dataset)) return;
                        t.preventDefault(), t.stopPropagation();
                        const e = parseInt(t.target.dataset.page, 10), i = this.carousel;
                        e !== i.page && (i.pages.length < 3 && i.option("infinite") ? i[0 == e ? "slidePrev" : "slideNext"]() : i.slideTo(e));
                    })), this.$list = t, this.carousel.$container.appendChild(t), this.carousel.$container.classList.add("has-dots"), 
                    t;
                }
                removeList() {
                    this.$list && (this.$list.parentNode.removeChild(this.$list), this.$list = null), 
                    this.carousel.$container.classList.remove("has-dots");
                }
                rebuildDots() {
                    let t = this.$list;
                    const e = !!t, i = this.carousel.pages.length;
                    if (i < 2) return void (e && this.removeList());
                    e || (t = this.buildList());
                    const s = this.$list.children.length;
                    if (s > i) for (let t = i; t < s; t++) this.$list.removeChild(this.$list.lastChild); else {
                        for (let t = s; t < i; t++) {
                            const e = document.createElement("li");
                            e.classList.add("carousel__dot"), e.dataset.page = t, e.setAttribute("role", "button"), 
                            e.setAttribute("tabindex", "0"), e.setAttribute("title", this.carousel.localize("{{GOTO}}", [ [ "%d", t + 1 ] ])), 
                            e.addEventListener("keydown", (t => {
                                const i = t.code;
                                let s;
                                "Enter" === i || "NumpadEnter" === i ? s = e : "ArrowRight" === i ? s = e.nextSibling : "ArrowLeft" === i && (s = e.previousSibling), 
                                s && s.click();
                            })), this.$list.appendChild(e);
                        }
                        this.setActiveDot();
                    }
                }
                setActiveDot() {
                    if (!this.$list) return;
                    this.$list.childNodes.forEach((t => {
                        t.classList.remove("is-selected");
                    }));
                    const t = this.$list.childNodes[this.carousel.page];
                    t && t.classList.add("is-selected");
                }
                onChange() {
                    this.setActiveDot();
                }
                onRefresh() {
                    this.rebuildDots();
                }
                attach() {
                    this.carousel.on(this.events);
                }
                detach() {
                    this.removeList(), this.carousel.off(this.events), this.carousel = null;
                }
            },
            Sync: g
        };
        const m = {
            slides: [],
            preload: 0,
            slidesPerPage: "auto",
            initialPage: null,
            initialSlide: null,
            friction: .92,
            center: !0,
            infinite: !0,
            fill: !0,
            dragFree: !1,
            prefix: "",
            classNames: {
                viewport: "carousel__viewport",
                track: "carousel__track",
                slide: "carousel__slide",
                slideSelected: "is-selected"
            },
            l10n: {
                NEXT: "Next slide",
                PREV: "Previous slide",
                GOTO: "Go to slide #%d"
            }
        };
        class y extends l {
            constructor(t, i = {}) {
                if (super(i = e(!0, {}, m, i)), this.state = "init", this.$container = t, !(this.$container instanceof HTMLElement)) throw new Error("No root element provided");
                this.slideNext = u(this.slideNext.bind(this), 250), this.slidePrev = u(this.slidePrev.bind(this), 250), 
                this.init(), t.__Carousel = this;
            }
            init() {
                this.pages = [], this.page = this.pageIndex = null, this.prevPage = this.prevPageIndex = null, 
                this.attachPlugins(y.Plugins), this.trigger("init"), this.initLayout(), this.initSlides(), 
                this.updateMetrics(), this.$track && this.pages.length && (this.$track.style.transform = `translate3d(${-1 * this.pages[this.page].left}px, 0px, 0) scale(1)`), 
                this.manageSlideVisiblity(), this.initPanzoom(), this.state = "ready", this.trigger("ready");
            }
            initLayout() {
                const t = this.option("prefix"), e = this.option("classNames");
                this.$viewport = this.option("viewport") || this.$container.querySelector(`.${t}${e.viewport}`), 
                this.$viewport || (this.$viewport = document.createElement("div"), this.$viewport.classList.add(...(t + e.viewport).split(" ")), 
                this.$viewport.append(...this.$container.childNodes), this.$container.appendChild(this.$viewport)), 
                this.$track = this.option("track") || this.$container.querySelector(`.${t}${e.track}`), 
                this.$track || (this.$track = document.createElement("div"), this.$track.classList.add(...(t + e.track).split(" ")), 
                this.$track.append(...this.$viewport.childNodes), this.$viewport.appendChild(this.$track));
            }
            initSlides() {
                this.slides = [];
                this.$viewport.querySelectorAll(`.${this.option("prefix")}${this.option("classNames.slide")}`).forEach((t => {
                    const e = {
                        $el: t,
                        isDom: !0
                    };
                    this.slides.push(e), this.trigger("createSlide", e, this.slides.length);
                })), Array.isArray(this.options.slides) && (this.slides = e(!0, [ ...this.slides ], this.options.slides));
            }
            updateMetrics() {
                let t, e = 0, s = [];
                this.slides.forEach(((i, o) => {
                    const n = i.$el, a = i.isDom || !t ? this.getSlideMetrics(n) : t;
                    i.index = o, i.width = a, i.left = e, t = a, e += a, s.push(o);
                }));
                let o = Math.max(this.$track.offsetWidth, i(this.$track.getBoundingClientRect().width)), n = getComputedStyle(this.$track);
                o -= parseFloat(n.paddingLeft) + parseFloat(n.paddingRight), this.contentWidth = e, 
                this.viewportWidth = o;
                const a = [], r = this.option("slidesPerPage");
                if (Number.isInteger(r) && e > o) for (let t = 0; t < this.slides.length; t += r) a.push({
                    indexes: s.slice(t, t + r),
                    slides: this.slides.slice(t, t + r)
                }); else {
                    let t = 0, e = 0;
                    for (let i = 0; i < this.slides.length; i += 1) {
                        let s = this.slides[i];
                        (!a.length || e + s.width > o) && (a.push({
                            indexes: [],
                            slides: []
                        }), t = a.length - 1, e = 0), e += s.width, a[t].indexes.push(i), a[t].slides.push(s);
                    }
                }
                const h = this.option("center"), l = this.option("fill");
                a.forEach(((t, i) => {
                    t.index = i, t.width = t.slides.reduce(((t, e) => t + e.width), 0), t.left = t.slides[0].left, 
                    h && (t.left += .5 * (o - t.width) * -1), l && !this.option("infiniteX", this.option("infinite")) && e > o && (t.left = Math.max(t.left, 0), 
                    t.left = Math.min(t.left, e - o));
                }));
                const c = [];
                let d;
                a.forEach((t => {
                    const e = {
                        ...t
                    };
                    d && e.left === d.left ? (d.width += e.width, d.slides = [ ...d.slides, ...e.slides ], 
                    d.indexes = [ ...d.indexes, ...e.indexes ]) : (e.index = c.length, d = e, c.push(e));
                })), this.pages = c;
                let u = this.page;
                if (null === u) {
                    const t = this.option("initialSlide");
                    u = null !== t ? this.findPageForSlide(t) : parseInt(this.option("initialPage", 0), 10) || 0, 
                    c[u] || (u = c.length && u > c.length ? c[c.length - 1].index : 0), this.page = u, 
                    this.pageIndex = u;
                }
                this.updatePanzoom(), this.trigger("refresh");
            }
            getSlideMetrics(t) {
                if (!t) {
                    const e = this.slides[0];
                    (t = document.createElement("div")).dataset.isTestEl = 1, t.style.visibility = "hidden", 
                    t.classList.add(...(this.option("prefix") + this.option("classNames.slide")).split(" ")), 
                    e.customClass && t.classList.add(...e.customClass.split(" ")), this.$track.prepend(t);
                }
                let e = Math.max(t.offsetWidth, i(t.getBoundingClientRect().width));
                const s = t.currentStyle || window.getComputedStyle(t);
                return e = e + (parseFloat(s.marginLeft) || 0) + (parseFloat(s.marginRight) || 0), 
                t.dataset.isTestEl && t.remove(), e;
            }
            findPageForSlide(t) {
                t = parseInt(t, 10) || 0;
                const e = this.pages.find((e => e.indexes.indexOf(t) > -1));
                return e ? e.index : null;
            }
            slideNext() {
                this.slideTo(this.pageIndex + 1);
            }
            slidePrev() {
                this.slideTo(this.pageIndex - 1);
            }
            slideTo(t, e = {}) {
                const {x: i = -1 * this.setPage(t, !0), y: s = 0, friction: o = this.option("friction")} = e;
                this.Panzoom.content.x === i && !this.Panzoom.velocity.x && o || (this.Panzoom.panTo({
                    x: i,
                    y: s,
                    friction: o,
                    ignoreBounds: !0
                }), "ready" === this.state && "ready" === this.Panzoom.state && this.trigger("settle"));
            }
            initPanzoom() {
                this.Panzoom && this.Panzoom.destroy();
                const t = e(!0, {}, {
                    content: this.$track,
                    wrapInner: !1,
                    resizeParent: !1,
                    zoom: !1,
                    click: !1,
                    lockAxis: "x",
                    x: this.pages.length ? -1 * this.pages[this.page].left : 0,
                    centerOnStart: !1,
                    textSelection: () => this.option("textSelection", !1),
                    panOnlyZoomed: function() {
                        return this.content.width <= this.viewport.width;
                    }
                }, this.option("Panzoom"));
                this.Panzoom = new d(this.$container, t), this.Panzoom.on({
                    "*": (t, ...e) => this.trigger(`Panzoom.${t}`, ...e),
                    afterUpdate: () => {
                        this.updatePage();
                    },
                    beforeTransform: this.onBeforeTransform.bind(this),
                    touchEnd: this.onTouchEnd.bind(this),
                    endAnimation: () => {
                        this.trigger("settle");
                    }
                }), this.updateMetrics(), this.manageSlideVisiblity();
            }
            updatePanzoom() {
                this.Panzoom && (this.Panzoom.content = {
                    ...this.Panzoom.content,
                    fitWidth: this.contentWidth,
                    origWidth: this.contentWidth,
                    width: this.contentWidth
                }, this.pages.length > 1 && this.option("infiniteX", this.option("infinite")) ? this.Panzoom.boundX = null : this.pages.length && (this.Panzoom.boundX = {
                    from: -1 * this.pages[this.pages.length - 1].left,
                    to: -1 * this.pages[0].left
                }), this.option("infiniteY", this.option("infinite")) ? this.Panzoom.boundY = null : this.Panzoom.boundY = {
                    from: 0,
                    to: 0
                }, this.Panzoom.handleCursor());
            }
            manageSlideVisiblity() {
                const t = this.contentWidth, e = this.viewportWidth;
                let i = this.Panzoom ? -1 * this.Panzoom.content.x : this.pages.length ? this.pages[this.page].left : 0;
                const s = this.option("preload"), o = this.option("infiniteX", this.option("infinite")), n = parseFloat(getComputedStyle(this.$viewport, null).getPropertyValue("padding-left")), a = parseFloat(getComputedStyle(this.$viewport, null).getPropertyValue("padding-right"));
                this.slides.forEach((r => {
                    let h, l, c = 0;
                    h = i - n, l = i + e + a, h -= s * (e + n + a), l += s * (e + n + a);
                    const d = r.left + r.width > h && r.left < l;
                    h = i + t - n, l = i + t + e + a, h -= s * (e + n + a);
                    const u = o && r.left + r.width > h && r.left < l;
                    h = i - t - n, l = i - t + e + a, h -= s * (e + n + a);
                    const f = o && r.left + r.width > h && r.left < l;
                    u || d || f ? (this.createSlideEl(r), d && (c = 0), u && (c = -1), f && (c = 1), 
                    r.left + r.width > i && r.left <= i + e + a && (c = 0)) : this.removeSlideEl(r), 
                    r.hasDiff = c;
                }));
                let r = 0, h = 0;
                this.slides.forEach(((e, i) => {
                    let s = 0;
                    e.$el ? (i !== r || e.hasDiff ? s = h + e.hasDiff * t : h = 0, e.$el.style.left = Math.abs(s) > .1 ? `${h + e.hasDiff * t}px` : "", 
                    r++) : h += e.width;
                })), this.markSelectedSlides();
            }
            createSlideEl(t) {
                if (!t) return;
                if (t.$el) {
                    let e = t.$el.dataset.index;
                    if (!e || parseInt(e, 10) !== t.index) {
                        let e;
                        t.$el.dataset.index = t.index, t.$el.querySelectorAll("[data-lazy-srcset]").forEach((t => {
                            t.srcset = t.dataset.lazySrcset;
                        })), t.$el.querySelectorAll("[data-lazy-src]").forEach((t => {
                            let e = t.dataset.lazySrc;
                            t instanceof HTMLImageElement ? t.src = e : t.style.backgroundImage = `url('${e}')`;
                        })), (e = t.$el.dataset.lazySrc) && (t.$el.style.backgroundImage = `url('${e}')`), 
                        t.state = "ready";
                    }
                    return;
                }
                const e = document.createElement("div");
                e.dataset.index = t.index, e.classList.add(...(this.option("prefix") + this.option("classNames.slide")).split(" ")), 
                t.customClass && e.classList.add(...t.customClass.split(" ")), t.html && (e.innerHTML = t.html);
                const i = [];
                this.slides.forEach(((t, e) => {
                    t.$el && i.push(e);
                }));
                const s = t.index;
                let o = null;
                if (i.length) {
                    let t = i.reduce(((t, e) => Math.abs(e - s) < Math.abs(t - s) ? e : t));
                    o = this.slides[t];
                }
                return this.$track.insertBefore(e, o && o.$el ? o.index < t.index ? o.$el.nextSibling : o.$el : null), 
                t.$el = e, this.trigger("createSlide", t, s), t;
            }
            removeSlideEl(t) {
                t.$el && !t.isDom && (this.trigger("removeSlide", t), t.$el.remove(), t.$el = null);
            }
            markSelectedSlides() {
                const t = this.option("classNames.slideSelected"), e = "aria-hidden";
                this.slides.forEach(((i, s) => {
                    const o = i.$el;
                    if (!o) return;
                    const n = this.pages[this.page];
                    n && n.indexes && n.indexes.indexOf(s) > -1 ? (t && !o.classList.contains(t) && (o.classList.add(t), 
                    this.trigger("selectSlide", i)), o.removeAttribute(e)) : (t && o.classList.contains(t) && (o.classList.remove(t), 
                    this.trigger("unselectSlide", i)), o.setAttribute(e, !0));
                }));
            }
            updatePage() {
                this.updateMetrics(), this.slideTo(this.page, {
                    friction: 0
                });
            }
            onBeforeTransform() {
                this.option("infiniteX", this.option("infinite")) && this.manageInfiniteTrack(), 
                this.manageSlideVisiblity();
            }
            manageInfiniteTrack() {
                const t = this.contentWidth, e = this.viewportWidth;
                if (!this.option("infiniteX", this.option("infinite")) || this.pages.length < 2 || t < e) return;
                const i = this.Panzoom;
                let s = !1;
                return i.content.x < -1 * (t - e) && (i.content.x += t, this.pageIndex = this.pageIndex - this.pages.length, 
                s = !0), i.content.x > e && (i.content.x -= t, this.pageIndex = this.pageIndex + this.pages.length, 
                s = !0), s && "pointerdown" === i.state && i.resetDragPosition(), s;
            }
            onTouchEnd(t, e) {
                const i = this.option("dragFree");
                if (!i && this.pages.length > 1 && t.dragOffset.time < 350 && Math.abs(t.dragOffset.y) < 1 && Math.abs(t.dragOffset.x) > 5) this[t.dragOffset.x < 0 ? "slideNext" : "slidePrev"](); else if (i) {
                    const [, e] = this.getPageFromPosition(-1 * t.transform.x);
                    this.setPage(e);
                } else this.slideToClosest();
            }
            slideToClosest(t = {}) {
                let [, e] = this.getPageFromPosition(-1 * this.Panzoom.content.x);
                this.slideTo(e, t);
            }
            getPageFromPosition(t) {
                const e = this.pages.length;
                this.option("center") && (t += .5 * this.viewportWidth);
                const i = Math.floor(t / this.contentWidth);
                t -= i * this.contentWidth;
                let s = this.slides.find((e => e.left <= t && e.left + e.width > t));
                if (s) {
                    let t = this.findPageForSlide(s.index);
                    return [ t, t + i * e ];
                }
                return [ 0, 0 ];
            }
            setPage(t, e) {
                let i = 0, s = parseInt(t, 10) || 0;
                const o = this.page, n = this.pageIndex, a = this.pages.length, r = this.contentWidth, h = this.viewportWidth;
                if (t = (s % a + a) % a, this.option("infiniteX", this.option("infinite")) && r > h) {
                    const o = Math.floor(s / a) || 0, n = r;
                    if (i = this.pages[t].left + o * n, !0 === e && a > 2) {
                        let t = -1 * this.Panzoom.content.x;
                        const e = i - n, o = i + n, r = Math.abs(t - i), h = Math.abs(t - e), l = Math.abs(t - o);
                        l < r && l <= h ? (i = o, s += a) : h < r && h < l && (i = e, s -= a);
                    }
                } else t = s = Math.max(0, Math.min(s, a - 1)), i = this.pages.length ? this.pages[t].left : 0;
                return this.page = t, this.pageIndex = s, null !== o && t !== o && (this.prevPage = o, 
                this.prevPageIndex = n, this.trigger("change", t, o)), i;
            }
            destroy() {
                this.state = "destroy", this.slides.forEach((t => {
                    this.removeSlideEl(t);
                })), this.slides = [], this.Panzoom.destroy(), this.detachPlugins();
            }
        }
        y.version = "4.0.31", y.Plugins = p;
        const v = !("undefined" == typeof window || !window.document || !window.document.createElement);
        let b = null;
        const x = [ "a[href]", "area[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "button:not([disabled]):not([aria-hidden])", "iframe", "object", "embed", "video", "audio", "[contenteditable]", '[tabindex]:not([tabindex^="-"]):not([disabled]):not([aria-hidden])' ], w = t => {
            if (t && v) {
                null === b && document.createElement("div").focus({
                    get preventScroll() {
                        return b = !0, !1;
                    }
                });
                try {
                    if (t.setActive) t.setActive(); else if (b) t.focus({
                        preventScroll: !0
                    }); else {
                        const e = window.pageXOffset || document.body.scrollTop, i = window.pageYOffset || document.body.scrollLeft;
                        t.focus(), document.body.scrollTo({
                            top: e,
                            left: i,
                            behavior: "auto"
                        });
                    }
                } catch (t) {}
            }
        };
        const $ = {
            minSlideCount: 2,
            minScreenHeight: 500,
            autoStart: !0,
            key: "t",
            Carousel: {},
            tpl: '<div class="fancybox__thumb" style="background-image:url(\'{{src}}\')"></div>'
        };
        class C {
            constructor(t) {
                this.fancybox = t, this.$container = null, this.state = "init";
                for (const t of [ "onPrepare", "onClosing", "onKeydown" ]) this[t] = this[t].bind(this);
                this.events = {
                    prepare: this.onPrepare,
                    closing: this.onClosing,
                    keydown: this.onKeydown
                };
            }
            onPrepare() {
                this.getSlides().length < this.fancybox.option("Thumbs.minSlideCount") ? this.state = "disabled" : !0 === this.fancybox.option("Thumbs.autoStart") && this.fancybox.Carousel.Panzoom.content.height >= this.fancybox.option("Thumbs.minScreenHeight") && this.build();
            }
            onClosing() {
                this.Carousel && this.Carousel.Panzoom.detachEvents();
            }
            onKeydown(t, e) {
                e === t.option("Thumbs.key") && this.toggle();
            }
            build() {
                if (this.$container) return;
                const t = document.createElement("div");
                t.classList.add("fancybox__thumbs"), this.fancybox.$carousel.parentNode.insertBefore(t, this.fancybox.$carousel.nextSibling), 
                this.Carousel = new y(t, e(!0, {
                    Dots: !1,
                    Navigation: !1,
                    Sync: {
                        friction: 0
                    },
                    infinite: !1,
                    center: !0,
                    fill: !0,
                    dragFree: !0,
                    slidesPerPage: 1,
                    preload: 1
                }, this.fancybox.option("Thumbs.Carousel"), {
                    Sync: {
                        target: this.fancybox.Carousel
                    },
                    slides: this.getSlides()
                })), this.Carousel.Panzoom.on("wheel", ((t, e) => {
                    e.preventDefault(), this.fancybox[e.deltaY < 0 ? "prev" : "next"]();
                })), this.$container = t, this.state = "visible";
            }
            getSlides() {
                const t = [];
                for (const e of this.fancybox.items) {
                    const i = e.thumb;
                    i && t.push({
                        html: this.fancybox.option("Thumbs.tpl").replace(/\{\{src\}\}/gi, i),
                        customClass: `has-thumb has-${e.type || "image"}`
                    });
                }
                return t;
            }
            toggle() {
                "visible" === this.state ? this.hide() : "hidden" === this.state ? this.show() : this.build();
            }
            show() {
                "hidden" === this.state && (this.$container.style.display = "", this.Carousel.Panzoom.attachEvents(), 
                this.state = "visible");
            }
            hide() {
                "visible" === this.state && (this.Carousel.Panzoom.detachEvents(), this.$container.style.display = "none", 
                this.state = "hidden");
            }
            cleanup() {
                this.Carousel && (this.Carousel.destroy(), this.Carousel = null), this.$container && (this.$container.remove(), 
                this.$container = null), this.state = "init";
            }
            attach() {
                this.fancybox.on(this.events);
            }
            detach() {
                this.fancybox.off(this.events), this.cleanup();
            }
        }
        C.defaults = $;
        const S = (t, e) => {
            const i = new URL(t), s = new URLSearchParams(i.search);
            let o = new URLSearchParams;
            for (const [t, i] of [ ...s, ...Object.entries(e) ]) "t" === t ? o.set("start", parseInt(i)) : o.set(t, i);
            o = o.toString();
            let n = t.match(/#t=((.*)?\d+s)/);
            return n && (o += `#t=${n[1]}`), o;
        }, E = {
            video: {
                autoplay: !0,
                ratio: 16 / 9
            },
            youtube: {
                autohide: 1,
                fs: 1,
                rel: 0,
                hd: 1,
                wmode: "transparent",
                enablejsapi: 1,
                html5: 1
            },
            vimeo: {
                hd: 1,
                show_title: 1,
                show_byline: 1,
                show_portrait: 0,
                fullscreen: 1
            },
            html5video: {
                tpl: '<video class="fancybox__html5video" playsinline controls controlsList="nodownload" poster="{{poster}}">\n  <source src="{{src}}" type="{{format}}" />Sorry, your browser doesn\'t support embedded videos.</video>',
                format: ""
            }
        };
        class P {
            constructor(t) {
                this.fancybox = t;
                for (const t of [ "onInit", "onReady", "onCreateSlide", "onRemoveSlide", "onSelectSlide", "onUnselectSlide", "onRefresh", "onMessage" ]) this[t] = this[t].bind(this);
                this.events = {
                    init: this.onInit,
                    ready: this.onReady,
                    "Carousel.createSlide": this.onCreateSlide,
                    "Carousel.removeSlide": this.onRemoveSlide,
                    "Carousel.selectSlide": this.onSelectSlide,
                    "Carousel.unselectSlide": this.onUnselectSlide,
                    "Carousel.refresh": this.onRefresh
                };
            }
            onInit() {
                for (const t of this.fancybox.items) this.processType(t);
            }
            processType(t) {
                if (t.html) return t.src = t.html, t.type = "html", void delete t.html;
                const i = t.src || "";
                let s = t.type || this.fancybox.options.type, o = null;
                if (!i || "string" == typeof i) {
                    if (o = i.match(/(?:youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(?:watch\?(?:.*&)?v=|v\/|u\/|embed\/?)?(videoseries\?list=(?:.*)|[\w-]{11}|\?listType=(?:.*)&list=(?:.*))(?:.*)/i)) {
                        const e = S(i, this.fancybox.option("Html.youtube")), n = encodeURIComponent(o[1]);
                        t.videoId = n, t.src = `https://www.youtube-nocookie.com/embed/${n}?${e}`, t.thumb = t.thumb || `https://i.ytimg.com/vi/${n}/mqdefault.jpg`, 
                        t.vendor = "youtube", s = "video";
                    } else if (o = i.match(/^.+vimeo.com\/(?:\/)?([\d]+)(.*)?/)) {
                        const e = S(i, this.fancybox.option("Html.vimeo")), n = encodeURIComponent(o[1]);
                        t.videoId = n, t.src = `https://player.vimeo.com/video/${n}?${e}`, t.vendor = "vimeo", 
                        s = "video";
                    } else (o = i.match(/(?:maps\.)?google\.([a-z]{2,3}(?:\.[a-z]{2})?)\/(?:(?:(?:maps\/(?:place\/(?:.*)\/)?\@(.*),(\d+.?\d+?)z))|(?:\?ll=))(.*)?/i)) ? (t.src = `//maps.google.${o[1]}/?ll=${(o[2] ? o[2] + "&z=" + Math.floor(o[3]) + (o[4] ? o[4].replace(/^\//, "&") : "") : o[4] + "").replace(/\?/, "&")}&output=${o[4] && o[4].indexOf("layer=c") > 0 ? "svembed" : "embed"}`, 
                    s = "map") : (o = i.match(/(?:maps\.)?google\.([a-z]{2,3}(?:\.[a-z]{2})?)\/(?:maps\/search\/)(.*)/i)) && (t.src = `//maps.google.${o[1]}/maps?q=${o[2].replace("query=", "q=").replace("api=1", "")}&output=embed`, 
                    s = "map");
                    s || ("#" === i.charAt(0) ? s = "inline" : (o = i.match(/\.(mp4|mov|ogv|webm)((\?|#).*)?$/i)) ? (s = "html5video", 
                    t.format = t.format || "video/" + ("ogv" === o[1] ? "ogg" : o[1])) : i.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i) ? s = "image" : i.match(/\.(pdf)((\?|#).*)?$/i) && (s = "pdf")), 
                    t.type = s || this.fancybox.option("defaultType", "image"), "html5video" !== s && "video" !== s || (t.video = e({}, this.fancybox.option("Html.video"), t.video), 
                    t._width && t._height ? t.ratio = parseFloat(t._width) / parseFloat(t._height) : t.ratio = t.ratio || t.video.ratio || E.video.ratio);
                }
            }
            onReady() {
                this.fancybox.Carousel.slides.forEach((t => {
                    t.$el && (this.setContent(t), t.index === this.fancybox.getSlide().index && this.playVideo(t));
                }));
            }
            onCreateSlide(t, e, i) {
                "ready" === this.fancybox.state && this.setContent(i);
            }
            loadInlineContent(t) {
                let e;
                if (t.src instanceof HTMLElement) e = t.src; else if ("string" == typeof t.src) {
                    const i = t.src.split("#", 2), s = 2 === i.length && "" === i[0] ? i[1] : i[0];
                    e = document.getElementById(s);
                }
                if (e) {
                    if ("clone" === t.type || e.$placeHolder) {
                        e = e.cloneNode(!0);
                        let i = e.getAttribute("id");
                        i = i ? `${i}--clone` : `clone-${this.fancybox.id}-${t.index}`, e.setAttribute("id", i);
                    } else {
                        const t = document.createElement("div");
                        t.classList.add("fancybox-placeholder"), e.parentNode.insertBefore(t, e), e.$placeHolder = t;
                    }
                    this.fancybox.setContent(t, e);
                } else this.fancybox.setError(t, "{{ELEMENT_NOT_FOUND}}");
            }
            loadAjaxContent(t) {
                const e = this.fancybox, i = new XMLHttpRequest;
                e.showLoading(t), i.onreadystatechange = function() {
                    i.readyState === XMLHttpRequest.DONE && "ready" === e.state && (e.hideLoading(t), 
                    200 === i.status ? e.setContent(t, i.responseText) : e.setError(t, 404 === i.status ? "{{AJAX_NOT_FOUND}}" : "{{AJAX_FORBIDDEN}}"));
                };
                const s = t.ajax || null;
                i.open(s ? "POST" : "GET", t.src), i.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), 
                i.setRequestHeader("X-Requested-With", "XMLHttpRequest"), i.send(s), t.xhr = i;
            }
            loadIframeContent(t) {
                const e = this.fancybox, i = document.createElement("iframe");
                if (i.className = "fancybox__iframe", i.setAttribute("id", `fancybox__iframe_${e.id}_${t.index}`), 
                i.setAttribute("allow", "autoplay; fullscreen"), i.setAttribute("scrolling", "auto"), 
                t.$iframe = i, "iframe" !== t.type || !1 === t.preload) return i.setAttribute("src", t.src), 
                this.fancybox.setContent(t, i), void this.resizeIframe(t);
                e.showLoading(t);
                const s = document.createElement("div");
                s.style.visibility = "hidden", this.fancybox.setContent(t, s), s.appendChild(i), 
                i.onerror = () => {
                    e.setError(t, "{{IFRAME_ERROR}}");
                }, i.onload = () => {
                    e.hideLoading(t);
                    let s = !1;
                    i.isReady || (i.isReady = !0, s = !0), i.src.length && (i.parentNode.style.visibility = "", 
                    this.resizeIframe(t), s && e.revealContent(t));
                }, i.setAttribute("src", t.src);
            }
            setAspectRatio(t) {
                const e = t.$content, i = t.ratio;
                if (!e) return;
                let s = t._width, o = t._height;
                if (i || s && o) {
                    Object.assign(e.style, {
                        width: s && o ? "100%" : "",
                        height: s && o ? "100%" : "",
                        maxWidth: "",
                        maxHeight: ""
                    });
                    let t = e.offsetWidth, n = e.offsetHeight;
                    if (s = s || t, o = o || n, s > t || o > n) {
                        let e = Math.min(t / s, n / o);
                        s *= e, o *= e;
                    }
                    Math.abs(s / o - i) > .01 && (i < s / o ? s = o * i : o = s / i), Object.assign(e.style, {
                        width: `${s}px`,
                        height: `${o}px`
                    });
                }
            }
            resizeIframe(t) {
                const e = t.$iframe;
                if (!e) return;
                let i = t._width || 0, s = t._height || 0;
                i && s && (t.autoSize = !1);
                const o = e.parentNode, n = o && o.style;
                if (!1 !== t.preload && !1 !== t.autoSize && n) try {
                    const t = window.getComputedStyle(o), a = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight), r = parseFloat(t.paddingTop) + parseFloat(t.paddingBottom), h = e.contentWindow.document, l = h.getElementsByTagName("html")[0], c = h.body;
                    n.width = "", c.style.overflow = "hidden", i = i || l.scrollWidth + a, n.width = `${i}px`, 
                    c.style.overflow = "", n.flex = "0 0 auto", n.height = `${c.scrollHeight}px`, s = l.scrollHeight + r;
                } catch (t) {}
                if (i || s) {
                    const t = {
                        flex: "0 1 auto"
                    };
                    i && (t.width = `${i}px`), s && (t.height = `${s}px`), Object.assign(n, t);
                }
            }
            onRefresh(t, e) {
                e.slides.forEach((t => {
                    t.$el && (t.$iframe && this.resizeIframe(t), t.ratio && this.setAspectRatio(t));
                }));
            }
            setContent(t) {
                if (t && !t.isDom) {
                    switch (t.type) {
                      case "html":
                        this.fancybox.setContent(t, t.src);
                        break;

                      case "html5video":
                        this.fancybox.setContent(t, this.fancybox.option("Html.html5video.tpl").replace(/\{\{src\}\}/gi, t.src).replace("{{format}}", t.format || t.html5video && t.html5video.format || "").replace("{{poster}}", t.poster || t.thumb || ""));
                        break;

                      case "inline":
                      case "clone":
                        this.loadInlineContent(t);
                        break;

                      case "ajax":
                        this.loadAjaxContent(t);
                        break;

                      case "pdf":
                      case "video":
                      case "map":
                        t.preload = !1;

                      case "iframe":
                        this.loadIframeContent(t);
                    }
                    t.ratio && this.setAspectRatio(t);
                }
            }
            onSelectSlide(t, e, i) {
                "ready" === t.state && this.playVideo(i);
            }
            playVideo(t) {
                if ("html5video" === t.type && t.video.autoplay) try {
                    const e = t.$el.querySelector("video");
                    if (e) {
                        const t = e.play();
                        void 0 !== t && t.then((() => {})).catch((t => {
                            e.muted = !0, e.play();
                        }));
                    }
                } catch (t) {}
                if ("video" !== t.type || !t.$iframe || !t.$iframe.contentWindow) return;
                const e = () => {
                    if ("done" === t.state && t.$iframe && t.$iframe.contentWindow) {
                        let e;
                        if (t.$iframe.isReady) return t.video && t.video.autoplay && (e = "youtube" == t.vendor ? {
                            event: "command",
                            func: "playVideo"
                        } : {
                            method: "play",
                            value: "true"
                        }), void (e && t.$iframe.contentWindow.postMessage(JSON.stringify(e), "*"));
                        "youtube" === t.vendor && (e = {
                            event: "listening",
                            id: t.$iframe.getAttribute("id")
                        }, t.$iframe.contentWindow.postMessage(JSON.stringify(e), "*"));
                    }
                    t.poller = setTimeout(e, 250);
                };
                e();
            }
            onUnselectSlide(t, e, i) {
                if ("html5video" === i.type) {
                    try {
                        i.$el.querySelector("video").pause();
                    } catch (t) {}
                    return;
                }
                let s = !1;
                "vimeo" == i.vendor ? s = {
                    method: "pause",
                    value: "true"
                } : "youtube" === i.vendor && (s = {
                    event: "command",
                    func: "pauseVideo"
                }), s && i.$iframe && i.$iframe.contentWindow && i.$iframe.contentWindow.postMessage(JSON.stringify(s), "*"), 
                clearTimeout(i.poller);
            }
            onRemoveSlide(t, e, i) {
                i.xhr && (i.xhr.abort(), i.xhr = null), i.$iframe && (i.$iframe.onload = i.$iframe.onerror = null, 
                i.$iframe.src = "//about:blank", i.$iframe = null);
                const s = i.$content;
                "inline" === i.type && s && (s.classList.remove("fancybox__content"), "none" !== s.style.display && (s.style.display = "none")), 
                i.$closeButton && (i.$closeButton.remove(), i.$closeButton = null);
                const o = s && s.$placeHolder;
                o && (o.parentNode.insertBefore(s, o), o.remove(), s.$placeHolder = null);
            }
            onMessage(t) {
                try {
                    let e = JSON.parse(t.data);
                    if ("https://player.vimeo.com" === t.origin) {
                        if ("ready" === e.event) for (let e of document.getElementsByClassName("fancybox__iframe")) e.contentWindow === t.source && (e.isReady = 1);
                    } else "https://www.youtube-nocookie.com" === t.origin && "onReady" === e.event && (document.getElementById(e.id).isReady = 1);
                } catch (t) {}
            }
            attach() {
                this.fancybox.on(this.events), window.addEventListener("message", this.onMessage, !1);
            }
            detach() {
                this.fancybox.off(this.events), window.removeEventListener("message", this.onMessage, !1);
            }
        }
        P.defaults = E;
        class T {
            constructor(t) {
                this.fancybox = t;
                for (const t of [ "onReady", "onClosing", "onDone", "onPageChange", "onCreateSlide", "onRemoveSlide", "onImageStatusChange" ]) this[t] = this[t].bind(this);
                this.events = {
                    ready: this.onReady,
                    closing: this.onClosing,
                    done: this.onDone,
                    "Carousel.change": this.onPageChange,
                    "Carousel.createSlide": this.onCreateSlide,
                    "Carousel.removeSlide": this.onRemoveSlide
                };
            }
            onReady() {
                this.fancybox.Carousel.slides.forEach((t => {
                    t.$el && this.setContent(t);
                }));
            }
            onDone(t, e) {
                this.handleCursor(e);
            }
            onClosing(t) {
                clearTimeout(this.clickTimer), this.clickTimer = null, t.Carousel.slides.forEach((t => {
                    t.$image && (t.state = "destroy"), t.Panzoom && t.Panzoom.detachEvents();
                })), "closing" === this.fancybox.state && this.canZoom(t.getSlide()) && this.zoomOut();
            }
            onCreateSlide(t, e, i) {
                "ready" === this.fancybox.state && this.setContent(i);
            }
            onRemoveSlide(t, e, i) {
                i.$image && (i.$el.classList.remove(t.option("Image.canZoomInClass")), i.$image.remove(), 
                i.$image = null), i.Panzoom && (i.Panzoom.destroy(), i.Panzoom = null), i.$el && i.$el.dataset && delete i.$el.dataset.imageFit;
            }
            setContent(t) {
                if (t.isDom || t.html || t.type && "image" !== t.type) return;
                if (t.$image) return;
                t.type = "image", t.state = "loading";
                const e = document.createElement("div");
                e.style.visibility = "hidden";
                const i = document.createElement("img");
                i.addEventListener("load", (e => {
                    e.stopImmediatePropagation(), this.onImageStatusChange(t);
                })), i.addEventListener("error", (() => {
                    this.onImageStatusChange(t);
                })), i.src = t.src, i.alt = "", i.draggable = !1, i.classList.add("fancybox__image"), 
                t.srcset && i.setAttribute("srcset", t.srcset), t.sizes && i.setAttribute("sizes", t.sizes), 
                t.$image = i;
                const s = this.fancybox.option("Image.wrap");
                if (s) {
                    const o = document.createElement("div");
                    o.classList.add("string" == typeof s ? s : "fancybox__image-wrap"), o.appendChild(i), 
                    e.appendChild(o), t.$wrap = o;
                } else e.appendChild(i);
                t.$el.dataset.imageFit = this.fancybox.option("Image.fit"), this.fancybox.setContent(t, e), 
                i.complete || i.error ? this.onImageStatusChange(t) : this.fancybox.showLoading(t);
            }
            onImageStatusChange(t) {
                const e = t.$image;
                e && "loading" === t.state && (e.complete && e.naturalWidth && e.naturalHeight ? (this.fancybox.hideLoading(t), 
                "contain" === this.fancybox.option("Image.fit") && this.initSlidePanzoom(t), t.$el.addEventListener("wheel", (e => this.onWheel(t, e)), {
                    passive: !1
                }), t.$content.addEventListener("click", (e => this.onClick(t, e)), {
                    passive: !1
                }), this.revealContent(t)) : this.fancybox.setError(t, "{{IMAGE_ERROR}}"));
            }
            initSlidePanzoom(t) {
                t.Panzoom || (t.Panzoom = new d(t.$el, e(!0, this.fancybox.option("Image.Panzoom", {}), {
                    viewport: t.$wrap,
                    content: t.$image,
                    width: t._width,
                    height: t._height,
                    wrapInner: !1,
                    textSelection: !0,
                    touch: this.fancybox.option("Image.touch"),
                    panOnlyZoomed: !0,
                    click: !1,
                    wheel: !1
                })), t.Panzoom.on("startAnimation", (() => {
                    this.fancybox.trigger("Image.startAnimation", t);
                })), t.Panzoom.on("endAnimation", (() => {
                    "zoomIn" === t.state && this.fancybox.done(t), this.handleCursor(t), this.fancybox.trigger("Image.endAnimation", t);
                })), t.Panzoom.on("afterUpdate", (() => {
                    this.handleCursor(t), this.fancybox.trigger("Image.afterUpdate", t);
                })));
            }
            revealContent(t) {
                null === this.fancybox.Carousel.prevPage && t.index === this.fancybox.options.startIndex && this.canZoom(t) ? this.zoomIn() : this.fancybox.revealContent(t);
            }
            getZoomInfo(t) {
                const e = t.$thumb.getBoundingClientRect(), i = e.width, s = e.height, o = t.$content.getBoundingClientRect(), n = o.width, a = o.height, r = o.top - e.top, h = o.left - e.left;
                let l = this.fancybox.option("Image.zoomOpacity");
                return "auto" === l && (l = Math.abs(i / s - n / a) > .1), {
                    top: r,
                    left: h,
                    scale: n && i ? i / n : 1,
                    opacity: l
                };
            }
            canZoom(t) {
                const e = this.fancybox, i = e.$container;
                if (window.visualViewport && 1 !== window.visualViewport.scale) return !1;
                if (t.Panzoom && !t.Panzoom.content.width) return !1;
                if (!e.option("Image.zoom") || "contain" !== e.option("Image.fit")) return !1;
                const s = t.$thumb;
                if (!s || "loading" === t.state) return !1;
                i.classList.add("fancybox__no-click");
                const o = s.getBoundingClientRect();
                let n;
                if (this.fancybox.option("Image.ignoreCoveredThumbnail")) {
                    const t = document.elementFromPoint(o.left + 1, o.top + 1) === s, e = document.elementFromPoint(o.right - 1, o.bottom - 1) === s;
                    n = t && e;
                } else n = document.elementFromPoint(o.left + .5 * o.width, o.top + .5 * o.height) === s;
                return i.classList.remove("fancybox__no-click"), n;
            }
            zoomIn() {
                const t = this.fancybox, e = t.getSlide(), i = e.Panzoom, {top: s, left: o, scale: n, opacity: a} = this.getZoomInfo(e);
                t.trigger("reveal", e), i.panTo({
                    x: -1 * o,
                    y: -1 * s,
                    scale: n,
                    friction: 0,
                    ignoreBounds: !0
                }), e.$content.style.visibility = "", e.state = "zoomIn", !0 === a && i.on("afterTransform", (t => {
                    "zoomIn" !== e.state && "zoomOut" !== e.state || (t.$content.style.opacity = Math.min(1, 1 - (1 - t.content.scale) / (1 - n)));
                })), i.panTo({
                    x: 0,
                    y: 0,
                    scale: 1,
                    friction: this.fancybox.option("Image.zoomFriction")
                });
            }
            zoomOut() {
                const t = this.fancybox, e = t.getSlide(), i = e.Panzoom;
                if (!i) return;
                e.state = "zoomOut", t.state = "customClosing", e.$caption && (e.$caption.style.visibility = "hidden");
                let s = this.fancybox.option("Image.zoomFriction");
                const o = t => {
                    const {top: o, left: n, scale: a, opacity: r} = this.getZoomInfo(e);
                    t || r || (s *= .82), i.panTo({
                        x: -1 * n,
                        y: -1 * o,
                        scale: a,
                        friction: s,
                        ignoreBounds: !0
                    }), s *= .98;
                };
                window.addEventListener("scroll", o), i.once("endAnimation", (() => {
                    window.removeEventListener("scroll", o), t.destroy();
                })), o();
            }
            handleCursor(t) {
                if ("image" !== t.type || !t.$el) return;
                const e = t.Panzoom, i = this.fancybox.option("Image.click", !1, t), s = this.fancybox.option("Image.touch"), o = t.$el.classList, n = this.fancybox.option("Image.canZoomInClass"), a = this.fancybox.option("Image.canZoomOutClass");
                if (o.remove(a), o.remove(n), e && "toggleZoom" === i) e && 1 === e.content.scale && e.option("maxScale") - e.content.scale > .01 ? o.add(n) : e.content.scale > 1 && !s && o.add(a); else "close" === i && o.add(a);
            }
            onWheel(t, e) {
                if ("ready" === this.fancybox.state && !1 !== this.fancybox.trigger("Image.wheel", e)) switch (this.fancybox.option("Image.wheel")) {
                  case "zoom":
                    "done" === t.state && t.Panzoom && t.Panzoom.zoomWithWheel(e);
                    break;

                  case "close":
                    this.fancybox.close();
                    break;

                  case "slide":
                    this.fancybox[e.deltaY < 0 ? "prev" : "next"]();
                }
            }
            onClick(t, e) {
                if ("ready" !== this.fancybox.state) return;
                const i = t.Panzoom;
                if (i && (i.dragPosition.midPoint || 0 !== i.dragOffset.x || 0 !== i.dragOffset.y || 1 !== i.dragOffset.scale)) return;
                if (this.fancybox.Carousel.Panzoom.lockAxis) return !1;
                const s = i => {
                    switch (i) {
                      case "toggleZoom":
                        e.stopPropagation(), t.Panzoom && t.Panzoom.zoomWithClick(e);
                        break;

                      case "close":
                        this.fancybox.close();
                        break;

                      case "next":
                        e.stopPropagation(), this.fancybox.next();
                    }
                }, o = this.fancybox.option("Image.click"), n = this.fancybox.option("Image.doubleClick");
                n ? this.clickTimer ? (clearTimeout(this.clickTimer), this.clickTimer = null, s(n)) : this.clickTimer = setTimeout((() => {
                    this.clickTimer = null, s(o);
                }), 300) : s(o);
            }
            onPageChange(t, e) {
                const i = t.getSlide();
                e.slides.forEach((t => {
                    t.Panzoom && "done" === t.state && t.index !== i.index && t.Panzoom.panTo({
                        x: 0,
                        y: 0,
                        scale: 1,
                        friction: .8
                    });
                }));
            }
            attach() {
                this.fancybox.on(this.events);
            }
            detach() {
                this.fancybox.off(this.events);
            }
        }
        T.defaults = {
            canZoomInClass: "can-zoom_in",
            canZoomOutClass: "can-zoom_out",
            zoom: !0,
            zoomOpacity: "auto",
            zoomFriction: .82,
            ignoreCoveredThumbnail: !1,
            touch: !0,
            click: "toggleZoom",
            doubleClick: null,
            wheel: "zoom",
            fit: "contain",
            wrap: !1,
            Panzoom: {
                ratio: 1
            }
        };
        class L {
            constructor(t) {
                this.fancybox = t;
                for (const t of [ "onChange", "onClosing" ]) this[t] = this[t].bind(this);
                this.events = {
                    initCarousel: this.onChange,
                    "Carousel.change": this.onChange,
                    closing: this.onClosing
                }, this.hasCreatedHistory = !1, this.origHash = "", this.timer = null;
            }
            onChange(t) {
                const e = t.Carousel;
                this.timer && clearTimeout(this.timer);
                const i = null === e.prevPage, s = t.getSlide(), o = new URL(document.URL).hash;
                let n = !1;
                if (s.slug) n = "#" + s.slug; else {
                    const i = s.$trigger && s.$trigger.dataset, o = t.option("slug") || i && i.fancybox;
                    o && o.length && "true" !== o && (n = "#" + o + (e.slides.length > 1 ? "-" + (s.index + 1) : ""));
                }
                i && (this.origHash = o !== n ? o : ""), n && o !== n && (this.timer = setTimeout((() => {
                    try {
                        window.history[i ? "pushState" : "replaceState"]({}, document.title, window.location.pathname + window.location.search + n), 
                        i && (this.hasCreatedHistory = !0);
                    } catch (t) {}
                }), 300));
            }
            onClosing() {
                if (this.timer && clearTimeout(this.timer), !0 !== this.hasSilentClose) try {
                    return void window.history.replaceState({}, document.title, window.location.pathname + window.location.search + (this.origHash || ""));
                } catch (t) {}
            }
            attach(t) {
                t.on(this.events);
            }
            detach(t) {
                t.off(this.events);
            }
            static startFromUrl() {
                const t = L.Fancybox;
                if (!t || t.getInstance() || !1 === t.defaults.Hash) return;
                const {hash: e, slug: i, index: s} = L.getParsedURL();
                if (!i) return;
                let o = document.querySelector(`[data-slug="${e}"]`);
                if (o && o.dispatchEvent(new CustomEvent("click", {
                    bubbles: !0,
                    cancelable: !0
                })), t.getInstance()) return;
                const n = document.querySelectorAll(`[data-fancybox="${i}"]`);
                n.length && (null === s && 1 === n.length ? o = n[0] : s && (o = n[s - 1]), o && o.dispatchEvent(new CustomEvent("click", {
                    bubbles: !0,
                    cancelable: !0
                })));
            }
            static onHashChange() {
                const {slug: t, index: e} = L.getParsedURL(), i = L.Fancybox, s = i && i.getInstance();
                if (s && s.plugins.Hash) {
                    if (t) {
                        const i = s.Carousel;
                        if (t === s.option("slug")) return i.slideTo(e - 1);
                        for (let e of i.slides) if (e.slug && e.slug === t) return i.slideTo(e.index);
                        const o = s.getSlide(), n = o.$trigger && o.$trigger.dataset;
                        if (n && n.fancybox === t) return i.slideTo(e - 1);
                    }
                    s.plugins.Hash.hasSilentClose = !0, s.close();
                }
                L.startFromUrl();
            }
            static create(t) {
                function e() {
                    window.addEventListener("hashchange", L.onHashChange, !1), L.startFromUrl();
                }
                L.Fancybox = t, v && window.requestAnimationFrame((() => {
                    /complete|interactive|loaded/.test(document.readyState) ? e() : document.addEventListener("DOMContentLoaded", e);
                }));
            }
            static destroy() {
                window.removeEventListener("hashchange", L.onHashChange, !1);
            }
            static getParsedURL() {
                const t = window.location.hash.substr(1), e = t.split("-"), i = e.length > 1 && /^\+?\d+$/.test(e[e.length - 1]) && parseInt(e.pop(-1), 10) || null;
                return {
                    hash: t,
                    slug: e.join("-"),
                    index: i
                };
            }
        }
        const _ = {
            pageXOffset: 0,
            pageYOffset: 0,
            element: () => document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement,
            activate(t) {
                _.pageXOffset = window.pageXOffset, _.pageYOffset = window.pageYOffset, t.requestFullscreen ? t.requestFullscreen() : t.mozRequestFullScreen ? t.mozRequestFullScreen() : t.webkitRequestFullscreen ? t.webkitRequestFullscreen() : t.msRequestFullscreen && t.msRequestFullscreen();
            },
            deactivate() {
                document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitExitFullscreen && document.webkitExitFullscreen();
            }
        };
        class A {
            constructor(t) {
                this.fancybox = t, this.active = !1, this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
            }
            isActive() {
                return this.active;
            }
            setTimer() {
                if (!this.active || this.timer) return;
                const t = this.fancybox.option("slideshow.delay", 3e3);
                this.timer = setTimeout((() => {
                    this.timer = null, this.fancybox.option("infinite") || this.fancybox.getSlide().index !== this.fancybox.Carousel.slides.length - 1 ? this.fancybox.next() : this.fancybox.jumpTo(0, {
                        friction: 0
                    });
                }), t);
                let e = this.$progress;
                e || (e = document.createElement("div"), e.classList.add("fancybox__progress"), 
                this.fancybox.$carousel.parentNode.insertBefore(e, this.fancybox.$carousel), this.$progress = e, 
                e.offsetHeight), e.style.transitionDuration = `${t}ms`, e.style.transform = "scaleX(1)";
            }
            clearTimer() {
                clearTimeout(this.timer), this.timer = null, this.$progress && (this.$progress.style.transitionDuration = "", 
                this.$progress.style.transform = "", this.$progress.offsetHeight);
            }
            activate() {
                this.active || (this.active = !0, this.fancybox.$container.classList.add("has-slideshow"), 
                "done" === this.fancybox.getSlide().state && this.setTimer(), document.addEventListener("visibilitychange", this.handleVisibilityChange, !1));
            }
            handleVisibilityChange() {
                this.deactivate();
            }
            deactivate() {
                this.active = !1, this.clearTimer(), this.fancybox.$container.classList.remove("has-slideshow"), 
                document.removeEventListener("visibilitychange", this.handleVisibilityChange, !1);
            }
            toggle() {
                this.active ? this.deactivate() : this.fancybox.Carousel.slides.length > 1 && this.activate();
            }
        }
        const z = {
            display: [ "counter", "zoom", "slideshow", "fullscreen", "thumbs", "close" ],
            autoEnable: !0,
            items: {
                counter: {
                    position: "left",
                    type: "div",
                    class: "fancybox__counter",
                    html: '<span data-fancybox-index=""></span>&nbsp;/&nbsp;<span data-fancybox-count=""></span>',
                    attr: {
                        tabindex: -1
                    }
                },
                prev: {
                    type: "button",
                    class: "fancybox__button--prev",
                    label: "PREV",
                    html: '<svg viewBox="0 0 24 24"><path d="M15 4l-8 8 8 8"/></svg>',
                    attr: {
                        "data-fancybox-prev": ""
                    }
                },
                next: {
                    type: "button",
                    class: "fancybox__button--next",
                    label: "NEXT",
                    html: '<svg viewBox="0 0 24 24"><path d="M8 4l8 8-8 8"/></svg>',
                    attr: {
                        "data-fancybox-next": ""
                    }
                },
                fullscreen: {
                    type: "button",
                    class: "fancybox__button--fullscreen",
                    label: "TOGGLE_FULLSCREEN",
                    html: '<svg viewBox="0 0 24 24">\n                <g><path d="M3 8 V3h5"></path><path d="M21 8V3h-5"></path><path d="M8 21H3v-5"></path><path d="M16 21h5v-5"></path></g>\n                <g><path d="M7 2v5H2M17 2v5h5M2 17h5v5M22 17h-5v5"/></g>\n            </svg>',
                    click: function(t) {
                        t.preventDefault(), _.element() ? _.deactivate() : _.activate(this.fancybox.$container);
                    }
                },
                slideshow: {
                    type: "button",
                    class: "fancybox__button--slideshow",
                    label: "TOGGLE_SLIDESHOW",
                    html: '<svg viewBox="0 0 24 24">\n                <g><path d="M6 4v16"/><path d="M20 12L6 20"/><path d="M20 12L6 4"/></g>\n                <g><path d="M7 4v15M17 4v15"/></g>\n            </svg>',
                    click: function(t) {
                        t.preventDefault(), this.Slideshow.toggle();
                    }
                },
                zoom: {
                    type: "button",
                    class: "fancybox__button--zoom",
                    label: "TOGGLE_ZOOM",
                    html: '<svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="7"></circle><path d="M16 16 L21 21"></svg>',
                    click: function(t) {
                        t.preventDefault();
                        const e = this.fancybox.getSlide().Panzoom;
                        e && e.toggleZoom();
                    }
                },
                download: {
                    type: "link",
                    label: "DOWNLOAD",
                    class: "fancybox__button--download",
                    html: '<svg viewBox="0 0 24 24"><path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.62 2.48A2 2 0 004.56 21h14.88a2 2 0 001.94-1.51L22 17"/></svg>',
                    click: function(t) {
                        t.stopPropagation();
                    }
                },
                thumbs: {
                    type: "button",
                    label: "TOGGLE_THUMBS",
                    class: "fancybox__button--thumbs",
                    html: '<svg viewBox="0 0 24 24"><circle cx="4" cy="4" r="1" /><circle cx="12" cy="4" r="1" transform="rotate(90 12 4)"/><circle cx="20" cy="4" r="1" transform="rotate(90 20 4)"/><circle cx="4" cy="12" r="1" transform="rotate(90 4 12)"/><circle cx="12" cy="12" r="1" transform="rotate(90 12 12)"/><circle cx="20" cy="12" r="1" transform="rotate(90 20 12)"/><circle cx="4" cy="20" r="1" transform="rotate(90 4 20)"/><circle cx="12" cy="20" r="1" transform="rotate(90 12 20)"/><circle cx="20" cy="20" r="1" transform="rotate(90 20 20)"/></svg>',
                    click: function(t) {
                        t.stopPropagation();
                        const e = this.fancybox.plugins.Thumbs;
                        e && e.toggle();
                    }
                },
                close: {
                    type: "button",
                    label: "CLOSE",
                    class: "fancybox__button--close",
                    html: '<svg viewBox="0 0 24 24"><path d="M20 20L4 4m16 0L4 20"></path></svg>',
                    attr: {
                        "data-fancybox-close": "",
                        tabindex: 0
                    }
                }
            }
        };
        class k {
            constructor(t) {
                this.fancybox = t, this.$container = null, this.state = "init";
                for (const t of [ "onInit", "onPrepare", "onDone", "onKeydown", "onClosing", "onChange", "onSettle", "onRefresh" ]) this[t] = this[t].bind(this);
                this.events = {
                    init: this.onInit,
                    prepare: this.onPrepare,
                    done: this.onDone,
                    keydown: this.onKeydown,
                    closing: this.onClosing,
                    "Carousel.change": this.onChange,
                    "Carousel.settle": this.onSettle,
                    "Carousel.Panzoom.touchStart": () => this.onRefresh(),
                    "Image.startAnimation": (t, e) => this.onRefresh(e),
                    "Image.afterUpdate": (t, e) => this.onRefresh(e)
                };
            }
            onInit() {
                if (this.fancybox.option("Toolbar.autoEnable")) {
                    let t = !1;
                    for (const e of this.fancybox.items) if ("image" === e.type) {
                        t = !0;
                        break;
                    }
                    if (!t) return void (this.state = "disabled");
                }
                for (const e of this.fancybox.option("Toolbar.display")) if ("close" === (t(e) ? e.id : e)) {
                    this.fancybox.options.closeButton = !1;
                    break;
                }
            }
            onPrepare() {
                const t = this.fancybox;
                if ("init" === this.state && (this.build(), this.update(), this.Slideshow = new A(t), 
                !t.Carousel.prevPage && (t.option("slideshow.autoStart") && this.Slideshow.activate(), 
                t.option("fullscreen.autoStart") && !_.element()))) try {
                    _.activate(t.$container);
                } catch (t) {}
            }
            onFsChange() {
                window.scrollTo(_.pageXOffset, _.pageYOffset);
            }
            onSettle() {
                const t = this.fancybox, e = this.Slideshow;
                e && e.isActive() && (t.getSlide().index !== t.Carousel.slides.length - 1 || t.option("infinite") ? "done" === t.getSlide().state && e.setTimer() : e.deactivate());
            }
            onChange() {
                this.update(), this.Slideshow && this.Slideshow.isActive() && this.Slideshow.clearTimer();
            }
            onDone(t, e) {
                const i = this.Slideshow;
                e.index === t.getSlide().index && (this.update(), i && i.isActive() && (t.option("infinite") || e.index !== t.Carousel.slides.length - 1 ? i.setTimer() : i.deactivate()));
            }
            onRefresh(t) {
                t && t.index !== this.fancybox.getSlide().index || (this.update(), !this.Slideshow || !this.Slideshow.isActive() || t && "done" !== t.state || this.Slideshow.deactivate());
            }
            onKeydown(t, e, i) {
                " " === e && this.Slideshow && (this.Slideshow.toggle(), i.preventDefault());
            }
            onClosing() {
                this.Slideshow && this.Slideshow.deactivate(), document.removeEventListener("fullscreenchange", this.onFsChange);
            }
            createElement(t) {
                let e;
                "div" === t.type ? e = document.createElement("div") : (e = document.createElement("link" === t.type ? "a" : "button"), 
                e.classList.add("carousel__button")), e.innerHTML = t.html, e.setAttribute("tabindex", t.tabindex || 0), 
                t.class && e.classList.add(...t.class.split(" "));
                for (const i in t.attr) e.setAttribute(i, t.attr[i]);
                t.label && e.setAttribute("title", this.fancybox.localize(`{{${t.label}}}`)), t.click && e.addEventListener("click", t.click.bind(this)), 
                "prev" === t.id && e.setAttribute("data-fancybox-prev", ""), "next" === t.id && e.setAttribute("data-fancybox-next", "");
                const i = e.querySelector("svg");
                return i && (i.setAttribute("role", "img"), i.setAttribute("tabindex", "-1"), i.setAttribute("xmlns", "http://www.w3.org/2000/svg")), 
                e;
            }
            build() {
                this.cleanup();
                const i = this.fancybox.option("Toolbar.items"), s = [ {
                    position: "left",
                    items: []
                }, {
                    position: "center",
                    items: []
                }, {
                    position: "right",
                    items: []
                } ], o = this.fancybox.plugins.Thumbs;
                for (const n of this.fancybox.option("Toolbar.display")) {
                    let a, r;
                    if (t(n) ? (a = n.id, r = e({}, i[a], n)) : (a = n, r = i[a]), [ "counter", "next", "prev", "slideshow" ].includes(a) && this.fancybox.items.length < 2) continue;
                    if ("fullscreen" === a) {
                        if (!document.fullscreenEnabled || window.fullScreen) continue;
                        document.addEventListener("fullscreenchange", this.onFsChange);
                    }
                    if ("thumbs" === a && (!o || "disabled" === o.state)) continue;
                    if (!r) continue;
                    let h = r.position || "right", l = s.find((t => t.position === h));
                    l && l.items.push(r);
                }
                const n = document.createElement("div");
                n.classList.add("fancybox__toolbar");
                for (const t of s) if (t.items.length) {
                    const e = document.createElement("div");
                    e.classList.add("fancybox__toolbar__items"), e.classList.add(`fancybox__toolbar__items--${t.position}`);
                    for (const i of t.items) e.appendChild(this.createElement(i));
                    n.appendChild(e);
                }
                this.fancybox.$carousel.parentNode.insertBefore(n, this.fancybox.$carousel), this.$container = n;
            }
            update() {
                const t = this.fancybox.getSlide(), e = t.index, i = this.fancybox.items.length, s = t.downloadSrc || ("image" !== t.type || t.error ? null : t.src);
                for (const t of this.fancybox.$container.querySelectorAll("a.fancybox__button--download")) s ? (t.removeAttribute("disabled"), 
                t.removeAttribute("tabindex"), t.setAttribute("href", s), t.setAttribute("download", s), 
                t.setAttribute("target", "_blank")) : (t.setAttribute("disabled", ""), t.setAttribute("tabindex", -1), 
                t.removeAttribute("href"), t.removeAttribute("download"));
                const o = t.Panzoom, n = o && o.option("maxScale") > o.option("baseScale");
                for (const t of this.fancybox.$container.querySelectorAll(".fancybox__button--zoom")) n ? t.removeAttribute("disabled") : t.setAttribute("disabled", "");
                for (const e of this.fancybox.$container.querySelectorAll("[data-fancybox-index]")) e.innerHTML = t.index + 1;
                for (const t of this.fancybox.$container.querySelectorAll("[data-fancybox-count]")) t.innerHTML = i;
                if (!this.fancybox.option("infinite")) {
                    for (const t of this.fancybox.$container.querySelectorAll("[data-fancybox-prev]")) 0 === e ? t.setAttribute("disabled", "") : t.removeAttribute("disabled");
                    for (const t of this.fancybox.$container.querySelectorAll("[data-fancybox-next]")) e === i - 1 ? t.setAttribute("disabled", "") : t.removeAttribute("disabled");
                }
            }
            cleanup() {
                this.Slideshow && this.Slideshow.isActive() && this.Slideshow.clearTimer(), this.$container && this.$container.remove(), 
                this.$container = null;
            }
            attach() {
                this.fancybox.on(this.events);
            }
            detach() {
                this.fancybox.off(this.events), this.cleanup();
            }
        }
        k.defaults = z;
        const O = {
            ScrollLock: class {
                constructor(t) {
                    this.fancybox = t, this.viewport = null, this.pendingUpdate = null;
                    for (const t of [ "onReady", "onResize", "onTouchstart", "onTouchmove" ]) this[t] = this[t].bind(this);
                }
                onReady() {
                    const t = window.visualViewport;
                    t && (this.viewport = t, this.startY = 0, t.addEventListener("resize", this.onResize), 
                    this.updateViewport()), window.addEventListener("touchstart", this.onTouchstart, {
                        passive: !1
                    }), window.addEventListener("touchmove", this.onTouchmove, {
                        passive: !1
                    }), window.addEventListener("wheel", this.onWheel, {
                        passive: !1
                    });
                }
                onResize() {
                    this.updateViewport();
                }
                updateViewport() {
                    const t = this.fancybox, e = this.viewport, i = e.scale || 1, s = t.$container;
                    if (!s) return;
                    let o = "", n = "", a = "";
                    i - 1 > .1 && (o = e.width * i + "px", n = e.height * i + "px", a = `translate3d(${e.offsetLeft}px, ${e.offsetTop}px, 0) scale(${1 / i})`), 
                    s.style.width = o, s.style.height = n, s.style.transform = a;
                }
                onTouchstart(t) {
                    this.startY = t.touches ? t.touches[0].screenY : t.screenY;
                }
                onTouchmove(t) {
                    const e = this.startY, i = window.innerWidth / window.document.documentElement.clientWidth;
                    if (!t.cancelable) return;
                    if (t.touches.length > 1 || 1 !== i) return;
                    const o = s(t.composedPath()[0]);
                    if (!o) return void t.preventDefault();
                    const n = window.getComputedStyle(o), a = parseInt(n.getPropertyValue("height"), 10), r = t.touches ? t.touches[0].screenY : t.screenY, h = e <= r && 0 === o.scrollTop, l = e >= r && o.scrollHeight - o.scrollTop === a;
                    (h || l) && t.preventDefault();
                }
                onWheel(t) {
                    s(t.composedPath()[0]) || t.preventDefault();
                }
                cleanup() {
                    this.pendingUpdate && (cancelAnimationFrame(this.pendingUpdate), this.pendingUpdate = null);
                    const t = this.viewport;
                    t && (t.removeEventListener("resize", this.onResize), this.viewport = null), window.removeEventListener("touchstart", this.onTouchstart, !1), 
                    window.removeEventListener("touchmove", this.onTouchmove, !1), window.removeEventListener("wheel", this.onWheel, {
                        passive: !1
                    });
                }
                attach() {
                    this.fancybox.on("initLayout", this.onReady);
                }
                detach() {
                    this.fancybox.off("initLayout", this.onReady), this.cleanup();
                }
            },
            Thumbs: C,
            Html: P,
            Toolbar: k,
            Image: T,
            Hash: L
        };
        const M = {
            startIndex: 0,
            preload: 1,
            infinite: !0,
            showClass: "fancybox-zoomInUp",
            hideClass: "fancybox-fadeOut",
            animated: !0,
            hideScrollbar: !0,
            parentEl: null,
            mainClass: null,
            autoFocus: !0,
            trapFocus: !0,
            placeFocusBack: !0,
            click: "close",
            closeButton: "inside",
            dragToClose: !0,
            keyboard: {
                Escape: "close",
                Delete: "close",
                Backspace: "close",
                PageUp: "next",
                PageDown: "prev",
                ArrowUp: "next",
                ArrowDown: "prev",
                ArrowRight: "next",
                ArrowLeft: "prev"
            },
            template: {
                closeButton: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M20 20L4 4m16 0L4 20"/></svg>',
                spinner: '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="25 25 50 50" tabindex="-1"><circle cx="50" cy="50" r="20"/></svg>',
                main: null
            },
            l10n: {
                CLOSE: "Close",
                NEXT: "Next",
                PREV: "Previous",
                MODAL: "You can close this modal content with the ESC key",
                ERROR: "Something Went Wrong, Please Try Again Later",
                IMAGE_ERROR: "Image Not Found",
                ELEMENT_NOT_FOUND: "HTML Element Not Found",
                AJAX_NOT_FOUND: "Error Loading AJAX : Not Found",
                AJAX_FORBIDDEN: "Error Loading AJAX : Forbidden",
                IFRAME_ERROR: "Error Loading Page",
                TOGGLE_ZOOM: "Toggle zoom level",
                TOGGLE_THUMBS: "Toggle thumbnails",
                TOGGLE_SLIDESHOW: "Toggle slideshow",
                TOGGLE_FULLSCREEN: "Toggle full-screen mode",
                DOWNLOAD: "Download"
            }
        }, I = new Map;
        let F = 0;
        class R extends l {
            constructor(t, i = {}) {
                t = t.map((t => (t.width && (t._width = t.width), t.height && (t._height = t.height), 
                t))), super(e(!0, {}, M, i)), this.bindHandlers(), this.state = "init", this.setItems(t), 
                this.attachPlugins(R.Plugins), this.trigger("init"), !0 === this.option("hideScrollbar") && this.hideScrollbar(), 
                this.initLayout(), this.initCarousel(), this.attachEvents(), I.set(this.id, this), 
                this.trigger("prepare"), this.state = "ready", this.trigger("ready"), this.$container.setAttribute("aria-hidden", "false"), 
                this.option("trapFocus") && this.focus();
            }
            option(t, ...e) {
                const i = this.getSlide();
                let s = i ? i[t] : void 0;
                return void 0 !== s ? ("function" == typeof s && (s = s.call(this, this, ...e)), 
                s) : super.option(t, ...e);
            }
            bindHandlers() {
                for (const t of [ "onMousedown", "onKeydown", "onClick", "onFocus", "onCreateSlide", "onSettle", "onTouchMove", "onTouchEnd", "onTransform" ]) this[t] = this[t].bind(this);
            }
            attachEvents() {
                document.addEventListener("mousedown", this.onMousedown), document.addEventListener("keydown", this.onKeydown, !0), 
                this.option("trapFocus") && document.addEventListener("focus", this.onFocus, !0), 
                this.$container.addEventListener("click", this.onClick);
            }
            detachEvents() {
                document.removeEventListener("mousedown", this.onMousedown), document.removeEventListener("keydown", this.onKeydown, !0), 
                document.removeEventListener("focus", this.onFocus, !0), this.$container.removeEventListener("click", this.onClick);
            }
            initLayout() {
                this.$root = this.option("parentEl") || document.body;
                let t = this.option("template.main");
                t && (this.$root.insertAdjacentHTML("beforeend", this.localize(t)), this.$container = this.$root.querySelector(".fancybox__container")), 
                this.$container || (this.$container = document.createElement("div"), this.$root.appendChild(this.$container)), 
                this.$container.onscroll = () => (this.$container.scrollLeft = 0, !1), Object.entries({
                    class: "fancybox__container",
                    role: "dialog",
                    tabIndex: "-1",
                    "aria-modal": "true",
                    "aria-hidden": "true",
                    "aria-label": this.localize("{{MODAL}}")
                }).forEach((t => this.$container.setAttribute(...t))), this.option("animated") && this.$container.classList.add("is-animated"), 
                this.$backdrop = this.$container.querySelector(".fancybox__backdrop"), this.$backdrop || (this.$backdrop = document.createElement("div"), 
                this.$backdrop.classList.add("fancybox__backdrop"), this.$container.appendChild(this.$backdrop)), 
                this.$carousel = this.$container.querySelector(".fancybox__carousel"), this.$carousel || (this.$carousel = document.createElement("div"), 
                this.$carousel.classList.add("fancybox__carousel"), this.$container.appendChild(this.$carousel)), 
                this.$container.Fancybox = this, this.id = this.$container.getAttribute("id"), this.id || (this.id = this.options.id || ++F, 
                this.$container.setAttribute("id", "fancybox-" + this.id));
                const e = this.option("mainClass");
                return e && this.$container.classList.add(...e.split(" ")), document.documentElement.classList.add("with-fancybox"), 
                this.trigger("initLayout"), this;
            }
            setItems(t) {
                const e = [];
                for (const i of t) {
                    const t = i.$trigger;
                    if (t) {
                        const e = t.dataset || {};
                        i.src = e.src || t.getAttribute("href") || i.src, i.type = e.type || i.type, !i.src && t instanceof HTMLImageElement && (i.src = t.currentSrc || i.$trigger.src);
                    }
                    let s = i.$thumb;
                    if (!s) {
                        let t = i.$trigger && i.$trigger.origTarget;
                        t && (s = t instanceof HTMLImageElement ? t : t.querySelector("img:not([aria-hidden])")), 
                        !s && i.$trigger && (s = i.$trigger instanceof HTMLImageElement ? i.$trigger : i.$trigger.querySelector("img:not([aria-hidden])"));
                    }
                    i.$thumb = s || null;
                    let o = i.thumb;
                    !o && s && (o = s.currentSrc || s.src, !o && s.dataset && (o = s.dataset.lazySrc || s.dataset.src)), 
                    o || "image" !== i.type || (o = i.src), i.thumb = o || null, i.caption = i.caption || "", 
                    e.push(i);
                }
                this.items = e;
            }
            initCarousel() {
                return this.Carousel = new y(this.$carousel, e(!0, {}, {
                    prefix: "",
                    classNames: {
                        viewport: "fancybox__viewport",
                        track: "fancybox__track",
                        slide: "fancybox__slide"
                    },
                    textSelection: !0,
                    preload: this.option("preload"),
                    friction: .88,
                    slides: this.items,
                    initialPage: this.options.startIndex,
                    slidesPerPage: 1,
                    infiniteX: this.option("infinite"),
                    infiniteY: !0,
                    l10n: this.option("l10n"),
                    Dots: !1,
                    Navigation: {
                        classNames: {
                            main: "fancybox__nav",
                            button: "carousel__button",
                            next: "is-next",
                            prev: "is-prev"
                        }
                    },
                    Panzoom: {
                        textSelection: !0,
                        panOnlyZoomed: () => this.Carousel && this.Carousel.pages && this.Carousel.pages.length < 2 && !this.option("dragToClose"),
                        lockAxis: () => {
                            if (this.Carousel) {
                                let t = "x";
                                return this.option("dragToClose") && (t += "y"), t;
                            }
                        }
                    },
                    on: {
                        "*": (t, ...e) => this.trigger(`Carousel.${t}`, ...e),
                        init: t => this.Carousel = t,
                        createSlide: this.onCreateSlide,
                        settle: this.onSettle
                    }
                }, this.option("Carousel"))), this.option("dragToClose") && this.Carousel.Panzoom.on({
                    touchMove: this.onTouchMove,
                    afterTransform: this.onTransform,
                    touchEnd: this.onTouchEnd
                }), this.trigger("initCarousel"), this;
            }
            onCreateSlide(t, e) {
                let i = e.caption || "";
                if ("function" == typeof this.options.caption && (i = this.options.caption.call(this, this, this.Carousel, e)), 
                "string" == typeof i && i.length) {
                    const t = document.createElement("div"), s = `fancybox__caption_${this.id}_${e.index}`;
                    t.className = "fancybox__caption", t.innerHTML = i, t.setAttribute("id", s), e.$caption = e.$el.appendChild(t), 
                    e.$el.classList.add("has-caption"), e.$el.setAttribute("aria-labelledby", s);
                }
            }
            onSettle() {
                this.option("autoFocus") && this.focus();
            }
            onFocus(t) {
                this.isTopmost() && this.focus(t);
            }
            onClick(t) {
                if (t.defaultPrevented) return;
                let e = t.composedPath()[0];
                if (e.matches("[data-fancybox-close]")) return t.preventDefault(), void R.close(!1, t);
                if (e.matches("[data-fancybox-next]")) return t.preventDefault(), void R.next();
                if (e.matches("[data-fancybox-prev]")) return t.preventDefault(), void R.prev();
                const i = document.activeElement;
                if (i) {
                    if (i.closest("[contenteditable]")) return;
                    e.matches(x) || i.blur();
                }
                if (e.closest(".fancybox__content")) return;
                if (getSelection().toString().length) return;
                if (!1 === this.trigger("click", t)) return;
                switch (this.option("click")) {
                  case "close":
                    this.close();
                    break;

                  case "next":
                    this.next();
                }
            }
            onTouchMove() {
                const t = this.getSlide().Panzoom;
                return !t || 1 === t.content.scale;
            }
            onTouchEnd(t) {
                const e = t.dragOffset.y;
                Math.abs(e) >= 150 || Math.abs(e) >= 35 && t.dragOffset.time < 350 ? (this.option("hideClass") && (this.getSlide().hideClass = "fancybox-throwOut" + (t.content.y < 0 ? "Up" : "Down")), 
                this.close()) : "y" === t.lockAxis && t.panTo({
                    y: 0
                });
            }
            onTransform(t) {
                if (this.$backdrop) {
                    const e = Math.abs(t.content.y), i = e < 1 ? "" : Math.max(.33, Math.min(1, 1 - e / t.content.fitHeight * 1.5));
                    this.$container.style.setProperty("--fancybox-ts", i ? "0s" : ""), this.$container.style.setProperty("--fancybox-opacity", i);
                }
            }
            onMousedown() {
                "ready" === this.state && document.body.classList.add("is-using-mouse");
            }
            onKeydown(t) {
                if (!this.isTopmost()) return;
                document.body.classList.remove("is-using-mouse");
                const e = t.key, i = this.option("keyboard");
                if (!i || t.ctrlKey || t.altKey || t.shiftKey) return;
                const s = t.composedPath()[0], o = document.activeElement && document.activeElement.classList, n = o && o.contains("carousel__button");
                if ("Escape" !== e && !n) if (t.target.isContentEditable || -1 !== [ "BUTTON", "TEXTAREA", "OPTION", "INPUT", "SELECT", "VIDEO" ].indexOf(s.nodeName)) return;
                if (!1 === this.trigger("keydown", e, t)) return;
                const a = i[e];
                "function" == typeof this[a] && this[a]();
            }
            getSlide() {
                const t = this.Carousel;
                if (!t) return null;
                const e = null === t.page ? t.option("initialPage") : t.page, i = t.pages || [];
                return i.length && i[e] ? i[e].slides[0] : null;
            }
            focus(t) {
                if (R.ignoreFocusChange) return;
                if ([ "init", "closing", "customClosing", "destroy" ].indexOf(this.state) > -1) return;
                const e = this.$container, i = this.getSlide(), s = "done" === i.state ? i.$el : null;
                if (s && s.contains(document.activeElement)) return;
                t && t.preventDefault(), R.ignoreFocusChange = !0;
                const o = Array.from(e.querySelectorAll(x));
                let n, a = [];
                for (let t of o) {
                    const e = t.offsetParent, i = s && s.contains(t), o = !this.Carousel.$viewport.contains(t);
                    e && (i || o) ? (a.push(t), void 0 !== t.dataset.origTabindex && (t.tabIndex = t.dataset.origTabindex, 
                    t.removeAttribute("data-orig-tabindex")), (t.hasAttribute("autoFocus") || !n && i && !t.classList.contains("carousel__button")) && (n = t)) : (t.dataset.origTabindex = void 0 === t.dataset.origTabindex ? t.getAttribute("tabindex") : t.dataset.origTabindex, 
                    t.tabIndex = -1);
                }
                t ? a.indexOf(t.target) > -1 ? this.lastFocus = t.target : this.lastFocus === e ? w(a[a.length - 1]) : w(e) : this.option("autoFocus") && n ? w(n) : a.indexOf(document.activeElement) < 0 && w(e), 
                this.lastFocus = document.activeElement, R.ignoreFocusChange = !1;
            }
            hideScrollbar() {
                if (!v) return;
                const t = window.innerWidth - document.documentElement.getBoundingClientRect().width, e = "fancybox-style-noscroll";
                let i = document.getElementById(e);
                i || t > 0 && (i = document.createElement("style"), i.id = e, i.type = "text/css", 
                i.innerHTML = `.compensate-for-scrollbar {padding-right: ${t}px;}`, document.getElementsByTagName("head")[0].appendChild(i), 
                document.body.classList.add("compensate-for-scrollbar"));
            }
            revealScrollbar() {
                document.body.classList.remove("compensate-for-scrollbar");
                const t = document.getElementById("fancybox-style-noscroll");
                t && t.remove();
            }
            clearContent(t) {
                this.Carousel.trigger("removeSlide", t), t.$content && (t.$content.remove(), t.$content = null), 
                t.$closeButton && (t.$closeButton.remove(), t.$closeButton = null), t._className && t.$el.classList.remove(t._className);
            }
            setContent(t, e, i = {}) {
                let s;
                const o = t.$el;
                if (e instanceof HTMLElement) [ "img", "iframe", "video", "audio" ].indexOf(e.nodeName.toLowerCase()) > -1 ? (s = document.createElement("div"), 
                s.appendChild(e)) : s = e; else {
                    const t = document.createRange().createContextualFragment(e);
                    s = document.createElement("div"), s.appendChild(t);
                }
                if (t.filter && !t.error && (s = s.querySelector(t.filter)), s instanceof Element) return t._className = `has-${i.suffix || t.type || "unknown"}`, 
                o.classList.add(t._className), s.classList.add("fancybox__content"), "none" !== s.style.display && "none" !== getComputedStyle(s).getPropertyValue("display") || (s.style.display = t.display || this.option("defaultDisplay") || "flex"), 
                t.id && s.setAttribute("id", t.id), t.$content = s, o.prepend(s), this.manageCloseButton(t), 
                "loading" !== t.state && this.revealContent(t), s;
                this.setError(t, "{{ELEMENT_NOT_FOUND}}");
            }
            manageCloseButton(t) {
                const e = void 0 === t.closeButton ? this.option("closeButton") : t.closeButton;
                if (!e || "top" === e && this.$closeButton) return;
                const i = document.createElement("button");
                i.classList.add("carousel__button", "is-close"), i.setAttribute("title", this.options.l10n.CLOSE), 
                i.innerHTML = this.option("template.closeButton"), i.addEventListener("click", (t => this.close(t))), 
                "inside" === e ? (t.$closeButton && t.$closeButton.remove(), t.$closeButton = t.$content.appendChild(i)) : this.$closeButton = this.$container.insertBefore(i, this.$container.firstChild);
            }
            revealContent(t) {
                this.trigger("reveal", t), t.$content.style.visibility = "";
                let e = !1;
                t.error || "loading" === t.state || null !== this.Carousel.prevPage || t.index !== this.options.startIndex || (e = void 0 === t.showClass ? this.option("showClass") : t.showClass), 
                e ? (t.state = "animating", this.animateCSS(t.$content, e, (() => {
                    this.done(t);
                }))) : this.done(t);
            }
            animateCSS(t, e, i) {
                if (t && t.dispatchEvent(new CustomEvent("animationend", {
                    bubbles: !0,
                    cancelable: !0
                })), !t || !e) return void ("function" == typeof i && i());
                const s = function(o) {
                    o.currentTarget === this && (t.removeEventListener("animationend", s), i && i(), 
                    t.classList.remove(e));
                };
                t.addEventListener("animationend", s), t.classList.add(e);
            }
            done(t) {
                t.state = "done", this.trigger("done", t);
                const e = this.getSlide();
                e && t.index === e.index && this.option("autoFocus") && this.focus();
            }
            setError(t, e) {
                t.error = e, this.hideLoading(t), this.clearContent(t);
                const i = document.createElement("div");
                i.classList.add("fancybox-error"), i.innerHTML = this.localize(e || "<p>{{ERROR}}</p>"), 
                this.setContent(t, i, {
                    suffix: "error"
                });
            }
            showLoading(t) {
                t.state = "loading", t.$el.classList.add("is-loading");
                let e = t.$el.querySelector(".fancybox__spinner");
                e || (e = document.createElement("div"), e.classList.add("fancybox__spinner"), e.innerHTML = this.option("template.spinner"), 
                e.addEventListener("click", (() => {
                    this.Carousel.Panzoom.velocity || this.close();
                })), t.$el.prepend(e));
            }
            hideLoading(t) {
                const e = t.$el && t.$el.querySelector(".fancybox__spinner");
                e && (e.remove(), t.$el.classList.remove("is-loading")), "loading" === t.state && (this.trigger("load", t), 
                t.state = "ready");
            }
            next() {
                const t = this.Carousel;
                t && t.pages.length > 1 && t.slideNext();
            }
            prev() {
                const t = this.Carousel;
                t && t.pages.length > 1 && t.slidePrev();
            }
            jumpTo(...t) {
                this.Carousel && this.Carousel.slideTo(...t);
            }
            isClosing() {
                return [ "closing", "customClosing", "destroy" ].includes(this.state);
            }
            isTopmost() {
                return R.getInstance().id == this.id;
            }
            close(t) {
                if (t && t.preventDefault(), this.isClosing()) return;
                if (!1 === this.trigger("shouldClose", t)) return;
                if (this.state = "closing", this.Carousel.Panzoom.destroy(), this.detachEvents(), 
                this.trigger("closing", t), "destroy" === this.state) return;
                this.$container.setAttribute("aria-hidden", "true"), this.$container.classList.add("is-closing");
                const e = this.getSlide();
                if (this.Carousel.slides.forEach((t => {
                    t.$content && t.index !== e.index && this.Carousel.trigger("removeSlide", t);
                })), "closing" === this.state) {
                    const t = void 0 === e.hideClass ? this.option("hideClass") : e.hideClass;
                    this.animateCSS(e.$content, t, (() => {
                        this.destroy();
                    }), !0);
                }
            }
            destroy() {
                if ("destroy" === this.state) return;
                this.state = "destroy", this.trigger("destroy");
                const t = this.option("placeFocusBack") ? this.option("triggerTarget", this.getSlide().$trigger) : null;
                this.Carousel.destroy(), this.detachPlugins(), this.Carousel = null, this.options = {}, 
                this.events = {}, this.$container.remove(), this.$container = this.$backdrop = this.$carousel = null, 
                t && w(t), I.delete(this.id);
                const e = R.getInstance();
                e ? e.focus() : (document.documentElement.classList.remove("with-fancybox"), document.body.classList.remove("is-using-mouse"), 
                this.revealScrollbar());
            }
            static show(t, e = {}) {
                return new R(t, e);
            }
            static fromEvent(t, e = {}) {
                if (t.defaultPrevented) return;
                if (t.button && 0 !== t.button) return;
                if (t.ctrlKey || t.metaKey || t.shiftKey) return;
                const i = t.composedPath()[0];
                let s, o, n, a = i;
                if ((a.matches("[data-fancybox-trigger]") || (a = a.closest("[data-fancybox-trigger]"))) && (e.triggerTarget = a, 
                s = a && a.dataset && a.dataset.fancyboxTrigger), s) {
                    const t = document.querySelectorAll(`[data-fancybox="${s}"]`), e = parseInt(a.dataset.fancyboxIndex, 10) || 0;
                    a = t.length ? t[e] : a;
                }
                Array.from(R.openers.keys()).reverse().some((e => {
                    n = a || i;
                    let s = !1;
                    try {
                        n instanceof Element && ("string" == typeof e || e instanceof String) && (s = n.matches(e) || (n = n.closest(e)));
                    } catch (t) {}
                    return !!s && (t.preventDefault(), o = e, !0);
                }));
                let r = !1;
                if (o) {
                    e.event = t, e.target = n, n.origTarget = i, r = R.fromOpener(o, e);
                    const s = R.getInstance();
                    s && "ready" === s.state && t.detail && document.body.classList.add("is-using-mouse");
                }
                return r;
            }
            static fromOpener(t, i = {}) {
                let s = [], o = i.startIndex || 0, n = i.target || null;
                const a = void 0 !== (i = e({}, i, R.openers.get(t))).groupAll && i.groupAll, r = void 0 === i.groupAttr ? "data-fancybox" : i.groupAttr, h = r && n ? n.getAttribute(`${r}`) : "";
                if (!n || h || a) {
                    const e = i.root || (n ? n.getRootNode() : document.body);
                    s = [].slice.call(e.querySelectorAll(t));
                }
                if (n && !a && (s = h ? s.filter((t => t.getAttribute(`${r}`) === h)) : [ n ]), 
                !s.length) return !1;
                const l = R.getInstance();
                return !(l && s.indexOf(l.options.$trigger) > -1) && (o = n ? s.indexOf(n) : o, 
                s = s.map((function(t) {
                    const e = [ "false", "0", "no", "null", "undefined" ], i = [ "true", "1", "yes" ], s = Object.assign({}, t.dataset), o = {};
                    for (let [t, n] of Object.entries(s)) if ("fancybox" !== t) if ("width" === t || "height" === t) o[`_${t}`] = n; else if ("string" == typeof n || n instanceof String) if (e.indexOf(n) > -1) o[t] = !1; else if (i.indexOf(o[t]) > -1) o[t] = !0; else try {
                        o[t] = JSON.parse(n);
                    } catch (e) {
                        o[t] = n;
                    } else o[t] = n;
                    return t instanceof Element && (o.$trigger = t), o;
                })), new R(s, e({}, i, {
                    startIndex: o,
                    $trigger: n
                })));
            }
            static bind(t, e = {}) {
                function i() {
                    document.body.addEventListener("click", R.fromEvent, !1);
                }
                v && (R.openers.size || (/complete|interactive|loaded/.test(document.readyState) ? i() : document.addEventListener("DOMContentLoaded", i)), 
                R.openers.set(t, e));
            }
            static unbind(t) {
                R.openers.delete(t), R.openers.size || R.destroy();
            }
            static destroy() {
                let t;
                for (;t = R.getInstance(); ) t.destroy();
                R.openers = new Map, document.body.removeEventListener("click", R.fromEvent, !1);
            }
            static getInstance(t) {
                if (t) return I.get(t);
                return Array.from(I.values()).reverse().find((t => !t.isClosing() && t)) || null;
            }
            static close(t = !0, e) {
                if (t) for (const t of I.values()) t.close(e); else {
                    const t = R.getInstance();
                    t && t.close(e);
                }
            }
            static next() {
                const t = R.getInstance();
                t && t.next();
            }
            static prev() {
                const t = R.getInstance();
                t && t.prev();
            }
        }
        R.version = "4.0.31", R.defaults = M, R.openers = new Map, R.Plugins = O, R.bind("[data-fancybox]");
        for (const [t, e] of Object.entries(R.Plugins || {})) "function" == typeof e.create && e.create(R);
        function showMoreMy() {
            let buttons = document.querySelectorAll(".button-js");
            if (buttons) for (let elem of buttons) elem.addEventListener("click", (function() {
                let content = this.previousElementSibling;
                content.classList.toggle("hidden-js");
                this.classList.add("button-hidden");
            }));
        }
        showMoreMy();
        function cleanInput() {
            let buttons = document.querySelectorAll(".button-form-js");
            for (let elem of buttons) elem.addEventListener("click", (function(e) {
                event.preventDefault();
                let input = this.previousElementSibling;
                input.value = "";
                input.focus();
            }));
        }
        cleanInput();
        function selectArrow() {
            let buttons = document.querySelectorAll(".select-click-js");
            for (let elem of buttons) elem.addEventListener("click", (function() {
                let img = this.nextElementSibling;
                img.classList.toggle("active-arrow");
            }));
        }
        selectArrow();
        document.addEventListener("DOMContentLoaded", (function() {
            function initSliders() {
                if (document.querySelector("#splide-1")) new Splide("#splide-1", {
                    perPage: 1,
                    rewind: true,
                    autoplay: true
                }).mount();
                if (document.querySelector("#splide-2")) new Splide("#splide-2", {
                    perPage: 5,
                    rewind: true,
                    gap: 20,
                    breakpoints: {
                        900: {
                            perPage: 3
                        },
                        500: {
                            perPage: 2
                        }
                    }
                }).mount();
                if (document.querySelector("#splide-3")) new Splide("#splide-3", {
                    perPage: 5,
                    rewind: true,
                    gap: 20,
                    breakpoints: {
                        900: {
                            perPage: 3
                        },
                        500: {
                            perPage: 2
                        }
                    }
                }).mount();
                if (document.querySelector("#splide-4")) new Splide("#splide-4", {
                    perPage: 2,
                    rewind: true,
                    gap: 30,
                    breakpoints: {
                        600: {
                            perPage: 1
                        }
                    }
                }).mount();
                if (document.querySelector("#splide-5")) new Splide("#splide-5", {
                    perPage: 3,
                    rewind: true,
                    gap: 26,
                    breakpoints: {
                        900: {
                            perPage: 2
                        },
                        700: {
                            perPage: 1
                        }
                    }
                }).mount();
            }
            initSliders();
        }));
        function buttonOne() {
            let buttons1 = document.querySelectorAll(".top__button-top");
            for (let elem1 of buttons1) elem1.addEventListener("click", (function(event) {
                event.preventDefault();
                let buttons2 = document.querySelectorAll(".splide__arrow--prev");
                for (let elem2 of buttons2) elem2.click();
            }));
        }
        buttonOne();
        function buttonTwo() {
            let buttons1 = document.querySelectorAll(".top__button-bottom");
            for (let elem1 of buttons1) elem1.addEventListener("click", (function(event) {
                event.preventDefault();
                let buttons2 = document.querySelectorAll(".splide__arrow--next");
                for (let elem2 of buttons2) elem2.click();
            }));
        }
        buttonTwo();
        R.bind("[data-fancybox]", {});
        function mascTel() {
            window.addEventListener("DOMContentLoaded", (function() {
                [].forEach.call(document.querySelectorAll(".tel"), (function(input) {
                    var keyCode;
                    function mask(event) {
                        event.keyCode && (keyCode = event.keyCode);
                        var pos = this.selectionStart;
                        if (pos < 3) event.preventDefault();
                        var matrix = "+7 (___) ___ ____", i = 0, def = matrix.replace(/\D/g, ""), val = this.value.replace(/\D/g, ""), new_value = matrix.replace(/[_\d]/g, (function(a) {
                            return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
                        }));
                        i = new_value.indexOf("_");
                        if (-1 != i) {
                            i < 5 && (i = 3);
                            new_value = new_value.slice(0, i);
                        }
                        var reg = matrix.substr(0, this.value.length).replace(/_+/g, (function(a) {
                            return "\\d{1," + a.length + "}";
                        })).replace(/[+()]/g, "\\$&");
                        reg = new RegExp("^" + reg + "$");
                        if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
                        if ("blur" == event.type && this.value.length < 5) this.value = "";
                    }
                    input.addEventListener("input", mask, false);
                    input.addEventListener("focus", mask, false);
                    input.addEventListener("blur", mask, false);
                    input.addEventListener("keydown", mask, false);
                }));
            }));
        }
        mascTel();
        window["FLS"] = true;
        isWebp();
        menuInit();
        tabs();
    })();
})();