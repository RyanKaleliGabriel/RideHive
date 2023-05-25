
//Function to get Full Year
function getFullYear(){
    var dateObj = new Date();
    var dateObject = dateObj.getFullYear();
    const yearElement = document.getElementById("year");
    yearElement.innerHTML = "CopyRight @"+dateObject;
}
getFullYear();

//Advanced SearchPopup
document.getElementById("advancedSearch").addEventListener("click", function(){
    document.getElementById("searchContainer").style.display="flex";
    document.getElementById("advancedSearch").style.display="none"
})
document.getElementById("cancelButton").addEventListener("click", function(){
    document.getElementById("searchContainer").style.display="none"
    document.getElementById("advancedSearch").style.display="flex"
})
