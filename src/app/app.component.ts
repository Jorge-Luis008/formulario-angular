import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent{
  title = 'formulario-angular';
  nombres = new FormGroup('');
  name01 = new FormControl(''); // Nombre
  name02 = new FormControl(''); // Apellido Paterno
  name03 = new FormControl(''); // Apellido Materno

  direcciones01 = new FormGroup('');
  streetForm = new FormControl(''); // Calle
  zipCodeForm = new FormControl(''); // Codigo Postal

  Location = new FormGroup('');
  stateForm = new FormControl(''); // Estado
  municipalityForm = new FormControl(''); // Municipio

  extraData = new FormGroup('');
  phoneForm = new FormControl(''); // Telefono

  optionalData = new FormGroup('');
  genderForm01 = new FormControl(''); // Sexo: Hombre
  genderForm02 = new FormControl(''); // Sexo: Mujer
  genderForm03 = new FormControl(''); // Sexo: Otro
  educationForm01 = new FormControl(''); // Educacion: Secundaria
  educationForm02 = new FormControl(''); // Educacion: Preparatoria
  educationForm03 = new FormControl(''); // Educacion: Universidad

  async loadData(){
    const apiStatesURL = 'https://sepomex.icalialabs.com/api/v1/states?per_page=32'; // La pagina que contiene los estados
    // Declaraciones a cambiar
    let a = 0;
    var dataStates= [0];
    var statesPageLength = 0;

    // "fetch" para obtener el numero de estados en la pagina
    const giveState = await fetch(apiStatesURL).then(response => response.json()).then(data => {
      dataStates = data;
      statesPageLength = data.states.lenght;
    })

    // Añadir los estados al dropbox uno tras otro
    while(a < statesPageLength){
      if(a == statesPageLength){break;}
      var addState = new Option((dataStates as any).states[a].name, String(a));
      (stateList as any).options.add(addState);
      a++;
    }
    // Llamar la funcion "giveMunicipality" para dar los municipios de Aguascalientes
    // Ya que este es el estado que se vera al iniciar la pagina
    this.giveMunicipality();
  }
  // Funcion que da los municipios del estado seleccionado
  async giveMunicipality(){
    (municipalityList as any).disabled = (stateList as any).value=="";
    var selectState = (stateInput as any).selectedIndex + 1;

    if(!(stateList as any).value){
      return;
    } else {
      var url1 = String(['https://sepomex.icalialabs.com/api/v1/states'+selectState+'/municipalities']);
      var totalMuni = 0;
      var data1 = 0;

      // Busca los municipios por el estado seleccionado
      const resMuni = await fetch(url1)
      .then(response => response.json())
      .then(data => {
        data1 = data
        totalMuni = data.municipalities.lenght
      });

      while((municipalityList as any).options.length){  //Elimina los municipios que estaban antes, si habia algunos
        municipalityList.remove();
      }
      if(totalMuni){ // Añade todos los municipios del estado seleccionado
        for(var i = 0; i <= totalMuni-1; i++){
          var muni2 = new Option((data1 as any).municipalities[i].name, String(i));
          (municipalityList as any).options.add(muni2);
        }
      }
    }
  }
  // Funcion para enviar los datos al dar click en "Enviar"
  async submitApplication(){
    var stateNum = stateInput.value;
    var muniNum = municipalityInput.value;

    // BUSCAR EL NOMBRE DEL ESTADO
    var data2 = 0;
    var stateLength = 0;
    var url2 = String(['https://sepomex.icalialabs.com/api/v1/states?per_page=32']);
    var idStart = 0;

    // Obtener el numero de estados en la pagina
    const stateName = await fetch(url2).then(response => response.json()).then(data => {
      data2 = data;
      stateLength = data.states.length;
    })

    // Buscar el estado correcto y su nombre
    let x = 0;
    while(x < stateLength){
      if (String(idStart) == stateNum){
        var state2 = (data2 as any).states[x].name;
        break;
      }
      x = x + 1;
      idStart = idStart + 1;
    }

    // BUSCAR EL NOMBRE DEL MUNICIPIO
    var data3 = 0;
    var muniLength = 0;
    var idBegin = 0;

    // Buscar la pagina del estado con sus municipios
    var selState2 = (stateList as any).value;
    const url3 = String(['https://sepomex.icalialabs.com/api/v1/states/'+selState2+'/municipalities']);

    // Obtener el numero de municipios de la pagina
    const muniNumb = await fetch(url3).then(response2 => response2.json()).then(data => {
      data3 = data;
      muniLength = data.municipalities.length;
    })

    // Funcion para buscar el municipio correcto y su nombre
    let y = 0;
    while (y < muniLength){
      if (String(idBegin) == muniNum){
        var muni2 = (data3 as any).municipalities[y].name;
        break;
      }
      y = y + 1;
      idBegin = idBegin + 1;
    }

    //VALIDACION
    if (this.validarCampos()){
      var selectState = (stateInput as any).selectedIndex;
      var selectMuni = (municipalityInput as any).selectedIndex;
      var sendState = (stateInput[selectState as keyof typeof stateInput] as any).text;
      var sendMuni = (municipalityInput[selectMuni as keyof typeof municipalityInput] as any).text;
      var selGender = this.checkGender;
      var eduValues = this.getEducation;

      // Llamar la funcion para dar genero/sexo
      this.checkGender();
      // Llamar la funcion para dar la educacion
      this.getEducation();

      const bodyRequest = {
        nombre: nameInput1.value,
        apellidoPaterno: nameInput2.value,
        apellidoMaterno: nameInput3.value,
        calle: streetInput.value,
        codigoPostal: zipCodeInput.value,
        estado: sendState,
        municipio: sendMuni,
        sexo: selGender,
        educacion: eduValues
      }
      // Hasta que no encuentre una forma de arreglar esto se mantendra en comentario
      /*
      const url2 = "https://postman-echo.com/post";
      var requestOptions = {
        method:'POST',
        mode: 'cors',
        body: JSON.stringify(bodyRequest),
        headers: {
          'Content-Type':'application/json',
          'Access-Control-Allow-Origin':'*'
        }
      };

      //fetch para enviar datos a postman-echo y los regrese la consola
      try{
        const respuesta = await fetch(url2, requestOptions);
        if (!respuesta.ok){
          throw new Error (`Response status: ${respuesta.status}`);
        }
        const json = await respuesta.json();
        console.log(json);
        alert("Informacion enviada");
      } catch(error){
        console.error(error.message);
        alert("Hubo un ERROR, informacion NO enviada. Intentalo mas tarde.")
      }
      */
     console.log(bodyRequest);
    } else {
      // Otro "failsafe" por si los anteriores no funcionaron
      alert("ERROR: Verifica que rellenaste todos los campos e intentalo otra vez");
      return;
    }
  }
  // Funcion que valida los campos de los datos necesarios
  validarCampos(){
    if (!nameInput1 || !nameInput2 || !nameInput3 || !streetInput || !zipCodeInput || !stateInput || !municipalityInput){
      return false;
    }
    return true;
  }

  // Funcion para validar el numero de telefono y prevenir elementos no deseados(letras y simbolos)
  validatePhoneNumber(event:any){
    if(isNaN(event.key) && event.key !== 'Backspace'){
      event.preventDefault();
    }
  }

  // Funcion que regresa el sexo seleccionado
  checkGender(){
    var selGender = '';
    const genderSel = document.querySelector('input[name="genero"]:checked');
    if (genderSel){
      selGender = (genderSel as any).value;
    } else {
      selGender = '??????';
    }
    return selGender;
  }

  // Funcion que regresa los niveles de educacion seleccionadados (si alguno fue)
  getEducation(){
    var eduValues = '';
    //Busca el fieldset con id "education"
    const fieldEdu = document.getElementById('education');

    //Selecciona todos los campos dentro de "education"
    const checkEdu = fieldEdu?.querySelectorAll('input[type="checkbox"]');

    //Se filtra y mapea los valores
    const selecValor = (checkEdu as any)
    .filter((checkbox:any) => checkbox.checked)
    .map((checkbox:any) => checkbox.value);

    //Si no se da ningun nivel de educacion
    eduValues = selecValor.length > 0 ? selecValor : 'Educacion no seleccionada';

    //Se regresa el resultado
    return eduValues;
  }

  // Funcion para limpiar lo escrito en el formulario
  OnResetClick(){
    console.log("Limpiar");
    //Datos necesarios
    /*
    if (nameInput1.value==null){
      return;
    } else{
      nameInput1.value='';
    }
    if (nameInput2.value==null){
      return;
    } else{
      nameInput2.value='';
    }
    if (nameInput3.value==null){
      return;
    } else {
      nameInput3.value='';
    }
    if (streetInput.value==null){
      return;
    } else{
      streetInput.value=''
    }
    if (stateInput.value==null){
      return;
    } else {
      stateInput.value=''
    }
    if (municipalityInput.value==null){
      return;
    } else {
      municipalityInput.value=''
    }
    if (phoneInput.value==null){
      return;
    } else {
      phoneInput.value=''
    }
    */

    //Datos opcionales
    (genderInput0 as any).checked = true;
    (genderInput1 as any).checked = false;
    (genderInput2 as any).checked = false;
    (eduInput0 as any).checked = false;
    (eduInput1 as any).checked = false;
    (eduInput2 as any).checked = false;
  }
}

//Declaraciones
  // Campos necesarios
  const nameInput1 = <HTMLInputElement>document.getElementById("name");
  const nameInput2 = <HTMLInputElement>document.getElementById("name2");
  const nameInput3 = <HTMLInputElement>document.getElementById("name3");
  const streetInput = <HTMLInputElement>document.getElementById("street");
  const zipCodeInput = <HTMLInputElement>document.getElementById("zipCode");
  const stateInput = <HTMLInputElement>document.getElementById("state");
  const municipalityInput = <HTMLInputElement>document.getElementById("municipality");
  const phoneInput = <HTMLInputElement>document.getElementById("phone");
  // Campos Opcionales
  const genderInput0 = <HTMLDivElement>document.getElementById("genderMale");
  const genderInput1 = <HTMLDivElement>document.getElementById("genderFemale");
  const genderInput2 = <HTMLDivElement>document.getElementById("genderOther");

  const eduInput0 = <HTMLDivElement>document.getElementById("eduSecundaria");
  const eduInput1 = <HTMLDivElement>document.getElementById("eduPrepa");
  const eduInput2 = <HTMLDivElement>document.getElementById("eduUni");
  // Boton
  const checkButton1 = document.getElementById("sendForm");
  // Otros
  // const camposInput = [nameInput1,nameInput2,nameInput3,streetInput,zipCodeInput,stateInput,municipalityInput,phoneInput,genderInput0,genderInput1,genderInput2,eduInput0,eduInput1,eduInput2]
  var stateList = <HTMLDivElement>document.getElementById("state");
  var municipalityList = <HTMLDivElement>document.getElementById("municipality");

