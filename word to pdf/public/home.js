const downloadButton = document.querySelector('#download-button');
downloadButton.style.display = "none";

var fileName;

function uploadFile(e){
    var elem = e.originalTarget;
    fileName = elem.files[0].name;
    if(fileName.indexOf(".doc") > -1 || fileName.indexOf(".docx") > -1 || fileName.indexOf(".odt") > -1){
        elem.form.submit();
        elem.style.display = "none";
        elem.parentNode.firstElementChild.style.display = "none";
        downloadButton.style.display = "block";
        e.preventDefault()
    } else {
        alert("Unesite word file!");
    }
}