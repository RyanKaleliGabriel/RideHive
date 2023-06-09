const commentButton = document.getElementById("commentPopup");
const searchButton = document.getElementById("advancedSearch");
const closeSearchButton = document.getElementById("cancelButton");
const issuesButton = document.getElementById("issuePopup")

//Function to get Full Year
function getFullYear(){
    var dateObj = new Date();
    var dateObject = dateObj.getFullYear();
    const yearElement = document.getElementById("year");
    yearElement.innerHTML = "CopyRight @"+dateObject;
}
getFullYear();


function showCommentWindow(){
    commentButton.addEventListener("click", function(event){
    event.preventDefault();
    document.getElementById("commentContainer").style.display="flex"
});
}

function showIssueWindow(){
    issuesButton.addEventListener("click", function(event){
        event.preventDefault();
        document.getElementById("issueContainer").style.display="flex"
    });
}

function showSearchWindow(){
    searchButton.addEventListener("click", function(event){
    event.preventDefault();
    document.getElementById("searchContainer").style.display="flex";
    document.getElementById("advancedSearch").style.display="none"
});
}

function closeSearchWindow(){
    closeButton.addEventListener("click", function(event){
    event.preventDefault();
    document.getElementById("searchContainer").style.display="none"
    document.getElementById("advancedSearch").style.display="flex"
});
}

function toggleMenu(){
    var menu = document.getElementById("adminMenu")
    menu.classList.toggle('show');
}






