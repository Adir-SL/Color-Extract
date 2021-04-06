  var tab_title = '';
  function displayCode (results){
    document.querySelector("#workingData").innerHTML = "<div class='flexDiv'><h1>Colors</h1><button id='allBtn'>Copy all</button></div>"+results;
    // document.getElementById("allBtn").addEventListener("click", copySVG);
    
    var x = document.getElementsByTagName("button");
    var i;
    for (i = 0; i < x.length; i++) {
      x[i].style.backgroundColor = x[i].innerText;
      x[i].setAttribute("title", x[i].innerText);
      x[i].addEventListener("click", colorClick);
      
      if(x[i].innerText.slice(0,4) == "rgba"){
        RGBAToHexA(x[i].innerText, x[i]);
      }else{
        RGBToHex(x[i].innerText, x[i]);
      }      
    }
  }
  function colorClick(){
    var x = document.getElementsByTagName("button");
    var i;
    for (i = 0; i < x.length; i++) {
      if(window.getComputedStyle(x[i]).opacity == "0.8" || window.getComputedStyle(x[i]).opacity == 0.8){
        if(x[i].id == "allBtn"){
          copySVG();
        }else{
          copyText(x[i].getAttribute("title"))
        }
        x[i].setAttribute("clip", "Copied!");
        setTimeout(function(){ resetClips(); }, 500);
      }
    }
  }
  function resetClips(){
    var x = document.getElementsByTagName("button");
    var i;
    for (i = 0; i < x.length; i++) {
      x[i].setAttribute("clip", "");
    }
  }
  function copyText(text) {
    var copyFrom = document.createElement("textarea");
    copyFrom.textContent = text;
    document.body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand("copy");
    copyFrom.blur();
    document.body.removeChild(copyFrom);
  }
  function copySVG(){
    window.placeMeX = 0;
    window.placeMeY = 0;
    window.countMe = 0;
    window.tempSVG = '<svg width="'+document.getElementById("workingData").offsetWidth+'" height="'+document.getElementById("workingData").offsetHeight+'" viewBox="0 0 '+document.getElementById("workingData").offsetWidth+' '+document.getElementById("workingData").offsetHeight+'" fill="none" xmlns="http://www.w3.org/2000/svg">';
    var x = document.getElementById("workingData").getElementsByTagName("button")
    var i;
    for (i = 0; i < x.length; i++) {
      window.tempSVG += '<rect width="60" height="60" rx="40" x="'+window.placeMeX+'" y="'+window.placeMeY+'" stroke="#333333" fill="'+x[i].getAttribute("title")+'"/>';
      window.placeMeX += 80;
      window.countMe += 1;
      if(window.countMe == 7){
        window.placeMeY += 80;
        window.placeMeX = 0;
        window.countMe = 0;
      }
    }
    window.tempSVG += '</svg>';
    // alert(window.tempSVG);
    copyText(window.tempSVG);
  }
  
  function RGBToHex(rgb, y) {
    let sep = rgb.indexOf(",") > -1 ? "," : " ";
    rgb = rgb.substr(4).split(")")[0].split(sep);
  
    let r = (+rgb[0]).toString(16),
        g = (+rgb[1]).toString(16),
        b = (+rgb[2]).toString(16);
  
    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;
  
      y.setAttribute("title", "#" + r + g + b);
  }
  function RGBAToHexA(rgba, y) {
    let sep = rgba.indexOf(",") > -1 ? "," : " "; 
    rgba = rgba.substr(5).split(")")[0].split(sep);
                  
    if (rgba.indexOf("/") > -1)
      rgba.splice(3,1);
  
    for (let R in rgba) {
      let r = rgba[R];
      if (r.indexOf("%") > -1) {
        let p = r.substr(0,r.length - 1) / 100;
  
        if (R < 3) {
          rgba[R] = Math.round(p * 255);
        } else {
          rgba[R] = p;
        }
      }
    }
    let r = (+rgba[0]).toString(16),
    g = (+rgba[1]).toString(16),
    b = (+rgba[2]).toString(16),
    a = Math.round(+rgba[3] * 255).toString(16);

    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;
    if (a.length == 1)
      a = "0" + a;

      y.setAttribute("title","#" + r + g + b + a);
    }

  function hideAll(w){
    var g = document.getElementsByClassName(w);
    var t;
    for (t = 1; t < g.length; t++) {
      g[t].style.display = "none";
    }
  }
  chrome.tabs.query({active: true}, function(tabs) {
    var tab = tabs[0];
    tab_title = tab.title;
    chrome.tabs.executeScript(tab.id, {
    
    code: 'window.temp="";var x = document.querySelectorAll("*");var i;for (i = 0; i < x.length; i++) {if(window.temp.indexOf(window.getComputedStyle(x[i]).color) < 0){window.temp +="<button id="+window.getComputedStyle(x[i]).color+" class="+1+">"+window.getComputedStyle(x[i]).color+"</button>";}};document.body.setAttribute("colorStyles", window.temp);var x = document.querySelectorAll("*");var i;for (i = 0; i < x.length; i++) {if(window.temp.indexOf(window.getComputedStyle(x[i]).backgroundColor) < 0){window.temp +="<button id="+window.getComputedStyle(x[i]).color+" class="+1+">"+window.getComputedStyle(x[i]).backgroundColor+"</button>";}};document.body.setAttribute("colorStyles", window.temp);document.body.getAttribute("colorStyles")'

    }, displayCode);
  });
