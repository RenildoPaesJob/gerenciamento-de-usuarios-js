class User {
  constructor(name, gender, birth, country, email, password, photo, admin) {
    this._id;
    this._name = name;
    this._gender = gender;
    this._birth = birth;
    this._country = country;
    this._email = email;
    this._password = password;
    this._photo = photo;
    this._admin = admin;
    this._register = new Date();
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }
  set name(name) {
    this._name = name;
  }

  get gender() {
    return this._gender;
  }
  set gender(gender) {
    this._gender = gender;
  }

  get birth() {
    return this._birth;
  }
  set birth(birth) {
    this._birth = birth;
  }

  get country() {
    return this._country;
  }
  set country(country) {
    this._country = country;
  }

  get email() {
    return this._email;
  }
  set email(email) {
    this._email = email;
  }

  get password() {
    return this._password;
  }
  set password(password) {
    this._password = password;
  }

  get photo() {
    return this._photo;
  }
  set photo(photo) {
    this._photo = photo;
  }

  get admin() {
    return this._admin;
  }
  set admin(admin) {
    this._admin = admin;
  }

  get register() {
    return this._register;
  }
  set register(register) {
    this._register = register;
  }

  loadFromJSON(json) {
    for (let name in json) {
      switch (name) {
        case "_register":
          this[name] = new Date(json[name]);
          break;

        default:
          this[name] = json[name];
      }
    }
  }

  getNewId() {
    if (!window.id) window.id = 0;

    id++;

    return id;
  }

  static getUserStorage() {
    let users = [];

    if (localStorage.getItem("users")) {
      users = JSON.parse(localStorage.getItem("users"));
    }

    return users;
  }

  save() {
    let users = User.getUserStorage();

    //se um usuario ja tiver um id
    if (this.id > 0) {
      //filter => localiza uma informação em uma array e retorna para a tela a informação
      // let user = users.filter(u => {return u._id === this.id;});
      // let newUser = Object.assign({}, user, this);

      users.map(u => {
        if (this.id == u._id) {
          Object.assign(u, this);
        }
        return u;
      });

    } else {

      this._id = this.getNewId();

      //push => adiciona ao final do array
      users.push(this);

      //sessionStorage.setItem('key', 'value') => permite gravar dados na sessão. Se fechar o navegador, deixa de existir.
      // sessionStorage.setItem('users', JSON.stringify(users));

      //localStorage.setItem('key', 'value') => permite gravar dados no navegador. Se fechar o navegador, ainda existirá.
    }

    localStorage.setItem("users", JSON.stringify(users));

  }
}
