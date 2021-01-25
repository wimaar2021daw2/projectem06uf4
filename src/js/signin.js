function main() {
    let form = document.getElementById('registro');

    form.addEventListener('submit', (element) => {
        element.preventDefault();
        let formData = new FormData(form);
        fetch('/registrar', {
            method: 'POST',
            body: formData
        }).then(
            response => response.text()
        ).then(
                data => console.log(data)
        );
    });
}

window.addEventListener('load', main, true);