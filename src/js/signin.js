function main() {
    let form = document.getElementById('registro');

    form.addEventListener('submit', (element) => {
        element.preventDefault();
        let formData = new FormData();
        formData.append('prueba1', 'valorprueba1');
        fetch('/sesion', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(
            response => response.text()
        ).then(
                data => console.log(data)
        );
    });
}

window.addEventListener('load', main, true);