class UserController {
    constructor(formId, tableId){
        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit()
    }

    onSubmit(){
        this.formEl.addEventListener('submit', e => {
            e.preventDefault()

            let values = this.getValues()

            this.getPhoto().then(
                //try
                (content) => {
                    values.photo = content;
    
                    this.addLine(values)
                },
                //catch
                (e) => {
                    console.error(e);
                }
            )
        }) 
    }

    getPhoto(){
        //Promise is Class
        return new Promise((resolve, reject) => {

            let fileReader = new FileReader();

            let elements = [...this.formEl.elements].filter(item => {
                if (item.name === 'photo'){
                    return item;
                }
            });

            let file = elements[0].files[0];

            fileReader.onload = () => {
                resolve(fileReader.result)
            }

            fileReader.onerror = (e) => {
                reject(e)
            }

            if(file) {fileReader.readAsDataURL(file)} else {resolve('dist/img/boxed-bg.jpg')};
        });
    }

    getValues(){
        let user = {};

        //quando for um collection use o forEach da seguinte maneira...
        //com o spread operator [...this.values]
        [...this.formEl.elements].forEach(function(filed, index) {
            if (filed.name == 'gender') {

                if(filed.checked){
                    user[filed.name] = filed.value
                }

            } else if(filed.name == 'admin') {

                user[filed.name] = filed.checked

            }else {
                user[filed.name] = filed.value
            }
        })
    
        return new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
        )
    }

    addLine(dataUser){

        let tr = document.createElement('tr');

        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${dataUser.admin == true ? 'Sim' : 'Não' }</td>
            <td>${dataUser.birth}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `
        this.tableEl.appendChild(tr);
    }
}