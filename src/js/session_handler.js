let cookies = document.cookie.split('; ');
let cookiesJSON = new Array();

for(cookie of cookies){
    cookiesJSON.push(
        {
            key: cookie.split('=')[0],
            value: cookie.split('=')[1]
        }
    );
}

let sessionVar = false;

for(item of cookiesJSON){
    console.log(item);
    if(item.key == 'userid' && item.value != ''){
        fetch('/session_auth?userid='+item.value)
            .then(
                response => response.text()
            ).then(data => {
                if(data == 'true'){
                    console.log(data);
                    sessionVar = true;
                }else{
                    console.log(data);
                }
            });
            let url = new URL(window.location.href);
            if(sessionVar){
                if(url.pathname == '/login' || url.pathname == '/signin'){
                    location.href = '/';
                }
            }else{
                if(url.pathname != '/login' && url.pathname != '/signin'){
                    location.href = '/login';
                }
            }
        break;
    }
}