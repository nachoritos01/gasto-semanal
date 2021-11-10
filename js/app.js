//Variables y selectores
const formulario = document.querySelector("#agregar-gasto");
const gatoListado = document.querySelector("#gastos ul");

//Eventos

eventListeners();

function eventListeners() {
  document.addEventListener("DOMContentLoaded", preguntarPresupuesto);

  formulario.addEventListener("submit", agregarGasto);
}

//Classes

class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }

  nuevoGasto(gasto) {
    this.gastos = [...this.gastos, gasto];
    ui.inprimirAlerta("correcto");
    this.calcularRestante();
  }

  calcularRestante() {
    //acumulado , objeto actual , iniciar en 0
    const gastado = this.gastos.reduce(
      (total, gasto) => total + gasto.cantidad,
      0
    );
    this.restante = this.presupuesto - gastado;
    ui.imprimirRestante(this.restante);
  }
  eliminarGasto(id) {
    this.gastos = this.gastos.filter(gasto=> gasto.id !== id);
    this.calcularRestante();

  }
}

//Imprimir html
class UI {
  insertarPresupuesto(cantidad) {
    const { presupuesto, restante } = cantidad;

    document.querySelector("#total").textContent = presupuesto;
    document.querySelector("#restante").textContent = restante;
  }

  inprimirAlerta(mensaje, tipo) {
    const divMensaje = document.createElement("div");

    divMensaje.classList.add("text-center", "alert");

    if (tipo === "error") {
      divMensaje.classList.add("alert-danger");
    } else {
      divMensaje.classList.add("alert-success");
    }

    //mensaje
    divMensaje.textContent = mensaje;

    document.querySelector(".primario").insertBefore(divMensaje, formulario);

    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }

  mostrarGastos(gastos) {
    this.limpiarHTML();
    //Iterar sobre los gastos

    gastos.forEach((gasto) => {
      const { cantidad, nombre, id } = gasto;
      //Crear un li
      const nuevoGasto = document.createElement("li");
      nuevoGasto.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center"
      );
      nuevoGasto.dataset.id = id;

      //Agregar el html del gasto
      nuevoGasto.innerHTML = `${nombre}<span class="badge badge-primary badge-pill">$ ${cantidad}</span>`;
      // Boton para borrar

      const btnBorrar = document.createElement("button");
      console.log(btnBorrar);
      btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
      btnBorrar.textContent = "borrar x";
      btnBorrar.onclick = () => {
        eliminarGasto(id);
      };

      nuevoGasto.appendChild(btnBorrar);
      //Agregar al html

      gatoListado.appendChild(nuevoGasto);
    });
  }

  limpiarHTML() {
    while (gatoListado.firstChild) {
      gatoListado.removeChild(gatoListado.firstChild);
    }
  }

  imprimirRestante(restante) {
    document.querySelector("#restante").textContent = restante;
  }

  comprobarPresupuesto(presupuestoObj) {
    const { presupuesto, restante } = presupuestoObj;

    const restanteDiv = document.querySelector(".restante");

    if (presupuesto / 4 > restante) {
      restanteDiv.classList.remove("alert-success", "alert-warning");
      restanteDiv.classList.add("alert-danger");
    } else if (presupuesto / 2 > restante) {
      restanteDiv.classList.remove("alert-success");
      restanteDiv.classList.add("alert-warning");
    } else {
      console.log('hola');
      restanteDiv.classList.remove("alert-danger", "alert-warning");
      restanteDiv.classList.add("alert-success")
    }

    //si el total es menor a 0
    console.log(restante);
    if (restante <= 0) {
      ui.inprimirAlerta("el presupuesto esta agotado", "error");
      formulario.querySelector('button[type="submit"]').disabled = true;
    }else {
      formulario.querySelector('button[type="submit"]').disabled = false;
    }
  }
}

let presupuesto;
const ui = new UI();

//Funciones

function preguntarPresupuesto() {
  const presupuestoUsuario = prompt("cual es tu presupuesto?");

  if (
    presupuestoUsuario === "" ||
    presupuestoUsuario === null ||
    isNaN(presupuestoUsuario) ||
    presupuestoUsuario <= 0
  ) {
    window.location.reload();
  }

  presupuesto = new Presupuesto(presupuestoUsuario);
  ui.insertarPresupuesto(presupuesto);
}

function agregarGasto(e) {
  e.preventDefault();

  const nombre = document.querySelector("#gasto").value;
  const cantidad = Number(document.querySelector("#cantidad").value);

  if (nombre === "" && cantidad === "") {
    ui.inprimirAlerta("Ambos casos son obligatorios", "error");
    return;
  } else if (cantidad <= 0 || isNaN(cantidad)) {
    ui.inprimirAlerta("cantidad no valida", "error");
    return;
  }

  //Genera un objeto con el gastom object literal
  const gasto = { nombre, cantidad, id: Date.now() };
  presupuesto.nuevoGasto(gasto);

  //Imprimir los gastos
  const { gastos } = presupuesto;
  ui.mostrarGastos(gastos);

  ui.comprobarPresupuesto(presupuesto);

  //Reiniciar el formulario
  formulario.reset();
}

function eliminarGasto(id) {
  //Elimina del objeto
  presupuesto.eliminarGasto(id);
  //Elimina los gastos del html
  const {gastos, restante} = presupuesto;

  ui.mostrarGastos(gastos);
  presupuesto.calcularRestante(restante);
  ui.comprobarPresupuesto(presupuesto);
}
