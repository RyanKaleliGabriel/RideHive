
//Function to get Full Year
function getFullYear(){
    var dateObj = new Date();
    var dateObject = dateObj.getFullYear();
    const yearElement = document.getElementById("year");
    yearElement.innerHTML = "CopyRight @"+dateObject;
}
getFullYear();