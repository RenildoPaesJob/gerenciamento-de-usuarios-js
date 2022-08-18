class UserController {
  constructor(formIdCreate, formIdUpdate, tableId) {
    this.formEl       = document.getElementById(formIdCreate);
    this.formUpdateEl = document.getElementById(formIdUpdate);
    this.tableEl      = document.getElementById(tableId);

    this.onSubmit();
    this.onEdit();
    this.selectAllStorage();
  }

  //btn save form update user
  onEdit() {
    document
      .querySelector("#box-user-update .btn-cancel")
      .addEventListener("click", (e) => {
        this.showPanelCreate();
      });

    //form Update user
    this.formUpdateEl.addEventListener("submit", (e) => {
      e.preventDefault();

      //disable btn submit
      let btn      = this.formUpdateEl.querySelector('[type="submit"]');
          btn.disabled = true;

      //get values using the function
      let values = this.getValues(this.formUpdateEl);

      //get index of line user
      let index = this.formUpdateEl.dataset.trIndex;

      let tr = this.tableEl.rows[index];

      //get the phot old
      let userOld = JSON.parse(tr.dataset.user);

      //mescle thes values form user-update
      //Object.assign({}, ..., ...) => copia o valor de atributos de um objeto, e cria um objeto destinto, retornando este objeto.
      //o 2° parametro substitui o primeiro
      let result = Object.assign({}, userOld, values);

      this.getPhoto(this.formUpdateEl).then(
        //se for success
        (content) => {
          if (!values.photo) {
            result._photo = userOld._photo;
          } else {
            result._photo = content;
          }

          let user = new User();

          user.loadFromJSON(result);

          user.save();

          //get line of table
          //JSON.stringify() => transforma um objeto em um string
          // tr.dataset.user = JSON.stringify(result);

          this.getTr(user, tr);

          this.updateCount();

          this.formUpdateEl.reset();
          btn.disabled = false;
          this.showPanelCreate();
        },
        //se for um error
        (e) => {
          console.error(e);
        }
      );
    });
  }

  //event submit the values form
  onSubmit() {
    this.formEl.addEventListener("submit", (e) => {
      //remove the action default
      e.preventDefault();

      //disable btn submit
      let btn          = this.formEl.querySelector('[type="submit"]');
          btn.disabled = true;

      let values = this.getValues(this.formEl);

      if (!values) {
        return false;
      }

      this.getPhoto(this.formEl).then(
        //se for success
        (content) => {
          values.photo = content;

          values.save();

          this.addLine(values);

          this.formEl.reset();

          btn.disabled = false;
        },
        //se for um error
        (e) => {
          console.error(e);
        }
      );
    });
  }

  //Function to pick up user's photo
  getPhoto(formEl) {
    return new Promise((resolve, reject) => {
      //api file native JS
      let fileReader = new FileReader();

      //selected the user photo
      let elements = [...formEl.elements].filter((item) => {
        if (item.name === "photo") return item;
      });

      //filtering and geting the file
      let file = elements[0].files[0];

      fileReader.onload = () => {
        //retuning the file reader
        //only return if the file not is read
        resolve(fileReader.result);
      };

      //caso der algum error cai nessa function
      fileReader.onerror = (e) => {
        reject();
      };

      if (file) {
        fileReader.readAsDataURL(file);
      } else {
        resolve("/dist/img/boxed-bg.jpg");
      }
    });
  }

  //geting the form values
  getValues(formEl) {
    //Seting Object User
    let user = {};
    let isValid = true;

    //let el = this.formEl.elements
    [...formEl.elements].forEach(function (field) {
      if (
        ["name", "email", "password"].indexOf(field.name) > -1 &&
        !field.value
      ) {
        field.parentElement.classList.add("has-error");
        isValid = false;
        return false;
      }

      if (field.name == "gender") {
        if (field.checked) {
          user[field.name] = field.value;
        }
      } else if (field.name == "admin") {
        user[field.name] = field.checked;
      } else {
        user[field.name] = field.value;
      }
    });

    if (!isValid) {
      return false;
    }

    //returning the OBJECT User
    return new User(
      user.name,
      user.gender,
      user.birth,
      user.country,
      user.email,
      user.password,
      user.photo,
      user.admin
    );
  }

  selectAllStorage() {
    let users = User.getUserStorage();
    users.forEach((data) => {
      let user = new User();

      user.loadFromJSON(data);

      this.addLine(user);
    });
  }

  //add line in table
  addLine(dataUser) {
    let tr = this.getTr(dataUser);

    this.tableEl.appendChild(tr);

    this.updateCount();
  }

  //getTr() => seleciona uma tr na table, com os valores do users
  getTr(dataUser, tr = null) {
    if (tr == null) tr = document.createElement("tr");

    tr.dataset.user = JSON.stringify(dataUser);

    tr.innerHTML = `
      <td><img src="${
        dataUser.photo
      }" alt="User Image" class="img-circle img-sm"></td>
      <td>${dataUser.name}</td>
      <td>${dataUser.email}</td>
      <td>${dataUser.admin == true ? "Sim" : "Não"}</td>
      <td>${Utils.dateFormat(dataUser.register)}</td>
      <td>
          <button type="button" class="btn btn-primary btn-xs btn-flat btn-edit">Editar</button>
          <button type="button" class="btn btn-danger btn-xs btn-flat btn-delete">Excluir</button>
      </td>
    `;

    this.addEventTr(tr);
    return tr;
  }

  addEventTr(tr) {
    tr.querySelector(".btn-delete").addEventListener("click", (e) => {
      if (confirm("Deseja Realmente EXCLUIR este USUARIO??")) {
        let user = new User();
        user.loadFromJSON(JSON.parse(tr.dataset.user));
        user.removeUsersStrore();
        tr.remove();
        this.updateCount();
      }
    });

    tr.querySelector(".btn-edit").addEventListener("click", (e) => {
      // console.log(JSON.parse(tr.dataset.user));
      let json = JSON.parse(tr.dataset.user);
      this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;

      for (let name in json) {
        let field = this.formUpdateEl.querySelector(
          "[name=" + name.replace("_", "") + "]"
        );

        if (field) {
          switch (field.type) {
            case "file":
              continue;
              break;

            case "radio":
              field = this.formUpdateEl.querySelector(
                "[name=" + name.replace("_", "") + "][value=" + json[name] + "]"
              );
              field.checked = true;
              break;

            case "checkbox":
              field.checked = json[name];
              break;

            default:
              field.value = json[name];
          }
        }
      }

      this.formUpdateEl.querySelector(".photo").src = json._photo;

      this.showPanelUpdate();
    });
  }

  showPanelCreate() {
    document.querySelector("#box-user-create").style.display = "block";
    document.querySelector("#box-user-update").style.display = "none";
  }

  showPanelUpdate() {
    document.querySelector("#box-user-create").style.display = "none";
    document.querySelector("#box-user-update").style.display = "block";
  }

  updateCount() {
    let numberUsers = 0;
    let numberAdmin = 0;

    [...this.tableEl.children].forEach((tr) => {
      numberUsers++;

      let user = JSON.parse(tr.dataset.user);

      if (user._admin) {
        numberAdmin++;
      }
    });

    document.querySelector("#number-users").innerHTML       = numberUsers;
    document.querySelector("#number-users-admin").innerHTML = numberAdmin;
  }
}
