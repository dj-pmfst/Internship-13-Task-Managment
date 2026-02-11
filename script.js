
document.querySelectorAll('.add button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector('.pop-add').classList.add('active');
    });
});

document.querySelector('#cancel').addEventListener('click', () => {
    document.querySelector('.pop-add').classList.remove('active');
});


document.querySelector('#save').addEventListener('click', () => {

    document.querySelector('.pop-add').classList.remove('active');
});