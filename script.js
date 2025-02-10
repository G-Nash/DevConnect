document.getElementById("loginButton").addEventListener("click", function() {
    window.location.href = "transition.html?redirect=login.html";
});

document.getElementById("signupButton").addEventListener("click", function() {
    window.location.href = "transition.html?redirect=signup.html";
});


function darkLight(){
    if (getComputedStyle(document.documentElement).getPropertyValue("--backgroundColor")!="#e1e1e1"){
        document.documentElement.style.setProperty("--backgroundColor","#e1e1e1")
        document.documentElement.style.setProperty("--textbasic","#000000")
        document.documentElement.style.setProperty("--marginColor","#00000080")
        document.documentElement.style.setProperty("--accentColor","#a9a9a9")
    }
    else{
        document.documentElement.style.setProperty("--backgroundColor","#0E1217")
        document.documentElement.style.setProperty("--textbasic","#ffffff")
        document.documentElement.style.setProperty("--marginColor","#d3d3d380")
        document.documentElement.style.setProperty("--accentColor","#1C1F26")
    }
}