function darkLight(){
    if (getComputedStyle(document.documentElement).getPropertyValue("--backgroundColor")!="#e1e1e1"){
        document.documentElement.style.setProperty("--backgroundColor","#e1e1e1")
        document.documentElement.style.setProperty("--textbasic","#000000")
        document.documentElement.style.setProperty("--marginColor","#00000080")
        document.documentElement.style.setProperty("--accentColor","#a9a9a9")
        document.documentElement.style.setProperty("--textaccentColor","#00000080")
    }
    else{
        document.documentElement.style.setProperty("--backgroundColor","#0E1217")
        document.documentElement.style.setProperty("--textbasic","#ffffff")
        document.documentElement.style.setProperty("--marginColor","#d3d3d380")
        document.documentElement.style.setProperty("--accentColor","#1C1F26")
        document.documentElement.style.setProperty("--textaccentColor","#ffffff80")
    }
}


let logout=document.getElementById("navBarLogout")

logout.addEventListener("click", ()=>{
    location.replace("./index.html")
})